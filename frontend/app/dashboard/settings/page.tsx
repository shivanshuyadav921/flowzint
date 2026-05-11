"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [theme, setTheme] = useState("dark");
  const [language, setLanguage] = useState("English");

  return (
    <div className="flex min-h-screen text-slate-100">
      <Sidebar />
      <div className="flex-1 px-6 py-8 lg:px-10">
        <Navbar />
        <div className="mt-8 space-y-6">
          <div className="rounded-3xl border border-white/10 bg-slate-950/85 p-8 shadow-soft">
            <p className="text-sm uppercase tracking-[0.24em] text-brand-400">Settings</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Customize your AI interview workspace.</h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-950/85 p-8 shadow-soft">
              <label className="block text-sm font-medium text-slate-300">Theme</label>
              <select value={theme} onChange={(event) => setTheme(event.target.value)} className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900/90 p-4 text-slate-100 outline-none">
                <option>dark</option>
                <option>light</option>
              </select>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/85 p-8 shadow-soft">
              <label className="block text-sm font-medium text-slate-300">Interview language</label>
              <select value={language} onChange={(event) => setLanguage(event.target.value)} className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900/90 p-4 text-slate-100 outline-none">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/85 p-8 shadow-soft">
            <p className="text-sm text-slate-400">AI voice and notification preferences can be configured here once the speaker module is enabled.</p>
            <div className="mt-6 flex flex-col gap-4 md:flex-row">
              <Button>Save preferences</Button>
              <Button className="bg-white/5 text-slate-100 hover:bg-white/10">Reset defaults</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
