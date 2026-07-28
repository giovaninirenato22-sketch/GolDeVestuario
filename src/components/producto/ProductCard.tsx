import Image from "next/image";
import Link from "next/link";
import type { Producto } from "@/types";
import { PriceDisplay } from "./PriceDisplay";
import { CategoryBadge } from "./CategoryBadge";
import { StockBadge } from "./StockBadge";

export function ProductCard({ producto, nombreCategoria }: { producto: Producto; nombreCategoria: string }) {
  return (
    <Link
      href={`/productos/${producto.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg bg-surface transition-all duration-200 ease-out hover:-translate-y-1 hover:bg-surface-alt active:scale-[0.98] active:duration-75"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-bg">
        <Image
          src={producto.imagenes[0]}
          alt={producto.nombre}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-contain p-4 transition-transform group-hover:scale-105 sm:p-6"
        />
        <div className="absolute left-2 top-2 sm:left-3 sm:top-3">
          <StockBadge producto={producto} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-5">
        <CategoryBadge nombre={nombreCategoria} />
        <h3 className="text-body text-fg leading-snug">{producto.nombre}</h3>
        {producto.club ? <p className="text-caption text-fg-muted">{producto.club}</p> : null}
        <div className="mt-auto pt-2">
          <PriceDisplay producto={producto} />
        </div>
      </div>
    </Link>
  );
}
