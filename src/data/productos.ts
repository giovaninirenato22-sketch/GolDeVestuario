import "server-only";
import type { Producto, TalleDisponibilidad } from "@/types";
import { prisma } from "@/lib/db";
import { MAX_PRODUCTOS_DESTACADOS } from "./site";
import type { Producto as ProductoDB } from "@/generated/prisma/client";

/**
 * Este módulo es server-only (Prisma no corre en el navegador). El carrito,
 * que sí necesita el catálogo en el cliente, lo consume vía
 * GET /api/productos (ver src/app/api/productos/route.ts), no importando
 * este archivo directamente.
 */

function mapProducto(row: ProductoDB): Producto {
  const talles = JSON.parse(row.talles) as TalleDisponibilidad[];
  const imagenes = JSON.parse(row.imagenes) as string[];

  const base = {
    id: row.id,
    slug: row.slug,
    nombre: row.nombre,
    club: row.club ?? undefined,
    temporada: row.temporada ?? undefined,
    categoria: row.categoria as Producto["categoria"],
    talles,
    imagenes,
    descripcion: row.descripcion ?? undefined,
    destacado: row.destacado,
    orden: row.orden,
    activo: row.activo,
  };

  if (row.tipo === "en-stock") {
    return { ...base, tipo: "en-stock", precio: row.precio ?? 0 };
  }
  return { ...base, tipo: "por-encargue", precio: undefined };
}

export async function getProductosActivos(): Promise<Producto[]> {
  const rows = await prisma.producto.findMany({
    where: { activo: true },
    orderBy: { orden: "asc" },
  });
  return rows.map(mapProducto);
}

export async function getProductoPorSlug(slug: string): Promise<Producto | undefined> {
  const row = await prisma.producto.findFirst({ where: { slug, activo: true } });
  return row ? mapProducto(row) : undefined;
}

export async function getProductosPorTipo(tipo: Producto["tipo"]): Promise<Producto[]> {
  const productos = await getProductosActivos();
  return productos.filter((p) => p.tipo === tipo);
}

export async function getProductosDestacados(): Promise<Producto[]> {
  const productos = await getProductosActivos();
  const destacados = productos.filter((p) => p.destacado);
  if (destacados.length > MAX_PRODUCTOS_DESTACADOS && process.env.NODE_ENV !== "production") {
    console.warn(
      `[productos] Hay ${destacados.length} productos destacados; RN-02 permite un máximo de ${MAX_PRODUCTOS_DESTACADOS}. Se recortará la lista.`,
    );
  }
  return destacados.slice(0, MAX_PRODUCTOS_DESTACADOS);
}

export async function getProductosRelacionados(producto: Producto, limite = 4): Promise<Producto[]> {
  const productos = await getProductosActivos();
  return productos
    .filter((p) => p.id !== producto.id && p.categoria === producto.categoria)
    .slice(0, limite);
}
