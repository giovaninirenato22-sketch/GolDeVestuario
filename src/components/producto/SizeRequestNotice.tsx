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
  const [talleElegido, setTalleElegido] = useState<Talle | null>(null);
  const { agregarItem } = useCart();
  const { showToast } = useToast();

  const tallesSinStock = producto.talles.filter((t) => t.cantidad === 0);
  if (tallesSinStock.length === 0) return null;

  function handleAgregar() {
    if (!talleElegido) return;
    agregarItem(producto.id, talleElegido, 1, true);
    showToast(`Agregado por encargue: ${producto.nombre} (Talle ${talleElegido})`, {
      tone: "success",
      href: "/carrito",
      hrefLabel: "Ver carrito",
    });
    setTalleElegido(null);
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
        ¿No encontrás el talle que estás buscando? Seleccionalo acá y pedilo por encargue
      </button>
      {abierto ? (
        <>
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Talles por encargue">
            {tallesSinStock.map(({ talle }) => {
              const selected = talleElegido === talle;
              return (
                <button
                  key={talle}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setTalleElegido(talle)}
                  className={`text-button rounded-md border px-4 py-2 transition-all duration-150 active:scale-95 ${
                    selected
                      ? "border-accent bg-accent text-on-accent"
                      : "border-border-strong text-fg hover:border-accent"
                  }`}
                >
                  {talle}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={handleAgregar}
            disabled={!talleElegido}
            className="text-button mt-3 rounded-md bg-accent px-5 py-2 text-on-accent transition-opacity duration-150 hover:bg-accent-light disabled:cursor-not-allowed disabled:opacity-40"
          >
            {talleElegido ? `Agregar talle ${talleElegido} por encargue` : "Elegí un talle"}
          </button>
        </>
      ) : null}
    </div>
  );
}
