import { StaggerGroup, StaggerItem } from "@/components/ui/Reveal";

const STATS = [
  { label: "Calidad", sub: "Materiales premium" },
  { label: "Comunidad", sub: "Hecho por hinchas" },
  { label: "Estilo", sub: "Diseño de vestuario" },
];

export function StatRow() {
  return (
    <StaggerGroup className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-border border-y border-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
      {STATS.map((stat, index) => (
        <StaggerItem key={stat.label} index={index} className="px-6 py-8 text-center">
          <p className="text-stat-label text-accent-light">{stat.label}</p>
          <p className="text-caption mt-1 text-fg-secondary">{stat.sub}</p>
        </StaggerItem>
      ))}
    </StaggerGroup>
  );
}
