"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex w-full max-w-md flex-col gap-3 px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((toast) => {
          const isDestructive = toast.variant === "destructive";
          const isSuccess = toast.variant === "success";

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
              className={`relative flex w-full items-start gap-3 overflow-hidden rounded-2xl border bg-slate-950/85 p-4 shadow-xl backdrop-blur-md transition-all duration-300 hover:bg-slate-900/90 ${
                isDestructive
                  ? "border-red-500/20 shadow-red-950/5"
                  : isSuccess
                  ? "border-emerald-500/20 shadow-emerald-950/5"
                  : "border-white/10 shadow-slate-950/20"
              }`}
            >
              {/* Variant indicator bar */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1 ${
                  isDestructive ? "bg-red-500" : isSuccess ? "bg-emerald-500" : "bg-brand-500"
                }`}
              />

              {/* Icon */}
              <div className="mt-0.5 flex-shrink-0">
                {isDestructive ? (
                  <AlertCircle className="h-5 w-5 text-red-400" />
                ) : isSuccess ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : (
                  <Info className="h-5 w-5 text-brand-400" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pr-4">
                <h4 className="text-sm font-semibold text-white">{toast.title}</h4>
                {toast.description && (
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">
                    {toast.description}
                  </p>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={() => removeToast(toast.id)}
                className="rounded-lg p-1 text-slate-500 hover:bg-white/5 hover:text-white transition"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
