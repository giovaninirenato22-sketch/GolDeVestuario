import type { Metadata } from "next";
import { Hero } from "@/components/contenido/Hero";
import { StatRow } from "@/components/contenido/StatRow";
import { CTABanner } from "@/components/contenido/CTABanner";
import { ProductGrid } from "@/components/producto/ProductGrid";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ButtonLink } from "@/components/ui/Button";
import { StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { getProductosDestacados } from "@/data/productos";
import { getCategorias } from "@/data/categorias";
import { SITE_URL } from "@/data/site";

export const metadata: Metadata = {
  alternates: { canonical: `${SITE_URL}/` },
};

export default async function Home() {
  const [destacados, categorias] = await Promise.all([getProductosDestacados(), getCategorias()]);

  return (
    <>
      <Hero />
      <StatRow />

      <Section>
        <Container>
          <SectionHeader eyebrow="Catálogo" title="Productos destacados" />
          <ProductGrid productos={destacados} categorias={categorias} />
        </Container>
      </Section>

      <Section>
        <Container>
          <StaggerGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <StaggerItem index={0} className="rounded-lg border border-border p-8 text-center transition-all duration-200 hover:-translate-y-1 hover:border-accent">
              <p className="text-h2 text-fg">En Stock</p>
              <p className="text-body-small mt-2 text-fg-secondary">
                Listas para enviar, con talle y precio confirmados.
              </p>
              <ButtonLink href="/productos/en-stock" variant="secondary" className="mt-6">
                Ver en stock
              </ButtonLink>
            </StaggerItem>
            <StaggerItem index={1} className="rounded-lg border border-border p-8 text-center transition-all duration-200 hover:-translate-y-1 hover:border-accent">
              <p className="text-h2 text-fg">Por Encargue</p>
              <p className="text-body-small mt-2 text-fg-secondary">
                Elegís el talle y coordinamos el precio por WhatsApp.
              </p>
              <ButtonLink href="/productos/por-encargue" variant="secondary" className="mt-6">
                Ver por encargue
              </ButtonLink>
            </StaggerItem>
          </StaggerGroup>
        </Container>
      </Section>

      <Section border={false}>
        <CTABanner />
      </Section>
    </>
  );
}
