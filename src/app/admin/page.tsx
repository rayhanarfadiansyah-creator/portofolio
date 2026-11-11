import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { addProject, deleteProject, saveProfile, signOut } from "./actions";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const [{ data: profile }, { data: projects }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("projects").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
  ]);
  const field = "mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-blue-500";
  return <main className="container py-10">
    <header className="flex flex-wrap items-center justify-between gap-4"><div><div className="eyebrow">Portfolio control center</div><h1 className="mt-2 text-4xl font-black">Admin dashboard</h1><p className="mt-2 text-sm text-slate-500">{user.email}</p></div><form action={signOut}><button className="btn btn-outline">Sign out</button></form></header>
    <section className="mt-10 grid gap-8 lg:grid-cols-2">
      <form action={saveProfile} className="card p-6">
        <h2 className="text-2xl font-extrabold">Profile settings</h2>
        <div className="mt-5 rounded-xl border border-slate-200 p-4">
  <label className="block text-sm font-bold">
    Profile photo (JPG, PNG, WEBP — maksimal 5 MB)
    <input
      name="avatar_file"
      type="file"
      accept="image/jpeg,image/png,image/webp"
      className="mt-2 block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:font-semibold"
    />
  </label>
  {profile?.avatar_url && (
    <div className="mt-3 flex items-center gap-4">
      <img
        src={profile.avatar_url}
        alt="Current profile"
        className="h-20 w-20 rounded-full object-cover"
      />
      <label className="flex items-center gap-2 text-sm font-medium text-red-600">
        <input type="checkbox" name="remove_avatar" />
        Hapus foto profil
      </label>
    </div>
  )}
  <p className="mt-2 text-xs text-slate-500">
    Foto ini akan ditampilkan di hero section halaman utama.
  </p>
</div>
        <label className="mt-5 block text-sm font-bold">Full name<input name="full_name" required defaultValue={profile?.full_name ?? ""} className={field}/></label>
        <label className="mt-4 block text-sm font-bold">Headline<input name="headline" defaultValue={profile?.headline ?? ""} className={field}/></label>
        <label className="mt-4 block text-sm font-bold">About / bio<textarea name="bio" rows={4} defaultValue={profile?.bio ?? ""} className={field}/></label>
        <label className="mt-4 block text-sm font-bold">Current status<select name="status" defaultValue={profile?.status ?? "student"} className={field}><option value="student">University student</option><option value="graduated">Graduated</option><option value="working">Working</option><option value="freelancer">Freelancer</option></select></label>
        <label className="mt-4 block text-sm font-bold">University / company<input name="institution" defaultValue={profile?.institution ?? ""} className={field}/></label>
        <label className="mt-4 block text-sm font-bold">Location<input name="location" defaultValue={profile?.location ?? ""} className={field}/></label>
        <label className="mt-4 block text-sm font-bold">Public email<input name="email" type="email" defaultValue={profile?.email ?? ""} className={field}/></label>
        <label className="mt-4 block text-sm font-bold">GitHub URL<input name="github_url" type="url" defaultValue={profile?.github_url ?? ""} className={field}/></label>
        <label className="mt-4 block text-sm font-bold">LinkedIn URL<input name="linkedin_url" type="url" defaultValue={profile?.linkedin_url ?? ""} className={field}/></label>
        <label className="mt-4 block text-sm font-bold">WhatsApp number
          <input name="whatsapp_phone" type="tel" inputMode="tel" placeholder="6281234567890" defaultValue={profile?.whatsapp_phone ?? ""} className={field}/>
          <span className="mt-1 block text-xs font-normal text-slate-500">Gunakan kode negara, tanpa tanda + atau spasi. Contoh: 6281234567890.</span>
        </label>
        <div className="mt-5 rounded-xl border border-slate-200 p-4">
          <label className="block text-sm font-bold">CV (PDF, maksimal 8 MB)
            <input name="cv_file" type="file" accept="application/pdf,.pdf" className="mt-2 block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:font-semibold"/>
          </label>
          {profile?.cv_url && <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <a href={profile.cv_url} target="_blank" rel="noreferrer" className="font-semibold text-blue-700 underline">Lihat CV yang tersimpan</a>
            <label className="flex items-center gap-2 font-medium text-red-600"><input type="checkbox" name="remove_cv"/> Hapus CV saat menyimpan</label>
          </div>}
          <p className="mt-2 text-xs font-normal text-slate-500">Upload PDF baru untuk mengganti CV lama. File akan bisa diunduh pengunjung.</p>
        </div>
        <button className="btn btn-primary mt-6 w-full">Save profile</button>
      </form>
      <div className="space-y-8">
        <form action={addProject}>
          <h2 className="text-2xl font-extrabold">Add a project</h2>
          <label className="mt-5 block text-sm font-bold">Project title<input name="title" required className={field}/></label>
          <label className="mt-4 block text-sm font-bold">Description<textarea name="description" rows={3} className={field}/></label>
          <label className="mt-4 block text-sm font-bold">
  Project image (JPG, PNG, WEBP — maksimal 5 MB)
  <input
    name="image_file"
    type="file"
    accept="image/jpeg,image/png,image/webp"
    className="mt-2 block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:font-semibold"
  />
</label>
          <label className="mt-4 block text-sm font-bold">Live project URL<input name="live_url" type="url" className={field}/></label>
          <label className="mt-4 block text-sm font-bold">GitHub URL<input name="github_url" type="url" className={field}/></label>
          <label className="mt-4 block text-sm font-bold">Technologies (comma separated)<input name="technologies" placeholder="Next.js, Supabase, Tailwind" className={field}/></label>
          <button className="btn btn-primary mt-6 w-full">Publish project</button>
        </form>
        <div className="card p-6"><h2 className="text-2xl font-extrabold">Your projects ({projects?.length ?? 0})</h2>
          <div className="mt-4 space-y-3">{projects?.map(project=><div key={project.id} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3"><div><div className="font-bold">{project.title}</div><div className="text-xs text-slate-500">{project.is_published ? "Published" : "Draft"}</div></div><form action={deleteProject}><input type="hidden" name="id" value={project.id}/><button className="text-sm font-bold text-red-600">Delete</button></form></div>)}</div>
        </div>
      </div>
    </section>
    <p className="mt-8 text-center text-sm text-slate-500"><a href="/" className="font-bold text-blue-700">View public portfolio ↗</a></p>
  </main>;
}