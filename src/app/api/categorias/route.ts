import { NextResponse } from "next/server";
import { getCategorias } from "@/data/categorias";

/**
 * Igual que /api/productos: Prisma no corre en el navegador, así que
 * CartContext pide esta ruta en vez de importar src/data/categorias.ts
 * directamente (que es server-only).
 */
export async function GET() {
  const categorias = await getCategorias();
  return NextResponse.json(categorias);
}
