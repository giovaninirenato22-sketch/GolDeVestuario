import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Notice } from "@/components/ui/Notice";
import { ProductBrowser } from "@/components/producto/ProductBrowser";
import { CTABanner } from "@/components/contenido/CTABanner";
import { getProductosPorTipo } from "@/data/productos";
import { getCategorias } from "@/data/categorias";
import { SITE_URL } from "@/data/site";

export const metadata: Metadata = {
  title: "Por Encargue",
  description: "Camisetas por encargue: elegís el talle y coordinamos el precio.",
  alternates: { canonical: `${SITE_URL}/productos/por-encargue` },
};

export default async function PorEncarguePage() {
  const [productos, categorias] = await Promise.all([getProductosPorTipo("por-encargue"), getCategorias()]);

  return (
    <>
      <Section>
        <Container>
          <SectionHeader
            eyebrow="Productos"
            title="Por Encargue"
            description="Elegís el talle que necesitás y coordinamos el precio y los tiempos de entrega por WhatsApp."
          />
          <Notice>
            Precio a coordinar en todos los productos de esta sección. El talle es obligatorio
            para poder cotizar.
          </Notice>
          <ProductBrowser productos={productos} categorias={categorias} mostrarOrdenPrecio={false} />
        </Container>
      </Section>

      <Section border={false}>
        <CTABanner />
      </Section>
    </>
  );
}
