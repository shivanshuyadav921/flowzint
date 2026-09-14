import React from "react";
import Link from "next/link";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  href?: string;
  className?: string;
}

export function BrandLogo({
  size = "md",
  showText = true,
  href = "/",
  className = "",
}: BrandLogoProps) {
  const iconSizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  };

  const textSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
  };

  const content = (
    <div className={`flex items-center gap-3 font-semibold ${className}`}>
      <div
        className={`relative flex ${iconSizes[size]} items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-indigo-500 text-white shadow-lg shadow-brand-500/25 ring-1 ring-white/20 transition-transform duration-300 hover:scale-105`}
      >
        {/* Futuristic Flow Wave SVG */}
        <svg
          className="h-5 w-5 fill-none stroke-current stroke-2"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
          <path d="M12 12v9" />
          <path d="m8 17 4 4 4-4" />
        </svg>
        <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 ring-1 ring-slate-950"></span>
        </span>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span
            className={`bg-gradient-to-r from-white via-slate-100 to-brand-200 bg-clip-text font-bold tracking-tight text-transparent ${textSizes[size]}`}
          >
            Flowzint
          </span>
          {size === "lg" && (
            <span className="text-[10px] uppercase tracking-[0.2em] text-brand-400">
              AI Interview Intelligence
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
