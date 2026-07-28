import Image from "next/image";
import { construirEnlaceWhatsApp } from "@/lib/whatsapp";
import { Reveal } from "@/components/ui/Reveal";
import { BANNER_MOBILE_URL, BANNER_DESKTOP_URL } from "@/data/media";

export function CTABanner() {
  const href = construirEnlaceWhatsApp(
    "Hola! No encontré la camiseta que buscaba en el catálogo, ¿me mostrás otras opciones?",
  );
  const alt = "¿No encontrás la camiseta que buscás? Escribinos por WhatsApp";

  return (
    <Reveal className="mx-auto max-w-3xl px-6 py-10">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group block overflow-hidden rounded-lg border border-border-strong transition-colors hover:border-accent"
      >
        {/* Pieza vertical, pensada para mobile */}
        <div className="relative aspect-[2/3] w-full sm:hidden">
          <Image
            src={BANNER_MOBILE_URL}
            alt={alt}
            fill
            sizes="100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>
        {/* Pieza horizontal, pensada para desktop */}
        <div className="relative hidden aspect-[3/2] w-full sm:block">
          <Image
            src={BANNER_DESKTOP_URL}
            alt={alt}
            fill
            sizes="768px"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>
      </a>
    </Reveal>
  );
}
