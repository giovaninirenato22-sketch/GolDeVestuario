import type { MedioDePago, Producto } from "@/types";
import { WHATSAPP_NUMBER } from "@/data/site";
import { formatARS, calcularResumen, type ResumenCarrito } from "./precios";
import type { ItemCarrito } from "@/types";

const ETIQUETA_MEDIO: Record<MedioDePago, string> = {
  efectivo: "Efectivo",
  transferencia: "Transferencia",
  otro: "Otro medio de pago",
};

// R-13: wa.me empieza a fallar en algunos navegadores por encima de ~2000
// caracteres. Si el pedido es muy largo, se resume en vez de cortarlo a la mitad.
const LIMITE_CARACTERES = 1800;

function construirMensajeCompleto(resumen: ResumenCarrito, medio: MedioDePago): string {
  const lineas: string[] = [`Hola ${"Gol de Vestuario"}! Quiero hacer este pedido:`, ""];

  if (resumen.itemsEnStock.length > 0) {
    lineas.push("EN STOCK");
    for (const { item, producto } of resumen.itemsEnStock) {
      lineas.push(
        `• ${producto.nombre} (${producto.categoria}) — Talle ${item.talle} × ${item.cantidad} — ${formatARS(
          producto.precio * item.cantidad,
        )}`,
      );
    }
    lineas.push("");
  }

  if (resumen.itemsPorEncargue.length > 0) {
    lineas.push("POR ENCARGUE (precio a coordinar)");
    for (const { item, producto } of resumen.itemsPorEncargue) {
      lineas.push(`• ${producto.nombre} (${producto.categoria}) — Talle ${item.talle} × ${item.cantidad}`);
    }
    lineas.push("");
  }

  lineas.push(`Medio de pago: ${ETIQUETA_MEDIO[medio]}`);
  if (resumen.itemsEnStock.length > 0) {
    lineas.push(`Subtotal en stock: ${formatARS(resumen.subtotal)}`);
    if (resumen.descuento > 0) {
      lineas.push(`Descuento 15%: -${formatARS(resumen.descuento)}`);
    }
    lineas.push(`Total en stock: ${formatARS(resumen.total)}`);
  }
  if (resumen.itemsPorEncargue.length > 0) {
    lineas.push("(Los productos por encargue se cotizan aparte)");
  }

  return lineas.join("\n");
}

function construirMensajeResumido(resumen: ResumenCarrito, medio: MedioDePago): string {
  const lineas: string[] = [`Hola Gol de Vestuario! Quiero hacer este pedido (resumen, ${
    resumen.itemsEnStock.length + resumen.itemsPorEncargue.length
  } productos):`, ""];

  for (const { item, producto } of resumen.itemsEnStock) {
    lineas.push(`• ${producto.nombre} — T.${item.talle} ×${item.cantidad}`);
  }
  for (const { item, producto } of resumen.itemsPorEncargue) {
    lineas.push(`• ${producto.nombre} — T.${item.talle} ×${item.cantidad} (a coordinar)`);
  }

  lineas.push("");
  lineas.push(`Medio de pago: ${ETIQUETA_MEDIO[medio]}`);
  if (resumen.itemsEnStock.length > 0) {
    lineas.push(`Total en stock (con descuento si corresponde): ${formatARS(resumen.total)}`);
  }
  lineas.push("Te paso el detalle completo por acá si hace falta.");

  return lineas.join("\n");
}

export function construirMensajePedido(
  items: ItemCarrito[],
  productos: Producto[],
  medio: MedioDePago,
): string {
  const resumen = calcularResumen(items, productos, medio);
  const completo = construirMensajeCompleto(resumen, medio);
  if (completo.length <= LIMITE_CARACTERES) return completo;
  return construirMensajeResumido(resumen, medio);
}

export function construirEnlaceWhatsApp(mensaje: string, numero: string = WHATSAPP_NUMBER): string {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}

export function construirEnlaceConsultaProducto(producto: Producto, talle?: string): string {
  const partes = [
    `Hola! Quiero consultar por esta camiseta: ${producto.nombre}`,
    talle ? `Talle: ${talle}` : undefined,
    producto.tipo === "por-encargue" ? "Es por encargue, ¿me pasás precio y tiempos?" : "¿Está disponible?",
  ].filter(Boolean);
  return construirEnlaceWhatsApp(partes.join("\n"));
}

export function construirEnlaceConsultaGeneral(mensaje: string): string {
  return construirEnlaceWhatsApp(mensaje);
}
