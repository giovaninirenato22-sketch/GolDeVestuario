"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import type { ItemCarrito, Producto } from "@/types";
import { QuantityStepper } from "@/components/producto/QuantityStepper";
import { PriceDisplay } from "@/components/producto/PriceDisplay";
import { CategoryBadge } from "@/components/producto/CategoryBadge";
import { formatARS } from "@/lib/precios";
import { useCart } from "@/lib/carrito/CartContext";
import { useToast } from "@/components/ui/Toast";

export function CartItemRow({ item, producto }: { item: ItemCarrito; producto: Producto }) {
  const { actualizarCantidad, quitarItem, categorias } = useCart();
  const { showToast } = useToast();
  const nombreCategoria = categorias.find((c) => c.id === producto.categoria)?.nombre ?? producto.categoria;

  function handleQuitar() {
    quitarItem(producto.id, item.talle);
    showToast(`Quitaste ${producto.nombre} (Talle ${item.talle}) del carrito`, { tone: "error" });
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -24, height: 0, marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="flex gap-3 overflow-hidden border-b border-border py-6 last:border-b-0 sm:gap-4">
      <Link
        href={`/productos/${producto.slug}`}
        className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-surface sm:h-24 sm:w-24"
      >
        <Image src={producto.imagenes[0]} alt={producto.nombre} fill sizes="96px" className="object-contain p-2 sm:p-3" />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CategoryBadge nombre={nombreCategoria} />
            <Link href={`/productos/${producto.slug}`} className="text-body block text-fg hover:underline mt-1">
              {producto.nombre}
            </Link>
            <p className="text-caption text-fg-muted">Talle {item.talle}</p>
          </div>
          <button
            onClick={handleQuitar}
            className="shrink-0 rounded-md p-1.5 text-error transition-all duration-150 hover:bg-error/10 active:scale-90"
            aria-label={`Quitar ${producto.nombre} talle ${item.talle} del carrito`}
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 6h18" />
              <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
              <path d="M19 6l-.9 13.4a2 2 0 0 1-2 1.6H7.9a2 2 0 0 1-2-1.6L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
            </svg>
          </button>
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
          <QuantityStepper
            value={item.cantidad}
            onChange={(cantidad) => actualizarCantidad(producto.id, item.talle, cantidad)}
          />
          {producto.tipo === "en-stock" ? (
            <p className="text-body-small text-fg">{formatARS(producto.precio * item.cantidad)}</p>
          ) : (
            <PriceDisplay producto={producto} />
          )}
        </div>
      </div>
    </motion.div>
  );
}
