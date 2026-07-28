import Image from "next/image";

export function CareGuide({ cuidadosSrc }: { cuidadosSrc: string }) {
  return (
    <div className="mx-auto max-w-xs sm:max-w-sm">
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg">
        <Image
          src={cuidadosSrc}
          alt="Cuidá tu camiseta: lavar a mano en agua fría con jabón blanco, sin lavarropas, sin secar al sol y sin planchar."
          fill
          sizes="(min-width: 640px) 384px, 320px"
          className="object-cover"
        />
      </div>
    </div>
  );
}
