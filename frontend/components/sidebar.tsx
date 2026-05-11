import Link from "next/link";
import { LayoutDashboard, Mic, FileText, BarChart3, Settings, Clock3 } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Mock Interviews", href: "/dashboard/mock", icon: Mic },
  { label: "Resume Analysis", href: "/dashboard/resume", icon: FileText },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "History", href: "/dashboard/history", icon: Clock3 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="flex min-h-screen w-72 flex-col gap-8 border-r border-white/10 bg-slate-950/85 px-6 py-8 text-slate-300">
      <div className="space-y-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-brand-500/15 text-brand-300">F</div>
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Flowzint</p>
          <p className="mt-1 text-xl font-semibold text-white">Interview Lab</p>
        </div>
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="group flex items-center gap-3 rounded-3xl px-4 py-3 transition hover:bg-white/5 hover:text-white">
            <item.icon className="h-5 w-5 text-slate-400 transition group-hover:text-brand-300" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="mt-auto rounded-3xl border border-white/10 bg-slate-900/80 p-5 text-sm text-slate-300">
        <p className="font-semibold text-white">AI Coach</p>
        <p className="mt-2 text-slate-400">Keep practicing daily to improve question accuracy and confidence.</p>
      </div>
    </aside>
  );
}
