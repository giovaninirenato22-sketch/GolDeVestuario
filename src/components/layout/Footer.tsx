import Link from "next/link";
import { NAV_LINKS, SITE_NAME, INSTAGRAM_URL, DEVELOPER_NAME, DEVELOPER_URL } from "@/data/site";
import { construirEnlaceWhatsApp } from "@/lib/whatsapp";

export function Footer() {
  const whatsappHref = construirEnlaceWhatsApp("Hola! Tengo una consulta sobre el catálogo.");

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 sm:py-14 md:flex-row md:justify-between">
        <div>
          <p className="text-h2 text-fg text-lg">
            GOL <span className="text-accent">DE VESTUARIO</span>
          </p>
          <p className="text-body-small mt-3 max-w-xs text-fg-secondary">
            Indumentaria y camisetas de fútbol para quienes viven el fútbol desde adentro.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-eyebrow text-accent">Navegación</p>
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-body-small text-fg-secondary hover:text-fg">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-eyebrow text-accent">Contacto</p>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="text-body-small text-fg-secondary hover:text-fg">
            WhatsApp
          </a>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-body-small text-fg-secondary hover:text-fg">
            Instagram
          </a>
        </div>
      </div>

      <div className="border-t border-border py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-caption text-fg-muted">
            © {new Date().getFullYear()} {SITE_NAME}. Todos los derechos reservados.
          </p>
          <p className="text-caption text-fg-muted">
            Sitio desarrollado por{" "}
            <a
              href={DEVELOPER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-fg-secondary underline decoration-border-strong underline-offset-2 hover:text-accent"
            >
              {DEVELOPER_NAME}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
