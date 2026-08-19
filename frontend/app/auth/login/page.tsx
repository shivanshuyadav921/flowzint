"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username: email, password }),
      });
      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.detail || "Login failed.");
      }
      const data = await response.json();
      localStorage.setItem("flowzint_token", data.access_token);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-900 px-6 py-12 sm:px-12">
      <div className="mx-auto grid max-w-6xl gap-12 rounded-[2rem] border border-white/10 bg-slate-950/75 p-8 shadow-soft backdrop-blur-xl lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] bg-gradient-to-br from-brand-500/20 via-slate-900/50 to-slate-950/40 p-10 text-white">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-brand-200 hover:text-white">
            <ArrowLeft size={16} /> Back to home
          </Link>
          <div className="mt-14 space-y-6">
            <h1 className="text-4xl font-semibold leading-tight">Sign in to Flowzint</h1>
            <p className="max-w-md text-slate-300">Login and start practicing premium AI-powered interviews with resume-aware coaching and analytics.</p>
            <div className="grid gap-4 rounded-3xl border border-white/10 bg-slate-900/80 p-5">
              <div className="flex items-center gap-3 text-sm text-slate-300"><Mail size={18} /> Secure email login</div>
              <div className="flex items-center gap-3 text-sm text-slate-300"><Lock size={18} /> Encrypted AI session data</div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-[2rem] border border-white/10 bg-slate-950/95 p-10 shadow-soft">
          <h2 className="text-2xl font-semibold text-white">Welcome back</h2>
          {error ? <p className="rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p> : null}
          <div className="space-y-4">
            <Input label="Email" icon={<Mail size={18} />} type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            <Input label="Password" icon={<Lock size={18} />} type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing in…" : "Sign in"}
          </Button>
          <p className="text-center text-sm text-slate-400">
            New to Flowzint? <Link href="/auth/signup" className="text-brand-400 hover:text-brand-300">Create account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
