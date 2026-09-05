export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  bgColor: string;
  image: string;
  badge?: string;
}

export const HERO_BANNERS: Banner[] = [
  {
    id: "b-1",
    title: "LỄ HỘI TÃ SỮA CHÍNH HÃNG",
    subtitle: "Giảm tới 45% + Tặng ngay xe đẩy em bé cao cấp cho đơn từ 2.990k",
    ctaText: "Mua Ngay Hôm Nay",
    ctaLink: "/category/ta-bim",
    bgColor: "from-rose-500 to-pink-600",
    image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80",
    badge: "SUPER SALE 9.9",
  },
  {
    id: "b-2",
    title: "THỜI TRANG SƠ SINH ORGANIC",
    subtitle: "100% Cotton hữu cơ mềm mại cho làn da bé yêu. Đồng giá từ 49K",
    ctaText: "Khám Phá BST",
    ctaLink: "/category/thoi-trang-tre-em",
    bgColor: "from-amber-500 to-orange-500",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
    badge: "BỘ BST MỚI",
  },
  {
    id: "b-3",
    title: "COMBO MẸ BẦU ĐI SINH TRỌN GÓI",
    subtitle: "Tiết kiệm 30% thời gian & chi phí. Đầy đủ vật dụng từ A - Z",
    ctaText: "Xem Chi Tiết Combo",
    ctaLink: "/category/cham-soc-me-bau",
    bgColor: "from-pink-500 to-rose-400",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
    badge: "BESTSELLER 2026",
  },
];
