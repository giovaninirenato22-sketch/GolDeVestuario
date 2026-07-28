// Antes era una unión fija ("fan" | "player" | ...); ahora las categorías se
// cargan desde el admin (ver Categoria más abajo), así que el universo de
// valores posibles ya no se conoce en tiempo de compilación. El slug de la
// categoría (Categoria["id"]) es lo que se guarda en Producto.categoria.
export type CategoriaId = string;

export type TipoProducto = "en-stock" | "por-encargue";

export type Talle = "M" | "L" | "XL" | "2XL" | "3XL";

export interface TalleDisponibilidad {
  talle: Talle;
  disponible: boolean;
}

export interface Categoria {
  id: CategoriaId;
  nombre: string;
  guiaTalles: string;
  cuidados: string;
  tallesDisponibles: Talle[];
}

/** Fila de categoría para el admin: incluye el cuid interno (dbId) usado para editar/borrar/reordenar. */
export interface CategoriaAdminRow {
  dbId: string;
  slug: string;
  nombre: string;
  guiaTalles: string;
  cuidados: string;
  tallesDisponibles: Talle[];
  orden: number;
}

export interface ProductoEnStock {
  id: string;
  slug: string;
  nombre: string;
  club?: string;
  temporada?: string;
  tipo: "en-stock";
  categoria: CategoriaId;
  precio: number;
  talles: TalleDisponibilidad[];
  imagenes: string[];
  descripcion?: string;
  destacado: boolean;
  orden?: number;
  activo: boolean;
}

export interface ProductoPorEncargue {
  id: string;
  slug: string;
  nombre: string;
  club?: string;
  temporada?: string;
  tipo: "por-encargue";
  categoria: CategoriaId;
  precio?: undefined;
  talles: TalleDisponibilidad[];
  imagenes: string[];
  descripcion?: string;
  destacado: boolean;
  orden?: number;
  activo: boolean;
}

export type Producto = ProductoEnStock | ProductoPorEncargue;

export type MedioDePago = "efectivo" | "transferencia" | "otro";

export interface ItemCarrito {
  productoId: string;
  talle: Talle;
  cantidad: number;
}
