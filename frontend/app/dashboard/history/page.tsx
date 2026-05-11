"use client";

import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { Card } from "@/components/ui/card";

const sessions = [
  { title: "Frontend engineer mock interview", score: "88%", date: "May 9" },
  { title: "Product design behavioral prep", score: "82%", date: "May 6" },
  { title: "System design sprint review", score: "91%", date: "May 4" },
];

export default function HistoryPage() {
  return (
    <div className="flex min-h-screen text-slate-100">
      <Sidebar />
      <div className="flex-1 px-6 py-8 lg:px-10">
        <Navbar />
        <div className="mt-8 space-y-6">
          <div className="rounded-3xl border border-white/10 bg-slate-950/85 p-8 shadow-soft">
            <p className="text-sm uppercase tracking-[0.24em] text-brand-400">Interview history</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Your latest practice sessions.</h2>
          </div>
          <div className="grid gap-6">
            {sessions.map((session) => (
              <Card key={session.title} title={session.title} className="flex justify-between items-center gap-4">
                <div>
                  <p className="text-sm text-slate-400">{session.date}</p>
                  <p className="mt-2 text-xl font-semibold text-white">Score {session.score}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
