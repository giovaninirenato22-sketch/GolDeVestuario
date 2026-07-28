import Link from "next/link";

export function CartIcon({ cantidadTotal }: { cantidadTotal: number }) {
  return (
    <Link
      href="/carrito"
      aria-label={
        cantidadTotal > 0
          ? `Carrito, ${cantidadTotal} ${cantidadTotal === 1 ? "producto" : "productos"}`
          : "Carrito"
      }
      className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border-strong text-fg transition-colors hover:bg-surface-alt"
    >
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.5 3h2l2.7 12.4a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L21 8H6" />
      </svg>
      {cantidadTotal > 0 ? (
        <span
          aria-hidden="true"
          className="text-caption absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 font-medium leading-none text-on-accent"
        >
          {cantidadTotal}
        </span>
      ) : null}
    </Link>
  );
}
