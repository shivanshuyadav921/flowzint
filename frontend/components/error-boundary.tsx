"use client";

import React, { ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-brand-900 px-4">
          <div className="max-w-md rounded-3xl border border-white/10 bg-slate-950/85 p-8 text-center shadow-soft">
            <h2 className="text-2xl font-semibold text-white">Something went wrong</h2>
            <p className="mt-3 text-slate-400">{this.state.error?.message || "An error occurred"}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 rounded-full bg-brand-500 px-6 py-2 text-white transition hover:bg-brand-400"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
