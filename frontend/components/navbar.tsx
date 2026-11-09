"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Bell,
  Settings,
  LogOut,
  User,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  Menu,
  X,
  LayoutDashboard,
  Mic,
  FileText,
  BarChart3,
  Clock3,
} from "lucide-react";
import { useAuth } from "@/lib/store";
import { UserAvatar } from "@/components/user-avatar";
import { BrandLogo } from "@/components/brand-logo";

const mobileNavItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Mock Interviews", href: "/dashboard/mock", icon: Mic, badge: "Live" },
  { label: "Resume Analysis", href: "/dashboard/resume", icon: FileText },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "History", href: "/dashboard/history", icon: Clock3 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  const displayName = user?.full_name || (user?.email ? user.email.split("@")[0] : "Candidate");
  const displayEmail = user?.email || "candidate@flowzint.com";

  return (
    <>
      <header className="relative z-30 flex items-center justify-between rounded-3xl border border-white/10 bg-slate-950/80 px-4 sm:px-6 py-4 shadow-soft backdrop-blur-xl">
        {/* Left: Mobile Menu Toggle & User Info */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden rounded-2xl border border-white/10 bg-slate-900/90 p-2 text-slate-300 hover:text-white hover:border-brand-400"
            aria-label="Open mobile navigation menu"
          >
            <Menu size={20} />
          </button>

          <UserAvatar
            name={displayName}
            email={displayEmail}
            src={user?.avatar_url}
            size="md"
          />
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400 hidden sm:block">Welcome back,</p>
            <p className="text-base sm:text-lg font-bold text-white capitalize truncate max-w-[140px] sm:max-w-xs">
              {displayName}
            </p>
          </div>
        </div>

        {/* Right: Actions & Profile Menu */}
        <div className="flex items-center gap-2 sm:gap-3 text-slate-300" ref={dropdownRef}>
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
              <div className="absolute right-0 mt-3 w-72 sm:w-80 rounded-3xl border border-white/10 bg-slate-950 p-4 shadow-xl backdrop-blur-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <p className="text-sm font-semibold text-white">Notifications</p>
                  <span className="rounded-full bg-brand-500/20 px-2 py-0.5 text-xs text-brand-300">Live</span>
                </div>
                <div className="mt-3 space-y-3 text-xs text-slate-300">
                  <div className="flex gap-3 rounded-2xl bg-white/5 p-3">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-white">AI Mock Interview Ready</p>
                      <p className="mt-1 text-slate-400">Choose your domain role and practice with smart evaluation.</p>
                    </div>
                  </div>
                  <div className="flex gap-3 rounded-2xl bg-white/5 p-3">
                    <Sparkles size={16} className="text-brand-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-white">Resume Intelligence Ready</p>
                      <p className="mt-1 text-slate-400">Upload your PDF/DOCX to get instant ATS scores and recommendations.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Settings Quick Link */}
          <Link
            href="/dashboard/settings"
            className="hidden sm:flex rounded-2xl border border-white/10 bg-slate-900/90 p-2.5 transition hover:border-brand-400 hover:text-white"
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

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-slate-950 border-r border-white/10 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <BrandLogo size="md" showText={true} href="/dashboard" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-2xl border border-white/10 bg-slate-900 p-2 text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="mt-6 flex-1 space-y-2">
              {mobileNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-brand-500/15 text-white ring-1 ring-brand-500/30"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={`h-5 w-5 ${isActive ? "text-brand-400" : "text-slate-400"}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="rounded-full bg-brand-500/20 px-2 py-0.5 text-[10px] font-semibold text-brand-300">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-white/10 pt-4">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-rose-300 hover:bg-rose-500/10"
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
