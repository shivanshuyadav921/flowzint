"use client";

import React, { useState, useEffect, useRef } from "react";
import { UploadCloud, FileText, CheckCircle2, Download, AlertCircle, Clock, Sparkles, Loader2 } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";

interface ResumeRecord {
  id: number;
  filename: string;
  summary: string;
  skills: string;
  ats_score: number;
  uploaded_at: string;
}

export default function ResumePage() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentResume, setCurrentResume] = useState<ResumeRecord | null>(null);
  const [pastResumes, setPastResumes] = useState<ResumeRecord[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load existing resumes on mount
  useEffect(() => {
    async function loadResumes() {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("flowzint_token") : null;
        const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch("/api/resume/mine", { headers });
        if (res.ok) {
          const list: ResumeRecord[] = await res.json();
          setPastResumes(list);
          if (list.length > 0) {
            setCurrentResume(list[0]);
            setFileName(list[0].filename);
          }
        }
      } catch (e) {
        // Fallback
      }
    }
    loadResumes();
  }, []);

  const handleUploadFile = async (file: File) => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    setFileName(file.name);

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("flowzint_token") : null;
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/resume/upload", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (!res.ok) {
        const payload = await res.json();
        throw new Error(payload.detail || "Upload failed.");
      }

      const uploaded: ResumeRecord = await res.json();
      setCurrentResume(uploaded);
      setPastResumes((prev) => [uploaded, ...prev.filter((r) => r.id !== uploaded.id)]);
      setSuccess(`Resume "${file.name}" analyzed successfully with ATS Score ${uploaded.ats_score}/100!`);
    } catch (err: any) {
      setError(err.message || "Failed to analyze resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleUploadFile(file);
    }
  };

  const handleDownloadReport = () => {
    if (!currentResume) return;

    const reportContent = `=====================================================
FLOWZINT AI RESUME & ATS AUDIT REPORT
=====================================================
Filename: ${currentResume.filename}
Date: ${new Date(currentResume.uploaded_at).toLocaleDateString()}
ATS Score: ${currentResume.ats_score} / 100

SUMMARY
-------
${currentResume.summary}

EXTRACTED SKILLS
----------------
${currentResume.skills}

AI COACH RECOMMENDATIONS
------------------------
1. Use standard reverse-chronological layout with clean section headers.
2. Quantify achievement bullets with concrete business metrics (% reduced, $ saved, users scaled).
3. Align keywords with targeted technical requirements.
=====================================================`;

    const blob = new Blob([reportContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `flowzint-ats-report-${currentResume.filename.replace(/\.[^/.]+$/, "")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const parsedSkills = currentResume?.skills
    ? currentResume.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : ["React", "TypeScript", "Next.js", "Python", "Docker", "Tailwind CSS", "REST APIs", "System Design"];

  const atsScore = currentResume ? currentResume.ats_score : 85;

  return (
    <div className="flex min-h-screen text-slate-100">
      <Sidebar />
      <div className="flex-1 px-4 sm:px-6 py-6 lg:px-10 lg:py-8 max-w-7xl mx-auto w-full">
        <Navbar />

        <div className="mt-8 space-y-6">
          {/* Header */}
          <div className="rounded-3xl border border-white/10 bg-slate-950/85 p-6 sm:p-8 shadow-soft">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs sm:text-sm uppercase tracking-[0.24em] text-brand-400 font-semibold">
                  Resume Intelligence & ATS Audit
                </p>
                <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-white">
                  Extract skills, benchmark ATS match, and optimize for recruiter screening.
                </h1>
              </div>
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="shrink-0"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin mr-2" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud size={16} className="mr-2" />
                    <span>Upload New Resume</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Feedback messages */}
          {error && (
            <div className="flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
              <CheckCircle2 size={18} className="shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Drag & Drop Upload Zone */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/90 p-6 sm:p-8 shadow-soft">
            <label className="group flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-[2rem] border border-dashed border-white/15 bg-slate-950/80 px-6 py-8 text-center transition hover:border-brand-300/40 hover:bg-slate-900/95">
              {loading ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="h-10 w-10 animate-spin rounded-full border-3 border-brand-400 border-t-transparent" />
                  <p className="text-base font-semibold text-white">Parsing and calculating ATS compatibility...</p>
                  <p className="text-xs text-slate-400">Extracting technical keywords and formatting analysis</p>
                </div>
              ) : (
                <>
                  <UploadCloud className="h-12 w-12 text-brand-400 group-hover:scale-110 transition-transform" />
                  <p className="mt-4 text-base sm:text-lg font-semibold text-white">
                    Drop your resume here or browse files
                  </p>
                  <p className="mt-2 max-w-md text-xs sm:text-sm text-slate-400">
                    Supported formats: PDF, DOCX, TXT. Automatic skill extraction and ATS screening.
                  </p>
                  {fileName && (
                    <div className="mt-4 flex items-center gap-2 rounded-full bg-brand-500/20 px-4 py-1.5 text-xs text-brand-300 border border-brand-400/20">
                      <FileText size={14} />
                      <span>{fileName}</span>
                    </div>
                  )}
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                className="sr-only"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
                disabled={loading}
              />
            </label>
          </div>

          {/* Score & Skills Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* ATS Score Card */}
            <div className="rounded-3xl border border-white/10 bg-slate-950/85 p-6 sm:p-8 shadow-soft flex flex-col justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400 font-semibold">ATS Match Score</p>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold text-white">{atsScore}</span>
                  <span className="text-xl text-slate-500">/ 100</span>
                </div>
                <div className="mt-4 h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${atsScore}%` }}
                  />
                </div>
              </div>
              <p className="mt-4 text-xs text-slate-400 leading-relaxed">
                {atsScore >= 85
                  ? "Outstanding ATS compatibility. High probability of passing recruiter automated filters."
                  : "Good foundation. Increase keyword density and quantify bullet points to exceed 90."}
              </p>
            </div>

            {/* Extracted Skills Card */}
            <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-slate-950/85 p-6 sm:p-8 shadow-soft">
              <div className="flex items-center gap-2.5 text-brand-400">
                <FileText className="h-5 w-5" />
                <h3 className="text-xs uppercase tracking-[0.24em] font-semibold text-slate-400">
                  Detected Core Skills ({parsedSkills.length})
                </h3>
              </div>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {parsedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-white/10 bg-slate-900/90 px-3.5 py-1.5 text-xs font-medium text-slate-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* AI Recommendations Card */}
          <div className="rounded-3xl border border-white/10 bg-slate-950/85 p-6 sm:p-8 shadow-soft">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-5">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-brand-400 font-semibold">AI Resume Coach</p>
                <h2 className="mt-1 text-xl font-bold text-white">Actionable ATS Improvements</h2>
              </div>
              <Button
                onClick={handleDownloadReport}
                disabled={!currentResume}
                className="bg-white/10 text-white hover:bg-white/15 border border-white/10 shrink-0"
              >
                <Download size={16} className="mr-2" />
                <span>Download Report (.txt)</span>
              </Button>
            </div>

            <ul className="mt-5 space-y-3.5 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-3 rounded-2xl bg-slate-900/80 p-4 border border-white/5">
                <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Quantify technical impact in experience bullets</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Replace generic tasks with measurable results (e.g., &quot;Optimized React rendering, reducing time-to-interactive by 34%&quot;).
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 rounded-2xl bg-slate-900/80 p-4 border border-white/5">
                <CheckCircle2 size={18} className="text-brand-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Use clean single-column ATS formatting</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Avoid multi-column tables, graphics, or nested text boxes which can scramble text during automated parsing.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 rounded-2xl bg-slate-900/80 p-4 border border-white/5">
                <CheckCircle2 size={18} className="text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Match domain role keywords</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Ensure exact keywords from the job description (e.g. CI/CD, Next.js, Distributed Systems) are represented.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Past Uploads History */}
          {pastResumes.length > 0 && (
            <div className="rounded-3xl border border-white/10 bg-slate-950/85 p-6 sm:p-8 shadow-soft">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
                Uploaded Resumes ({pastResumes.length})
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {pastResumes.map((res) => (
                  <div
                    key={res.id}
                    onClick={() => {
                      setCurrentResume(res);
                      setFileName(res.filename);
                    }}
                    className={`cursor-pointer flex items-center justify-between rounded-2xl p-4 transition border ${
                      currentResume?.id === res.id
                        ? "bg-brand-500/10 border-brand-400/40 text-white"
                        : "bg-slate-900/80 border-white/10 text-slate-300 hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-brand-400" />
                      <div>
                        <p className="font-medium text-xs sm:text-sm truncate max-w-[200px]">{res.filename}</p>
                        <p className="text-[11px] text-slate-500">
                          {new Date(res.uploaded_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-brand-500/20 px-2.5 py-1 text-xs font-semibold text-brand-300">
                      ATS {res.ats_score}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
