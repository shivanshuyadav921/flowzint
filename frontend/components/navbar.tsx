"use client";

import Link from "next/link";
import { Bell, Settings, CreditCard, LayoutDashboard, Sparkles } from "lucide-react";

export function Navbar() {
  return (
    <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-slate-950/80 px-6 py-5 shadow-soft">
      <div className="flex items-center gap-4">
        <div className="grid h-10 w-10 place-items-center rounded-3xl bg-brand-500/15 text-brand-300">F</div>
        <div>
          <p className="text-sm text-slate-400">Welcome back,</p>
          <p className="text-lg font-semibold text-white">Ariana.</p>
        </div>
      </div>
      <div className="flex items-center gap-4 text-slate-400">
        <button className="rounded-2xl border border-white/10 bg-slate-900/90 p-3 transition hover:border-brand-400 hover:text-white"><Bell size={18} /></button>
        <button className="rounded-2xl border border-white/10 bg-slate-900/90 p-3 transition hover:border-brand-400 hover:text-white"><Settings size={18} /></button>
      </div>
    </div>
  );
}
