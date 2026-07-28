"use client";

import { useState } from "react";
import Image from "next/image";
import { Modal } from "@/components/ui/Modal";
import type { Categoria } from "@/types";

export function SizeGuideModal({ categoria: info }: { categoria: Categoria }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-body-small text-fg-secondary underline decoration-border-strong underline-offset-4 hover:text-fg"
      >
        Ver guía de talles ({info.nombre})
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title={`Guía de talles — ${info.nombre}`}>
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md">
          <Image
            src={info.guiaTalles}
            alt={`Guía de talles ${info.nombre}: medidas por talle`}
            fill
            sizes="(min-width: 640px) 512px, 100vw"
            className="object-contain"
          />
        </div>
      </Modal>
    </>
  );
}
