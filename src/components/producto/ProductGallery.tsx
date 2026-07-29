"use client";

import { useRef, useState } from "react";
import Image from "next/image";

// A partir de cuántos px se movió el dedo se considera un swipe (no un
// toque accidental). Menos que eso no hace nada.
const UMBRAL_SWIPE_PX = 40;

/**
 * Antes esto montaba las N fotos en una tira ancha y las mostraba corriendo
 * un transform (para el efecto "el dedo arrastra la foto"). Eso rompía en
 * dispositivos reales de formas que no pude reproducir acá (fotos que no
 * cargaban, parpadeos) — pointer capture + una tira siempre más ancha que
 * la pantalla es una combinación frágil entre navegadores. Esta versión es
 * la más simple posible: una sola imagen montada a la vez (se cambia el
 * src al tocar flecha/miniatura o al hacer swipe), sin transform ni
 * pointer capture. Se pierde el efecto de "seguir el dedo" en tiempo real,
 * pero es mucho más difícil que se rompa.
 */
export function ProductGallery({ imagenes, nombre }: { imagenes: string[]; nombre: string }) {
  const [activa, setActiva] = useState(0);
  const touchStartXRef = useRef<number | null>(null);

  const haySeveras = imagenes.length > 1;

  function irA(index: number) {
    setActiva((index + imagenes.length) % imagenes.length);
  }

  function handleTouchStart(e: React.TouchEvent<HTMLDivElement>) {
    touchStartXRef.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent<HTMLDivElement>) {
    if (touchStartXRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    touchStartXRef.current = null;
    if (deltaX <= -UMBRAL_SWIPE_PX) irA(activa + 1);
    else if (deltaX >= UMBRAL_SWIPE_PX) irA(activa - 1);
  }

  return (
    <div>
      <div className="relative">
        <div
          className="relative aspect-square w-full touch-pan-y overflow-hidden rounded-lg bg-surface"
          onTouchStart={haySeveras ? handleTouchStart : undefined}
          onTouchEnd={haySeveras ? handleTouchEnd : undefined}
        >
          <Image
            key={imagenes[activa]}
            src={imagenes[activa]}
            alt={nombre}
            fill
            sizes="(min-width: 1024px) 500px, 100vw"
            className="object-contain"
            draggable={false}
            priority
          />
        </div>

        {haySeveras ? (
          <>
            <button
              type="button"
              onClick={() => irA(activa - 1)}
              aria-label={`Ver imagen anterior de ${nombre}`}
              className="text-body absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-bg/80 text-fg transition-colors hover:bg-bg"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => irA(activa + 1)}
              aria-label={`Ver siguiente imagen de ${nombre}`}
              className="text-body absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-bg/80 text-fg transition-colors hover:bg-bg"
            >
              ›
            </button>
          </>
        ) : null}
      </div>

      {haySeveras ? (
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
              <Image src={img} alt="" fill sizes="80px" className="object-contain" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
