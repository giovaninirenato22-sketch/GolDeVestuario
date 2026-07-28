import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { productosSeed, categoriasSeed } from "./seed-data";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  for (const c of categoriasSeed) {
    await prisma.categoria.upsert({
      where: { slug: c.slug },
      update: {},
      create: {
        slug: c.slug,
        nombre: c.nombre,
        guiaTalles: c.guiaTalles,
        cuidados: c.cuidados,
        talles: JSON.stringify(c.talles),
        orden: c.orden,
      },
    });
  }
  console.log(`Seed listo: ${categoriasSeed.length} categorías.`);

  for (const p of productosSeed) {
    await prisma.producto.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        nombre: p.nombre,
        club: p.club,
        temporada: p.temporada,
        tipo: p.tipo,
        categoria: p.categoria,
        precio: p.precio,
        talles: JSON.stringify(p.talles),
        imagenes: JSON.stringify(p.imagenes),
        descripcion: p.descripcion,
        destacado: p.destacado,
        orden: p.orden,
        activo: p.activo,
      },
    });
  }
  console.log(`Seed listo: ${productosSeed.length} productos.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
