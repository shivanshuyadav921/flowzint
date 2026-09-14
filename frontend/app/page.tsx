"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ShieldCheck, MessageSquare, ArrowRight, Play, CheckCircle2, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { BrandLogo } from "@/components/brand-logo";
import { UserAvatar } from "@/components/user-avatar";
import { useAuth } from "@/lib/store";

const features = [
  {
    title: "AI Mock Interviews",
    description: "Generate role-specific questions, practice in a conversation flow, and get instant feedback.",
    icon: MessageSquare,
  },
  {
    title: "Resume Intelligence",
    description: "Upload resumes, extract skills, and get ATS-friendly improvement suggestions.",
    icon: ShieldCheck,
  },
  {
    title: "Performance Analytics",
    description: "Track your interview score, weak topics, and weekly progress at a glance.",
    icon: Sparkles,
  },
];

export default function Home() {
  const router = useRouter();
  const { token, user, setAuth } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [demoStarting, setDemoStarting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const startLiveDemo = async () => {
    setDemoStarting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
      const response = await fetch(`${apiUrl}/auth/demo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        setAuth(data.access_token, {
          id: data.user?.id,
          email: data.user?.email || "demo@flowzint.com",
          full_name: data.user?.full_name || "Flowzint Demo Candidate",
          avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=flowzint-demo",
        });
      } else {
        // Local fallback token if backend is restarting
        setAuth("demo-access-token", {
          email: "demo@flowzint.com",
          full_name: "Flowzint Demo Candidate",
          avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=flowzint-demo",
        });
      }
      router.push("/dashboard/mock");
    } catch (e) {
      setAuth("demo-access-token", {
        email: "demo@flowzint.com",
        full_name: "Flowzint Demo Candidate",
        avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=flowzint-demo",
      });
      router.push("/dashboard/mock");
    } finally {
      setDemoStarting(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Background gradients */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 -z-10 h-[35rem] w-[60rem] rounded-full bg-gradient-to-tr from-brand-600/30 via-indigo-600/20 to-purple-600/20 blur-[130px]" />
      
      <section className="relative isolate px-6 py-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          {/* Top Navigation */}
          <nav className="flex items-center justify-between gap-8 rounded-full border border-white/10 bg-slate-900/60 px-6 py-3.5 backdrop-blur-xl">
            <BrandLogo size="md" />

            <div className="flex items-center gap-4 text-sm font-medium">
              {mounted && token ? (
                <div className="flex items-center gap-4">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-2 text-xs font-semibold text-brand-300 hover:bg-brand-500/20 transition"
                  >
                    <UserAvatar name={user?.full_name} email={user?.email} src={user?.avatar_url} size="sm" showStatus={false} />
                    <span>Go to Dashboard</span>
                  </Link>
                </div>
              ) : (
                <>
                  <Link href="/auth/login" className="text-slate-300 hover:text-white transition">
                    Login
                  </Link>
                  <button
                    onClick={startLiveDemo}
                    disabled={demoStarting}
                    className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
                  >
                    <Play size={12} className="fill-current text-brand-400" />
                    <span>{demoStarting ? "Loading..." : "Live Demo"}</span>
                  </button>
                  <Link
                    href="/auth/signup"
                    className="rounded-full bg-gradient-to-r from-brand-500 to-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:brightness-110"
                  >
                    Get Started Free
                  </Link>
                </>
              )}
            </div>
          </nav>

          {/* Hero Section */}
          <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center pt-16 lg:pt-24">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-300 ring-1 ring-brand-400/20">
                  <Zap size={14} className="text-brand-400" />
                  <span>AI Interview Intelligence 2.0</span>
                </div>
                
                <h1 className="mt-8 text-5xl font-bold tracking-tight text-white sm:text-6xl leading-[1.1]">
                  Master Technical & Behavioral Interviews with <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">AI Coaching</span>.
                </h1>
                
                <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
                  Practice role-tailored questions, receive real-time scoring and feedback, optimize your resume for ATS algorithms, and boost your job interview readiness.
                </p>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                  <button
                    onClick={startLiveDemo}
                    disabled={demoStarting}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-500 via-indigo-600 to-purple-600 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-brand-500/25 transition hover:brightness-110 active:scale-95"
                  >
                    <Play size={16} className="fill-current" />
                    <span>{demoStarting ? "Launching Demo..." : "Try Live Demo Now"}</span>
                  </button>
                  
                  <Link
                    href="/auth/signup"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10 hover:border-brand-400/40"
                  >
                    <span>Create Free Account</span>
                    <ArrowRight size={16} className="text-brand-400" />
                  </Link>
                </div>

                <div className="mt-8 flex items-center gap-6 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-400" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-400" />
                    <span>Instant 1-Click Access</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Interactive Live Demo Preview Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-2xl"
            >
              <div className="absolute inset-x-4 top-4 h-28 rounded-[2rem] bg-gradient-to-r from-brand-500/30 to-violet-500/20 blur-2xl -z-10" />

              <div className="relative rounded-[2rem] bg-slate-950/95 p-6 ring-1 ring-white/10 shadow-inner">
                <div className="flex items-center justify-between border-b border-white/10 pb-4 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-semibold text-white">Live AI Interview Session</span>
                  </div>
                  <span className="rounded-full bg-brand-500/20 px-2.5 py-1 font-semibold text-brand-300 text-[11px]">
                    Technical & Behavioral
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl border border-white/5 bg-slate-900/90 p-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-brand-400" />
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-400">Interviewer</p>
                    </div>
                    <p className="mt-2.5 text-sm text-slate-100 leading-relaxed font-medium">
                      “Can you walk me through an architecture decision you made to optimize a high-traffic system?”
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/5 bg-slate-900/90 p-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-slate-400" />
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Your Answer (Analyzed)</p>
                    </div>
                    <p className="mt-2.5 text-sm text-slate-300 leading-relaxed">
                      “We implemented distributed Redis caching and database indexing, which reduced latency by 45% and handled 10,000 req/s.”
                    </p>
                    <div className="mt-3 flex items-center justify-between rounded-xl bg-brand-500/10 px-3 py-1.5 text-xs text-brand-300">
                      <span>Confidence Score: <strong>94%</strong></span>
                      <span className="text-emerald-400 font-semibold">Excellent STAR Structure</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-2">
                  <button
                    onClick={startLiveDemo}
                    disabled={demoStarting}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-500 py-3 text-xs font-bold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-400"
                  >
                    <Play size={14} className="fill-current" />
                    <span>{demoStarting ? "Opening Mock Session..." : "Launch Live Mock Interview"}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Feature Highlights Grid */}
          <section className="mt-24 grid gap-6 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-3xl border border-white/10 bg-slate-900/60 p-8 text-white shadow-soft transition hover:-translate-y-1 hover:border-brand-500/30 hover:bg-slate-900/90"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-300 group-hover:bg-brand-500/25 transition">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl font-bold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{feature.description}</p>
              </div>
            ))}
          </section>
        </div>
      </section>
    </main>
  );
}
