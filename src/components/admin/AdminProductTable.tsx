"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { formatARS } from "@/lib/precios";
import { useToast } from "@/components/ui/Toast";
import {
  eliminarProductoAction,
  toggleDestacadoAction,
  reordenarProductosAction,
} from "@/app/admin/(protected)/productos/actions";
import type { Categoria, CategoriaId, TipoProducto } from "@/types";

export interface ProductoAdminRow {
  id: string;
  slug: string;
  nombre: string;
  categoria: string;
  tipo: string;
  precio: number | null;
  activo: boolean;
  destacado: boolean;
  orden: number;
}

function GripIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <circle cx="9" cy="6" r="1.5" />
      <circle cx="15" cy="6" r="1.5" />
      <circle cx="9" cy="12" r="1.5" />
      <circle cx="15" cy="12" r="1.5" />
      <circle cx="9" cy="18" r="1.5" />
      <circle cx="15" cy="18" r="1.5" />
    </svg>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.8Z" />
    </svg>
  );
}

function SortableRow({
  producto,
  nombreCategoria,
  onToggleDestacado,
  onEliminar,
}: {
  producto: ProductoAdminRow;
  nombreCategoria: string;
  onToggleDestacado: (id: string) => void;
  onEliminar: (id: string, slug: string, nombre: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: producto.id,
  });

  return (
    <tr
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="text-body-small border-b border-border text-fg last:border-b-0"
    >
      <td className="w-10 px-2 py-3">
        <button
          {...attributes}
          {...listeners}
          className="flex touch-none items-center justify-center rounded p-1 text-fg-muted hover:text-fg active:cursor-grabbing"
          style={{ cursor: "grab" }}
          aria-label={`Arrastrar para reordenar ${producto.nombre}`}
        >
          <GripIcon />
        </button>
      </td>
      <td className="px-4 py-3">{producto.nombre}</td>
      <td className="px-4 py-3 text-fg-secondary">{nombreCategoria}</td>
      <td className="px-4 py-3 text-fg-secondary">{producto.tipo === "en-stock" ? "En Stock" : "Por Encargue"}</td>
      <td className="px-4 py-3 text-fg-secondary">{producto.precio != null ? formatARS(producto.precio) : "—"}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleDestacado(producto.id)}
            aria-pressed={producto.destacado}
            aria-label={producto.destacado ? "Quitar de destacados" : "Marcar como destacado"}
            className={`rounded p-1 transition-all duration-150 active:scale-90 ${
              producto.destacado ? "text-accent" : "text-fg-muted hover:text-fg-secondary"
            }`}
          >
            <StarIcon filled={producto.destacado} />
          </button>
          <span className="text-fg-secondary">{producto.activo ? "Activo" : "Inactivo"}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-3">
          <Link href={`/admin/productos/${producto.id}`} className="text-fg-secondary hover:text-accent">
            Editar
          </Link>
          <button
            type="button"
            onClick={() => onEliminar(producto.id, producto.slug, producto.nombre)}
            className="text-fg-secondary hover:text-error"
          >
            Eliminar
          </button>
        </div>
      </td>
    </tr>
  );
}

export function AdminProductTable({
  productosIniciales,
  categorias,
}: {
  productosIniciales: ProductoAdminRow[];
  categorias: Categoria[];
}) {
  const [productos, setProductos] = useState(productosIniciales);
  const [filtroCategoria, setFiltroCategoria] = useState<CategoriaId | "todas">("todas");
  const [filtroTipo, setFiltroTipo] = useState<TipoProducto | "todos">("todos");
  const { showToast } = useToast();

  const nombresPorCategoria = useMemo(
    () => new Map(categorias.map((c) => [c.id, c.nombre])),
    [categorias],
  );

  // Los dos filtros se combinan (AND): categoría Y tipo a la vez, no uno u otro.
  const visibles = useMemo(
    () =>
      productos.filter(
        (p) =>
          (filtroCategoria === "todas" || p.categoria === filtroCategoria) &&
          (filtroTipo === "todos" || p.tipo === filtroTipo),
      ),
    [productos, filtroCategoria, filtroTipo],
  );

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const idsVisibles = visibles.map((p) => p.id);
    const oldIndex = idsVisibles.indexOf(String(active.id));
    const newIndex = idsVisibles.indexOf(String(over.id));
    const nuevoOrdenVisible = arrayMove(idsVisibles, oldIndex, newIndex);

    // El drag solo reordena lo visible (según el filtro); el grupo se
    // reinserta en el lugar donde arrancaba dentro de la lista completa,
    // así no se pierde el orden relativo de las categorías no filtradas.
    const filtradoSet = new Set(idsVisibles);
    const primerIndiceGlobal = productos.findIndex((p) => filtradoSet.has(p.id));
    const resto = productos.filter((p) => !filtradoSet.has(p.id));
    const itemsReordenados = nuevoOrdenVisible.map((id) => productos.find((p) => p.id === id)!);
    const combinado = [...resto.slice(0, primerIndiceGlobal), ...itemsReordenados, ...resto.slice(primerIndiceGlobal)];
    const conNuevoOrden = combinado.map((p, i) => ({ ...p, orden: i }));

    setProductos(conNuevoOrden);
    await reordenarProductosAction(conNuevoOrden.map((p) => ({ id: p.id, orden: p.orden })));
  }

  async function handleToggleDestacado(id: string) {
    const resultado = await toggleDestacadoAction(id);
    if (!resultado.ok) {
      showToast(resultado.error, { tone: "error" });
      return;
    }
    setProductos((prev) => prev.map((p) => (p.id === id ? { ...p, destacado: resultado.destacado } : p)));
  }

  async function handleEliminar(id: string, slug: string, nombre: string) {
    setProductos((prev) => prev.filter((p) => p.id !== id));
    try {
      await eliminarProductoAction(id, slug);
      showToast(`Eliminaste "${nombre}"`, { tone: "error" });
    } catch {
      showToast(`No se pudo eliminar "${nombre}". Probá de nuevo.`, { tone: "error" });
      setProductos(productosIniciales);
    }
  }

  return (
    <div>
      <div role="group" aria-label="Filtrar por categoría" className="mb-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFiltroCategoria("todas")}
          aria-pressed={filtroCategoria === "todas"}
          className={`text-button rounded-full border px-4 py-2 transition-all duration-150 active:scale-95 ${
            filtroCategoria === "todas"
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
            onClick={() => setFiltroCategoria(cat.id)}
            aria-pressed={filtroCategoria === cat.id}
            className={`text-button rounded-full border px-4 py-2 transition-all duration-150 active:scale-95 ${
              filtroCategoria === cat.id
                ? "border-accent bg-accent text-on-accent"
                : "border-border-strong text-fg-secondary hover:border-accent"
            }`}
          >
            {cat.nombre}
          </button>
        ))}
      </div>

      <div role="group" aria-label="Filtrar por tipo" className="mb-6 flex flex-wrap gap-2">
        {(
          [
            { value: "todos", label: "Todos los tipos" },
            { value: "en-stock", label: "En Stock" },
            { value: "por-encargue", label: "Por Encargue" },
          ] as const
        ).map((opcion) => (
          <button
            key={opcion.value}
            type="button"
            onClick={() => setFiltroTipo(opcion.value)}
            aria-pressed={filtroTipo === opcion.value}
            className={`text-button rounded-full border px-4 py-2 transition-all duration-150 active:scale-95 ${
              filtroTipo === opcion.value
                ? "border-accent bg-accent text-on-accent"
                : "border-border-strong text-fg-secondary hover:border-accent"
            }`}
          >
            {opcion.label}
          </button>
        ))}
      </div>

      {visibles.length === 0 ? (
        <p className="text-body text-fg-secondary">No hay productos con estos filtros.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <DndContext
            id="admin-productos-dnd"
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <table className="w-full text-left">
              <thead>
                <tr className="text-caption border-b border-border text-fg-muted">
                  <th className="px-2 py-3 font-normal" aria-hidden="true"></th>
                  <th className="px-4 py-3 font-normal">Nombre</th>
                  <th className="px-4 py-3 font-normal">Categoría</th>
                  <th className="px-4 py-3 font-normal">Tipo</th>
                  <th className="px-4 py-3 font-normal">Precio</th>
                  <th className="px-4 py-3 font-normal">Estado</th>
                  <th className="px-4 py-3 font-normal">Acciones</th>
                </tr>
              </thead>
              <SortableContext items={visibles.map((p) => p.id)} strategy={verticalListSortingStrategy}>
                <tbody>
                  {visibles.map((p) => (
                    <SortableRow
                      key={p.id}
                      producto={p}
                      nombreCategoria={nombresPorCategoria.get(p.categoria) ?? p.categoria}
                      onToggleDestacado={handleToggleDestacado}
                      onEliminar={handleEliminar}
                    />
                  ))}
                </tbody>
              </SortableContext>
            </table>
          </DndContext>
        </div>
      )}
    </div>
  );
}
