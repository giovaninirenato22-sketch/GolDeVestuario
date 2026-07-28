import { Badge } from "@/components/ui/Badge";

export function CategoryBadge({ nombre }: { nombre: string }) {
  return <Badge tone="accent">{nombre}</Badge>;
}
