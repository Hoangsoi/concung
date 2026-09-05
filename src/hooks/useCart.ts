"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";

export function useCart() {
  const [isHydrated, setIsHydrated] = useState(false);
  const cartStore = useCartStore();

  useEffect(() => {
    useCartStore.persist.rehydrate();
    setIsHydrated(true);
  }, []);

  return {
    items: isHydrated ? cartStore.items : [],
    addItem: cartStore.addItem,
    removeItem: cartStore.removeItem,
    updateQuantity: cartStore.updateQuantity,
    clearCart: cartStore.clearCart,
    totalItems: isHydrated ? cartStore.getTotalItems() : 0,
    totalPrice: isHydrated ? cartStore.getTotalPrice() : 0,
    isHydrated,
  };
}
