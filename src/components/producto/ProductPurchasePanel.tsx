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
  const puedeAgregar = talle !== null && talleSeleccionado?.disponible;

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
        <SizeSelector talles={producto.talles} value={talle} onChange={setTalle} />
        <div className="mt-3">
          <SizeGuideModal categoria={categoria} />
        </div>
      </div>

      <div>
        <p className="text-body-small mb-3 text-fg-secondary">Cantidad</p>
        <QuantityStepper value={cantidad} onChange={setCantidad} />
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
