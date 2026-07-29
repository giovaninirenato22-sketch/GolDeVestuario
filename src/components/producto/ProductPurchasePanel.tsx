"use client";

import { useState } from "react";
import type { Categoria, Producto, Talle } from "@/types";
import { PriceDisplay } from "./PriceDisplay";
import { SizeSelector } from "./SizeSelector";
import { QuantityStepper } from "./QuantityStepper";
import { SizeGuideModal } from "./SizeGuideModal";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/carrito/CartContext";
import { useToast } from "@/components/ui/Toast";
import { construirEnlaceConsultaProducto } from "@/lib/whatsapp";

export function ProductPurchasePanel({ producto, categoria }: { producto: Producto; categoria: Categoria }) {
  const [talle, setTalle] = useState<Talle | null>(null);
  const [cantidad, setCantidad] = useState(1);
  const { agregarItem } = useCart();
  const { showToast } = useToast();

  const talleSeleccionado = producto.talles.find((t) => t.talle === talle);
  // "por-encargue" no tiene inventario real (cantidad ahí es solo 1/0 según
  // se ofrezca el talle o no), así que el tope de cantidad y el texto de
  // stock restante solo aplican a "en-stock".
  const stockDelTalle = producto.tipo === "en-stock" ? talleSeleccionado?.cantidad : undefined;
  const puedeAgregar = talle !== null && (talleSeleccionado?.cantidad ?? 0) > 0;

  // Reinicia la cantidad al cambiar de talle en vez de arrastrar un valor
  // que podría superar el stock del talle recién elegido.
  function handleCambiarTalle(nuevoTalle: Talle) {
    setTalle(nuevoTalle);
    setCantidad(1);
  }

  function handleAgregar() {
    if (!talle) return;
    agregarItem(producto.id, talle, cantidad);
    showToast(`Agregado al carrito: ${producto.nombre} (Talle ${talle})`, {
      tone: "success",
      href: "/carrito",
      hrefLabel: "Ver carrito",
    });
  }

  const hrefConsulta = construirEnlaceConsultaProducto(producto, talle ?? undefined);

  return (
    <div className="flex flex-col gap-6">
      <PriceDisplay producto={producto} size="lg" />

      {producto.tipo === "por-encargue" ? (
        <p className="text-body-small text-fg-secondary">
          El precio se coordina por WhatsApp una vez elegido el talle.
        </p>
      ) : null}

      <div>
        <p className="text-body-small mb-3 text-fg-secondary">Talle</p>
        <SizeSelector talles={producto.talles} value={talle} onChange={handleCambiarTalle} />
        {talle && stockDelTalle !== undefined ? (
          <p className="text-caption mt-2 text-fg-muted" aria-live="polite">
            {stockDelTalle > 0
              ? `Quedan ${stockDelTalle} unidad${stockDelTalle === 1 ? "" : "es"} en talle ${talle}`
              : `Sin stock en talle ${talle}`}
          </p>
        ) : null}
        <div className="mt-3">
          <SizeGuideModal categoria={categoria} />
        </div>
      </div>

      <div>
        <p className="text-body-small mb-3 text-fg-secondary">Cantidad</p>
        <QuantityStepper value={cantidad} onChange={setCantidad} max={stockDelTalle} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button onClick={handleAgregar} disabled={!puedeAgregar} className="flex-1">
          {talle ? "Agregar al carrito" : "Elegí un talle"}
        </Button>
        <a
          href={hrefConsulta}
          target="_blank"
          rel="noopener noreferrer"
          className="text-button flex flex-1 items-center justify-center gap-2 rounded-md border border-fg-secondary px-7 py-3 text-fg hover:bg-surface-alt"
        >
          Consultar por WhatsApp
        </a>
      </div>
    </div>
  );
}
