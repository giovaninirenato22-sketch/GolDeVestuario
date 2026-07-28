import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProductBrowser } from "@/components/producto/ProductBrowser";
import { CTABanner } from "@/components/contenido/CTABanner";
import { getProductosPorTipo } from "@/data/productos";
import { getCategorias } from "@/data/categorias";
import { SITE_URL } from "@/data/site";

export const metadata: Metadata = {
  title: "En Stock",
  description: "Camisetas en stock, con talle y precio confirmados.",
  alternates: { canonical: `${SITE_URL}/productos/en-stock` },
};

export default async function EnStockPage() {
  const [productos, categorias] = await Promise.all([getProductosPorTipo("en-stock"), getCategorias()]);

  return (
    <>
      <Section>
        <Container>
          <SectionHeader
            eyebrow="Productos"
            title="En Stock"
            description="Talle y precio confirmados. Sujeto a disponibilidad hasta confirmar el pedido por WhatsApp."
          />
          <ProductBrowser productos={productos} categorias={categorias} />
        </Container>
      </Section>

      <Section border={false}>
        <CTABanner />
      </Section>
    </>
  );
}
