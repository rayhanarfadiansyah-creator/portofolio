"use client";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  const router = useRouter(); const params = useSearchParams();
  async function submit(e: FormEvent) {
    e.preventDefault(); setBusy(true); setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setBusy(false); return; }
    router.replace(params.get("next") || "/admin"); router.refresh();
  }
  return <main className="flex min-h-screen items-center justify-center px-5">
    <form onSubmit={submit} className="card w-full max-w-md p-8">
      <div className="eyebrow">Private area</div><h1 className="mt-3 text-3xl font-black">Admin sign in</h1>
      <p className="mt-2 text-sm text-slate-500">Sign in to manage your portfolio content.</p>
      <label className="mt-7 block text-sm font-bold">Email<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 p-3 font-normal outline-blue-500"/></label>
      <label className="mt-4 block text-sm font-bold">Password<input required type="password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 p-3 font-normal outline-blue-500"/></label>
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      <button disabled={busy} className="btn btn-primary mt-6 w-full">{busy ? "Signing in..." : "Sign in"}</button>
      <Link href="/" className="mt-5 block text-center text-sm text-slate-500">
        ← Back to portfolio
      </Link>
    </form>
  </main>;
}