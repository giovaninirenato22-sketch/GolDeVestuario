import { SITE_URL } from "@/data/site";
import type { Producto } from "@/types";

/**
 * Datos estructurados schema.org/Product. Solo se emite `offers` para
 * productos En Stock, que son los únicos con precio real (RN-04/RN-05):
 * declarar un precio para un producto Por Encargue sería incorrecto.
 */
export function ProductJsonLd({ producto }: { producto: Producto }) {
  const url = `${SITE_URL}/productos/${producto.slug}`;
  const hayStock = producto.tipo === "en-stock" && producto.talles.some((t) => t.cantidad > 0);

  const json = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: producto.nombre,
    description: producto.descripcion,
    image: producto.imagenes.map((img) => `${SITE_URL}${img}`),
    category: producto.categoria,
    url,
    ...(producto.tipo === "en-stock"
      ? {
          offers: {
            "@type": "Offer",
            price: producto.precio,
            priceCurrency: "ARS",
            availability: hayStock
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            url,
          },
        }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
