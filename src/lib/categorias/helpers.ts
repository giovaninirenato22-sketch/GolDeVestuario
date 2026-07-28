import type { Categoria, Talle } from "@/types";

/** Único lugar con el orden lógico de talles: úsalo para ordenar o para listar todas las opciones posibles en un form. */
export const ORDEN_TALLES: Talle[] = ["M", "L", "XL", "2XL", "3XL"];

/**
 * Unión de todos los talles que existen en alguna categoría, en orden
 * lógico. Es una función (no una constante precalculada) porque las
 * categorías ahora son dinámicas — se recalcula a partir de lo que venga
 * de la base. Sin dependencias de servidor: se puede llamar tanto desde
 * componentes cliente como server.
 */
export function calcularTodosLosTalles(categorias: Categoria[]): Talle[] {
  const presentes = new Set(categorias.flatMap((c) => c.tallesDisponibles));
  return ORDEN_TALLES.filter((t) => presentes.has(t));
}
