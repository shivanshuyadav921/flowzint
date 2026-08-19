"use client";

import { ResponsiveContainer, RadialBarChart, RadialBar, Legend } from "recharts";

const data = [
  { name: "Confidence", value: 78, fill: "#7c6dff" },
  { name: "Accuracy", value: 84, fill: "#22d3ee" },
  { name: "Clarity", value: 91, fill: "#a855f7" },
];

export function ScoreChart() {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/90 p-6 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Performance Score</p>
          <h3 className="mt-2 text-lg font-semibold text-white">Interview readiness</h3>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="100%" data={data} startAngle={90} endAngle={-270}>
            <RadialBar background dataKey="value" cornerRadius={12} />
            <Legend iconSize={8} layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ color: "#cbd5e1" }} />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
