import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carrito",
  description: "Revisá tu pedido, elegí el medio de pago y finalizá por WhatsApp.",
  robots: { index: false, follow: true },
};

export default function CarritoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
