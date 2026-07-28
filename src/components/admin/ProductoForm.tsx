"use client";

import { useState } from "react";
import Image from "next/image";
import { guardarProducto, subirImagen } from "@/app/admin/(protected)/productos/actions";
import type { Categoria, CategoriaId, TalleDisponibilidad, TipoProducto } from "@/types";

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

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSubiendo(true);
    setErrorSubida(null);
    const fd = new FormData();
    fd.set("file", file);
    const res = await subirImagen(fd);
    setSubiendo(false);
    e.target.value = "";
    if (res.error) {
      setErrorSubida(res.error);
      return;
    }
    if (res.path) setImagenes((prev) => [...prev, res.path!]);
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
        <div className="mt-2 flex flex-wrap gap-3">
          {imagenes.map((img) => (
            <div key={img} className="relative h-20 w-20 overflow-hidden rounded-md bg-surface">
              <Image src={img} alt="" fill sizes="80px" className="object-contain p-1" />
              <button
                type="button"
                onClick={() => setImagenes((prev) => prev.filter((i) => i !== img))}
                aria-label="Quitar imagen"
                className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center bg-error text-fg text-xs"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <input type="file" accept="image/*" onChange={handleFile} disabled={subiendo} className="text-body-small mt-3 text-fg-secondary" />
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
