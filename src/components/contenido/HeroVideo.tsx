"use client";

import { useEffect, useState } from "react";
import { HERO_VIDEO_DESKTOP_URL, HERO_VIDEO_MOBILE_URL } from "@/data/media";

const BREAKPOINT_QUERY = "(min-width: 640px)";

/**
 * Un solo <video> montado por vez: si se renderizaran los dos (mobile +
 * desktop) y se ocultara uno por CSS, el navegador igual puede empezar a
 * descargarlo (son ~26-44MB cada uno). Se decide el breakpoint en cliente y
 * recién ahí se monta el <source> correcto.
 */
export function HeroVideo() {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(BREAKPOINT_QUERY);
    const actualizar = () => setSrc(mq.matches ? HERO_VIDEO_DESKTOP_URL : HERO_VIDEO_MOBILE_URL);
    actualizar();
    mq.addEventListener("change", actualizar);
    return () => mq.removeEventListener("change", actualizar);
  }, []);

  if (!src) return null;

  return (
    <video
      key={src}
      autoPlay
      muted
      loop
      playsInline
      // Respaldo manual del loop nativo: algunos navegadores (sobre todo
      // iOS/Safari en ciertas versiones) no siempre repiten un <video>
      // inline de forma confiable solo con el atributo `loop`.
      onEnded={(e) => {
        e.currentTarget.currentTime = 0;
        void e.currentTarget.play();
      }}
      // <video> es un elemento reemplazado: position:absolute con solo
      // inset (sin alto/ancho explícitos) NO lo estira al contenedor, cae
      // al tamaño intrínseco del video. Por eso el alto/ancho van explícitos
      // (100% + 8px), sobredimensionados y centrados con -top/-left, para
      // que sobre en las cuatro puntas y no se cuele una línea de 1px del
      // fondo del contenedor por redondeo de subpíxel. scale-[1.2]
      // origin-top recorta además el borde inferior del video (donde puede
      // haber un logo/marca de agua incrustado en el archivo fuente) sin
      // perder el encuadre superior.
      className="absolute -top-1 -left-1 h-[calc(100%_+_8px)] w-[calc(100%_+_8px)] origin-top scale-[1.2] object-cover"
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
