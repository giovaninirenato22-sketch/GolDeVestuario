/**
 * Sube a Cloudinary los assets estáticos que hoy viven en public/ (logo,
 * banners, guías de talles, camisetas de la pantalla de carga, videos del
 * hero, placeholder de producto) y deja un mapeo local->URL en
 * scripts/cloudinary-urls.json para que el código pueda actualizar sus
 * referencias. Usa public_id fijo (no timestamp) + overwrite: true, así
 * correrlo de nuevo actualiza el mismo asset en vez de duplicarlo.
 *
 * Uso: npx tsx scripts/migrar-assets-cloudinary.ts
 */
import "dotenv/config";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

interface Asset {
  localPath: string;
  publicId: string;
  resourceType: "image" | "video";
}

const ASSETS: Asset[] = [
  { localPath: "public/brand/logo.png", publicId: "brand/logo", resourceType: "image" },
  {
    localPath: "public/banners/no-encontras-tu-camiseta.png",
    publicId: "banners/no-encontras-tu-camiseta",
    resourceType: "image",
  },
  {
    localPath: "public/banners/no-encontras-tu-camiseta-desktop.png",
    publicId: "banners/no-encontras-tu-camiseta-desktop",
    resourceType: "image",
  },
  { localPath: "public/guias/cuidados.png", publicId: "guias/cuidados", resourceType: "image" },
  { localPath: "public/guias/talles-fan.png", publicId: "guias/talles-fan", resourceType: "image" },
  { localPath: "public/guias/talles-player.jpeg", publicId: "guias/talles-player", resourceType: "image" },
  { localPath: "public/guias/talles-retro.jpeg", publicId: "guias/talles-retro", resourceType: "image" },
  {
    localPath: "public/guias/talles-shorts-fan.png",
    publicId: "guias/talles-shorts-fan",
    resourceType: "image",
  },
  {
    localPath: "public/guias/talles-shorts-player.jpeg",
    publicId: "guias/talles-shorts-player",
    resourceType: "image",
  },
  { localPath: "public/hero/hero-desktop.mp4", publicId: "hero/hero-desktop", resourceType: "video" },
  { localPath: "public/hero/hero-mobile.mp4", publicId: "hero/hero-mobile", resourceType: "video" },
  {
    localPath: "public/productos/placeholder.svg",
    publicId: "productos/placeholder",
    resourceType: "image",
  },
  ...Array.from({ length: 17 }, (_, i) => {
    const n = String(i + 1).padStart(2, "0");
    return {
      localPath: `public/loading/jersey-${n}.png`,
      publicId: `loading/jersey-${n}`,
      resourceType: "image" as const,
    };
  }),
];

async function main() {
  const urls: Record<string, string> = {};

  for (const asset of ASSETS) {
    const resultado = await cloudinary.uploader.upload(asset.localPath, {
      public_id: asset.publicId,
      resource_type: asset.resourceType,
      overwrite: true,
    });
    urls[asset.localPath.replace(/^public/, "")] = resultado.secure_url;
    console.log(`${asset.localPath} -> ${resultado.secure_url}`);
  }

  const outPath = path.join(process.cwd(), "scripts", "cloudinary-urls.json");
  await writeFile(outPath, JSON.stringify(urls, null, 2));
  console.log(`\nListo: ${Object.keys(urls).length} assets subidos. Mapeo guardado en ${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
