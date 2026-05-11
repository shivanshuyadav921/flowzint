import { ChangeEventHandler, InputHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
}

export function Input({ label, icon, className, ...props }: InputProps) {
  return (
    <label className="block text-sm font-medium text-slate-200">
      <span className="mb-2 block text-sm text-slate-300">{label}</span>
      <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 transition focus-within:border-brand-400 focus-within:ring-1 focus-within:ring-brand-400">
        {icon ? <span className="text-slate-400">{icon}</span> : null}
        <input
          className={clsx(
            "w-full bg-transparent text-slate-100 outline-none placeholder:text-slate-500",
            className,
          )}
          {...props}
        />
      </div>
    </label>
  );
}
