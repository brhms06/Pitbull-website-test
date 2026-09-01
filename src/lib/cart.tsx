'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { readStore, writeStore } from './localStorage-utils';

export interface CartItem {
  /** Unique line id: `${dogSlug}:${optionId}` (a dog+option is unique). */
  id: string;
  dogSlug: string;
  name: string;
  image: string;
  optionId: string;
  optionLabel: string;
  price: number;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  total: number;
  add: (item: CartItem) => void;
  remove: (id: string) => void;
  clear: () => void;
  has: (dogSlug: string) => boolean;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const CART_KEY = 'ilb:cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => readStore<CartItem[]>(CART_KEY, []));

  useEffect(() => {
    writeStore(CART_KEY, items);
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const add = (item: CartItem) =>
      setItems((prev) => {
        // A specific dog can only be in the cart once — replace if re-added.
        const withoutDog = prev.filter((i) => i.dogSlug !== item.dogSlug);
        return [...withoutDog, item];
      });
    const remove = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));
    const clear = () => setItems([]);
    const has = (dogSlug: string) => items.some((i) => i.dogSlug === dogSlug);
    return {
      items,
      count: items.length,
      total: items.reduce((sum, i) => sum + i.price, 0),
      add,
      remove,
      clear,
      has,
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

// --- Purchase option helpers ----------------------------------------------

export interface PurchaseOption {
  id: string;
  label: string;
  price: number;
  note?: string;
}

export const RESERVE_DEPOSIT = 300;
export const BREEDING_RIGHTS_ADDON = 800;
export const WARRANTY_ADDON = 400;

interface PricedDog {
  price: number;
  reservePrice?: number;
  breedingPrice?: number;
  warrantyPrice?: number;
}

/**
 * Build the purchase options for a dog. Uses the per-dog prices set in the
 * admin dashboard when provided (> 0), otherwise sensible defaults.
 */
export function buildPurchaseOptions(dog: PricedDog): PurchaseOption[] {
  const base = dog.price;
  const reserve = dog.reservePrice && dog.reservePrice > 0 ? dog.reservePrice : RESERVE_DEPOSIT;
  const breeding =
    dog.breedingPrice && dog.breedingPrice > 0 ? dog.breedingPrice : base + BREEDING_RIGHTS_ADDON;
  const warranty =
    dog.warrantyPrice && dog.warrantyPrice > 0 ? dog.warrantyPrice : base + WARRANTY_ADDON;
  return [
    { id: 'reserve', label: 'Reserve', price: reserve, note: 'deposit, rest on pickup' },
    { id: 'full', label: 'Full Payment', price: base },
    { id: 'breeding', label: 'Add breeding rights', price: breeding },
    { id: 'warranty', label: 'Extend health warranty 6 → 12 months', price: warranty },
  ];
}

export const formatPrice = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
