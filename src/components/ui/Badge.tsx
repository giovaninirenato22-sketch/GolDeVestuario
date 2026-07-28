import type { ReactNode } from "react";

type Tone = "accent" | "success" | "error" | "warning" | "muted";

const tones: Record<Tone, string> = {
  accent: "text-accent border-accent",
  success: "text-success border-success",
  // Fondo sólido en vez de texto sobre transparente: text-error sobre bg da
  // 3.64:1 (no cumple AA 4.5:1 en texto normal); fg sobre error da 4.73:1.
  error: "border-error bg-error text-fg",
  warning: "text-warning border-warning",
  // Igual que error: estos badges flotan sobre fotos de producto, que
  // pueden tener cualquier fondo (blanco, de color, transparente). Con
  // fondo transparente, texto gris sobre una foto de fondo blanco quedaba
  // casi ilegible — el fondo sólido oscuro lo hace legible siempre, sea
  // cual sea la foto de atrás.
  muted: "text-fg-secondary bg-bg/90 border-border-strong",
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
