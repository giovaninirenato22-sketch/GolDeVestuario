import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloatButton } from "@/components/layout/WhatsAppFloatButton";
import { CartProvider } from "@/lib/carrito/CartContext";
import { ToastProvider } from "@/components/ui/Toast";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <ToastProvider>
        <Navbar />
        {/* pt-[73px] compensa la altura real del header (que ahora no ocupa
        espacio propio en el flujo, ver comentario en Navbar.tsx) para que el
        resto de las páginas no arranque tapado detrás de la barra. El Hero
        de Inicio cancela este padding con -mt-[73px] a propósito, para que
        el video se vea detrás del header transparente. */}
        <main className="flex-1 pt-[73px]">{children}</main>
        <Footer />
        <WhatsAppFloatButton />
      </ToastProvider>
    </CartProvider>
  );
}
