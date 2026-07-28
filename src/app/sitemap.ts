import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/site";
import { getProductosActivos } from "@/data/productos";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rutasEstaticas: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/productos`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/productos/en-stock`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/productos/por-encargue`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/quienes-somos`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/soporte`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const productos = await getProductosActivos();
  const rutasProductos: MetadataRoute.Sitemap = productos.map((producto) => ({
    url: `${SITE_URL}/productos/${producto.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...rutasEstaticas, ...rutasProductos];
}
