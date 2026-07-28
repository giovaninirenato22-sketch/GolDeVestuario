import type { Metadata } from "next";
import { login } from "./actions";

export const metadata: Metadata = {
  title: "Admin — Iniciar sesión",
  robots: { index: false, follow: false },
};

interface SearchParams {
  error?: string;
  from?: string;
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { error, from } = await searchParams;

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6">
      <form action={login} className="w-full max-w-sm rounded-lg bg-surface p-8">
        <p className="text-eyebrow text-accent">Gol de Vestuario</p>
        <h1 className="text-h2 text-fg mt-2">Panel de administración</h1>

        {error ? (
          <p className="text-body-small mt-4 rounded-md border border-error bg-error/10 px-4 py-3 text-fg">
            Contraseña incorrecta.
          </p>
        ) : null}

        <input type="hidden" name="from" value={from ?? "/admin/productos"} />

        <label className="text-body-small mt-6 block text-fg-secondary" htmlFor="password">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          className="text-body-small mt-2 w-full rounded-md border border-border-strong bg-surface-alt px-4 py-3 text-fg outline-none focus:border-accent"
        />

        <button
          type="submit"
          className="text-button mt-6 w-full rounded-md bg-accent px-7 py-3 text-on-accent hover:bg-accent-light"
        >
          Ingresar
        </button>
      </form>
    </div>
  );
}
