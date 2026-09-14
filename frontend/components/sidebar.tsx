"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Mic, FileText, BarChart3, Settings, Clock3, Sparkles } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { UserAvatar } from "@/components/user-avatar";
import { useAuth } from "@/lib/store";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Mock Interviews", href: "/dashboard/mock", icon: Mic, badge: "Live" },
  { label: "Resume Analysis", href: "/dashboard/resume", icon: FileText },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "History", href: "/dashboard/history", icon: Clock3 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const displayName = user?.full_name || (user?.email ? user.email.split("@")[0] : "Candidate");
  const displayEmail = user?.email || "candidate@flowzint.com";

  return (
    <aside className="hidden lg:flex min-h-screen w-72 flex-col gap-6 border-r border-white/10 bg-slate-950/85 px-6 py-8 text-slate-300 backdrop-blur-xl">
      {/* Brand Logo Header */}
      <div className="pb-2">
        <BrandLogo size="md" showText={true} href="/dashboard" />
      </div>

      {/* Navigation Links */}
      <nav className="space-y-1.5 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition duration-200 ${
                isActive
                  ? "bg-brand-500/15 text-white ring-1 ring-brand-500/30 shadow-sm"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  className={`h-5 w-5 transition ${
                    isActive ? "text-brand-400" : "text-slate-400 group-hover:text-brand-300"
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="rounded-full bg-brand-500/20 px-2 py-0.5 text-[10px] font-semibold text-brand-300 ring-1 ring-brand-400/20">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Pro AI Coach Banner */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-brand-950/40 to-slate-900/60 p-4 text-xs text-slate-300 shadow-soft">
        <div className="flex items-center gap-2 text-brand-400 font-semibold">
          <Sparkles size={14} />
          <span>Adaptive AI Coach</span>
        </div>
        <p className="mt-1.5 text-slate-400 leading-relaxed">
          AI evaluates answer depth, confidence score, and role suitability in real-time.
        </p>
      </div>

      {/* User Profile Mini Footer */}
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-3">
        <UserAvatar
          name={displayName}
          email={displayEmail}
          src={user?.avatar_url}
          size="sm"
        />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-white truncate capitalize">{displayName}</p>
          <p className="text-[11px] text-slate-400 truncate">{displayEmail}</p>
        </div>
      </div>
    </aside>
  );
}
