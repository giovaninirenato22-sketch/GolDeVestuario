"use client";

import { useRef, useState } from "react";
import Image from "next/image";

// A partir de cuánto se movió el dedo/mouse (como fracción del ancho del
// carrusel) se considera "arrastre suficiente" para pasar de foto. Menos que
// eso y vuelve a la foto actual.
const UMBRAL_ARRASTRE = 0.15;

export function ProductGallery({ imagenes, nombre }: { imagenes: string[]; nombre: string }) {
  const [activa, setActiva] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [arrastrando, setArrastrando] = useState(false);
  const startXRef = useRef(0);
  const anchoRef = useRef(1);
  const contenedorRef = useRef<HTMLDivElement>(null);

  const haySeveras = imagenes.length > 1;

  function irA(index: number) {
    setActiva((index + imagenes.length) % imagenes.length);
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (!haySeveras) return;
    startXRef.current = e.clientX;
    anchoRef.current = contenedorRef.current?.getBoundingClientRect().width || 1;
    setArrastrando(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!arrastrando) return;
    setDragOffset(e.clientX - startXRef.current);
  }

  function finalizarArrastre() {
    if (!arrastrando) return;
    const umbralPx = anchoRef.current * UMBRAL_ARRASTRE;
    if (dragOffset <= -umbralPx) irA(activa + 1);
    else if (dragOffset >= umbralPx) irA(activa - 1);
    setDragOffset(0);
    setArrastrando(false);
  }

  return (
    <div>
      <div className="relative">
        <div
          ref={contenedorRef}
          className="relative aspect-square w-full touch-pan-y select-none overflow-hidden rounded-lg bg-surface"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finalizarArrastre}
          onPointerCancel={finalizarArrastre}
        >
          <div
            className="flex h-full"
            style={{
              width: `${imagenes.length * 100}%`,
              transform: `translateX(calc(${-activa * 100}% + ${dragOffset}px))`,
              transition: arrastrando ? "none" : "transform 0.3s ease",
            }}
          >
            {imagenes.map((img, index) => (
              <div
                key={img + index}
                className="relative h-full shrink-0"
                style={{ width: `${100 / imagenes.length}%` }}
              >
                <Image
                  src={img}
                  alt={index === 0 ? nombre : ""}
                  fill
                  sizes="(min-width: 1024px) 500px, 100vw"
                  className="object-contain"
                  draggable={false}
                  priority={index === 0}
                />
              </div>
            ))}
          </div>
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
