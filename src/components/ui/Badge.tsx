import type { ReactNode } from "react";

type Tone = "accent" | "success" | "error" | "warning" | "muted";

const tones: Record<Tone, string> = {
  accent: "text-accent border-accent",
  success: "text-success border-success",
  // Fondo sólido en vez de texto sobre transparente: text-error sobre bg da
  // 3.64:1 (no cumple AA 4.5:1 en texto normal); fg sobre error da 4.73:1.
  error: "border-error bg-error text-fg",
  warning: "text-warning border-warning",
  muted: "text-fg-muted border-border-strong",
};

export function Badge({ tone = "accent", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`text-caption inline-block rounded-full border px-3 py-1 uppercase tracking-wide ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
