
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const BUCKET = "portfolio-assets";
const MAX_CV_SIZE = 8 * 1024 * 1024;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function safeName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9.-]+/g, "-");
}

async function uploadImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  file: FormDataEntryValue | null,
  path: string
) {
  if (!(file instanceof File) || file.size === 0) return null;

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Foto harus JPG, PNG, atau WEBP.");
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("Ukuran foto maksimal 5 MB.");
  }

  const filePath = `${path}/${crypto.randomUUID()}-${safeName(file.name)}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw new Error(`Gagal upload foto: ${error.message}`);

  return supabase.storage.from(BUCKET).getPublicUrl(filePath).data.publicUrl;
}

export async function saveProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("avatar_url, cv_url")
    .eq("id", user.id)
    .maybeSingle();

  const payload: Record<string, unknown> = {
    id: user.id,
    full_name: String(formData.get("full_name") || ""),
    headline: String(formData.get("headline") || ""),
    bio: String(formData.get("bio") || ""),
    status: String(formData.get("status") || "student"),
    institution: String(formData.get("institution") || ""),
    location: String(formData.get("location") || ""),
    email: String(formData.get("email") || ""),
    github_url: String(formData.get("github_url") || ""),
    linkedin_url: String(formData.get("linkedin_url") || ""),
    whatsapp_phone: String(formData.get("whatsapp_phone") || "").replace(/[^\d]/g, ""),
    is_public: true,
    avatar_url: existingProfile?.avatar_url ?? null,
    cv_url: existingProfile?.cv_url ?? null,
  };

  // Upload foto profil
  const avatarUrl = await uploadImage(
    supabase,
    formData.get("avatar_file"),
    `${user.id}/profile`
  );

  if (avatarUrl) {
    payload.avatar_url = avatarUrl;
  } else if (formData.get("remove_avatar") === "on") {
    payload.avatar_url = null;
  }

  // Upload CV
  const cvFile = formData.get("cv_file");
  const removeCv = formData.get("remove_cv") === "on";

  if (cvFile instanceof File && cvFile.size > 0) {
    if (
      cvFile.type !== "application/pdf" ||
      !cvFile.name.toLowerCase().endsWith(".pdf")
    ) {
      throw new Error("CV harus berupa file PDF.");
    }

    if (cvFile.size > MAX_CV_SIZE) {
      throw new Error("Ukuran CV maksimal 8 MB.");
    }

    const path = `${user.id}/cv.pdf`;

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, cvFile, {
        upsert: true,
        contentType: "application/pdf",
        cacheControl: "3600",
      });

    if (error) throw new Error(`Gagal upload CV: ${error.message}`);

    payload.cv_url = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  } else if (removeCv) {
    const { error } = await supabase.storage
      .from(BUCKET)
      .remove([`${user.id}/cv.pdf`]);

    if (error) throw new Error(`Gagal menghapus CV: ${error.message}`);
    payload.cv_url = null;
  }

  const { error } = await supabase.from("profiles").upsert(payload);

  if (error) throw new Error(`Gagal menyimpan profil: ${error.message}`);

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function addProject(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const title = String(formData.get("title") || "").trim();

  if (!title) throw new Error("Project title is required.");

  const imageUrl = await uploadImage(
    supabase,
    formData.get("image_file"),
    `${user.id}/projects`
  );

  const technologies = String(formData.get("technologies") || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

  const { error } = await supabase.from("projects").insert({
    user_id: user.id,
    title,
    description: String(formData.get("description") || ""),
    image_url: imageUrl,
    live_url: String(formData.get("live_url") || "") || null,
    github_url: String(formData.get("github_url") || "") || null,
    technologies,
    is_published: true,
    is_featured: false,
  });

  if (error) throw new Error(`Gagal menambahkan project: ${error.message}`);

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteProject(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", String(formData.get("id")))
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
