import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Divider } from "@/components/ui/Divider";
import { CategoryBadge } from "@/components/producto/CategoryBadge";
import { Breadcrumbs } from "@/components/producto/Breadcrumbs";
import { ProductGallery } from "@/components/producto/ProductGallery";
import { SizeRequestNotice } from "@/components/producto/SizeRequestNotice";
import { ProductPurchasePanel } from "@/components/producto/ProductPurchasePanel";
import { CareGuide } from "@/components/producto/CareGuide";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { RelatedProducts } from "@/components/producto/RelatedProducts";
import { CTABanner } from "@/components/contenido/CTABanner";
import { ProductJsonLd } from "@/components/producto/ProductJsonLd";
import { getCategoriaPorSlug, getCategorias } from "@/data/categorias";
import { SITE_URL } from "@/data/site";
import {
  getProductoPorSlug,
  getProductosActivos,
  getProductosRelacionados,
} from "@/data/productos";

interface RouteParams {
  slug: string;
}

export async function generateStaticParams(): Promise<RouteParams[]> {
  const productos = await getProductosActivos();
  return productos.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const producto = await getProductoPorSlug(slug);
  if (!producto) return {};

  const categoria = await getCategoriaPorSlug(producto.categoria);

  return {
    title: producto.nombre,
    description: producto.descripcion ?? `${producto.nombre} — ${categoria?.nombre ?? producto.categoria}`,
    alternates: { canonical: `${SITE_URL}/productos/${producto.slug}` },
    openGraph: {
      title: producto.nombre,
      images: producto.imagenes,
    },
  };
}

export default async function ProductoDetailPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const producto = await getProductoPorSlug(slug);
  if (!producto) notFound();

  const categoria = await getCategoriaPorSlug(producto.categoria);
  if (!categoria) notFound();

  const [relacionados, categorias] = await Promise.all([
    getProductosRelacionados(producto),
    getCategorias(),
  ]);
  const seccionTipo = producto.tipo === "en-stock" ? "En Stock" : "Por Encargue";
  const hrefSeccion = producto.tipo === "en-stock" ? "/productos/en-stock" : "/productos/por-encargue";

  return (
    <>
      <ProductJsonLd producto={producto} />
      <Section>
        <Container>
          <Breadcrumbs
            items={[
              { label: "Inicio", href: "/" },
              { label: "Productos", href: "/productos" },
              { label: seccionTipo, href: hrefSeccion },
              { label: producto.nombre },
            ]}
          />

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div>
              <ProductGallery imagenes={producto.imagenes} nombre={producto.nombre} />
              {producto.tipo === "en-stock" ? <SizeRequestNotice producto={producto} /> : null}
            </div>

            <div>
              <CategoryBadge nombre={categoria.nombre} />
              <h1 className="text-h1 text-fg mt-3">{producto.nombre}</h1>
              {producto.club || producto.temporada ? (
                <p className="text-body text-fg-secondary mt-1">
                  {[producto.club, producto.temporada].filter(Boolean).join(" · ")}
                </p>
              ) : null}

              <Divider className="my-6" />

              <ProductPurchasePanel producto={producto} categoria={categoria} />

              {producto.descripcion ? (
                <>
                  <Divider className="my-6" />
                  <p className="text-body text-fg-secondary">{producto.descripcion}</p>
                </>
              ) : null}
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeader eyebrow="Cuidados" title="Cuidá tu camiseta" align="center" />
          <CareGuide cuidadosSrc={categoria.cuidados} />
        </Container>
      </Section>

      {relacionados.length > 0 ? (
        <Section>
          <Container>
            <RelatedProducts productos={relacionados} categorias={categorias} />
          </Container>
        </Section>
      ) : null}

      <Section border={false}>
        <CTABanner />
      </Section>
    </>
  );
}
