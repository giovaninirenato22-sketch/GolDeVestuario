import { Badge } from "@/components/ui/Badge";
import type { Producto } from "@/types";

export function StockBadge({ producto }: { producto: Producto }) {
  if (producto.tipo === "por-encargue") {
    return <Badge tone="muted">Por encargue</Badge>;
  }

  const totalUnidades = producto.talles.reduce((acc, t) => acc + t.cantidad, 0);
  if (totalUnidades === 0) return <Badge tone="error">Sin stock</Badge>;
  if (totalUnidades === 1) return <Badge tone="warning">Última unidad</Badge>;
  return null;
}
