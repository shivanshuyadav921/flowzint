"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowLeft, Sparkles, Check, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrandLogo } from "@/components/brand-logo";
import { GoogleIcon } from "@/components/google-icon";
import { useAuth } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [error, setError] = useState("");
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmail, setGoogleEmail] = useState("");
  const [googleName, setGoogleName] = useState("");

  const getApiUrl = () => {
    if (typeof window !== "undefined") {
      const env = process.env.NEXT_PUBLIC_API_URL;
      if (env && !env.includes("localhost:8000")) return env;
      return "/api";
    }
    return process.env.NEXT_PUBLIC_API_URL || "/api";
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    const apiUrl = getApiUrl();

    try {
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

      let userProfile = data.user || { email, full_name: email.split("@")[0] };
      try {
        const meRes = await fetch(`${apiUrl}/auth/me`, {
          headers: { Authorization: `Bearer ${data.access_token}` },
        });
        if (meRes.ok) {
          userProfile = await meRes.json();
        }
      } catch (e) {
        // Fallback
      }

      setAuth(data.access_token, userProfile);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async (userEmail?: string, userName?: string) => {
    setGoogleLoading(true);
    setError("");
    const apiUrl = getApiUrl();

    try {
      const targetEmail = userEmail || googleEmail || "candidate.google@flowzint.com";
      const targetName = userName || googleName || "Google Candidate";

      const response = await fetch(`${apiUrl}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: targetEmail,
          full_name: targetName,
          google_id: "google_" + Math.random().toString(36).substring(7),
          avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(targetEmail)}`,
        }),
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.detail || "Google authentication failed.");
      }

      const data = await response.json();
      setAuth(data.access_token, {
        id: data.user?.id,
        email: data.user?.email || targetEmail,
        full_name: data.user?.full_name || targetName,
        avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(targetEmail)}`,
      });

      setShowGoogleModal(false);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Google sign in failed.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    setError("");
    const apiUrl = getApiUrl();

    try {
      const response = await fetch(`${apiUrl}/auth/demo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.detail || "Demo access failed.");
      }

      const data = await response.json();
      setAuth(data.access_token, {
        id: data.user?.id,
        email: data.user?.email || "demo@flowzint.com",
        full_name: data.user?.full_name || "Flowzint Demo Candidate",
        avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=flowzint-demo",
      });

      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Demo access failed.");
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 sm:px-12 relative overflow-hidden flex items-center justify-center">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 -z-10 h-96 w-[45rem] rounded-full bg-gradient-to-tr from-brand-600/30 to-indigo-500/20 blur-3xl" />

      {/* Back to Home button */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
      >
        <ArrowLeft size={16} />
        <span>Back to Home</span>
      </Link>

      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="inline-block">
            <BrandLogo size="lg" />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-white">Welcome back</h1>
          <p className="mt-2 text-xs text-slate-400">
            Sign in to access your interview practice sessions and ATS insights.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-5">
          {error && (
            <div className="flex items-center gap-2.5 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Social / 1-Click Fast Access */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setShowGoogleModal(true)}
              disabled={googleLoading}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 py-3 px-4 text-xs font-semibold text-white transition hover:bg-white/10 hover:border-white/20 disabled:opacity-50"
            >
              <GoogleIcon />
              <span>{googleLoading ? "Signing in with Google..." : "Continue with Google"}</span>
            </button>

            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={demoLoading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-brand-500/30 bg-brand-500/10 py-2.5 px-4 text-xs font-semibold text-brand-300 transition hover:bg-brand-500/20 hover:border-brand-400 disabled:opacity-50"
            >
              <Sparkles size={15} />
              <span>{demoLoading ? "Starting Demo..." : "Try Live Demo (1-Click Instant Access)"}</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-white/10" />
            <span className="absolute bg-slate-900 px-3 text-xs uppercase tracking-widest text-slate-500">
              Or with email
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email address"
              icon={<Mail size={18} />}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              icon={<Lock size={18} />}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button type="submit" disabled={loading} className="w-full py-3 text-sm font-semibold">
              {loading ? "Signing in..." : "Sign In with Email"}
            </Button>
          </form>

          <p className="text-center text-xs text-slate-400">
            Don’t have an account?{" "}
            <Link href="/auth/signup" className="font-semibold text-brand-400 hover:text-brand-300">
              Create account
            </Link>
          </p>
        </div>
      </div>

      {/* Google Sign-in Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl border border-white/15 bg-slate-900 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <GoogleIcon />
                <span className="font-bold text-white">Sign in with Google</span>
              </div>
              <button
                onClick={() => setShowGoogleModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="rounded-2xl border border-brand-500/20 bg-brand-500/10 p-3 text-xs text-brand-300 flex items-start gap-2">
              <Info size={16} className="shrink-0 mt-0.5" />
              <span>
                To configure standard Google OAuth with your own domain, add <code>NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> in Vercel Dashboard → Environment Variables.
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Enter your Google account details to sign in or link your Flowzint account:
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 font-medium">Google Account Email</label>
                <input
                  type="email"
                  placeholder="your.email@gmail.com"
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-brand-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-medium">Your Name (Optional)</label>
                <input
                  type="text"
                  placeholder="Candidate Name"
                  value={googleName}
                  onChange={(e) => setGoogleName(e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-brand-400"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                onClick={() => handleGoogleSignIn()}
                disabled={googleLoading}
                className="flex-1"
              >
                {googleLoading ? "Connecting..." : "Continue with Google Account"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
