import Image from "next/image";
import { Tabs } from "@/components/ui/Tabs";
import type { Categoria } from "@/types";

export function SizeGuideTabs({ categorias }: { categorias: Categoria[] }) {
  const items = categorias.map((cat) => ({
    id: cat.id,
    label: cat.nombre,
    content: (
      <div className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-lg">
        <Image
          src={cat.guiaTalles}
          alt={`Guía de talles ${cat.nombre}: medidas por talle`}
          fill
          sizes="(min-width: 640px) 384px, 100vw"
          className="object-contain"
        />
      </div>
    ),
  }));

  return <Tabs items={items} />;
}
