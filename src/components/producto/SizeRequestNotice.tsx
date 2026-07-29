"use client";

import { useState } from "react";
import type { ProductoEnStock, Talle } from "@/types";
import { useCart } from "@/lib/carrito/CartContext";
import { useToast } from "@/components/ui/Toast";

/**
 * Solo para productos En Stock con algún talle en cantidad 0. Deja pedir
 * ese talle puntual por encargue sin salir de la ficha del producto — se
 * agrega al carrito marcado como porEncargue (ver ItemCarrito), así que en
 * el carrito y en el mensaje de WhatsApp aparece como "a coordinar" en vez
 * de con el precio fijo del producto.
 */
export function SizeRequestNotice({ producto }: { producto: ProductoEnStock }) {
  const [abierto, setAbierto] = useState(false);
  const { agregarItem } = useCart();
  const { showToast } = useToast();

  const tallesSinStock = producto.talles.filter((t) => t.cantidad === 0);
  if (tallesSinStock.length === 0) return null;

  function handleSeleccionar(talle: Talle) {
    agregarItem(producto.id, talle, 1, true);
    showToast(`Agregado por encargue: ${producto.nombre} (Talle ${talle})`, {
      tone: "success",
      href: "/carrito",
      hrefLabel: "Ver carrito",
    });
    setAbierto(false);
  }

  return (
    <div className="mt-4 rounded-md border border-dashed border-border-strong p-4">
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        className="text-body-small text-left text-fg-secondary underline decoration-dotted underline-offset-2 hover:text-fg"
      >
        ¿No encontrás el talle que estás buscando? Seleccionalo acá
      </button>
      {abierto ? (
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Talles por encargue">
          {tallesSinStock.map(({ talle }) => (
            <button
              key={talle}
              type="button"
              onClick={() => handleSeleccionar(talle)}
              className="text-button rounded-md border border-border-strong px-4 py-2 text-fg transition-all duration-150 hover:border-accent active:scale-95"
            >
              {talle}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
