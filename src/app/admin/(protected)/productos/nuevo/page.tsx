import type { Metadata } from "next";
import { ProductoForm } from "@/components/admin/ProductoForm";
import { ErrorBanner } from "@/components/admin/ErrorBanner";
import { getCategorias } from "@/data/categorias";

export const metadata: Metadata = {
  title: "Admin — Nuevo producto",
  robots: { index: false, follow: false },
};

export default async function NuevoProductoPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const categorias = await getCategorias();

  return (
    <div>
      <h1 className="text-h1 text-fg mb-8">Nuevo producto</h1>
      <ErrorBanner mensaje={error} />
      <ProductoForm categorias={categorias} />
    </div>
  );
}
