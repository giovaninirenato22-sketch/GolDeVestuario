import "server-only";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slug";
import type { CategoriaAdminRow, Talle } from "@/types";
import type { Categoria as CategoriaDB } from "@/generated/prisma/client";

export interface CategoriaInput {
  nombre: string;
  guiaTalles: string;
  cuidados: string;
  talles: Talle[];
  orden: number;
}

function mapAdminRow(row: CategoriaDB): CategoriaAdminRow {
  return {
    dbId: row.id,
    slug: row.slug,
    nombre: row.nombre,
    guiaTalles: row.guiaTalles,
    cuidados: row.cuidados,
    tallesDisponibles: JSON.parse(row.talles) as Talle[],
    orden: row.orden,
  };
}

export async function getTodasLasCategoriasAdmin(): Promise<CategoriaAdminRow[]> {
  const rows = await prisma.categoria.findMany({ orderBy: { orden: "asc" } });
  return rows.map(mapAdminRow);
}

export async function getCategoriaPorIdAdmin(id: string): Promise<CategoriaAdminRow | null> {
  const row = await prisma.categoria.findUnique({ where: { id } });
  return row ? mapAdminRow(row) : null;
}

async function generarSlugUnico(nombre: string): Promise<string> {
  const base = slugify(nombre) || "categoria";
  let candidato = base;
  let sufijo = 2;

  while (await prisma.categoria.findUnique({ where: { slug: candidato } })) {
    candidato = `${base}-${sufijo}`;
    sufijo += 1;
  }

  return candidato;
}

/**
 * El slug se genera una sola vez, al crear, y nunca se toca después: es lo
 * que Producto.categoria guarda como referencia (sin FK), así que
 * cambiarlo en un edit dejaría huérfanos a todos los productos de esa
 * categoría. Renombrar (nombre) es libre; el slug queda fijo.
 */
export async function crearCategoria(data: CategoriaInput) {
  const slug = await generarSlugUnico(data.nombre);
  return prisma.categoria.create({
    data: {
      slug,
      nombre: data.nombre,
      guiaTalles: data.guiaTalles,
      cuidados: data.cuidados,
      talles: JSON.stringify(data.talles),
      orden: data.orden,
    },
  });
}

export async function actualizarCategoria(id: string, data: CategoriaInput) {
  return prisma.categoria.update({
    where: { id },
    data: {
      nombre: data.nombre,
      guiaTalles: data.guiaTalles,
      cuidados: data.cuidados,
      talles: JSON.stringify(data.talles),
      orden: data.orden,
    },
  });
}

/**
 * Producto.categoria guarda el slug sin FK: borrar una categoría en uso
 * dejaría huérfanos a esos productos (su categoría dejaría de resolver en
 * cualquier lado — ficha, talles, filtros). Por eso se bloquea acá, igual
 * que se bloquea borrar la última categoría que queda (el form de
 * productos necesita al menos una opción).
 */
export async function eliminarCategoria(
  id: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const categoria = await prisma.categoria.findUniqueOrThrow({ where: { id } });

  const totalCategorias = await prisma.categoria.count();
  if (totalCategorias <= 1) {
    return { ok: false, error: "No podés borrar la última categoría: tiene que quedar al menos una." };
  }

  const productosEnUso = await prisma.producto.count({ where: { categoria: categoria.slug } });
  if (productosEnUso > 0) {
    return {
      ok: false,
      error: `Hay ${productosEnUso} producto(s) en esta categoría. Cambiales la categoría antes de borrarla.`,
    };
  }

  await prisma.categoria.delete({ where: { id } });
  return { ok: true };
}

export async function reordenarCategorias(ordenados: Array<{ id: string; orden: number }>) {
  await prisma.$transaction(
    ordenados.map(({ id, orden }) => prisma.categoria.update({ where: { id }, data: { orden } })),
  );
}
