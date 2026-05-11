import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flowzint | AI Interview Preparation",
  description: "Premium AI-powered interview coach, resume analyzer, and mock interview dashboard.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-brand-900 text-slate-100 antialiased">{children}</body>
    </html>
  );
}
