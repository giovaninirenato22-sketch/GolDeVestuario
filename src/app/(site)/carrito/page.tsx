"use client";

import { useEffect, useMemo, useRef } from "react";
import { AnimatePresence } from "motion/react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonLink } from "@/components/ui/Button";
import { CartItemRow } from "@/components/carrito/CartItemRow";
import { PaymentMethodSelector } from "@/components/carrito/PaymentMethodSelector";
import { OrderSummary } from "@/components/carrito/OrderSummary";
import { useCart } from "@/lib/carrito/CartContext";
import { useToast } from "@/components/ui/Toast";
import { calcularResumen } from "@/lib/precios";
import { construirEnlaceWhatsApp, construirMensajePedido } from "@/lib/whatsapp";

export default function CarritoPage() {
  const { items, medioDePago, setMedioDePago, hidratado, productos, productosCargados } = useCart();
  const { showToast } = useToast();
  const pedidoEnCurso = useRef(false);

  const resumen = useMemo(
    () => calcularResumen(items, productos, medioDePago),
    [items, productos, medioDePago],
  );

  const hrefWhatsApp = useMemo(() => {
    const mensaje = construirMensajePedido(items, productos, medioDePago);
    return construirEnlaceWhatsApp(mensaje);
  }, [items, productos, medioDePago]);

  // Como el pedido se cierra en una pestaña aparte de WhatsApp, no hay forma
  // de saber con certeza si el mensaje se envió. Al volver a esta pestaña
  // después de haber tocado "Finalizar pedido" mostramos una confirmación
  // amigable en vez de dejar al usuario sin ninguna señal de que "quedó todo bien".
  useEffect(() => {
    function alVolver() {
      if (document.visibilityState === "visible" && pedidoEnCurso.current) {
        pedidoEnCurso.current = false;
        showToast("¡Gracias! Si ya enviaste tu pedido por WhatsApp, te contestamos a la brevedad.", {
          tone: "success",
        });
      }
    }
    document.addEventListener("visibilitychange", alVolver);
    return () => document.removeEventListener("visibilitychange", alVolver);
  }, [showToast]);

  if (!hidratado || !productosCargados) return null;

  if (items.length === 0) {
    return (
      <Section border={false}>
        <Container>
          <EmptyState
            title="Tu carrito está vacío"
            description="Agregá camisetas desde el catálogo para armar tu pedido."
            action={<ButtonLink href="/productos">Ver productos</ButtonLink>}
          />
        </Container>
      </Section>
    );
  }

  return (
    <Section border={false}>
      <Container>
        <SectionHeader eyebrow="Tu pedido" title="Carrito" />

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {resumen.itemsEnStock.length > 0 ? (
              <div className="mb-8">
                <p className="text-eyebrow mb-2 text-accent">En Stock</p>
                <AnimatePresence initial={false}>
                  {resumen.itemsEnStock.map(({ item, producto }) => (
                    <CartItemRow key={`${item.productoId}-${item.talle}`} item={item} producto={producto} />
                  ))}
                </AnimatePresence>
              </div>
            ) : null}

            {resumen.itemsPorEncargue.length > 0 ? (
              <div>
                <p className="text-eyebrow mb-2 text-accent">Por Encargue (precio a coordinar)</p>
                <AnimatePresence initial={false}>
                  {resumen.itemsPorEncargue.map(({ item, producto }) => (
                    <CartItemRow key={`${item.productoId}-${item.talle}`} item={item} producto={producto} />
                  ))}
                </AnimatePresence>
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-6 rounded-lg bg-surface p-6 lg:h-fit">
            <div>
              <p className="text-body-small mb-3 text-fg-secondary">Medio de pago</p>
              <PaymentMethodSelector value={medioDePago} onChange={setMedioDePago} />
            </div>

            <OrderSummary resumen={resumen} />

            <a
              href={hrefWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                pedidoEnCurso.current = true;
              }}
              className="text-button flex items-center justify-center rounded-md bg-accent px-7 py-3 text-on-accent hover:bg-accent-light"
            >
              Finalizar pedido por WhatsApp
            </a>
          </div>
        </div>
      </Container>
    </Section>
  );
}
