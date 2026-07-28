"use client";

import { useState } from "react";
import Image from "next/image";
import { guardarCategoriaAction, subirImagenCategoria } from "@/app/admin/(protected)/categorias/actions";
import { ORDEN_TALLES } from "@/lib/categorias/helpers";
import type { Talle } from "@/types";

export interface CategoriaFormValues {
  id?: string;
  nombre: string;
  guiaTalles: string;
  cuidados: string;
  tallesDisponibles: Talle[];
  orden: number;
}

const inputClass =
  "text-body-small mt-2 w-full rounded-md border border-border-strong bg-surface-alt px-4 py-3 text-fg outline-none focus:border-accent";
const labelClass = "text-body-small block text-fg-secondary";

function CampoImagen({
  label,
  name,
  valorInicial,
  ayuda,
}: {
  label: string;
  name: string;
  valorInicial?: string;
  ayuda?: string;
}) {
  const [imagen, setImagen] = useState(valorInicial ?? "");
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSubiendo(true);
    setError(null);
    const fd = new FormData();
    fd.set("file", file);
    const res = await subirImagenCategoria(fd);
    setSubiendo(false);
    e.target.value = "";
    if (res.error) {
      setError(res.error);
      return;
    }
    if (res.path) setImagen(res.path);
  }

  return (
    <div>
      <p className={labelClass}>{label}</p>
      {ayuda ? <p className="text-caption mt-1 text-fg-muted">{ayuda}</p> : null}
      <input type="hidden" name={name} value={imagen} />
      <div className="mt-2 flex items-center gap-3">
        {imagen ? (
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-surface">
            <Image src={imagen} alt="" fill sizes="80px" className="object-contain p-1" />
          </div>
        ) : null}
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            disabled={subiendo}
            className="text-body-small text-fg-secondary"
          />
          {subiendo ? <p className="text-caption mt-1 text-fg-muted">Subiendo...</p> : null}
          {error ? <p className="text-caption mt-1 text-error">{error}</p> : null}
        </div>
      </div>
    </div>
  );
}

export function CategoriaForm({ valores }: { valores?: CategoriaFormValues }) {
  const disponiblesPorTalle = new Set(valores?.tallesDisponibles ?? []);

  return (
    <form action={guardarCategoriaAction} className="flex flex-col gap-8">
      {valores?.id ? <input type="hidden" name="id" value={valores.id} /> : null}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="nombre">
            Nombre *
          </label>
          <input id="nombre" name="nombre" required defaultValue={valores?.nombre} className={inputClass} />
        </div>

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
        <p className={labelClass}>Talles disponibles *</p>
        <div className="mt-2 flex flex-wrap gap-4">
          {ORDEN_TALLES.map((talle) => (
            <label key={talle} className="text-body-small flex items-center gap-2 text-fg">
              <input type="checkbox" name={`talle_${talle}`} defaultChecked={disponiblesPorTalle.has(talle)} />
              {talle}
            </label>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <CampoImagen
          label="Guía de talles *"
          name="guiaTalles"
          valorInicial={valores?.guiaTalles}
          ayuda="Foto con las medidas por talle (RN-06)."
        />
        <CampoImagen
          label="Cuidados"
          name="cuidados"
          valorInicial={valores?.cuidados}
          ayuda="Opcional: si no subís nada se usa la imagen de cuidados genérica del sitio."
        />
      </section>

      <button type="submit" className="text-button self-start rounded-md bg-accent px-7 py-3 text-on-accent hover:bg-accent-light">
        Guardar categoría
      </button>
    </form>
  );
}
