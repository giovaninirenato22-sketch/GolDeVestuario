"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  toggleDestacado,
  reordenarProductos,
  agregarImagenProducto,
  quitarImagenProducto,
  reordenarImagenesProducto,
} from "@/lib/productos/admin";
import { getCategoriaPorSlug } from "@/data/categorias";
import { PLACEHOLDER_PRODUCTO_URL } from "@/data/media";
import type { CategoriaId, TalleDisponibilidad, TipoProducto } from "@/types";

function revalidarPaginasPublicas(slugAnterior?: string, slugNuevo?: string) {
  revalidatePath("/");
  revalidatePath("/productos");
  revalidatePath("/productos/en-stock");
  revalidatePath("/productos/por-encargue");
  revalidatePath("/sitemap.xml");
  if (slugAnterior) revalidatePath(`/productos/${slugAnterior}`);
  if (slugNuevo) revalidatePath(`/productos/${slugNuevo}`);
}

export async function guardarProducto(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim() || undefined;
  const nombre = String(formData.get("nombre") ?? "").trim();
  const club = String(formData.get("club") ?? "").trim();
  const temporada = String(formData.get("temporada") ?? "").trim();
  const tipo = String(formData.get("tipo") ?? "en-stock") as TipoProducto;
  const categoria = String(formData.get("categoria") ?? "fan") as CategoriaId;
  const precioRaw = String(formData.get("precio") ?? "");
  const descripcion = String(formData.get("descripcion") ?? "").trim();
  const destacado = formData.get("destacado") === "on";
  const activo = formData.get("activo") === "on";
  const orden = Number(formData.get("orden") ?? 0);
  const imagenesRaw = String(formData.get("imagenes") ?? "[]");
  const nombreAnterior = String(formData.get("nombreAnterior") ?? "");
  const slugAnterior = String(formData.get("slugAnterior") ?? "") || undefined;

  if (!nombre) {
    const volverA = id ? `/admin/productos/${id}` : "/admin/productos/nuevo";
    redirect(`${volverA}?error=${encodeURIComponent("El nombre es obligatorio")}`);
  }

  const categoriaInfo = await getCategoriaPorSlug(categoria);
  if (!categoriaInfo) {
    const volverA = id ? `/admin/productos/${id}` : "/admin/productos/nuevo";
    redirect(`${volverA}?error=${encodeURIComponent("La categoría seleccionada ya no existe")}`);
  }

  const talles: TalleDisponibilidad[] = categoriaInfo.tallesDisponibles.map((talle) => ({
    talle,
    disponible: formData.get(`talle_${talle}`) === "on",
  }));

  let imagenes: string[] = [];
  try {
    imagenes = JSON.parse(imagenesRaw);
  } catch {
    imagenes = [];
  }
  if (imagenes.length === 0) {
    imagenes = [PLACEHOLDER_PRODUCTO_URL];
  }

  const data = {
    nombre,
    club: club || undefined,
    temporada: temporada || undefined,
    tipo,
    categoria,
    precio: precioRaw ? Number(precioRaw) : undefined,
    talles,
    imagenes,
    descripcion: descripcion || undefined,
    destacado,
    orden,
    activo,
  };

  let slugNuevo: string;

  try {
    if (id) {
      const nombreCambio = nombre !== nombreAnterior;
      const actualizado = await actualizarProducto(id, data, nombreCambio);
      slugNuevo = actualizado.slug;
    } else {
      const creado = await crearProducto(data);
      slugNuevo = creado.slug;
    }
  } catch (err) {
    const volverA = id ? `/admin/productos/${id}` : "/admin/productos/nuevo";
    const mensaje = err instanceof Error ? err.message : "No se pudo guardar el producto";
    redirect(`${volverA}?error=${encodeURIComponent(mensaje)}`);
  }

  revalidarPaginasPublicas(slugAnterior, slugNuevo);
  redirect("/admin/productos");
}

export async function eliminarProductoAction(id: string, slug: string) {
  await eliminarProducto(id);
  revalidarPaginasPublicas(slug);
  revalidatePath("/admin/productos");
}

export async function toggleDestacadoAction(id: string) {
  const resultado = await toggleDestacado(id);
  if (resultado.ok) {
    revalidarPaginasPublicas();
    revalidatePath("/admin/productos");
  }
  return resultado;
}

export async function reordenarProductosAction(ordenados: Array<{ id: string; orden: number }>) {
  await reordenarProductos(ordenados);
  revalidarPaginasPublicas();
  revalidatePath("/admin/productos");
}

/**
 * Se llaman apenas termina de subirse cada foto a Cloudinary (ver
 * ProductoForm), no recién al guardar el formulario completo — así dos
 * dispositivos editando el mismo producto no se pisan las fotos entre sí.
 * Devuelven el array actualizado para que el cliente sincronice su vista.
 */
export async function agregarImagenProductoAction(id: string, path: string): Promise<string[]> {
  const actualizado = await agregarImagenProducto(id, path);
  revalidarPaginasPublicas(actualizado.slug, actualizado.slug);
  revalidatePath("/admin/productos");
  revalidatePath(`/admin/productos/${id}`);
  return JSON.parse(actualizado.imagenes) as string[];
}

export async function quitarImagenProductoAction(id: string, path: string): Promise<string[]> {
  const actualizado = await quitarImagenProducto(id, path);
  revalidarPaginasPublicas(actualizado.slug, actualizado.slug);
  revalidatePath("/admin/productos");
  revalidatePath(`/admin/productos/${id}`);
  return JSON.parse(actualizado.imagenes) as string[];
}

export async function reordenarImagenesProductoAction(id: string, orden: string[]): Promise<string[]> {
  const actualizado = await reordenarImagenesProducto(id, orden);
  revalidarPaginasPublicas(actualizado.slug, actualizado.slug);
  revalidatePath("/admin/productos");
  revalidatePath(`/admin/productos/${id}`);
  return JSON.parse(actualizado.imagenes) as string[];
}
