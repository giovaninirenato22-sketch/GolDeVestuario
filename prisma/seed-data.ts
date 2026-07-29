/**
 * Catálogo de ejemplo usado únicamente para poblar la base de datos la
 * primera vez (`npm run db:seed`) en un entorno nuevo. El catálogo real se
 * carga y mantiene desde el panel /admin.
 */

// Estos son los mismos assets que src/data/media.ts en el código de la app
// (fuera de src/, este archivo no puede importar el alias @/ de forma
// confiable al correr standalone con tsx, así que se repiten como
// literales acá).
const PLACEHOLDER_IMG = "https://res.cloudinary.com/g22yoyre/image/upload/v1785278103/productos/placeholder.svg";
const CUIDADOS_URL = "https://res.cloudinary.com/g22yoyre/image/upload/v1785278086/guias/cuidados.png";

export interface CategoriaSeed {
  slug: string;
  nombre: string;
  guiaTalles: string;
  cuidados: string;
  talles: string[];
  orden: number;
}

export const categoriasSeed: CategoriaSeed[] = [
  {
    slug: "fan",
    nombre: "Versión Fan",
    guiaTalles: "https://res.cloudinary.com/g22yoyre/image/upload/v1785278088/guias/talles-fan.png",
    cuidados: CUIDADOS_URL,
    talles: ["M", "L", "XL", "2XL", "3XL"],
    orden: 0,
  },
  {
    slug: "player",
    nombre: "Versión Player",
    guiaTalles: "https://res.cloudinary.com/g22yoyre/image/upload/v1785278088/guias/talles-player.jpg",
    cuidados: CUIDADOS_URL,
    talles: ["M", "L", "XL", "2XL", "3XL"],
    orden: 1,
  },
  {
    slug: "retro",
    nombre: "Versión Retro",
    guiaTalles: "https://res.cloudinary.com/g22yoyre/image/upload/v1785278089/guias/talles-retro.jpg",
    cuidados: CUIDADOS_URL,
    talles: ["M", "L", "XL", "2XL"],
    orden: 2,
  },
  {
    slug: "shorts-fan",
    nombre: "Shorts Fan",
    guiaTalles: "https://res.cloudinary.com/g22yoyre/image/upload/v1785278090/guias/talles-shorts-fan.png",
    cuidados: CUIDADOS_URL,
    talles: ["L", "XL", "2XL", "3XL"],
    orden: 3,
  },
  {
    slug: "shorts-player",
    nombre: "Shorts Player",
    guiaTalles: "https://res.cloudinary.com/g22yoyre/image/upload/v1785278090/guias/talles-shorts-player.jpg",
    cuidados: CUIDADOS_URL,
    talles: ["L", "XL", "2XL", "3XL"],
    orden: 4,
  },
];

export interface ProductoSeed {
  slug: string;
  nombre: string;
  club?: string;
  temporada?: string;
  tipo: "en-stock" | "por-encargue";
  categoria: "fan" | "player" | "retro";
  precio?: number;
  talles: Array<{ talle: string; disponible: boolean }>;
  imagenes: string[];
  descripcion?: string;
  destacado: boolean;
  orden: number;
  activo: boolean;
}

export const productosSeed: ProductoSeed[] = [
  {
    slug: "seleccion-argentina-titular-2024-fan",
    nombre: "Selección Argentina Titular 2024",
    club: "Selección Argentina",
    temporada: "2024",
    tipo: "en-stock",
    categoria: "fan",
    precio: 48000,
    talles: [
      { talle: "M", disponible: true },
      { talle: "L", disponible: true },
      { talle: "XL", disponible: true },
      { talle: "2XL", disponible: false },
      { talle: "3XL", disponible: true },
    ],
    imagenes: [PLACEHOLDER_IMG],
    descripcion: "Camiseta versión Fan, tela liviana, escudo bordado. Ejemplo de catálogo.",
    destacado: true,
    orden: 1,
    activo: true,
  },
  {
    slug: "boca-juniors-titular-2024-fan",
    nombre: "Boca Juniors Titular 2024",
    club: "Boca Juniors",
    temporada: "2024",
    tipo: "en-stock",
    categoria: "fan",
    precio: 45000,
    talles: [
      { talle: "M", disponible: true },
      { talle: "L", disponible: true },
      { talle: "XL", disponible: false },
      { talle: "2XL", disponible: true },
      { talle: "3XL", disponible: false },
    ],
    imagenes: [PLACEHOLDER_IMG],
    destacado: true,
    orden: 2,
    activo: true,
  },
  {
    slug: "river-plate-suplente-2024-player",
    nombre: "River Plate Suplente 2024",
    club: "River Plate",
    temporada: "2024",
    tipo: "en-stock",
    categoria: "player",
    precio: 60000,
    talles: [
      { talle: "M", disponible: true },
      { talle: "L", disponible: true },
      { talle: "XL", disponible: true },
      { talle: "2XL", disponible: true },
      { talle: "3XL", disponible: false },
    ],
    imagenes: [PLACEHOLDER_IMG],
    descripcion: "Versión Player, tela de match, corte ajustado.",
    destacado: true,
    orden: 3,
    activo: true,
  },
  {
    slug: "boca-juniors-retro-1981",
    nombre: "Boca Juniors Retro 1981",
    club: "Boca Juniors",
    temporada: "1981",
    tipo: "en-stock",
    categoria: "retro",
    precio: 52000,
    talles: [
      { talle: "M", disponible: true },
      { talle: "L", disponible: true },
      { talle: "XL", disponible: true },
      { talle: "2XL", disponible: false },
    ],
    imagenes: [PLACEHOLDER_IMG],
    descripcion: "Edición retro, tela algodón peinado 220g.",
    destacado: true,
    orden: 4,
    activo: true,
  },
  {
    slug: "river-plate-alternativa-2023-fan",
    nombre: "River Plate Alternativa 2023",
    club: "River Plate",
    temporada: "2023",
    tipo: "en-stock",
    categoria: "fan",
    precio: 42000,
    talles: [
      { talle: "M", disponible: false },
      { talle: "L", disponible: true },
      { talle: "XL", disponible: true },
      { talle: "2XL", disponible: true },
      { talle: "3XL", disponible: true },
    ],
    imagenes: [PLACEHOLDER_IMG],
    destacado: true,
    orden: 5,
    activo: true,
  },
  {
    slug: "seleccion-argentina-player-2024",
    nombre: "Selección Argentina Player 2024",
    club: "Selección Argentina",
    temporada: "2024",
    tipo: "en-stock",
    categoria: "player",
    precio: 65000,
    talles: [
      { talle: "M", disponible: true },
      { talle: "L", disponible: false },
      { talle: "XL", disponible: true },
      { talle: "2XL", disponible: true },
      { talle: "3XL", disponible: false },
    ],
    imagenes: [PLACEHOLDER_IMG],
    destacado: true,
    orden: 6,
    activo: true,
  },
  {
    slug: "racing-club-titular-2024-fan",
    nombre: "Racing Club Titular 2024",
    club: "Racing Club",
    temporada: "2024",
    tipo: "en-stock",
    categoria: "fan",
    precio: 44000,
    talles: [
      { talle: "M", disponible: true },
      { talle: "L", disponible: true },
      { talle: "XL", disponible: true },
      { talle: "2XL", disponible: true },
      { talle: "3XL", disponible: false },
    ],
    imagenes: [PLACEHOLDER_IMG],
    destacado: true,
    orden: 7,
    activo: true,
  },
  {
    slug: "independiente-titular-2024-fan",
    nombre: "Independiente Titular 2024",
    club: "Independiente",
    temporada: "2024",
    tipo: "en-stock",
    categoria: "fan",
    precio: 44000,
    talles: [
      { talle: "M", disponible: true },
      { talle: "L", disponible: true },
      { talle: "XL", disponible: false },
      { talle: "2XL", disponible: true },
      { talle: "3XL", disponible: true },
    ],
    imagenes: [PLACEHOLDER_IMG],
    destacado: true,
    orden: 8,
    activo: true,
  },
  {
    slug: "san-lorenzo-titular-2024-fan",
    nombre: "San Lorenzo Titular 2024",
    club: "San Lorenzo",
    temporada: "2024",
    tipo: "en-stock",
    categoria: "fan",
    precio: 44000,
    talles: [
      { talle: "M", disponible: true },
      { talle: "L", disponible: true },
      { talle: "XL", disponible: true },
      { talle: "2XL", disponible: true },
      { talle: "3XL", disponible: true },
    ],
    imagenes: [PLACEHOLDER_IMG],
    destacado: false,
    orden: 9,
    activo: true,
  },
  {
    slug: "velez-sarsfield-titular-2024-player",
    nombre: "Vélez Sarsfield Titular 2024",
    club: "Vélez Sarsfield",
    temporada: "2024",
    tipo: "en-stock",
    categoria: "player",
    precio: 62000,
    talles: [
      { talle: "M", disponible: true },
      { talle: "L", disponible: false },
      { talle: "XL", disponible: false },
      { talle: "2XL", disponible: true },
      { talle: "3XL", disponible: true },
    ],
    imagenes: [PLACEHOLDER_IMG],
    destacado: false,
    orden: 10,
    activo: true,
  },
  {
    slug: "seleccion-argentina-retro-1986",
    nombre: "Selección Argentina Retro 1986",
    club: "Selección Argentina",
    temporada: "1986",
    tipo: "por-encargue",
    categoria: "retro",
    talles: [
      { talle: "M", disponible: true },
      { talle: "L", disponible: true },
      { talle: "XL", disponible: true },
      { talle: "2XL", disponible: true },
    ],
    imagenes: [PLACEHOLDER_IMG],
    descripcion: "Edición retro por encargue. Precio a coordinar.",
    destacado: false,
    orden: 11,
    activo: true,
  },
  {
    slug: "newells-old-boys-titular-2024-fan",
    nombre: "Newell's Old Boys Titular 2024",
    club: "Newell's Old Boys",
    temporada: "2024",
    tipo: "por-encargue",
    categoria: "fan",
    talles: [
      { talle: "M", disponible: true },
      { talle: "L", disponible: true },
      { talle: "XL", disponible: true },
      { talle: "2XL", disponible: true },
      { talle: "3XL", disponible: true },
    ],
    imagenes: [PLACEHOLDER_IMG],
    descripcion: "Por encargue. Precio a coordinar.",
    destacado: false,
    orden: 12,
    activo: true,
  },
];
