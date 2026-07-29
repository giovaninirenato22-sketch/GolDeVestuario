"use client";

import { useMemo, useState } from "react";
import type { Categoria, CategoriaId, Producto, Talle } from "@/types";
import { calcularTodosLosTalles } from "@/lib/categorias/helpers";
import { coincideBusqueda } from "@/lib/texto";
import { ProductGrid } from "./ProductGrid";

type Orden = "recomendado" | "nombre-asc" | "nombre-desc" | "precio-asc" | "precio-desc";

const OPCIONES_ORDEN: Array<{ value: Orden; label: string }> = [
  { value: "recomendado", label: "Recomendado" },
  { value: "nombre-asc", label: "Nombre (A-Z)" },
  { value: "nombre-desc", label: "Nombre (Z-A)" },
  { value: "precio-asc", label: "Precio: menor a mayor" },
  { value: "precio-desc", label: "Precio: mayor a menor" },
];

function ordenar(productos: Producto[], orden: Orden): Producto[] {
  const lista = [...productos];

  switch (orden) {
    case "nombre-asc":
      return lista.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
    case "nombre-desc":
      return lista.sort((a, b) => b.nombre.localeCompare(a.nombre, "es"));
    case "precio-asc":
      return lista.sort((a, b) => (a.precio ?? Infinity) - (b.precio ?? Infinity));
    case "precio-desc":
      return lista.sort((a, b) => (b.precio ?? -Infinity) - (a.precio ?? -Infinity));
    default:
      return lista.sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
  }
}

export function ProductBrowser({
  productos,
  categorias,
  mostrarOrdenPrecio = true,
}: {
  productos: Producto[];
  categorias: Categoria[];
  /** Ocultar las opciones de orden por precio en listados sin precio fijo (Por Encargue). */
  mostrarOrdenPrecio?: boolean;
}) {
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState<CategoriaId | "todas">("todas");
  const [talle, setTalle] = useState<Talle | "todos">("todos");
  const [orden, setOrden] = useState<Orden>("recomendado");

  const todosLosTalles = useMemo(() => calcularTodosLosTalles(categorias), [categorias]);

  const opcionesOrden = mostrarOrdenPrecio
    ? OPCIONES_ORDEN
    : OPCIONES_ORDEN.filter((op) => !op.value.startsWith("precio"));

  const resultado = useMemo(() => {
    const filtrados = productos.filter((p) => {
      const pasaCategoria = categoria === "todas" || p.categoria === categoria;
      const pasaTalle = talle === "todos" || p.talles.some((t) => t.talle === talle && t.cantidad > 0);
      const pasaBusqueda =
        busqueda.trim() === "" ||
        coincideBusqueda(p.nombre, busqueda) ||
        (p.club ? coincideBusqueda(p.club, busqueda) : false);
      return pasaCategoria && pasaTalle && pasaBusqueda;
    });
    return ordenar(filtrados, orden);
  }, [productos, busqueda, categoria, talle, orden]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <input
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre o club..."
          aria-label="Buscar productos"
          className="text-body-small w-full rounded-md border border-border-strong bg-surface-alt px-4 py-3 text-fg outline-none placeholder:text-fg-muted focus:border-accent sm:max-w-xs"
        />

        <div className="flex flex-wrap items-center gap-4">
          <label className="text-body-small flex items-center gap-2 text-fg-secondary">
            Talle
            <select
              value={talle}
              onChange={(e) => setTalle(e.target.value as Talle | "todos")}
              aria-label="Filtrar por talle"
              className="text-body-small rounded-md border border-border-strong bg-surface-alt px-3 py-2 text-fg outline-none focus:border-accent"
            >
              <option value="todos">Todos</option>
              {todosLosTalles.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          <label className="text-body-small flex items-center gap-2 text-fg-secondary">
            Ordenar
            <select
              value={orden}
              onChange={(e) => setOrden(e.target.value as Orden)}
              className="text-body-small rounded-md border border-border-strong bg-surface-alt px-3 py-2 text-fg outline-none focus:border-accent"
            >
              {opcionesOrden.map((op) => (
                <option key={op.value} value={op.value}>
                  {op.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div role="group" aria-label="Filtrar por categoría" className="mb-8 flex flex-wrap gap-2">
        <button
          type="button"
          aria-pressed={categoria === "todas"}
          onClick={() => setCategoria("todas")}
          className={`text-button rounded-full border px-4 py-2 transition-all duration-150 active:scale-95 ${
            categoria === "todas"
              ? "border-accent bg-accent text-on-accent"
              : "border-border-strong text-fg-secondary hover:border-accent"
          }`}
        >
          Todas
        </button>
        {categorias.map((cat) => (
          <button
            key={cat.id}
            type="button"
            aria-pressed={categoria === cat.id}
            onClick={() => setCategoria(cat.id)}
            className={`text-button rounded-full border px-4 py-2 transition-all duration-150 active:scale-95 ${
              categoria === cat.id
                ? "border-accent bg-accent text-on-accent"
                : "border-border-strong text-fg-secondary hover:border-accent"
            }`}
          >
            {cat.nombre}
          </button>
        ))}
      </div>

      {resultado.length === 0 ? (
        <p className="text-body text-fg-secondary">
          No encontramos productos con esos filtros. Probá con otra búsqueda, talle o categoría.
        </p>
      ) : (
        <ProductGrid productos={resultado} categorias={categorias} />
      )}
    </div>
  );
}
