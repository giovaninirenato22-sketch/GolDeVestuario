import type { MedioDePago } from "@/types";

const OPCIONES: Array<{ id: MedioDePago; label: string; nota?: string }> = [
  { id: "efectivo", label: "Efectivo", nota: "15% OFF" },
  { id: "transferencia", label: "Transferencia", nota: "15% OFF" },
  { id: "otro", label: "Otro" },
];

export function PaymentMethodSelector({
  value,
  onChange,
}: {
  value: MedioDePago;
  onChange: (medio: MedioDePago) => void;
}) {
  return (
    <div role="radiogroup" aria-label="Medio de pago" className="flex flex-col gap-2 sm:flex-row">
      {OPCIONES.map((op) => {
        const selected = value === op.id;
        return (
          <button
            key={op.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(op.id)}
            className={`text-body-small flex flex-1 flex-col items-center justify-center gap-1 rounded-md border px-4 py-3 text-center transition-all duration-150 active:scale-[0.98] ${
              selected ? "border-accent bg-surface" : "border-border-strong text-fg-secondary hover:border-accent"
            }`}
          >
            <span className={selected ? "text-fg" : ""}>{op.label}</span>
            <span className={`text-caption ${op.nota ? "text-success" : "invisible"}`}>{op.nota ?? "·"}</span>
          </button>
        );
      })}
    </div>
  );
}
