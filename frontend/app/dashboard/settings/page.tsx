"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, User, Globe, Moon, Volume2, Shield, Bell } from "lucide-react";
import { useAuth } from "@/lib/store";

export default function SettingsPage() {
  const { user, setUser } = useAuth();
  const [theme, setTheme] = useState("dark");
  const [language, setLanguage] = useState("English (US)");
  const [voiceSpeed, setVoiceSpeed] = useState("1.0x (Normal)");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [feedbackDetail, setFeedbackDetail] = useState("Comprehensive (STAR + Scores)");
  const [fullName, setFullName] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (user?.full_name) {
      setFullName(user.full_name);
    }
    const saved = typeof window !== "undefined" ? localStorage.getItem("flowzint_settings") : null;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.theme) setTheme(parsed.theme);
        if (parsed.language) setLanguage(parsed.language);
        if (parsed.voiceSpeed) setVoiceSpeed(parsed.voiceSpeed);
        if (parsed.emailAlerts !== undefined) setEmailAlerts(parsed.emailAlerts);
        if (parsed.feedbackDetail) setFeedbackDetail(parsed.feedbackDetail);
      } catch (e) {
        // ignore
      }
    }
  }, [user]);

  const handleSave = () => {
    const settings = { theme, language, voiceSpeed, emailAlerts, feedbackDetail };
    localStorage.setItem("flowzint_settings", JSON.stringify(settings));

    if (user && fullName && fullName !== user.full_name) {
      setUser({ ...user, full_name: fullName });
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    setTheme("dark");
    setLanguage("English (US)");
    setVoiceSpeed("1.0x (Normal)");
    setEmailAlerts(true);
    setFeedbackDetail("Comprehensive (STAR + Scores)");
    localStorage.removeItem("flowzint_settings");
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="flex min-h-screen text-slate-100">
      <Sidebar />
      <div className="flex-1 px-4 sm:px-6 py-6 lg:px-10 lg:py-8 max-w-7xl mx-auto w-full">
        <Navbar />

        <div className="mt-8 space-y-6">
          {/* Header */}
          <div className="rounded-3xl border border-white/10 bg-slate-950/85 p-6 sm:p-8 shadow-soft">
            <p className="text-xs sm:text-sm uppercase tracking-[0.24em] text-brand-400 font-semibold">
              Workspace Settings
            </p>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-white">
              Profile, AI Coach Tuning & Preferences
            </h1>
          </div>

          {savedSuccess && (
            <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
              <CheckCircle2 size={18} className="shrink-0" />
              <span>Preferences saved successfully!</span>
            </div>
          )}

          {/* User Profile Card */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-8 shadow-soft">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <User className="h-5 w-5 text-brand-400" />
              <h2 className="text-lg font-bold text-white">Profile Information</h2>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-brand-400"
                  placeholder="Your Name"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email || "candidate@flowzint.com"}
                  disabled
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-slate-400 cursor-not-allowed outline-none"
                />
              </div>
            </div>
          </div>

          {/* Preferences Grid */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-soft space-y-4">
              <div className="flex items-center gap-2 text-brand-400">
                <Globe size={18} />
                <h3 className="font-bold text-white text-sm">Language & Locale</h3>
              </div>
              <p className="text-xs text-slate-400">Language for mock interviews and AI questions.</p>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-950 p-3.5 text-sm text-slate-100 outline-none focus:border-brand-400"
              >
                <option>English (US)</option>
                <option>English (UK)</option>
                <option>Spanish</option>
                <option>German</option>
                <option>French</option>
              </select>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-soft space-y-4">
              <div className="flex items-center gap-2 text-indigo-400">
                <Volume2 size={18} />
                <h3 className="font-bold text-white text-sm">AI Voice Synthesis Speed</h3>
              </div>
              <p className="text-xs text-slate-400">Playback speed of the interviewer reading aloud.</p>
              <select
                value={voiceSpeed}
                onChange={(e) => setVoiceSpeed(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-950 p-3.5 text-sm text-slate-100 outline-none focus:border-brand-400"
              >
                <option>0.85x (Slower)</option>
                <option>1.0x (Normal)</option>
                <option>1.15x (Brisk)</option>
                <option>1.25x (Fast)</option>
              </select>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-soft space-y-4">
              <div className="flex items-center gap-2 text-purple-400">
                <Shield size={18} />
                <h3 className="font-bold text-white text-sm">Evaluation Depth</h3>
              </div>
              <p className="text-xs text-slate-400">Detail level of instant answer scoring.</p>
              <select
                value={feedbackDetail}
                onChange={(e) => setFeedbackDetail(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-950 p-3.5 text-sm text-slate-100 outline-none focus:border-brand-400"
              >
                <option>Comprehensive (STAR + Scores)</option>
                <option>Fast (Score & Main Tip)</option>
                <option>Deep-Dive (Full Rubric)</option>
              </select>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-soft space-y-4">
              <div className="flex items-center gap-2 text-emerald-400">
                <Bell size={18} />
                <h3 className="font-bold text-white text-sm">Email Report Summaries</h3>
              </div>
              <p className="text-xs text-slate-400">Receive an email after completing full mock interviews.</p>
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-300">Send completion reports</span>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="h-5 w-5 rounded-md accent-brand-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="rounded-3xl border border-white/10 bg-slate-950/85 p-6 shadow-soft flex flex-col sm:flex-row gap-3">
            <Button onClick={handleSave} className="py-2.5 px-6">
              Save Preferences
            </Button>
            <Button
              onClick={handleReset}
              className="bg-white/10 text-white hover:bg-white/15 border border-white/10 py-2.5 px-6"
            >
              Reset Defaults
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
