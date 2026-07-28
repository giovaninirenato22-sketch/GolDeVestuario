import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoriaPorIdAdmin } from "@/lib/categorias/admin";
import { CategoriaForm, type CategoriaFormValues } from "@/components/admin/CategoriaForm";
import { ErrorBanner } from "@/components/admin/ErrorBanner";

export const metadata: Metadata = {
  title: "Admin — Editar categoría",
  robots: { index: false, follow: false },
};

export default async function EditarCategoriaPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const categoria = await getCategoriaPorIdAdmin(id);
  if (!categoria) notFound();

  const valores: CategoriaFormValues = {
    id: categoria.dbId,
    nombre: categoria.nombre,
    guiaTalles: categoria.guiaTalles,
    cuidados: categoria.cuidados,
    tallesDisponibles: categoria.tallesDisponibles,
    orden: categoria.orden,
  };

  return (
    <div>
      <h1 className="text-h1 text-fg mb-8">Editar categoría</h1>
      <ErrorBanner mensaje={error} />
      <CategoriaForm valores={valores} />
    </div>
  );
}
