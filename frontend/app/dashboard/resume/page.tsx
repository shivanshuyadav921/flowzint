"use client";

import React, { useState } from "react";
import { UploadCloud, FileText } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";

export default function ResumePage() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [message, setMessage] = useState("Drag and drop your resume or click to upload.");

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setMessage("Ready to upload and analyze your resume.");
  };

  return (
    <div className="flex min-h-screen text-slate-100">
      <Sidebar />
      <div className="flex-1 px-6 py-8 lg:px-10">
        <Navbar />
        <div className="mt-8 space-y-6">
          <div className="rounded-3xl border border-white/10 bg-slate-950/85 p-8 shadow-soft">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-brand-400">Resume analyzer</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">Upload your resume for instant insights.</h2>
              </div>
              <Button>Upload new resume</Button>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/90 p-8 shadow-soft">
            <label className="group flex min-h-[260px] cursor-pointer flex-col items-center justify-center rounded-[2rem] border border-dashed border-white/15 bg-slate-950/80 px-6 text-center transition hover:border-brand-300/40 hover:bg-slate-900/95">
              <UploadCloud className="h-12 w-12 text-brand-400" />
              <p className="mt-4 text-lg font-semibold text-white">Drop your file here</p>
              <p className="mt-2 max-w-md text-sm text-slate-400">Supported formats: PDF, DOCX. We extract skills, summary, and ATS-friendly improvements.</p>
              <input type="file" className="sr-only" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
              {fileName ? <p className="mt-3 text-sm text-brand-300">Selected file: {fileName}</p> : null}
            </label>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-slate-950/85 p-6 shadow-soft">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">ATS score</p>
              <p className="mt-4 text-4xl font-semibold text-white">84</p>
              <p className="mt-3 text-sm text-slate-400">Your resume is strong but can improve clarity and bullet structure.</p>
            </div>
            <div className="xl:col-span-2 rounded-3xl border border-white/10 bg-slate-950/85 p-6 shadow-soft">
              <div className="flex items-center gap-3 text-slate-300">
                <FileText className="h-5 w-5 text-brand-400" />
                <p className="text-sm uppercase tracking-[0.24em]">Extracted skills</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                {[
                  "React", "TypeScript", "FastAPI", "Cloud architecture", "Leadership", "Systems design",
                ].map((skill) => (
                  <span key={skill} className="rounded-full bg-white/5 px-4 py-2 text-sm text-slate-100">{skill}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/85 p-8 shadow-soft">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-brand-400">Resume coach</p>
                <h3 className="mt-3 text-xl font-semibold text-white">Recommendations</h3>
              </div>
              <Button>Download report</Button>
            </div>
            <ul className="mt-6 space-y-4 text-slate-300">
              <li className="rounded-3xl bg-slate-900/80 p-4">Add quantified results to leadership achievements.</li>
              <li className="rounded-3xl bg-slate-900/80 p-4">Use keywords for technical stack sections and avoid generic terms.</li>
              <li className="rounded-3xl bg-slate-900/80 p-4">Highlight metrics from interviews or product launches in top bullets.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
