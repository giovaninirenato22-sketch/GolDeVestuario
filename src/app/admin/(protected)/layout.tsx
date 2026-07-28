import Link from "next/link";
import { logout } from "../login/actions";
import { ToastProvider } from "@/components/ui/Toast";

export default function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className="flex min-h-screen flex-col">
        <header className="border-b border-border">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <Link href="/admin/productos" className="text-h2 text-fg text-lg">
              GOL <span className="text-accent">ADMIN</span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link href="/admin/productos" className="text-nav text-fg-secondary hover:text-fg">
                Productos
              </Link>
              <Link href="/admin/categorias" className="text-nav text-fg-secondary hover:text-fg">
                Categorías
              </Link>
              <Link href="/" target="_blank" className="text-nav text-fg-secondary hover:text-fg">
                Ver sitio
              </Link>
              <form action={logout}>
                <button type="submit" className="text-nav text-fg-secondary hover:text-fg">
                  Cerrar sesión
                </button>
              </form>
            </nav>
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">{children}</main>
      </div>
    </ToastProvider>
  );
}
