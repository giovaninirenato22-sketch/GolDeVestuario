import "server-only";
import type { Categoria, Talle } from "@/types";
import { prisma } from "@/lib/db";
import type { Categoria as CategoriaDB } from "@/generated/prisma/client";

/**
 * RN-06: la guía de talles y la foto de cuidados de una camiseta se
 * resuelven por categoría, nunca por producto individual.
 *
 * Las categorías se cargan desde el admin (antes eran un objeto estático
 * acá mismo). Este módulo es server-only: los componentes cliente que
 * necesitan la lista la reciben como prop desde una página/server component
 * que llamó a getCategorias(), no importan este archivo directamente.
 */

function mapCategoria(row: CategoriaDB): Categoria {
  return {
    id: row.slug,
    nombre: row.nombre,
    guiaTalles: row.guiaTalles,
    cuidados: row.cuidados,
    tallesDisponibles: JSON.parse(row.talles) as Talle[],
  };
}

export async function getCategorias(): Promise<Categoria[]> {
  const rows = await prisma.categoria.findMany({ orderBy: { orden: "asc" } });
  return rows.map(mapCategoria);
}

export async function getCategoriaPorSlug(slug: string): Promise<Categoria | undefined> {
  const row = await prisma.categoria.findUnique({ where: { slug } });
  return row ? mapCategoria(row) : undefined;
}
