import type { Metadata } from "next";
import { VercelToolbar } from "@vercel/toolbar/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flowzint | AI Interview Preparation",
  description: "Premium AI-powered interview coach, resume analyzer, and mock interview dashboard.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const shouldInjectToolbar = process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_VERCEL_ENV === "preview";

  return (
    <html lang="en">
      <body className="min-h-screen bg-brand-900 text-slate-100 antialiased">
        {children}
        {shouldInjectToolbar && <VercelToolbar />}
      </body>
    </html>
  );
}
