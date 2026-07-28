import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CTABanner } from "@/components/contenido/CTABanner";
import { getProductosPorTipo } from "@/data/productos";
import { SITE_URL } from "@/data/site";

export const metadata: Metadata = {
  title: "Productos",
  description: "Elegí si querés ver las camisetas en stock o las que son por encargue.",
  alternates: { canonical: `${SITE_URL}/productos` },
};

export default async function ProductosPage() {
  const [enStock, porEncargue] = await Promise.all([
    getProductosPorTipo("en-stock"),
    getProductosPorTipo("por-encargue"),
  ]);

  const opciones = [
    {
      href: "/productos/en-stock",
      titulo: "En Stock",
      descripcion: "Talle y precio confirmados. Sujeto a disponibilidad, listas para coordinar el envío.",
      cantidad: enStock.length,
    },
    {
      href: "/productos/por-encargue",
      titulo: "Por Encargue",
      descripcion: "Elegís el talle y coordinamos el precio y los tiempos por WhatsApp.",
      cantidad: porEncargue.length,
    },
  ];

  return (
    <>
      <Section border={false}>
        <Container>
          <SectionHeader
            eyebrow="Productos"
            title="¿Qué estás buscando?"
            description="Elegí a qué sección querés entrar."
            align="center"
          />

          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
            {opciones.map((op) => (
              <Link
                key={op.href}
                href={op.href}
                className="group flex flex-col items-center gap-3 rounded-lg border border-border-strong bg-surface px-8 py-12 text-center transition-colors hover:border-accent hover:bg-surface-alt"
              >
                <h2 className="text-h1 text-fg">{op.titulo}</h2>
                <p className="text-body-small max-w-[26ch] text-fg-secondary">{op.descripcion}</p>
                <p className="text-caption text-fg-muted">
                  {op.cantidad} {op.cantidad === 1 ? "producto" : "productos"}
                </p>
                <span className="text-button mt-4 inline-flex items-center gap-1 text-accent transition-transform group-hover:translate-x-1">
                  Entrar →
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <Section border={false}>
        <CTABanner />
      </Section>
    </>
  );
}
