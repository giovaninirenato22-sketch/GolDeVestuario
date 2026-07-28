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

// No incluye `imagenes` a propósito: esas se manejan con
// agregarImagenProducto/quitarImagenProducto (ver más abajo), que
// persisten cada foto al toque en vez de esperar al submit del form
// completo. Si actualizarProducto también pisara imagenes con lo que el
// navegador tenía en memoria, guardar el producto desde un dispositivo
// borraría fotos agregadas mientras tanto desde otro.
function serializarCamposBase(data: ProductoInput) {
  return {
    nombre: data.nombre,
    club: data.club || null,
    temporada: data.temporada || null,
    tipo: data.tipo,
    categoria: data.categoria,
    precio: data.tipo === "en-stock" ? (data.precio ?? 0) : null,
    talles: JSON.stringify(data.talles),
    descripcion: data.descripcion || null,
    destacado: data.destacado,
    orden: data.orden,
    activo: data.activo,
  };
}

export async function crearProducto(data: ProductoInput) {
  const slug = await generarSlugUnico(data.nombre);
  return prisma.producto.create({
    data: { ...serializarCamposBase(data), imagenes: JSON.stringify(data.imagenes), slug },
  });
}

export async function actualizarProducto(id: string, data: ProductoInput, nombreCambio: boolean) {
  const actual = await prisma.producto.findUniqueOrThrow({ where: { id } });
  const slug = nombreCambio ? await generarSlugUnico(data.nombre, id) : actual.slug;
  return prisma.producto.update({ where: { id }, data: { ...serializarCamposBase(data), slug } });
}

/**
 * Lee-modifica-escribe contra la base en el momento (no contra un array que
 * el cliente tenía en memoria), así que dos dispositivos subiendo fotos al
 * mismo producto casi al mismo tiempo no se pisan entre sí.
 */
export async function agregarImagenProducto(id: string, path: string) {
  const producto = await prisma.producto.findUniqueOrThrow({ where: { id } });
  const imagenes = JSON.parse(producto.imagenes) as string[];
  return prisma.producto.update({
    where: { id },
    data: { imagenes: JSON.stringify([...imagenes, path]) },
  });
}

export async function quitarImagenProducto(id: string, path: string) {
  const producto = await prisma.producto.findUniqueOrThrow({ where: { id } });
  const imagenes = JSON.parse(producto.imagenes) as string[];
  return prisma.producto.update({
    where: { id },
    data: { imagenes: JSON.stringify(imagenes.filter((i) => i !== path)) },
  });
}

/**
 * Recibe el orden completo deseado (mismas URLs que ya están en la base, en
 * otro orden). Si otro dispositivo agregó o quitó una foto justo antes de
 * este guardado, esa diferencia se respeta: se aplica el orden pedido a las
 * fotos que siguen existiendo y las que aparecieron mientras tanto se
 * agregan al final, en vez de perderse.
 */
export async function reordenarImagenesProducto(id: string, ordenPedido: string[]) {
  const producto = await prisma.producto.findUniqueOrThrow({ where: { id } });
  const actuales = JSON.parse(producto.imagenes) as string[];
  const actualesSet = new Set(actuales);
  const nuevasNoContempladas = actuales.filter((img) => !ordenPedido.includes(img));
  const ordenFinal = [...ordenPedido.filter((img) => actualesSet.has(img)), ...nuevasNoContempladas];
  return prisma.producto.update({
    where: { id },
    data: { imagenes: JSON.stringify(ordenFinal) },
  });
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
