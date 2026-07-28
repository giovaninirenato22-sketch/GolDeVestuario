import type { Metadata } from "next";
import { CategoriaForm } from "@/components/admin/CategoriaForm";
import { ErrorBanner } from "@/components/admin/ErrorBanner";

export const metadata: Metadata = {
  title: "Admin — Nueva categoría",
  robots: { index: false, follow: false },
};

export default async function NuevaCategoriaPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div>
      <h1 className="text-h1 text-fg mb-8">Nueva categoría</h1>
      <ErrorBanner mensaje={error} />
      <CategoriaForm />
    </div>
  );
}
