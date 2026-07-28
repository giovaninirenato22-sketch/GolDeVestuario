"use client";

import { useState } from "react";
import Image from "next/image";

export function ProductGallery({ imagenes, nombre }: { imagenes: string[]; nombre: string }) {
  const [activa, setActiva] = useState(0);

  return (
    <div>
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-surface">
        <Image
          src={imagenes[activa]}
          alt={nombre}
          fill
          sizes="(min-width: 1024px) 500px, 100vw"
          className="object-contain p-10"
          priority
        />
      </div>
      {imagenes.length > 1 ? (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {imagenes.map((img, index) => (
            <button
              key={img + index}
              onClick={() => setActiva(index)}
              aria-label={`Ver imagen ${index + 1} de ${nombre}`}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-surface ${
                activa === index ? "ring-2 ring-accent" : "ring-1 ring-border"
              }`}
            >
              <Image src={img} alt="" fill sizes="80px" className="object-contain p-2" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
