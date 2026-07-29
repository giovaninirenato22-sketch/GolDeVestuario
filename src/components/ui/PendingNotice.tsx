import type { ReactNode } from "react";

/**
 * Marca visible de contenido pendiente de aprobación del negocio. No
 * reemplaza al contenido real: solo evita inventar historia, políticas o
 * datos que no están documentados.
 */
export function PendingNotice({ children }: { children: ReactNode }) {
  return (
    <div className="text-body-small rounded-md border border-dashed border-border-strong px-5 py-4 text-fg-muted">
      {children}
    </div>
  );
}
