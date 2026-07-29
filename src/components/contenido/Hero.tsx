import { ButtonLink } from "@/components/ui/Button";
import { RevealOnMount } from "@/components/ui/Reveal";
import { HeroVideo } from "./HeroVideo";

export function Hero() {
  return (
    // -mt-[73px] cancela el pt-[73px] de <main> (ver SiteLayout) para que el
    // video arranque en el borde superior real de la pantalla, detrás del
    // header transparente, en vez de empezar recién debajo de la barra.
    <div className="relative -mt-[73px] flex min-h-[calc(75svh_+_73px)] items-center overflow-hidden bg-bg sm:min-h-[713px] md:min-h-[793px]">
      <HeroVideo />
      <div className="absolute inset-0 bg-bg/75" />

      {/* En mobile, pt grande / pb chico reparte el espacio libre del hero
      hacia arriba en vez de hacia abajo (el bloque sigue centrado por el
      flex del contenedor, pero con menos padding abajo el texto arranca
      más cerca del borde inferior). Desde sm/md el padding vuelve a ser
      simétrico: en desktop el bloque de texto tiene que quedar centrado
      en la pantalla, no corrido hacia arriba. */}
      <div className="relative mx-auto w-full max-w-6xl px-6 pt-24 pb-10 text-center sm:py-14 md:py-20">
        <RevealOnMount>
          <p className="text-eyebrow text-accent">Pasión por el fútbol</p>
        </RevealOnMount>
        <RevealOnMount delay={0.08}>
          {/* md:/lg: pisan el font-size de .text-display (que tiene 44px de
          techo) solo desde tablet/desktop para arriba — en mobile el clamp()
          original queda intacto. */}
          <h1 className="text-display text-fg mt-4 md:text-[58px] lg:text-[68px]">
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
          {/* translate-y en vez de más margin: un margin más grande agranda
          el bloque completo y el centrado del hero le "come" la mitad del
          efecto (además de correr el texto de arriba, que no se quería
          tocar). translate es puramente visual — no participa del cálculo
          de layout/centrado del padre, así que solo mueve los botones. */}
          <div className="mt-8 flex translate-y-6 flex-col items-center justify-center gap-3 sm:translate-y-0 sm:flex-row sm:gap-4">
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
