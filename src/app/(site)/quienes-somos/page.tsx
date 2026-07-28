import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatRow } from "@/components/contenido/StatRow";
import { CTABanner } from "@/components/contenido/CTABanner";
import { PendingNotice } from "@/components/ui/PendingNotice";
import { SITE_URL } from "@/data/site";

export const metadata: Metadata = {
  title: "Quiénes somos",
  description: "Gol de Vestuario: indumentaria y cultura futbolera argentina.",
  alternates: { canonical: `${SITE_URL}/quienes-somos` },
};

export default function QuienesSomosPage() {
  return (
    <>
      <Section>
        <Container className="max-w-3xl text-center">
          <SectionHeader eyebrow="Quiénes somos" title="El vestuario donde nace el gol" align="center" />
          <p className="text-body text-fg-secondary">
            Gol de Vestuario es indumentaria y cultura futbolera argentina, construida alrededor
            del vestuario: el lugar donde realmente se gana el partido. Preparación, ritual,
            hermandad.
          </p>
        </Container>
      </Section>

      <StatRow />

      <Section>
        <Container className="max-w-2xl">
          <PendingNotice>
            La historia completa de la marca, el equipo y los datos de contacto formales todavía
            no fueron definidos por el negocio. Mientras tanto, cualquier consulta se responde
            directamente por WhatsApp.
          </PendingNotice>
        </Container>
      </Section>

      <Section border={false}>
        <CTABanner />
      </Section>
    </>
  );
}
