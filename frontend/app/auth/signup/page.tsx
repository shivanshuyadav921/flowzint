"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
      const response = await fetch(`${apiUrl}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, full_name: name }),
      });
      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.detail || "Signup failed.");
      }
      router.push("/auth/login");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-900 px-6 py-12 sm:px-12">
      <div className="mx-auto grid max-w-6xl gap-12 rounded-[2rem] border border-white/10 bg-slate-950/75 p-8 shadow-soft backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] bg-slate-900/80 p-10 text-white">
          <div className="inline-flex items-center gap-3 rounded-full bg-brand-500/10 px-4 py-2 text-sm text-brand-200">Create your AI coaching workspace</div>
          <div className="mt-14 space-y-6">
            <h1 className="text-4xl font-semibold leading-tight">Boost interview performance with ultra-fast practice.</h1>
            <p className="max-w-md text-slate-300">Sign up to access smart question generators, answer review, analytics, and an elegant mock interview environment.</p>
            <div className="grid gap-4 rounded-3xl border border-white/10 bg-slate-900/90 p-5">
              <div className="flex items-center gap-3 text-sm text-slate-300"><CheckCircle2 size={18} /> Personalized coaching and feedback</div>
              <div className="flex items-center gap-3 text-sm text-slate-300"><Mail size={18} /> Secure JWT authentication</div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-[2rem] border border-white/10 bg-slate-950/95 p-10 shadow-soft">
          <h2 className="text-2xl font-semibold text-white">Create your account</h2>
          {error ? <p className="rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p> : null}
          <div className="space-y-4">
            <Input label="Full name" icon={<CheckCircle2 size={18} />} type="text" value={name} onChange={(event) => setName(event.target.value)} required />
            <Input label="Email" icon={<Mail size={18} />} type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            <Input label="Password" icon={<Lock size={18} />} type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating account…" : "Sign up"}
          </Button>
          <p className="text-center text-sm text-slate-400">
            Already have an account? <Link href="/auth/login" className="text-brand-400 hover:text-brand-300">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
