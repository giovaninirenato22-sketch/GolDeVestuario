import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Accordion } from "@/components/ui/Accordion";
import { PendingNotice } from "@/components/ui/PendingNotice";
import { SizeGuideTabs } from "@/components/producto/SizeGuideTabs";
import { CareGuide } from "@/components/producto/CareGuide";
import { ContactCard } from "@/components/contenido/ContactCard";
import { getCategorias } from "@/data/categorias";
import { SITE_URL } from "@/data/site";
import { CUIDADOS_DEFAULT_URL } from "@/data/media";

export const metadata: Metadata = {
  title: "Soporte",
  description: "Preguntas frecuentes, guía de talles y cuidados de la camiseta.",
  alternates: { canonical: `${SITE_URL}/soporte` },
};

const FAQ = [
  {
    question: "¿Cómo compro?",
    answer: "Armás tu pedido en el carrito y se envía un resumen por WhatsApp para coordinar el pago y la entrega.",
  },
  {
    question: "¿Qué medios de pago hay y hay descuento?",
    answer: "Pagando en efectivo o por transferencia tenés 15% OFF. El descuento se calcula automáticamente en el carrito al elegir el medio de pago.",
  },
  {
    question: "¿Qué significa \"Por Encargue\"?",
    answer: "Son camisetas que no tenemos en stock inmediato: elegís el talle y coordinamos el precio y los tiempos de entrega por WhatsApp.",
  },
  {
    question: "¿Cómo sé qué talle soy?",
    answer: "Cada categoría (Fan, Player, Retro) tiene su propia guía de talles con medidas. La encontrás en la ficha de cada producto y más abajo en esta página.",
  },
  {
    question: "¿Cómo cuido la camiseta?",
    answer: "Lavar a mano en agua fría con jabón blanco, sin lavarropas ni planchado, y sin secar al sol. Más detalle en la sección de cuidados de esta página.",
  },
  {
    question: "¿No encontrás tu camiseta?",
    answer: "Tenemos un catálogo más amplio del que está publicado. Escribinos por WhatsApp y te mostramos todas las opciones disponibles.",
  },
];

export default async function SoportePage() {
  const categorias = await getCategorias();

  return (
    <>
      <Section>
        <Container className="max-w-3xl">
          <SectionHeader eyebrow="Soporte" title="Preguntas frecuentes" />
          <Accordion items={FAQ} />
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeader eyebrow="Ayuda" title="Guía de talles" description="Elegí la versión de tu camiseta para ver las medidas." />
          <SizeGuideTabs categorias={categorias} />
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeader eyebrow="Ayuda" title="Cuidá tu camiseta" />
          <CareGuide cuidadosSrc={CUIDADOS_DEFAULT_URL} />
        </Container>
      </Section>

      <Section>
        <Container className="max-w-2xl">
          <PendingNotice>
            Políticas de envío, plazos, cambios y devoluciones: todavía no fueron definidas por
            el negocio. Consultalas directamente por WhatsApp antes de confirmar tu pedido.
          </PendingNotice>
        </Container>
      </Section>

      <Section border={false}>
        <Container className="max-w-md">
          <ContactCard />
        </Container>
      </Section>
    </>
  );
}
