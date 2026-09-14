"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Settings, LogOut, User, Sparkles, ChevronDown, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/store";
import { UserAvatar } from "@/components/user-avatar";

export function Navbar() {
  const router = useRouter();
  const { user, logout, setAuth } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  const displayName = user?.full_name || (user?.email ? user.email.split("@")[0] : "Candidate");
  const displayEmail = user?.email || "candidate@flowzint.com";

  return (
    <header className="relative z-30 flex items-center justify-between rounded-3xl border border-white/10 bg-slate-950/80 px-6 py-4 shadow-soft backdrop-blur-xl">
      {/* Left: User Welcome & Avatar */}
      <div className="flex items-center gap-4">
        <UserAvatar
          name={displayName}
          email={displayEmail}
          src={user?.avatar_url}
          size="md"
        />
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Welcome back,</p>
          <p className="text-lg font-bold text-white capitalize">{displayName}</p>
        </div>
      </div>

      {/* Right: Actions & Profile Menu */}
      <div className="flex items-center gap-3 text-slate-300" ref={dropdownRef}>
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setDropdownOpen(false);
            }}
            className="relative rounded-2xl border border-white/10 bg-slate-900/90 p-2.5 transition hover:border-brand-400 hover:text-white"
            title="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-brand-400" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-3 w-80 rounded-3xl border border-white/10 bg-slate-950 p-4 shadow-xl backdrop-blur-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <p className="text-sm font-semibold text-white">Notifications</p>
                <span className="rounded-full bg-brand-500/20 px-2 py-0.5 text-xs text-brand-300">New</span>
              </div>
              <div className="mt-3 space-y-3 text-xs text-slate-300">
                <div className="flex gap-3 rounded-2xl bg-white/5 p-3">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-white">AI Mock Interview Ready</p>
                    <p className="mt-1 text-slate-400">Start practicing customized behavioral questions.</p>
                  </div>
                </div>
                <div className="flex gap-3 rounded-2xl bg-white/5 p-3">
                  <Sparkles size={16} className="text-brand-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-white">ATS Analysis Complete</p>
                    <p className="mt-1 text-slate-400">Your resume scored 84/100 compatibility.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Settings Quick Link */}
        <Link
          href="/dashboard/settings"
          className="rounded-2xl border border-white/10 bg-slate-900/90 p-2.5 transition hover:border-brand-400 hover:text-white"
          title="Settings"
        >
          <Settings size={18} />
        </Link>

        {/* Profile Dropdown Toggle */}
        <div className="relative">
          <button
            onClick={() => {
              setDropdownOpen(!dropdownOpen);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/90 py-1.5 pl-2 pr-3 text-sm transition hover:border-brand-400 hover:bg-slate-900"
          >
            <UserAvatar
              name={displayName}
              email={displayEmail}
              src={user?.avatar_url}
              size="sm"
              showStatus={false}
            />
            <span className="hidden sm:inline font-medium text-white text-xs max-w-[100px] truncate">{displayName}</span>
            <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Profile Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-64 rounded-3xl border border-white/10 bg-slate-950 p-3 shadow-2xl backdrop-blur-2xl">
              <div className="border-b border-white/10 px-3 py-2">
                <p className="text-sm font-semibold text-white">{displayName}</p>
                <p className="text-xs text-slate-400 truncate">{displayEmail}</p>
              </div>

              <div className="mt-2 space-y-1 text-xs">
                <Link
                  href="/dashboard/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  <User size={15} className="text-brand-400" />
                  <span>Profile & Preferences</span>
                </Link>
                <Link
                  href="/dashboard/mock"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  <Sparkles size={15} className="text-indigo-400" />
                  <span>Live Mock Interview</span>
                </Link>
              </div>

              <div className="mt-2 border-t border-white/10 pt-2">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-2xl px-3 py-2.5 text-left text-xs text-rose-300 transition hover:bg-rose-500/10 hover:text-rose-200"
                >
                  <LogOut size={15} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
