import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Section border={false}>
      <Container>
        <EmptyState
          title="Página no encontrada"
          description="La página que buscás no existe o fue movida."
          action={
            <div className="flex gap-3">
              <ButtonLink href="/">Ir a Inicio</ButtonLink>
              <ButtonLink href="/productos" variant="secondary">
                Ver productos
              </ButtonLink>
            </div>
          }
        />
      </Container>
    </Section>
  );
}
