"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";

type ToastTone = "neutral" | "success" | "error";

interface ToastOptions {
  tone?: ToastTone;
  href?: string;
  hrefLabel?: string;
}

interface ToastState extends ToastOptions {
  id: number;
  message: string;
}

interface ToastContextValue {
  showToast: (message: string, options?: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TONE_BORDER: Record<ToastTone, string> = {
  neutral: "border-border-strong",
  success: "border-success",
  error: "border-error",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const idRef = useRef(0);

  const showToast = useCallback((message: string, options?: ToastOptions) => {
    idRef.current += 1;
    const id = idRef.current;
    setToast({ id, message, tone: options?.tone ?? "neutral", href: options?.href, hrefLabel: options?.hrefLabel });
    window.setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
      >
        <AnimatePresence>
          {toast ? (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className={`pointer-events-auto flex max-w-sm flex-wrap items-center gap-x-3 gap-y-1 rounded-md border bg-surface-alt px-5 py-3 ${TONE_BORDER[toast.tone ?? "neutral"]}`}
            >
              <span className="flex items-center gap-2">
                {toast.tone === "success" ? (
                  <span aria-hidden="true" className="text-success shrink-0 text-base leading-none">
                    ✓
                  </span>
                ) : null}
                {toast.tone === "error" ? (
                  <span aria-hidden="true" className="text-error shrink-0 text-base leading-none">
                    ✕
                  </span>
                ) : null}
                <span className="text-body-small text-fg">{toast.message}</span>
              </span>
              {toast.href ? (
                <Link
                  href={toast.href}
                  className="text-body-small shrink-0 whitespace-nowrap font-medium text-accent underline underline-offset-2 hover:text-accent-light"
                >
                  {toast.hrefLabel ?? "Ver más"}
                </Link>
              ) : null}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de <ToastProvider>");
  return ctx;
}
