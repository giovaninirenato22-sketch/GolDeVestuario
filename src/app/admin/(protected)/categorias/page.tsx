import type { Metadata } from "next";
import Link from "next/link";
import { getTodasLasCategoriasAdmin } from "@/lib/categorias/admin";
import { AdminCategoriaTable } from "@/components/admin/AdminCategoriaTable";

export const metadata: Metadata = {
  title: "Admin — Categorías",
  robots: { index: false, follow: false },
};

export default async function AdminCategoriasPage() {
  const categorias = await getTodasLasCategoriasAdmin();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-h1 text-fg">Categorías</h1>
        <Link
          href="/admin/categorias/nueva"
          className="text-button rounded-md bg-accent px-5 py-2 text-on-accent hover:bg-accent-light"
        >
          + Nueva categoría
        </Link>
      </div>

      {categorias.length === 0 ? (
        <p className="text-body text-fg-secondary">Todavía no hay categorías cargadas.</p>
      ) : (
        <AdminCategoriaTable categoriasIniciales={categorias} />
      )}
    </div>
  );
}
