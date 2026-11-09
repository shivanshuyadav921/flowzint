"use client";

import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { Card } from "@/components/ui/card";
import { Sparkles, TrendingUp, Award, Activity } from "lucide-react";

interface AnalyticsRecord {
  id: number;
  metric: string;
  value: number;
  detail?: string;
}

export default function AnalyticsPage() {
  const [chartData, setChartData] = useState([
    { name: "Session 1", score: 76 },
    { name: "Session 2", score: 82 },
    { name: "Session 3", score: 88 },
    { name: "Session 4", score: 92 },
  ]);
  const [avgScore, setAvgScore] = useState<number>(88);
  const [readiness, setReadiness] = useState<number>(92);
  const [atsScore, setAtsScore] = useState<number>(84);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("flowzint_token") : null;
        const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

        // Fetch interview history for dynamic chart
        const histRes = await fetch("/api/interview/history", { headers });
        if (histRes.ok) {
          const sessions = await histRes.json();
          if (Array.isArray(sessions) && sessions.length > 0) {
            const formatted = sessions.slice(0, 6).reverse().map((s: any, idx: number) => ({
              name: `Session ${idx + 1}`,
              score: s.score || 85,
            }));
            setChartData(formatted);
          }
        }

        // Fetch summary metrics
        const sumRes = await fetch("/api/analytics/summary", { headers });
        if (sumRes.ok) {
          const records: AnalyticsRecord[] = await sumRes.json();
          records.forEach((r) => {
            if (r.metric === "Average Score") setAvgScore(r.value);
            if (r.metric === "Interview Readiness") setReadiness(r.value);
            if (r.metric === "ATS Compatibility") setAtsScore(r.value);
          });
        }
      } catch (e) {
        // Fallback defaults
      }
    }
    loadAnalytics();
  }, []);

  return (
    <div className="flex min-h-screen text-slate-100">
      <Sidebar />
      <div className="flex-1 px-4 sm:px-6 py-6 lg:px-10 lg:py-8 max-w-7xl mx-auto w-full">
        <Navbar />

        <div className="mt-8 space-y-6">
          {/* Header */}
          <div className="rounded-3xl border border-white/10 bg-slate-950/85 p-6 sm:p-8 shadow-soft">
            <p className="text-xs sm:text-sm uppercase tracking-[0.24em] text-brand-400 font-semibold">
              Performance Intelligence
            </p>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-white">
              Track your trajectory across technical and behavioral rounds.
            </h1>
          </div>

          {/* Quick Metrics */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3">
            <Card title="Average Interview Score" className="border-white/10 bg-slate-900/80">
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl font-extrabold text-white">{avgScore}%</span>
                <span className="text-xs text-emerald-400 flex items-center">
                  <TrendingUp size={14} className="mr-1" /> +8% this month
                </span>
              </div>
            </Card>

            <Card title="Readiness Probability" className="border-white/10 bg-slate-900/80">
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl font-extrabold text-white">{readiness}%</span>
                <span className="text-xs text-brand-300">Target: Senior Level</span>
              </div>
            </Card>

            <Card title="ATS Resume Index" className="border-white/10 bg-slate-900/80">
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl font-extrabold text-white">{atsScore}</span>
                <span className="text-xs text-slate-400">/ 100</span>
              </div>
            </Card>
          </div>

          {/* Chart & Insights */}
          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <Card title="Score Trajectory Over Sessions" className="border-white/10 bg-slate-900/80">
              <div className="h-80 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid stroke="rgba(148,163,184,0.1)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[50, 100]} tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#020617", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "16px" }}
                    />
                    <Bar dataKey="score" fill="#7c6dff" radius={[12, 12, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card title="Coach Observations" className="border-white/10 bg-slate-900/80 space-y-4">
              <div className="space-y-3.5 text-xs sm:text-sm text-slate-300">
                <div className="rounded-2xl border border-white/5 bg-slate-950/70 p-4">
                  <div className="flex items-center gap-2 text-brand-400 font-semibold mb-1">
                    <Sparkles size={16} />
                    <span>Technical Architecture</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Strongest progression observed in System Design. Your explanations of caching layers and rate limiting scored consistently above 88%.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-slate-950/70 p-4">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
                    <Award size={16} />
                    <span>STAR Method Adoption</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Behavioral answers improved by 14% after clearly structuring the Task and measurable Result upfront.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Topic Heatmap */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3">
            <Card title="Frontend Architecture" className="border-white/10 bg-slate-900/80">
              <p className="text-xs uppercase tracking-wider text-slate-400">Competency Level</p>
              <p className="mt-2 text-2xl font-bold text-emerald-400">High (92%)</p>
            </Card>

            <Card title="System Design Scalability" className="border-white/10 bg-slate-900/80">
              <p className="text-xs uppercase tracking-wider text-slate-400">Competency Level</p>
              <p className="mt-2 text-2xl font-bold text-brand-300">Strong (86%)</p>
            </Card>

            <Card title="Leadership & Conflict" className="border-white/10 bg-slate-900/80">
              <p className="text-xs uppercase tracking-wider text-slate-400">Competency Level</p>
              <p className="mt-2 text-2xl font-bold text-indigo-300">Improving (80%)</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
