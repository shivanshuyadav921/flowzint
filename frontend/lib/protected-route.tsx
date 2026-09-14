"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/store";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { token, isHydrated, setToken } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check if token exists in localStorage even if store is loading
    const localToken = typeof window !== "undefined" ? localStorage.getItem("flowzint_token") : null;
    if (localToken && !token) {
      setToken(localToken);
    }
    
    if (isHydrated || localToken || token) {
      if (!localToken && !token) {
        router.push("/auth/login");
      } else {
        setChecking(false);
      }
    }
  }, [token, isHydrated, router, setToken]);

  if (checking && !token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
          <p className="text-sm text-slate-400">Loading Flowzint workspace...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
