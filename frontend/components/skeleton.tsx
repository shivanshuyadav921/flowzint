import clsx from "clsx";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={clsx("animate-pulse rounded-3xl bg-white/5", className)} />;
}

export function SkeletonCard() {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/85 p-6 shadow-soft">
      <Skeleton className="mb-4 h-4 w-24" />
      <Skeleton className="h-12 w-full" />
    </div>
  );
}
