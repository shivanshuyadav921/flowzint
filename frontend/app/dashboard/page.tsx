"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { ScoreChart } from "@/components/charts/score-chart";
import { ArrowRight, Sparkles, Activity, Mic, FileText, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/store";

interface AnalyticsRecord {
  id: number;
  metric: string;
  value: number;
  detail?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState([
    { label: "Weekly streak", value: "5 days" },
    { label: "Average score", value: "88%" },
    { label: "Weak topics", value: "System Design" },
    { label: "Sessions this week", value: "3" },
  ]);
  const [readinessScore, setReadinessScore] = useState<number>(92);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("flowzint_token") : null;
        const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await fetch("/api/analytics/summary", { headers });
        if (res.ok) {
          const records: AnalyticsRecord[] = await res.json();
          const avgScoreRec = records.find((r) => r.metric === "Average Score");
          const readinessRec = records.find((r) => r.metric === "Interview Readiness");
          const sessionsRec = records.find((r) => r.metric === "Completed Sessions");

          if (avgScoreRec) {
            setStats([
              { label: "Weekly streak", value: "6 days" },
              { label: "Average score", value: `${avgScoreRec.value}%` },
              { label: "Weak topics", value: "System Scalability" },
              { label: "Sessions completed", value: `${sessionsRec?.value || 3}` },
            ]);
          }
          if (readinessRec) {
            setReadinessScore(readinessRec.value);
          }
        }
      } catch (err) {
        // Fallback to defaults
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const displayName = user?.full_name || (user?.email ? user.email.split("@")[0] : "Candidate");

  return (
    <div className="flex min-h-screen text-slate-100">
      <Sidebar />
      <div className="flex-1 px-4 sm:px-6 py-6 lg:px-10 lg:py-8 max-w-7xl mx-auto w-full">
        <Navbar />

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Header Banner */}
            <div className="rounded-3xl border border-white/10 bg-slate-950/85 p-6 sm:p-8 shadow-soft">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs sm:text-sm uppercase tracking-[0.24em] text-brand-400 font-semibold">
                    AI Control Center
                  </p>
                  <h1 className="mt-3 text-2xl sm:text-4xl font-bold text-white">
                    Ready to practice, {displayName}?
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm sm:text-base text-slate-400 leading-relaxed">
                    Review performance metrics, launch instant mock interviews, and optimize your resume for target tech roles.
                  </p>
                </div>
                <div className="rounded-3xl bg-brand-500/10 p-5 text-brand-200 ring-1 ring-brand-400/20 shrink-0 text-center lg:text-left">
                  <p className="text-xs uppercase tracking-wider text-brand-300">Today’s Readiness</p>
                  <p className="mt-2 text-3xl font-extrabold text-white">{readinessScore}%</p>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid gap-4 sm:gap-6 grid-cols-2 xl:grid-cols-4">
              {stats.map((item) => (
                <Card key={item.label} title={item.label} className="border-white/10 bg-slate-900/80 p-5">
                  <p className="text-2xl sm:text-3xl font-bold text-white">{item.value}</p>
                </Card>
              ))}
            </div>

            {/* Score Chart & AI Recommendations */}
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <ScoreChart />

              <Card title="AI Recommendations" className="border-white/10 bg-slate-900/80">
                <div className="space-y-3.5">
                  {[
                    "Structure technical answers with Situation, Task, Action, and Result (STAR).",
                    "Include quantifiable metric improvements (e.g., '% latency reduced', 'users scaled').",
                    "Refresh distributed caching and idempotency patterns before system design rounds.",
                  ].map((tip, idx) => (
                    <div key={idx} className="flex gap-3 rounded-2xl border border-white/10 bg-slate-950/70 p-3.5">
                      <CheckCircle2 size={18} className="text-brand-400 shrink-0 mt-0.5" />
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </motion.section>

          {/* Aside: Quick Start & Updates */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <Card title="Quick Actions" className="space-y-4 border-white/10 bg-slate-900/80">
              <div className="rounded-2xl bg-brand-500/10 p-4 text-xs text-slate-300 ring-1 ring-brand-400/20">
                <p className="font-semibold text-white">Start Practicing Now</p>
                <p className="mt-1 text-slate-400">Launch a focused round or analyze your resume with instant AI feedback.</p>
              </div>

              <div className="grid gap-3">
                <Link
                  href="/dashboard/mock"
                  className="flex items-center justify-between rounded-2xl bg-slate-950/80 p-4 text-left text-slate-100 transition hover:bg-white/5 border border-white/10 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-brand-500/20 p-2.5 text-brand-300">
                      <Mic size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm group-hover:text-brand-300 transition">Start Mock Interview</p>
                      <p className="text-xs text-slate-400">AI interviewer with live speech & scoring.</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-brand-300 transition" />
                </Link>

                <Link
                  href="/dashboard/resume"
                  className="flex items-center justify-between rounded-2xl bg-slate-950/80 p-4 text-left text-slate-100 transition hover:bg-white/5 border border-white/10 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-indigo-500/20 p-2.5 text-indigo-300">
                      <FileText size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm group-hover:text-indigo-300 transition">Analyze Resume</p>
                      <p className="text-xs text-slate-400">Extract skills & ATS compatibility score.</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-indigo-300 transition" />
                </Link>
              </div>
            </Card>

            <Card title="Live Coach Highlights" className="space-y-4 border-white/10 bg-slate-900/80">
              <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4">
                <div className="flex items-center gap-2 text-brand-400">
                  <Sparkles size={16} />
                  <span className="text-xs font-semibold uppercase tracking-wider">Multi-Round Readiness</span>
                </div>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                  Practice tailored questions across Full Stack, Backend & System Design, and Leadership behavioral scenarios.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-950/80 p-4 border border-white/10">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Activity size={16} />
                  <span className="text-xs font-semibold uppercase tracking-wider">Real-Time Scoring</span>
                </div>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                  Evaluates clarity, STAR compliance, filler words, and technical depth on every response.
                </p>
              </div>
            </Card>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}
