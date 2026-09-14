"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { ScoreChart } from "@/components/charts/score-chart";
import { ArrowRight, Sparkles, Activity } from "lucide-react";

const stats = [
  { label: "Weekly streak", value: "6 days" },
  { label: "Average score", value: "86%" },
  { label: "Weak topics", value: "Behavioral" },
  { label: "Sessions this week", value: "5" },
];

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen text-slate-100">
      <Sidebar />
      <div className="flex-1 px-6 py-8 lg:px-10">
        <Navbar />
        <div className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-slate-950/85 p-8 shadow-soft">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-brand-400">Live coaching</p>
                  <h1 className="mt-4 text-4xl font-semibold text-white">Your AI interview control center</h1>
                  <p className="mt-4 max-w-2xl text-slate-400">Review performance metrics, continue mock interviews, and keep your momentum strong with tailored insights.</p>
                </div>
                <div className="rounded-3xl bg-brand-500/10 p-4 text-brand-200 ring-1 ring-brand-400/10">
                  <p className="text-sm">Today’s readiness</p>
                  <p className="mt-2 text-3xl font-semibold">92%</p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {stats.map((item) => (
                <Card key={item.label} title={item.label} className="border-white/10 bg-slate-900/80">
                  <p className="text-3xl font-semibold text-white">{item.value}</p>
                </Card>
              ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
              <Card title="Interview score" className="xl:col-span-1">
                <ScoreChart />
              </Card>
              <Card title="AI recommendations">
                <div className="space-y-4">
                  {[
                    "Practice STAR stories for behavioral scenarios.",
                    "Refresh system design patterns before technical rounds.",
                    "Use stronger opening statements when answering leadership questions.",
                  ].map((item) => (
                    <div key={item} className="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
                      <p className="text-sm text-slate-300">{item}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </motion.section>

          <motion.aside initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
            <Card title="Quick start" className="space-y-4">
              <div className="rounded-3xl bg-brand-500/10 p-5 text-sm text-slate-300">
                <p className="font-semibold text-white">Launch a new practice session</p>
                <p className="mt-2">Select a role and difficulty level to generate a focused interview plan.</p>
              </div>
              <div className="grid gap-3">
                <button className="flex items-center justify-between rounded-3xl bg-slate-900/80 px-4 py-4 text-left text-slate-100 transition hover:bg-white/5">
                  <div>
                    <p className="font-semibold">Mock Interview</p>
                    <p className="text-sm text-slate-400">AI interviewer with context memory.</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-brand-400" />
                </button>
                <button className="flex items-center justify-between rounded-3xl bg-slate-900/80 px-4 py-4 text-left text-slate-100 transition hover:bg-white/5">
                  <div>
                    <p className="font-semibold">Upload resume</p>
                    <p className="text-sm text-slate-400">Analyze skills and ATS improvements.</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-brand-400" />
                </button>
              </div>
            </Card>
            <Card title="What’s new" className="space-y-4">
              <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
                <p className="text-sm text-slate-300">We added a stronger evaluation model and adaptive question selection for technical and behavioral rounds.</p>
              </div>
              <div className="grid gap-3">
                <div className="rounded-3xl bg-slate-900/80 p-4">
                  <div className="flex items-center gap-2 text-brand-400"><Sparkles size={18} /></div>
                  <p className="mt-3 text-sm text-slate-300">Refined answer scoring with clarity and confidence metrics.</p>
                </div>
                <div className="rounded-3xl bg-slate-900/80 p-4">
                  <div className="flex items-center gap-2 text-brand-400"><Activity size={18} /></div>
                  <p className="mt-3 text-sm text-slate-300">Personalized topic insights based on your session history.</p>
                </div>
              </div>
            </Card>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}
