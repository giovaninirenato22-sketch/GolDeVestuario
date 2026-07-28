import type { ReactNode } from "react";

export function Notice({ children }: { children: ReactNode }) {
  return (
    <div className="text-body-small mb-8 rounded-md border border-accent/40 bg-surface px-5 py-4 text-fg-secondary">
      {children}
    </div>
  );
}
