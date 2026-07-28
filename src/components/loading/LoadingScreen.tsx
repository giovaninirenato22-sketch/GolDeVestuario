"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, type Variants } from "motion/react";
import { LOGO_URL, LOADING_JERSEY_URLS } from "@/data/media";

const TOTAL_JERSEYS = 17;
const JERSEYS = LOADING_JERSEY_URLS;

// Tamaño de exportación real de /public/loading/jersey-*.png (con margen de
// nitidez para pantallas retina). El tile nunca se dibuja más grande que
// esto: agrandarlo por CSS/transform sería lo que pierde calidad.
const DISPLAY_SIZE = 260;
// Paso de la grilla: menor al tamaño real de la imagen para que los tiles
// vecinos se solapen y no quede fondo oscuro visible entre ellos, sin
// necesidad de escalar ninguna camiseta más allá de su tamaño real.
const CELDA_PX = 150;

const FILL_DURATION = 1.2;
const ENTER_ITEM_DURATION = 0.4;
const HOLD_COVERED = 0.3;
const REVERSE_DURATION = 1.0;
const EXIT_ITEM_DURATION = 0.3;
// El retroceso de las camisetas y el desvanecimiento del fondo negro con el
// logo corren a la vez (misma duración): así, al terminar, la pantalla
// principal aparece directo, sin un instante intermedio de fondo negro solo
// con el logo.
const EXIT_DURATION = REVERSE_DURATION + EXIT_ITEM_DURATION;

type Fase = "entrando" | "reversa";

interface Splat {
  key: string;
  jersey: string;
  left: number;
  top: number;
  size: number;
  rotate: number;
  enterDelay: number;
  exitDelay: number;
}

function mezclar<T>(items: T[]): T[] {
  const copia = [...items];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

/**
 * Con pocas camisetas (17) y pantallas grandes hacen falta repeticiones para
 * cubrir todo el viewport. Para que las repetidas no queden juntas, la
 * imagen de cada celda (f, c) se elige con `(f*a + c*b) % 17` en vez de al
 * azar: como 17 es primo, cualquier a/b entre 1 y 16 generan un recorrido
 * tipo "cuadrado latino" que no repite imagen dentro de una misma fila o
 * columna mientras la grilla tenga menos de 17 celdas de ese lado (el caso
 * normal en cualquier pantalla real).
 */
function construirSplats(ancho: number, alto: number): Splat[] {
  const columnas = Math.max(1, Math.ceil(ancho / CELDA_PX));
  const filas = Math.max(1, Math.ceil(alto / CELDA_PX));
  const anchoCelda = ancho / columnas;
  const altoCelda = alto / filas;

  const imagenes = mezclar(JERSEYS);
  const a = 1 + Math.floor(Math.random() * (TOTAL_JERSEYS - 1));
  const b = 1 + Math.floor(Math.random() * (TOTAL_JERSEYS - 1));

  const celdas: Array<{ f: number; c: number }> = [];
  for (let f = 0; f < filas; f++) {
    for (let c = 0; c < columnas; c++) {
      celdas.push({ f, c });
    }
  }
  const orden = mezclar(celdas);
  const total = orden.length;

  return orden.map((celda, idx) => {
    const jitterX = (Math.random() - 0.5) * anchoCelda * 0.4;
    const jitterY = (Math.random() - 0.5) * altoCelda * 0.4;

    return {
      key: `splat-${celda.f}-${celda.c}`,
      jersey: imagenes[(celda.f * a + celda.c * b) % TOTAL_JERSEYS],
      left: (celda.c + 0.5) * anchoCelda + jitterX,
      top: (celda.f + 0.5) * altoCelda + jitterY,
      size: DISPLAY_SIZE,
      rotate: (Math.random() - 0.5) * 36,
      enterDelay: (idx / total) * FILL_DURATION,
      exitDelay: ((total - 1 - idx) / total) * REVERSE_DURATION,
    };
  });
}

const splatVariants: Variants = {
  hidden: (rotate: number) => ({ opacity: 0, scale: 0.35, y: -45, rotate: rotate - 30 }),
  visible: (rotate: number) => ({ opacity: 1, scale: 1, y: 0, rotate }),
};

export function LoadingScreen() {
  const [montado, setMontado] = useState(true);
  const [fase, setFase] = useState<Fase>("entrando");
  const [fondoSaliendo, setFondoSaliendo] = useState(false);
  const [splats, setSplats] = useState<Splat[] | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const timeouts: ReturnType<typeof setTimeout>[] = [];

    // El viewport no existe durante el render en servidor: la grilla de
    // salpicado solo puede armarse acá, después del montaje en cliente.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSplats(construirSplats(window.innerWidth, window.innerHeight));

    timeouts.push(
      setTimeout(
        () => {
          setFase("reversa");
          setFondoSaliendo(true);
        },
        (FILL_DURATION + ENTER_ITEM_DURATION + HOLD_COVERED) * 1000,
      ),
    );

    return () => timeouts.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (!fondoSaliendo) return;
    const timeout = setTimeout(() => {
      setMontado(false);
      document.body.style.overflow = "";
    }, EXIT_DURATION * 1000);
    return () => clearTimeout(timeout);
  }, [fondoSaliendo]);

  if (!montado) return null;

  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 1 }}
      animate={{ opacity: fondoSaliendo ? 0 : 1 }}
      transition={{ duration: EXIT_DURATION, ease: [0.4, 0, 0.2, 1] }}
      style={{ pointerEvents: fondoSaliendo ? "none" : "auto" }}
      // Negro puro (no --color-bg, que es #0a0a0a): el fondo de /brand/logo.png
      // es #000000 real, y con --color-bg se notaba el borde cuadrado del logo.
      className="fixed inset-0 z-[100] overflow-hidden bg-[#000000]"
    >
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="w-44 px-6 sm:w-56 md:w-64"
        >
          <Image src={LOGO_URL} alt="Gol de Vestuario" width={1254} height={1254} priority className="h-auto w-full" />
        </motion.div>
      </div>

      {splats
        ? splats.map((splat) => (
            <div
              key={splat.key}
              className="absolute"
              style={{
                left: splat.left,
                top: splat.top,
                width: splat.size,
                height: splat.size,
                transform: "translate(-50%, -50%)",
              }}
            >
              <motion.div
                custom={splat.rotate}
                initial="hidden"
                animate={fase === "reversa" ? "hidden" : "visible"}
                variants={splatVariants}
                transition={{
                  duration: fase === "reversa" ? EXIT_ITEM_DURATION : ENTER_ITEM_DURATION,
                  delay: fase === "reversa" ? splat.exitDelay : splat.enterDelay,
                  ease: fase === "reversa" ? [0.55, 0, 1, 0.45] : [0.34, 1.56, 0.64, 1],
                }}
                className="flex h-full w-full items-center justify-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- mismas 17 URLs repetidas muchas veces; next/image duplicaría trabajo de optimización sin beneficio */}
                <img src={splat.jersey} alt="" className="h-full w-full object-contain" />
              </motion.div>
            </div>
          ))
        : null}
    </motion.div>
  );
}
