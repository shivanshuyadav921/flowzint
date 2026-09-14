"use client";

import React, { useEffect, useState } from "react";
import { VercelToolbar } from "@vercel/toolbar/next";

export function VercelToolbarClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const shouldInjectToolbar =
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_VERCEL_ENV === "preview";

  if (!shouldInjectToolbar) return null;

  return <VercelToolbar />;
}
