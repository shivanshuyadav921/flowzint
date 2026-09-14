/* eslint-disable @next/next/no-img-element */
import React from "react";


interface UserAvatarProps {
  src?: string | null;
  name?: string | null;
  email?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  showStatus?: boolean;
  className?: string;
}

export function UserAvatar({
  src,
  name,
  email,
  size = "md",
  showStatus = true,
  className = "",
}: UserAvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-xl",
  };

  const statusDotSizes = {
    sm: "h-2 w-2",
    md: "h-2.5 w-2.5",
    lg: "h-3 w-3",
    xl: "h-3.5 w-3.5",
  };

  const getInitials = () => {
    if (name && name.trim().length > 0) {
      const parts = name.trim().split(" ");
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
      }
      return name.slice(0, 2).toUpperCase();
    }
    if (email && email.trim().length > 0) {
      return email.slice(0, 2).toUpperCase();
    }
    return "FZ";
  };

  // Generate deterministic gradient background based on name/email
  const gradients = [
    "from-brand-500 via-indigo-600 to-purple-600",
    "from-cyan-500 via-blue-600 to-indigo-700",
    "from-emerald-500 via-teal-600 to-cyan-700",
    "from-violet-500 via-purple-600 to-pink-600",
    "from-amber-500 via-orange-600 to-rose-600",
  ];

  const charCode = (name || email || "Flowzint").charCodeAt(0) || 0;
  const gradient = gradients[charCode % gradients.length];

  return (
    <div className={`relative inline-flex flex-shrink-0 ${className}`}>
      <div
        className={`relative flex ${sizeClasses[size]} items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-tr ${gradient} font-bold text-white shadow-md ring-2 ring-white/10`}
      >
        {src ? (
          <img
            src={src}
            alt={name || "User profile"}
            className="h-full w-full object-cover"
            onError={(e) => {
              // Hide broken image and fallback to initials
              (e.target as HTMLElement).style.display = "none";
            }}
          />
        ) : (
          <span className="tracking-wider">{getInitials()}</span>
        )}
      </div>

      {showStatus && (
        <span className={`absolute -bottom-0.5 -right-0.5 ${statusDotSizes[size]} rounded-full bg-emerald-500 ring-2 ring-slate-950`} />
      )}
    </div>
  );
}
