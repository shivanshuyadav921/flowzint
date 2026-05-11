"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/store";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const token = useAuth((state) => state.token);

  useEffect(() => {
    if (!token) {
      router.push("/auth/login");
    }
  }, [token, router]);

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-900">
        <div className="text-center">
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
