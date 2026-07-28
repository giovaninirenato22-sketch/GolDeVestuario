"use client";

import { useState } from "react";
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
import { useToast } from "@/components/ui/Toast";
import { eliminarCategoriaAction, reordenarCategoriasAction } from "@/app/admin/(protected)/categorias/actions";
import type { CategoriaAdminRow } from "@/types";

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

function SortableRow({
  categoria,
  onEliminar,
}: {
  categoria: CategoriaAdminRow;
  onEliminar: (dbId: string, nombre: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: categoria.dbId,
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
          aria-label={`Arrastrar para reordenar ${categoria.nombre}`}
        >
          <GripIcon />
        </button>
      </td>
      <td className="px-4 py-3">{categoria.nombre}</td>
      <td className="px-4 py-3 text-fg-secondary">{categoria.slug}</td>
      <td className="px-4 py-3 text-fg-secondary">{categoria.tallesDisponibles.join(", ")}</td>
      <td className="px-4 py-3">
        <div className="flex gap-3">
          <Link href={`/admin/categorias/${categoria.dbId}`} className="text-fg-secondary hover:text-accent">
            Editar
          </Link>
          <button
            type="button"
            onClick={() => onEliminar(categoria.dbId, categoria.nombre)}
            className="text-fg-secondary hover:text-error"
          >
            Eliminar
          </button>
        </div>
      </td>
    </tr>
  );
}

export function AdminCategoriaTable({ categoriasIniciales }: { categoriasIniciales: CategoriaAdminRow[] }) {
  const [categorias, setCategorias] = useState(categoriasIniciales);
  const { showToast } = useToast();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const ids = categorias.map((c) => c.dbId);
    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    const reordenadas = arrayMove(categorias, oldIndex, newIndex).map((c, i) => ({ ...c, orden: i }));

    setCategorias(reordenadas);
    await reordenarCategoriasAction(reordenadas.map((c) => ({ id: c.dbId, orden: c.orden })));
  }

  async function handleEliminar(dbId: string, nombre: string) {
    const anteriores = categorias;
    setCategorias((prev) => prev.filter((c) => c.dbId !== dbId));
    const resultado = await eliminarCategoriaAction(dbId);
    if (!resultado.ok) {
      showToast(resultado.error, { tone: "error" });
      setCategorias(anteriores);
      return;
    }
    showToast(`Eliminaste "${nombre}"`, { tone: "error" });
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <DndContext
        id="admin-categorias-dnd"
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <table className="w-full text-left">
          <thead>
            <tr className="text-caption border-b border-border text-fg-muted">
              <th className="px-2 py-3 font-normal" aria-hidden="true"></th>
              <th className="px-4 py-3 font-normal">Nombre</th>
              <th className="px-4 py-3 font-normal">Slug</th>
              <th className="px-4 py-3 font-normal">Talles</th>
              <th className="px-4 py-3 font-normal">Acciones</th>
            </tr>
          </thead>
          <SortableContext items={categorias.map((c) => c.dbId)} strategy={verticalListSortingStrategy}>
            <tbody>
              {categorias.map((c) => (
                <SortableRow key={c.dbId} categoria={c} onEliminar={handleEliminar} />
              ))}
            </tbody>
          </SortableContext>
        </table>
      </DndContext>
    </div>
  );
}
