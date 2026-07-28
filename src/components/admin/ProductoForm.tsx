"use client";

import { useState } from "react";
import Image from "next/image";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  guardarProducto,
  agregarImagenProductoAction,
  quitarImagenProductoAction,
  reordenarImagenesProductoAction,
} from "@/app/admin/(protected)/productos/actions";
import { subirImagenDirecto } from "@/lib/cloudinary-client";
import type { Categoria, CategoriaId, TalleDisponibilidad, TipoProducto } from "@/types";

function SortableThumb({ img, onQuitar }: { img: string; onQuitar: (img: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: img });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="relative h-20 w-20 touch-none overflow-hidden rounded-md bg-surface"
      {...attributes}
      {...listeners}
    >
      <Image src={img} alt="" fill sizes="80px" className="object-contain p-1" />
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => onQuitar(img)}
        aria-label="Quitar imagen"
        className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center bg-error text-fg text-xs"
      >
        ✕
      </button>
    </div>
  );
}

export interface ProductoFormValues {
  id?: string;
  slug?: string;
  nombre: string;
  club?: string;
  temporada?: string;
  tipo: TipoProducto;
  categoria: CategoriaId;
  precio?: number;
  talles: TalleDisponibilidad[];
  imagenes: string[];
  descripcion?: string;
  destacado: boolean;
  orden: number;
  activo: boolean;
}

const inputClass =
  "text-body-small mt-2 w-full rounded-md border border-border-strong bg-surface-alt px-4 py-3 text-fg outline-none focus:border-accent";
const labelClass = "text-body-small block text-fg-secondary";

export function ProductoForm({ valores, categorias }: { valores?: ProductoFormValues; categorias: Categoria[] }) {
  const [tipo, setTipo] = useState<TipoProducto>(valores?.tipo ?? "en-stock");
  const [categoria, setCategoria] = useState<CategoriaId>(valores?.categoria ?? categorias[0]?.id ?? "");
  const [imagenes, setImagenes] = useState<string[]>(valores?.imagenes ?? []);
  const [subiendo, setSubiendo] = useState(false);
  const [errorSubida, setErrorSubida] = useState<string | null>(null);

  const disponiblesPorTalle = new Map(valores?.talles.map((t) => [t.talle, t.disponible]));
  const categoriaActual = categorias.find((c) => c.id === categoria);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  // Con producto ya creado (valores?.id), cada foto se persiste apenas se
  // sube — no espera al submit del form. Si dos dispositivos tienen el
  // mismo producto abierto, ninguno pisa lo que subió el otro (ver
  // agregarImagenProducto/quitarImagenProducto, que leen y modifican la
  // base en el momento en vez de confiar en lo que este navegador tenía
  // en memoria). Las subidas se hacen una por una (no en paralelo) por la
  // misma razón: si dos "agregar" del mismo dispositivo pisaran la base al
  // mismo tiempo, una podría perder la foto que agregó la otra.
  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setSubiendo(true);
    setErrorSubida(null);
    e.target.value = "";

    for (const file of files) {
      const res = await subirImagenDirecto(file, "gdv_admin_unsigned");
      if (res.error) {
        setErrorSubida(res.error);
        continue;
      }
      if (res.path) {
        if (valores?.id) {
          const actuales = await agregarImagenProductoAction(valores.id, res.path);
          setImagenes(actuales);
        } else {
          setImagenes((prev) => [...prev, res.path!]);
        }
      }
    }

    setSubiendo(false);
  }

  async function handleQuitarImagen(img: string) {
    if (valores?.id) {
      const actuales = await quitarImagenProductoAction(valores.id, img);
      setImagenes(actuales);
    } else {
      setImagenes((prev) => prev.filter((i) => i !== img));
    }
  }

  async function handleDragEndImagenes(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = imagenes.indexOf(String(active.id));
    const newIndex = imagenes.indexOf(String(over.id));
    const reordenadas = arrayMove(imagenes, oldIndex, newIndex);
    setImagenes(reordenadas);
    if (valores?.id) {
      await reordenarImagenesProductoAction(valores.id, reordenadas);
    }
  }

  return (
    <form action={guardarProducto} className="flex flex-col gap-8">
      {valores?.id ? <input type="hidden" name="id" value={valores.id} /> : null}
      <input type="hidden" name="nombreAnterior" value={valores?.nombre ?? ""} />
      <input type="hidden" name="slugAnterior" value={valores?.slug ?? ""} />
      <input type="hidden" name="imagenes" value={JSON.stringify(imagenes)} />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="nombre">
            Nombre *
          </label>
          <input id="nombre" name="nombre" required defaultValue={valores?.nombre} className={inputClass} />
        </div>

        <div>
          <label className={labelClass} htmlFor="club">
            Club / selección
          </label>
          <input id="club" name="club" defaultValue={valores?.club} className={inputClass} />
        </div>

        <div>
          <label className={labelClass} htmlFor="temporada">
            Temporada
          </label>
          <input id="temporada" name="temporada" defaultValue={valores?.temporada} className={inputClass} />
        </div>

        <div>
          <label className={labelClass} htmlFor="tipo">
            Tipo *
          </label>
          <select
            id="tipo"
            name="tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoProducto)}
            className={inputClass}
          >
            <option value="en-stock">En Stock</option>
            <option value="por-encargue">Por Encargue</option>
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="categoria">
            Categoría *
          </label>
          <select
            id="categoria"
            name="categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value as CategoriaId)}
            className={inputClass}
          >
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        {tipo === "en-stock" ? (
          <div>
            <label className={labelClass} htmlFor="precio">
              Precio (ARS) *
            </label>
            <input
              id="precio"
              name="precio"
              type="number"
              min={0}
              step={1}
              required
              defaultValue={valores?.precio}
              className={inputClass}
            />
          </div>
        ) : (
          <div className="text-body-small flex items-end rounded-md border border-dashed border-border-strong px-4 py-3 text-fg-muted">
            Por encargue: precio a coordinar por WhatsApp (RN-05), no se carga acá.
          </div>
        )}

        <div>
          <label className={labelClass} htmlFor="orden">
            Orden
          </label>
          <input
            id="orden"
            name="orden"
            type="number"
            defaultValue={valores?.orden ?? 0}
            className={inputClass}
          />
        </div>
      </section>

      <section>
        <p className={labelClass}>Talles ofrecidos ({categoriaActual?.nombre ?? categoria})</p>
        <div className="mt-2 flex flex-wrap gap-4">
          {(categoriaActual?.tallesDisponibles ?? []).map((talle) => (
            <label key={talle} className="text-body-small flex items-center gap-2 text-fg">
              <input
                type="checkbox"
                name={`talle_${talle}`}
                defaultChecked={disponiblesPorTalle.get(talle) ?? true}
              />
              {talle}
            </label>
          ))}
        </div>
      </section>

      <section>
        <label className={labelClass} htmlFor="descripcion">
          Descripción
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          rows={3}
          defaultValue={valores?.descripcion}
          className={inputClass}
        />
      </section>

      <section>
        <p className={labelClass}>Imágenes</p>
        {imagenes.length > 1 ? (
          <p className="text-caption mt-1 text-fg-muted">Arrastrá las fotos para cambiar el orden en que se muestran.</p>
        ) : null}
        <div className="mt-2 flex flex-wrap gap-3">
          <DndContext
            id="producto-imagenes-dnd"
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEndImagenes}
          >
            <SortableContext items={imagenes} strategy={rectSortingStrategy}>
              {imagenes.map((img) => (
                <SortableThumb key={img} img={img} onQuitar={handleQuitarImagen} />
              ))}
            </SortableContext>
          </DndContext>
        </div>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFiles}
          disabled={subiendo}
          className="text-body-small mt-3 text-fg-secondary"
        />
        {subiendo ? <p className="text-caption mt-1 text-fg-muted">Subiendo...</p> : null}
        {errorSubida ? <p className="text-caption mt-1 text-error">{errorSubida}</p> : null}
      </section>

      <section className="flex flex-wrap gap-6">
        <label className="text-body-small flex items-center gap-2 text-fg">
          <input type="checkbox" name="destacado" defaultChecked={valores?.destacado ?? false} />
          Destacado (máx. 8 en Inicio — RN-02)
        </label>
        <label className="text-body-small flex items-center gap-2 text-fg">
          <input type="checkbox" name="activo" defaultChecked={valores?.activo ?? true} />
          Activo (visible en el sitio)
        </label>
      </section>

      <button type="submit" className="text-button self-start rounded-md bg-accent px-7 py-3 text-on-accent hover:bg-accent-light">
        Guardar producto
      </button>
    </form>
  );
}
