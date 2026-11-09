"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock3, Mic, Award, ChevronDown, Sparkles, CheckCircle2 } from "lucide-react";

interface InterviewSession {
  id: number;
  title: string;
  role: string;
  difficulty: string;
  category: string;
  questions?: string;
  answers?: string;
  feedback?: string;
  score?: number;
  created_at: string;
}

export default function HistoryPage() {
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    async function loadHistory() {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("flowzint_token") : null;
        const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch("/api/interview/history", { headers });
        if (res.ok) {
          const data: InterviewSession[] = await res.json();
          setSessions(data);
        }
      } catch (e) {
        // Fallback
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex min-h-screen text-slate-100">
      <Sidebar />
      <div className="flex-1 px-4 sm:px-6 py-6 lg:px-10 lg:py-8 max-w-7xl mx-auto w-full">
        <Navbar />

        <div className="mt-8 space-y-6">
          <div className="rounded-3xl border border-white/10 bg-slate-950/85 p-6 sm:p-8 shadow-soft flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs sm:text-sm uppercase tracking-[0.24em] text-brand-400 font-semibold">
                Session Archive
              </p>
              <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-white">
                Interview History & Detailed Feedback
              </h1>
            </div>
            <Link href="/dashboard/mock" className="shrink-0">
              <Button>
                <Mic size={16} className="mr-2" />
                <span>New Mock Interview</span>
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-400 border-t-transparent" />
              <p className="mt-3 text-xs text-slate-400">Loading your interview archive...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-12 text-center backdrop-blur-xl">
              <Clock3 className="mx-auto h-12 w-12 text-slate-500" />
              <h3 className="mt-4 text-lg font-bold text-white">No Mock Interviews Recorded Yet</h3>
              <p className="mt-2 max-w-md mx-auto text-xs sm:text-sm text-slate-400">
                You haven&apos;t completed any interview sessions yet. Start a session now to get instant evaluation and build your performance record.
              </p>
              <Link href="/dashboard/mock" className="inline-block mt-6">
                <Button>Start Your First Interview</Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {sessions.map((session) => {
                const isExpanded = expandedId === session.id;
                const score = session.score || 85;
                const dateStr = session.created_at
                  ? new Date(session.created_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Recent";

                return (
                  <div
                    key={session.id}
                    className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 sm:p-6 shadow-soft transition hover:border-white/20"
                  >
                    <div
                      className="cursor-pointer flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                      onClick={() => toggleExpand(session.id)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="rounded-2xl bg-brand-500/20 p-3 text-brand-300 shrink-0">
                          <Mic size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs uppercase tracking-wider text-slate-400">{dateStr}</span>
                            <span className="text-slate-600">•</span>
                            <span className="text-xs text-brand-400 font-medium">{session.difficulty || "Senior"}</span>
                          </div>
                          <h3 className="mt-1 text-base sm:text-lg font-bold text-white">
                            {session.title || `${session.role} Practice Session`}
                          </h3>
                          <p className="mt-1 text-xs text-slate-400">
                            Category: {session.category || "Full Stack, System Design"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300 ring-1 ring-emerald-500/20">
                          <Award size={14} />
                          <span>Score {score}%</span>
                        </div>
                        <button
                          className={`rounded-full p-1.5 text-slate-400 transition-transform ${
                            isExpanded ? "rotate-180 text-white" : ""
                          }`}
                        >
                          <ChevronDown size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Detail */}
                    {isExpanded && (
                      <div className="mt-5 border-t border-white/10 pt-5 space-y-4 text-xs text-slate-300">
                        {session.feedback && (
                          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-4">
                            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                              <Sparkles size={15} />
                              <span>AI Coach Evaluation</span>
                            </div>
                            <p className="mt-2 whitespace-pre-wrap leading-relaxed text-slate-200">
                              {session.feedback}
                            </p>
                          </div>
                        )}

                        {session.answers && (
                          <div className="rounded-2xl bg-slate-950/80 p-4 border border-white/5">
                            <p className="font-semibold text-slate-400 uppercase tracking-wider text-[11px]">
                              Transcribed Responses
                            </p>
                            <p className="mt-2 whitespace-pre-wrap leading-relaxed text-slate-300">
                              {session.answers}
                            </p>
                          </div>
                        )}

                        <div className="flex justify-end pt-2">
                          <Link href="/dashboard/mock">
                            <Button className="text-xs py-2 px-4">Retake Interview</Button>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
