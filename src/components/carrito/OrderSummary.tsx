import type { ResumenCarrito } from "@/lib/precios";
import { formatARS } from "@/lib/precios";

export function OrderSummary({ resumen }: { resumen: ResumenCarrito }) {
  const hayEnStock = resumen.itemsEnStock.length > 0;
  const hayPorEncargue = resumen.itemsPorEncargue.length > 0;

  return (
    <div className="flex flex-col gap-3">
      {hayEnStock ? (
        <>
          <div className="text-body-small flex justify-between text-fg-secondary">
            <span>Subtotal en stock</span>
            <span>{formatARS(resumen.subtotal)}</span>
          </div>
          {resumen.descuento > 0 ? (
            <div className="text-body-small flex justify-between text-success">
              <span>Descuento 15%</span>
              <span>-{formatARS(resumen.descuento)}</span>
            </div>
          ) : null}
          <div className="text-h2 flex justify-between text-fg">
            <span>Total en stock</span>
            <span>{formatARS(resumen.total)}</span>
          </div>
        </>
      ) : null}

      {hayPorEncargue ? (
        <p className="text-caption text-fg-muted">
          Los productos por encargue no tienen precio fijo: se cotizan aparte por WhatsApp.
        </p>
      ) : null}

      {!hayEnStock && !hayPorEncargue ? (
        <p className="text-body-small text-fg-secondary">Tu carrito está vacío.</p>
      ) : null}
    </div>
  );
}
