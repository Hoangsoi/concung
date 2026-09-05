export interface ProductVariant {
  id: string;
  name: string; // e.g. "Size S (4-8kg)" or "Vị Dâu 400g"
  price: number;
  originalPrice?: number;
  inStock: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  categorySlug: string;
  categoryName: string;
  brand: string;
  rating: number;
  reviewCount: number;
  soldCount: number;
  image: string;
  images: string[];
  description: string;
  specifications: Record<string, string>;
  isOfficial: boolean; // Hàng chính hãng 100%
  isHot?: boolean;
  isNew?: boolean;
  variants?: ProductVariant[];
  ageRange?: string; // e.g. "0 - 12 tháng"
  origin?: string; // e.g. "Nhật Bản", "Hà Lan", "Việt Nam"
}
