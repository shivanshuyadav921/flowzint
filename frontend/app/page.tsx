"use client";

import Link from "next/link";
import { Sparkles, ShieldCheck, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

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
  return (
    <main className="relative overflow-hidden">
      <section className="relative isolate px-6 py-16 lg:px-12">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-hero-gradient blur-3xl" />
        <div className="mx-auto max-w-7xl">
          <nav className="flex items-center justify-between gap-8 text-sm font-medium text-slate-400">
            <div className="flex items-center gap-3 text-white">
              <div className="h-10 w-10 rounded-3xl bg-white/10 ring-1 ring-white/10 backdrop-blur-xl" />
              <span>Flowzint</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/auth/login" className="hover:text-white">Login</Link>
              <Link href="/auth/signup" className="rounded-full bg-brand-500 px-4 py-2 text-sm text-white shadow-soft transition hover:bg-brand-400">Get Started</Link>
            </div>
          </nav>

          <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pt-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="max-w-2xl">
                <span className="inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-brand-400 ring-1 ring-white/10">AI Interview Intelligence</span>
                <h1 className="mt-8 text-5xl font-semibold tracking-tight text-white sm:text-6xl">Master Interviews with AI-Powered Mock Sessions.</h1>
                <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">Practice questions, get real-time answer reviews, monitor weak skills, and build confidence with a futuristic interview workspace designed for ambitious candidates.</p>
                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                  <Link href="/auth/signup" className="inline-flex items-center justify-center rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-400">Start Practicing</Link>
                  <Link href="/dashboard" className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm text-slate-100 transition hover:border-brand-400">View Demo</Link>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-soft backdrop-blur-xl">
              <div className="absolute inset-x-4 top-4 h-24 rounded-[2rem] bg-gradient-to-r from-brand-500/25 to-violet-400/20 blur-2xl" />
              <div className="relative rounded-[1.75rem] bg-slate-950/95 p-6 ring-1 ring-white/5">
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>AI Interview Session</span>
                  <span className="rounded-full bg-slate-900 px-2 py-1 text-xs text-slate-300">Live</span>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="rounded-3xl border border-white/5 bg-slate-900/90 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-brand-400">Interviewer</p>
                    <p className="mt-3 text-sm text-white">“Tell me about a time you owned a product launch with a cross-functional team.”</p>
                  </div>
                  <div className="rounded-3xl border border-white/5 bg-slate-900/90 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Your answer</p>
                    <p className="mt-3 text-sm text-slate-300">“I aligned stakeholders, defined milestones, and led technical delivery through sprint reviews.”</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <section className="mt-20 grid gap-6 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-3xl border border-white/10 bg-slate-950/80 p-8 text-white shadow-soft transition hover:-translate-y-1 hover:bg-slate-900/95">
                <feature.icon className="h-8 w-8 text-brand-400" />
                <h3 className="mt-6 text-xl font-semibold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{feature.description}</p>
              </div>
            ))}
          </section>
        </div>
      </section>
    </main>
  );
}
