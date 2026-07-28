import { Card } from "@/components/ui/Card";
import { construirEnlaceWhatsApp } from "@/lib/whatsapp";
import { INSTAGRAM_URL } from "@/data/site";

export function ContactCard() {
  const href = construirEnlaceWhatsApp("Hola! Tengo una consulta.");

  return (
    <Card className="text-center">
      <p className="text-h2 text-fg">¿Necesitás ayuda?</p>
      <p className="text-body-small mt-2 text-fg-secondary">
        Escribinos por WhatsApp y te respondemos directamente.
      </p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-button mt-6 inline-flex items-center justify-center rounded-md bg-accent px-7 py-3 text-on-accent hover:bg-accent-light"
      >
        Escribir por WhatsApp
      </a>
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-body-small mt-4 block text-fg-secondary hover:text-fg"
      >
        Seguinos en Instagram
      </a>
    </Card>
  );
}
