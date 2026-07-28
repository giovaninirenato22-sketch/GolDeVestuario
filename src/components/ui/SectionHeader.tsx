import { Reveal } from "./Reveal";

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <Reveal className={`mb-8 ${align === "center" ? "text-center" : ""}`}>
      {eyebrow ? <p className="text-eyebrow mb-3 text-accent">{eyebrow}</p> : null}
      <h2 className="text-h2 text-fg">{title}</h2>
      {description ? (
        <p className={`text-body mt-3 max-w-2xl text-fg-secondary ${align === "center" ? "mx-auto" : ""}`}>
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
