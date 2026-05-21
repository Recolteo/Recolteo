"use client";

import { createContext, useCallback, useContext, useSyncExternalStore } from "react";
import { type Lot } from "@/src/components/ui/cards/LotCard";

type CartContextType = {
  items: Lot[];
  addToCart: (lot: Lot) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
});

const STORAGE_KEY = "recolteo_cart";
const subscribers = new Set<() => void>();

function subscribe(callback: () => void) {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
}

function notify() {
  subscribers.forEach((fn) => fn());
}

let _cachedJson: string | null = null;
let _cachedItems: Lot[] = [];

function readItems(): Lot[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === _cachedJson) return _cachedItems;
    _cachedJson = stored;
    _cachedItems = stored ? (JSON.parse(stored) as Lot[]) : [];
    return _cachedItems;
  } catch {
    return _cachedItems;
  }
}

function writeItems(items: Lot[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  notify();
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(subscribe, readItems, () => _cachedItems);

  const addToCart = useCallback((lot: Lot) => {
    const current = readItems();
    if (!current.some((i) => i.id_lot === lot.id_lot)) {
      writeItems([...current, lot]);
    }
  }, []);

  const removeFromCart = useCallback((id: number) => {
    writeItems(readItems().filter((i) => i.id_lot !== id));
  }, []);

  const clearCart = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    notify();
  }, []);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
