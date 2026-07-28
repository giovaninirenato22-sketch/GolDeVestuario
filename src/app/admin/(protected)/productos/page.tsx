import type { Metadata } from "next";
import Link from "next/link";
import { getTodosLosProductosAdmin } from "@/lib/productos/admin";
import { AdminProductTable } from "@/components/admin/AdminProductTable";
import { getCategorias } from "@/data/categorias";

export const metadata: Metadata = {
  title: "Admin — Productos",
  robots: { index: false, follow: false },
};

export default async function AdminProductosPage() {
  const [productos, categorias] = await Promise.all([getTodosLosProductosAdmin(), getCategorias()]);

  const filas = productos.map((p) => ({
    id: p.id,
    slug: p.slug,
    nombre: p.nombre,
    categoria: p.categoria,
    tipo: p.tipo,
    precio: p.precio,
    activo: p.activo,
    destacado: p.destacado,
    orden: p.orden,
  }));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-h1 text-fg">Productos</h1>
        <Link
          href="/admin/productos/nuevo"
          className="text-button rounded-md bg-accent px-5 py-2 text-on-accent hover:bg-accent-light"
        >
          + Nuevo producto
        </Link>
      </div>

      {filas.length === 0 ? (
        <p className="text-body text-fg-secondary">Todavía no hay productos cargados.</p>
      ) : (
        <AdminProductTable productosIniciales={filas} categorias={categorias} />
      )}
    </div>
  );
}
