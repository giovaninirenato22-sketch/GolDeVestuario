import type { Categoria, Producto } from "@/types";
import { ProductCard } from "./ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { StaggerGroup, StaggerItem } from "@/components/ui/Reveal";

export function ProductGrid({ productos, categorias }: { productos: Producto[]; categorias: Categoria[] }) {
  if (productos.length === 0) {
    return (
      <EmptyState
        title="No hay productos para mostrar"
        description="Todavía no cargamos camisetas en esta sección."
      />
    );
  }

  const nombresPorCategoria = new Map(categorias.map((c) => [c.id, c.nombre]));

  return (
    <StaggerGroup className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
      {productos.map((producto, index) => (
        <StaggerItem key={producto.id} index={index}>
          <ProductCard
            producto={producto}
            nombreCategoria={nombresPorCategoria.get(producto.categoria) ?? producto.categoria}
          />
        </StaggerItem>
      ))}
    </StaggerGroup>
  );
}
