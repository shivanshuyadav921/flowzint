"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { Card } from "@/components/ui/card";

const chartData = [
  { name: "Week 1", score: 72 },
  { name: "Week 2", score: 79 },
  { name: "Week 3", score: 84 },
  { name: "Week 4", score: 89 },
];

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen text-slate-100">
      <Sidebar />
      <div className="flex-1 px-6 py-8 lg:px-10">
        <Navbar />
        <div className="mt-8 space-y-6">
          <div className="rounded-3xl border border-white/10 bg-slate-950/85 p-8 shadow-soft">
            <p className="text-sm uppercase tracking-[0.24em] text-brand-400">Performance analytics</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Track your improvement across every round.</h2>
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
            <Card title="Weekly progress">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 0, left: -12, bottom: 0 }}>
                    <CartesianGrid stroke="rgba(148,163,184,0.15)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155" }} />
                    <Bar dataKey="score" fill="#7c6dff" radius={[12, 12, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card title="Insights">
              <div className="space-y-4 text-slate-300">
                <p>Focus on behavioral responses after Week 3; your score trend shows strong technical improvement.</p>
                <p>Mock interview frequency improved retention by 16% with daily practice and specific reinforcement.</p>
                <p>Your confidence metrics are projected to reach 94% with one additional session per week.</p>
              </div>
            </Card>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <Card title="Topic heatmap">
              <p className="text-sm text-slate-400">Behavioral</p>
              <p className="mt-3 text-3xl font-semibold text-white">Low</p>
            </Card>
            <Card title="Live readiness">
              <p className="text-sm text-slate-400">Technical system design</p>
              <p className="mt-3 text-3xl font-semibold text-white">High</p>
            </Card>
            <Card title="Recent session gap">
              <p className="text-sm text-slate-400">Last 2 days</p>
              <p className="mt-3 text-3xl font-semibold text-white">On track</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
