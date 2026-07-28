"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

const variants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/**
 * Fade + slide-up al entrar en viewport. `once: true` evita que la
 * animación se repita al hacer scroll hacia arriba y abajo.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={variants}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Igual que Reveal, pero anima en el montaje (para contenido above-the-fold como el Hero). */
export function RevealOnMount({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Contenedor simple para agrupar StaggerItem — ya no orquesta la animación
 * (ver nota en StaggerItem), es solo el wrapper visual (grid/flex).
 */
export function StaggerGroup({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

/**
 * Cada item anima su propio fade + slide-up al montarse (`initial`/`animate`
 * propios, no delegados a un padre). En listas que se refiltran en vivo
 * (ej. ProductGrid dentro de ProductBrowser) la orquestación por variants
 * del padre no reanima los hijos que se montan después del primer disparo
 * — quedaban con opacity:0 para siempre al cambiar de filtro. Con
 * animación propia, cada tarjeta nueva siempre anima, sin depender de
 * cuándo ni cuántas veces se montó el contenedor. `index` simula el
 * escalonado con un delay progresivo (capado para que listas largas no
 * tarden una eternidad en aparecer completas).
 */
export function StaggerItem({
  children,
  className,
  index = 0,
}: {
  children: ReactNode;
  className?: string;
  index?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{ duration: 0.35, delay: Math.min(index, 10) * 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
