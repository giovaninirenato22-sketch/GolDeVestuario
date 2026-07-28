"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
  reordenarCategorias,
} from "@/lib/categorias/admin";
import { guardarArchivoSubido } from "@/lib/uploads";
import { ORDEN_TALLES } from "@/lib/categorias/helpers";
import { CUIDADOS_DEFAULT_URL } from "@/data/media";
import type { Talle } from "@/types";

const CUIDADOS_POR_DEFECTO = CUIDADOS_DEFAULT_URL;

function revalidarPaginasPublicas() {
  revalidatePath("/");
  revalidatePath("/productos");
  revalidatePath("/productos/en-stock");
  revalidatePath("/productos/por-encargue");
  revalidatePath("/soporte");
  revalidatePath("/admin/productos");
}

export async function guardarCategoriaAction(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim() || undefined;
  const nombre = String(formData.get("nombre") ?? "").trim();
  const guiaTalles = String(formData.get("guiaTalles") ?? "").trim();
  const cuidados = String(formData.get("cuidados") ?? "").trim() || CUIDADOS_POR_DEFECTO;
  const orden = Number(formData.get("orden") ?? 0);
  const talles: Talle[] = ORDEN_TALLES.filter((t) => formData.get(`talle_${t}`) === "on");

  const volverA = id ? `/admin/categorias/${id}` : "/admin/categorias/nueva";

  if (!nombre) {
    redirect(`${volverA}?error=${encodeURIComponent("El nombre es obligatorio")}`);
  }
  if (!guiaTalles) {
    redirect(`${volverA}?error=${encodeURIComponent("Subí una guía de talles")}`);
  }
  if (talles.length === 0) {
    redirect(`${volverA}?error=${encodeURIComponent("Elegí al menos un talle disponible")}`);
  }

  const data = { nombre, guiaTalles, cuidados, talles, orden };

  try {
    if (id) {
      await actualizarCategoria(id, data);
    } else {
      await crearCategoria(data);
    }
  } catch (err) {
    const mensaje = err instanceof Error ? err.message : "No se pudo guardar la categoría";
    redirect(`${volverA}?error=${encodeURIComponent(mensaje)}`);
  }

  revalidarPaginasPublicas();
  revalidatePath("/admin/categorias");
  redirect("/admin/categorias");
}

export async function eliminarCategoriaAction(
  id: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const resultado = await eliminarCategoria(id);
  if (resultado.ok) {
    revalidarPaginasPublicas();
    revalidatePath("/admin/categorias");
  }
  return resultado;
}

export async function reordenarCategoriasAction(ordenados: Array<{ id: string; orden: number }>) {
  await reordenarCategorias(ordenados);
  revalidarPaginasPublicas();
  revalidatePath("/admin/categorias");
}

export async function subirImagenCategoria(formData: FormData): Promise<{ path?: string; error?: string }> {
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { error: "No se seleccionó ningún archivo" };
  }
  return guardarArchivoSubido(file, "guias/uploads");
}
