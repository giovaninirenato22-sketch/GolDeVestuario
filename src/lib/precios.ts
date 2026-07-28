import type { ItemCarrito, MedioDePago, Producto } from "@/types";
import { DESCUENTO_EFECTIVO_TRANSFERENCIA } from "@/data/site";

export function formatARS(valor: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(valor);
}

export function aplicaDescuento(medio: MedioDePago): boolean {
  return medio === "efectivo" || medio === "transferencia";
}

export interface ResumenCarrito {
  itemsEnStock: Array<{ item: ItemCarrito; producto: Producto & { tipo: "en-stock" } }>;
  itemsPorEncargue: Array<{ item: ItemCarrito; producto: Producto & { tipo: "por-encargue" } }>;
  subtotal: number;
  descuento: number;
  total: number;
}

/**
 * RN-05 + RN-08: el 15% OFF solo aplica a productos con precio (En Stock).
 * Los productos Por Encargue no tienen base de cálculo ("precio a
 * coordinar"), así que quedan fuera del subtotal y del descuento.
 */
export function calcularResumen(
  items: ItemCarrito[],
  productos: Producto[],
  medio: MedioDePago,
): ResumenCarrito {
  const itemsEnStock: ResumenCarrito["itemsEnStock"] = [];
  const itemsPorEncargue: ResumenCarrito["itemsPorEncargue"] = [];

  for (const item of items) {
    const producto = productos.find((p) => p.id === item.productoId);
    if (!producto) continue;
    if (producto.tipo === "en-stock") {
      itemsEnStock.push({ item, producto: producto as Producto & { tipo: "en-stock" } });
    } else {
      itemsPorEncargue.push({ item, producto: producto as Producto & { tipo: "por-encargue" } });
    }
  }

  const subtotal = itemsEnStock.reduce(
    (acc, { item, producto }) => acc + producto.precio * item.cantidad,
    0,
  );

  const descuento = aplicaDescuento(medio)
    ? Math.round(subtotal * DESCUENTO_EFECTIVO_TRANSFERENCIA)
    : 0;

  return {
    itemsEnStock,
    itemsPorEncargue,
    subtotal,
    descuento,
    total: subtotal - descuento,
  };
}
