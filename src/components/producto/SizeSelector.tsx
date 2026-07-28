import type { Talle, TalleDisponibilidad } from "@/types";

export function SizeSelector({
  talles,
  value,
  onChange,
}: {
  talles: TalleDisponibilidad[];
  value: Talle | null;
  onChange: (talle: Talle) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Elegir talle">
      {talles.map(({ talle, disponible }) => {
        const selected = value === talle;
        return (
          <button
            key={talle}
            type="button"
            disabled={!disponible}
            aria-pressed={selected}
            onClick={() => onChange(talle)}
            className={[
              "text-button min-w-12 rounded-md border px-4 py-2 transition-all duration-150",
              !disponible
                ? "cursor-not-allowed border-border text-fg-muted line-through"
                : selected
                  ? "border-accent bg-accent text-on-accent active:scale-95"
                  : "border-border-strong text-fg hover:border-accent active:scale-95",
            ].join(" ")}
          >
            {talle}
          </button>
        );
      })}
    </div>
  );
}
