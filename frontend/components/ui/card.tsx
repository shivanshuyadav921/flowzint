import clsx from "clsx";

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Card({ title, children, className }: CardProps) {
  return (
    <div className={clsx("rounded-3xl border border-white/10 bg-slate-900/85 p-6 shadow-soft", className)}>
      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}
