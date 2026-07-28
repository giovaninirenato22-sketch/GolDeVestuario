"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import type { Categoria, ItemCarrito, MedioDePago, Producto, Talle } from "@/types";

const STORAGE_KEY = "gdv:carrito:v1";

interface EstadoCarrito {
  items: ItemCarrito[];
  medioDePago: MedioDePago;
  hidratado: boolean;
}

type Accion =
  | { type: "AGREGAR"; productoId: string; talle: Talle; cantidad: number }
  | { type: "ACTUALIZAR_CANTIDAD"; productoId: string; talle: Talle; cantidad: number }
  | { type: "QUITAR"; productoId: string; talle: Talle }
  | { type: "SET_MEDIO_PAGO"; medio: MedioDePago }
  | { type: "VACIAR" }
  | { type: "HIDRATAR"; items: ItemCarrito[]; medioDePago: MedioDePago };

function reducer(estado: EstadoCarrito, accion: Accion): EstadoCarrito {
  switch (accion.type) {
    case "HIDRATAR":
      return { items: accion.items, medioDePago: accion.medioDePago, hidratado: true };

    case "AGREGAR": {
      const existente = estado.items.find(
        (i) => i.productoId === accion.productoId && i.talle === accion.talle,
      );
      const items = existente
        ? estado.items.map((i) =>
            i === existente ? { ...i, cantidad: i.cantidad + accion.cantidad } : i,
          )
        : [...estado.items, { productoId: accion.productoId, talle: accion.talle, cantidad: accion.cantidad }];
      return { ...estado, items };
    }

    case "ACTUALIZAR_CANTIDAD": {
      const cantidad = Math.max(1, accion.cantidad);
      return {
        ...estado,
        items: estado.items.map((i) =>
          i.productoId === accion.productoId && i.talle === accion.talle ? { ...i, cantidad } : i,
        ),
      };
    }

    case "QUITAR":
      return {
        ...estado,
        items: estado.items.filter(
          (i) => !(i.productoId === accion.productoId && i.talle === accion.talle),
        ),
      };

    case "SET_MEDIO_PAGO":
      return { ...estado, medioDePago: accion.medio };

    case "VACIAR":
      return { ...estado, items: [] };

    default:
      return estado;
  }
}

interface CartContextValue {
  items: ItemCarrito[];
  medioDePago: MedioDePago;
  hidratado: boolean;
  cantidadTotal: number;
  productos: Producto[];
  productosCargados: boolean;
  categorias: Categoria[];
  agregarItem: (productoId: string, talle: Talle, cantidad?: number) => void;
  actualizarCantidad: (productoId: string, talle: Talle, cantidad: number) => void;
  quitarItem: (productoId: string, talle: Talle) => void;
  setMedioDePago: (medio: MedioDePago) => void;
  vaciarCarrito: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [estado, dispatch] = useReducer(reducer, {
    items: [],
    medioDePago: "otro",
    hidratado: false,
  });
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productosCargados, setProductosCargados] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  // Prisma no corre en el navegador: el catálogo se trae por API una sola
  // vez y se usa tanto para hidratar el carrito (descartando ítems
  // huérfanos, R-18) como para calcular precios en /carrito.
  useEffect(() => {
    let cancelado = false;

    async function cargar() {
      let catalogo: Producto[] = [];
      try {
        const [resProductos, resCategorias] = await Promise.all([
          fetch("/api/productos"),
          fetch("/api/categorias"),
        ]);
        if (resProductos.ok) catalogo = await resProductos.json();
        if (resCategorias.ok && !cancelado) setCategorias(await resCategorias.json());
      } catch {
        // Sin conexión al catálogo: se hidrata sin podar huérfanos en vez
        // de bloquear el carrito indefinidamente.
      }
      if (cancelado) return;
      setProductos(catalogo);
      setProductosCargados(true);

      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) {
          dispatch({ type: "HIDRATAR", items: [], medioDePago: "otro" });
          return;
        }
        const parsed = JSON.parse(raw) as { items: ItemCarrito[]; medioDePago: MedioDePago };
        const items =
          catalogo.length > 0
            ? (parsed.items ?? []).filter((i) => catalogo.some((p) => p.id === i.productoId))
            : (parsed.items ?? []);
        dispatch({ type: "HIDRATAR", items, medioDePago: parsed.medioDePago ?? "otro" });
      } catch {
        dispatch({ type: "HIDRATAR", items: [], medioDePago: "otro" });
      }
    }

    cargar();
    return () => {
      cancelado = true;
    };
  }, []);

  useEffect(() => {
    if (!estado.hidratado) return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ items: estado.items, medioDePago: estado.medioDePago }),
    );
  }, [estado.items, estado.medioDePago, estado.hidratado]);

  const value = useMemo<CartContextValue>(
    () => ({
      items: estado.items,
      medioDePago: estado.medioDePago,
      hidratado: estado.hidratado,
      cantidadTotal: estado.items.reduce((acc, i) => acc + i.cantidad, 0),
      productos,
      productosCargados,
      categorias,
      agregarItem: (productoId, talle, cantidad = 1) =>
        dispatch({ type: "AGREGAR", productoId, talle, cantidad }),
      actualizarCantidad: (productoId, talle, cantidad) =>
        dispatch({ type: "ACTUALIZAR_CANTIDAD", productoId, talle, cantidad }),
      quitarItem: (productoId, talle) => dispatch({ type: "QUITAR", productoId, talle }),
      setMedioDePago: (medio) => dispatch({ type: "SET_MEDIO_PAGO", medio }),
      vaciarCarrito: () => dispatch({ type: "VACIAR" }),
    }),
    [estado, productos, productosCargados, categorias],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
