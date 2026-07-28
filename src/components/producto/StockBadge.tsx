import { Badge } from "@/components/ui/Badge";
import type { Producto } from "@/types";

export function StockBadge({ producto }: { producto: Producto }) {
  if (producto.tipo === "por-encargue") {
    return <Badge tone="muted">Por encargue</Badge>;
  }

  const disponibles = producto.talles.filter((t) => t.disponible).length;
  if (disponibles === 0) return <Badge tone="error">Sin stock</Badge>;
  if (disponibles <= 2) return <Badge tone="warning" >Últimas unidades</Badge>;
  return null;
}
