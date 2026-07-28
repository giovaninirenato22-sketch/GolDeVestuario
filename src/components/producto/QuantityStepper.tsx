export function QuantityStepper({
  value,
  onChange,
  min = 1,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
}) {
  return (
    <div className="inline-flex items-center rounded-md border border-border-strong" role="group" aria-label="Cantidad">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Restar"
        className="text-button flex h-10 w-10 items-center justify-center text-fg transition-transform duration-150 active:scale-90 disabled:text-fg-muted disabled:active:scale-100"
      >
        −
      </button>
      <span className="text-body-small w-8 text-center text-fg" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        aria-label="Sumar"
        className="text-button flex h-10 w-10 items-center justify-center text-fg transition-transform duration-150 active:scale-90"
      >
        +
      </button>
    </div>
  );
}
