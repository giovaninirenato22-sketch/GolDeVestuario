import type { Categoria, Producto } from "@/types";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProductGrid } from "./ProductGrid";

export function RelatedProducts({ productos, categorias }: { productos: Producto[]; categorias: Categoria[] }) {
  if (productos.length === 0) return null;

  return (
    <div>
      <SectionHeader eyebrow="También te puede interesar" title="Productos relacionados" />
      <ProductGrid productos={productos} categorias={categorias} />
    </div>
  );
}
