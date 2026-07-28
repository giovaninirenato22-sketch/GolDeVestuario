"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { NAV_LINKS, SITE_NAME } from "@/data/site";
import { LOGO_URL } from "@/data/media";
import { useCart } from "@/lib/carrito/CartContext";
import { CartIcon } from "./CartIcon";

const UMBRAL_SCROLL_PX = 24;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolleado, setScrolleado] = useState(false);
  const pathname = usePathname();
  const { cantidadTotal } = useCart();

  useEffect(() => {
    function alScrollear() {
      setScrolleado(window.scrollY > UMBRAL_SCROLL_PX);
    }
    alScrollear();
    window.addEventListener("scroll", alScrollear, { passive: true });
    return () => window.removeEventListener("scroll", alScrollear);
  }, []);

  return (
    /* El wrapper sticky con h-0 es lo que permite que el header "flote"
    sobre el hero en vez de empujarlo hacia abajo: un header sticky normal
    sigue ocupando su propio alto en el flujo del documento, así que arriba
    de todo (scroll 0) no hay nada del video detrás — se ve el fondo casi
    negro de body, no el video, aunque el header sea transparente. Con el
    wrapper en 0 de alto, el header (position: static, con overflow
    visible) se "derrama" hacia abajo sin empujar al hero, quedando
    superpuesto sobre el video desde el primer pixel. */
    <div className="sticky top-0 z-40 h-0">
      {/* Sin degradé propio: usar un segundo overlay traslúcido acá, además
      del bg-bg/75 del Hero, dejaba una costura visible justo en el borde
      inferior del header (límite de capa compositada). El overlay del Hero
      ya cubre parejo toda su altura, incluida la franja del header. */}
      <header
        className={`border-b transition-colors duration-300 ${
          scrolleado || open ? "border-border bg-bg" : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-10">
          <Link href="/" className="flex min-w-0 shrink items-center gap-3" onClick={() => setOpen(false)}>
            <Image
              src={LOGO_URL}
              alt={SITE_NAME}
              width={40}
              height={40}
              className="shrink-0 rounded-full"
              priority
            />
            <span className="text-h2 text-fg truncate text-base tracking-wide sm:text-lg">
              GOL <span className="text-accent">DE VESTUARIO</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className={`text-nav transition-colors hover:text-fg ${
                  pathname === link.href ? "text-fg" : "text-fg-secondary"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <CartIcon cantidadTotal={cantidadTotal} />
          </nav>

          <div className="flex shrink-0 items-center gap-2 md:hidden">
            <CartIcon cantidadTotal={cantidadTotal} />
            <button
              aria-label="Abrir menú"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="text-fg relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border-strong"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={open ? "close" : "open"}
                  initial={{ opacity: 0, rotate: -45 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 45 }}
                  transition={{ duration: 0.15 }}
                >
                  {open ? "✕" : "☰"}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {open ? (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-1 overflow-hidden border-t border-border px-6 py-4 md:hidden"
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={pathname === link.href ? "page" : undefined}
                  className={`text-nav rounded-md px-2 py-3 ${
                    pathname === link.href ? "text-fg" : "text-fg-secondary"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </motion.nav>
          ) : null}
        </AnimatePresence>
      </header>
    </div>
  );
}
