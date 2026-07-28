import { NextResponse } from "next/server";
import { getProductosActivos } from "@/data/productos";

/**
 * Único punto por el que el cliente (carrito) accede al catálogo: Prisma
 * no corre en el navegador, así que CartContext y /carrito piden esta
 * ruta en vez de importar src/data/productos.ts directamente.
 */
export async function GET() {
  const productos = await getProductosActivos();
  return NextResponse.json(productos);
}
