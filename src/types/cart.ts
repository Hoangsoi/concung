import { Product } from "./product";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariantId?: string;
  selectedVariantName?: string;
  selectedPrice: number;
}

export interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, variantId?: string, variantName?: string, variantPrice?: number) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}
