import type { Producto } from "@/types";
import { formatARS } from "@/lib/precios";

export function PriceDisplay({ producto, size = "md" }: { producto: Producto; size?: "md" | "lg" }) {
  const cls = size === "lg" ? "text-h2" : "text-button";

  if (producto.tipo === "por-encargue") {
    return <p className={`${cls} text-accent`}>Precio a coordinar</p>;
  }

  return <p className={`${cls} text-fg`}>{formatARS(producto.precio)}</p>;
}
