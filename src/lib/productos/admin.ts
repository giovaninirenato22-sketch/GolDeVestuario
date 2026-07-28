import "server-only";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slug";
import type { CategoriaId, TalleDisponibilidad, TipoProducto } from "@/types";

export interface ProductoInput {
  nombre: string;
  club?: string;
  temporada?: string;
  tipo: TipoProducto;
  categoria: CategoriaId;
  precio?: number;
  talles: TalleDisponibilidad[];
  imagenes: string[];
  descripcion?: string;
  destacado: boolean;
  orden: number;
  activo: boolean;
}

export async function getTodosLosProductosAdmin() {
  return prisma.producto.findMany({ orderBy: { orden: "asc" } });
}

export async function getProductoPorIdAdmin(id: string) {
  return prisma.producto.findUnique({ where: { id } });
}

async function generarSlugUnico(nombre: string, idAIgnorar?: string): Promise<string> {
  const base = slugify(nombre) || "producto";
  let candidato = base;
  let sufijo = 2;

  while (
    await prisma.producto.findFirst({
      where: { slug: candidato, ...(idAIgnorar ? { NOT: { id: idAIgnorar } } : {}) },
    })
  ) {
    candidato = `${base}-${sufijo}`;
    sufijo += 1;
  }

  return candidato;
}

function serializar(data: ProductoInput) {
  return {
    nombre: data.nombre,
    club: data.club || null,
    temporada: data.temporada || null,
    tipo: data.tipo,
    categoria: data.categoria,
    precio: data.tipo === "en-stock" ? (data.precio ?? 0) : null,
    talles: JSON.stringify(data.talles),
    imagenes: JSON.stringify(data.imagenes),
    descripcion: data.descripcion || null,
    destacado: data.destacado,
    orden: data.orden,
    activo: data.activo,
  };
}

export async function crearProducto(data: ProductoInput) {
  const slug = await generarSlugUnico(data.nombre);
  return prisma.producto.create({ data: { ...serializar(data), slug } });
}

export async function actualizarProducto(id: string, data: ProductoInput, nombreCambio: boolean) {
  const actual = await prisma.producto.findUniqueOrThrow({ where: { id } });
  const slug = nombreCambio ? await generarSlugUnico(data.nombre, id) : actual.slug;
  return prisma.producto.update({ where: { id }, data: { ...serializar(data), slug } });
}

export async function eliminarProducto(id: string) {
  return prisma.producto.delete({ where: { id } });
}

const MAX_DESTACADOS = 8;

/** RN-02: máximo 8 productos destacados. Devuelve error si se intenta superar el límite. */
export async function toggleDestacado(id: string): Promise<{ ok: true; destacado: boolean } | { ok: false; error: string }> {
  const producto = await prisma.producto.findUniqueOrThrow({ where: { id } });

  if (!producto.destacado) {
    const cantidadActual = await prisma.producto.count({ where: { destacado: true, activo: true } });
    if (cantidadActual >= MAX_DESTACADOS) {
      return { ok: false, error: `Ya hay ${MAX_DESTACADOS} productos destacados (el máximo permitido). Sacá uno antes de agregar otro.` };
    }
  }

  const actualizado = await prisma.producto.update({
    where: { id },
    data: { destacado: !producto.destacado },
  });

  return { ok: true, destacado: actualizado.destacado };
}

export async function reordenarProductos(ordenados: Array<{ id: string; orden: number }>) {
  await prisma.$transaction(
    ordenados.map(({ id, orden }) => prisma.producto.update({ where: { id }, data: { orden } })),
  );
}
