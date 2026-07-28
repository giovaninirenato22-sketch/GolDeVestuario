import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductoPorIdAdmin } from "@/lib/productos/admin";
import { ProductoForm, type ProductoFormValues } from "@/components/admin/ProductoForm";
import { ErrorBanner } from "@/components/admin/ErrorBanner";
import { getCategorias } from "@/data/categorias";
import type { CategoriaId, TalleDisponibilidad, TipoProducto } from "@/types";

export const metadata: Metadata = {
  title: "Admin — Editar producto",
  robots: { index: false, follow: false },
};

export default async function EditarProductoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const producto = await getProductoPorIdAdmin(id);
  if (!producto) notFound();
  const categorias = await getCategorias();

  const valores: ProductoFormValues = {
    id: producto.id,
    slug: producto.slug,
    nombre: producto.nombre,
    club: producto.club ?? undefined,
    temporada: producto.temporada ?? undefined,
    tipo: producto.tipo as TipoProducto,
    categoria: producto.categoria as CategoriaId,
    precio: producto.precio ?? undefined,
    talles: JSON.parse(producto.talles) as TalleDisponibilidad[],
    imagenes: JSON.parse(producto.imagenes) as string[],
    descripcion: producto.descripcion ?? undefined,
    destacado: producto.destacado,
    orden: producto.orden,
    activo: producto.activo,
  };

  return (
    <div>
      <h1 className="text-h1 text-fg mb-8">Editar producto</h1>
      <ErrorBanner mensaje={error} />
      <ProductoForm valores={valores} categorias={categorias} />
    </div>
  );
}
