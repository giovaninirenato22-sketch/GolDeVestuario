import { ButtonLink } from "@/components/ui/Button";
import { RevealOnMount } from "@/components/ui/Reveal";
import { HeroVideo } from "./HeroVideo";

export function Hero() {
  return (
    // -mt-[73px] cancela el pt-[73px] de <main> (ver SiteLayout) para que el
    // video arranque en el borde superior real de la pantalla, detrás del
    // header transparente, en vez de empezar recién debajo de la barra.
    <div className="relative -mt-[73px] flex min-h-[calc(60svh_+_73px)] items-center overflow-hidden bg-bg sm:min-h-[713px] md:min-h-[793px]">
      <HeroVideo />
      <div className="absolute inset-0 bg-bg/75" />

      <div className="relative mx-auto w-full max-w-6xl px-6 py-10 text-center sm:py-14 md:py-20">
        <RevealOnMount>
          <p className="text-eyebrow text-accent">Pasión por el fútbol</p>
        </RevealOnMount>
        <RevealOnMount delay={0.08}>
          {/* md:/lg: pisan el font-size de .text-display (que tiene 44px de
          techo) solo desde tablet/desktop para arriba — en mobile el clamp()
          original queda intacto. */}
          <h1 className="text-display text-fg mt-4 md:text-[52px] lg:text-[60px]">
            EL VESTUARIO
            <br />
            <span className="text-accent">DONDE NACE EL GOL</span>
          </h1>
        </RevealOnMount>
        <RevealOnMount delay={0.16}>
          <p className="text-body text-fg-secondary mx-auto mt-6 max-w-md">
            Camisetas en stock y por encargue para quienes viven el fútbol desde adentro.
          </p>
        </RevealOnMount>
        <RevealOnMount delay={0.24}>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <ButtonLink href="/productos" className="w-full sm:w-auto">
              Ver productos
            </ButtonLink>
            <ButtonLink href="/quienes-somos" variant="secondary" className="w-full sm:w-auto">
              Conocer más
            </ButtonLink>
          </div>
        </RevealOnMount>
      </div>
    </div>
  );
}
