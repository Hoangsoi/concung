import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartState } from "@/types/cart";
import { Product } from "@/types/product";

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product, quantity = 1, variantId?: string, variantName?: string, variantPrice?: number) => {
        const currentItems = get().items;
        const priceToUse = variantPrice ?? product.price;

        const existingIndex = currentItems.findIndex(
          (item) => item.product.id === product.id && item.selectedVariantId === variantId
        );

        if (existingIndex > -1) {
          const updatedItems = [...currentItems];
          updatedItems[existingIndex].quantity += quantity;
          set({ items: updatedItems });
        } else {
          set({
            items: [
              ...currentItems,
              {
                product,
                quantity,
                selectedVariantId: variantId,
                selectedVariantName: variantName,
                selectedPrice: priceToUse,
              },
            ],
          });
        }
      },

      removeItem: (productId: string, variantId?: string) => {
        set({
          items: get().items.filter(
            (item) => !(item.product.id === productId && item.selectedVariantId === variantId)
          ),
        });
      },

      updateQuantity: (productId: string, quantity: number, variantId?: string) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId);
          return;
        }

        const updatedItems = get().items.map((item) => {
          if (item.product.id === productId && item.selectedVariantId === variantId) {
            return { ...item, quantity };
          }
          return item;
        });

        set({ items: updatedItems });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.selectedPrice * item.quantity, 0);
      },
    }),
    {
      name: "babymart-cart-storage",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true, // Prevents SSR hydration mismatch in Next.js
    }
  )
);
