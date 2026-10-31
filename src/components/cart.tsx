"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type CartLine = { kind: "menu" | "combo"; id: string; qty: number };

type CartCtx = {
  lines: CartLine[];
  count: number;
  ready: boolean;
  add: (kind: CartLine["kind"], id: string) => void;
  setQty: (kind: CartLine["kind"], id: string, qty: number) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "lua-hong-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartLine[];
        if (Array.isArray(parsed)) setLines(parsed.filter((l) => l && l.id && l.qty > 0));
      }
    } catch {
      /* bỏ qua: trình duyệt chặn localStorage */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {
      /* bỏ qua */
    }
  }, [lines, ready]);

  const add = useCallback((kind: CartLine["kind"], id: string) => {
    setLines((cur) => {
      const found = cur.find((l) => l.kind === kind && l.id === id);
      if (found) return cur.map((l) => (l === found ? { ...l, qty: Math.min(l.qty + 1, 50) } : l));
      return [...cur, { kind, id, qty: 1 }];
    });
  }, []);

  const setQty = useCallback((kind: CartLine["kind"], id: string, qty: number) => {
    setLines((cur) =>
      qty <= 0
        ? cur.filter((l) => !(l.kind === kind && l.id === id))
        : cur.map((l) => (l.kind === kind && l.id === id ? { ...l, qty: Math.min(qty, 50) } : l)),
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo(
    () => ({ lines, count: lines.reduce((s, l) => s + l.qty, 0), ready, add, setQty, clear }),
    [lines, ready, add, setQty, clear],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart(): CartCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart phải nằm trong CartProvider");
  return c;
}
