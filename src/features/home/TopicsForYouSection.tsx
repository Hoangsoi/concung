"use client";

import React, { useState } from "react";
import hotSaleProducts from "@/data/hot-sale-products.json";
import { ForYouProducts } from "./ForYouProducts";
import topics from "@/data/topics-reference.json";
import styles from "./TopicsForYouSection.module.css";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";

export interface TopicPill {
  id: string;
  title: string;
  subtitle?: string;
  bgGradient: string;
  borderColor: string;
  textColor: string;
  iconPath: string;
  href: string;
}

const TOPIC_PILLS: TopicPill[] = [
  {
    id: "me-mang-thai",
    title: "Mẹ",
    subtitle: "mang thai",
    bgGradient: "from-[#FFFBF0] to-[#FFF6DC]",
    borderColor: "border-[#FFE599]",
    textColor: "text-[#5C4000]",
    iconPath: "/images/chu-de/icon_me_mang_thai.png",
    href: "/topic/me-mang-thai",
  },
  {
    id: "lay-lai-voc-dang",
    title: "Lấy lại",
    subtitle: "vóc dáng",
    bgGradient: "from-[#FFF0F5] to-[#FFE4E1]",
    borderColor: "border-[#FFC0CB]",
    textColor: "text-[#8B008B]",
    iconPath: "/images/chu-de/icon_lay_lai_voc_dang.png",
    href: "/topic/lay-lai-voc-dang",
  },
  {
    id: "benh-vien-phong-kham",
    title: "Bệnh viện &",
    subtitle: "Phòng khám",
    bgGradient: "from-[#F8F9FE] to-[#EEF2FF]",
    borderColor: "border-[#E0E7FF]",
    textColor: "text-[#3730A3]",
    iconPath: "/images/chu-de/icon_benh_vien.png",
    href: "/topic/benh-vien-phong-kham",
  },
  {
    id: "tuan-thu-3",
    title: "Tuần",
    subtitle: "thứ 3",
    bgGradient: "from-[#F2FBF7] to-[#E6F7F0]",
    borderColor: "border-[#C6F6D5]",
    textColor: "text-[#22543D]",
    iconPath: "/images/chu-de/icon_tuan_3.png",
    href: "/topic/tuan-thu-3",
  },
  {
    id: "nha-tre-mau-giao",
    title: "Nhà trẻ &",
    subtitle: "Mẫu giáo",
    bgGradient: "from-[#FFF0F3] to-[#FFE3E8]",
    borderColor: "border-[#FFCCD5]",
    textColor: "text-[#9F1239]",
    iconPath: "/images/chu-de/icon_nha_tre.png",
    href: "/topic/nha-tre-mau-giao",
  },
  {
    id: "9-thang-10-ngay",
    title: "9 tháng",
    subtitle: "10 ngày",
    bgGradient: "from-[#FFFDF0] to-[#FFF9D6]",
    borderColor: "border-[#FEFCBF]",
    textColor: "text-[#744210]",
    iconPath: "/images/chu-de/icon_9_thang.png",
    href: "/topic/9-thang-10-ngay",
  },
  {
    id: "tuan-thu-5",
    title: "Tuần",
    subtitle: "thứ 5",
    bgGradient: "from-[#F0F9FF] to-[#E0F2FE]",
    borderColor: "border-[#BAE6FD]",
    textColor: "text-[#0369A1]",
    iconPath: "/images/chu-de/icon_tuan_5.png",
    href: "/topic/tuan-thu-5",
  },
  {
    id: "cham-me-sau-sinh",
    title: "Chăm mẹ",
    subtitle: "sau sinh",
    bgGradient: "from-[#FFF0F5] to-[#FFE4E8]",
    borderColor: "border-[#FECDD3]",
    textColor: "text-[#9F1239]",
    iconPath: "/images/chu-de/icon_cham_me.png",
    href: "/topic/cham-me-sau-sinh",
  },
  {
    id: "tuan-thu-1",
    title: "Tuần",
    subtitle: "thứ 1",
    bgGradient: "from-[#FFFDF0] to-[#FFF9D6]",
    borderColor: "border-[#FEFCBF]",
    textColor: "text-[#744210]",
    iconPath: "/images/chu-de/icon_tuan_1.png",
    href: "/topic/tuan-thu-1",
  },
  {
    id: "tuan-thu-2",
    title: "Tuần",
    subtitle: "thứ 2",
    bgGradient: "from-[#F0F9FF] to-[#E0F2FE]",
    borderColor: "border-[#BAE6FD]",
    textColor: "text-[#0369A1]",
    iconPath: "/images/chu-de/icon_tuan_2.png",
    href: "/topic/tuan-thu-2",
  },
  {
    id: "con-1-2-tuoi",
    title: "Con",
    subtitle: "1-2 tuổi",
    bgGradient: "from-[#FFF0F3] to-[#FFE3E8]",
    borderColor: "border-[#FFCCD5]",
    textColor: "text-[#9F1239]",
    iconPath: "/images/chu-de/icon_con_1_2.png",
    href: "/topic/con-1-2-tuoi",
  },
  {
    id: "con-0-12-thang",
    title: "Con",
    subtitle: "0-12 tháng",
    bgGradient: "from-[#F2FBF7] to-[#E6F7F0]",
    borderColor: "border-[#C6F6D5]",
    textColor: "text-[#22543D]",
    iconPath: "/images/chu-de/icon_con_0_12.png",
    href: "/topic/con-0-12-thang",
  },
];

export interface FeatureFilterTab {
  id: string;
  label: string;
  iconPath: string;
}

const FEATURE_FILTER_TABS: FeatureFilterTab[] = [
  {
    id: "danh-cho-ban",
    label: "Dành Cho Bạn",
    iconPath: "/images/chu-de/filter_danh_cho_ban.png",
  },
  {
    id: "hot-sale-thang-9",
    label: "Hot Sale Tháng 9",
    iconPath: "/images/chu-de/filter_hot_sale.png",
  },
  {
    id: "sieu-toc-giao-1h",
    label: "Siêu Tốc Giao 1h",
    iconPath: "/images/chu-de/filter_giao_1h.png",
  },
  {
    id: "tat-ca-freeship",
    label: "Tất Cả Freeship",
    iconPath: "/images/chu-de/filter_freeship.png",
  },
  {
    id: "mua-la-co-qua",
    label: "Mua Là Có Quà",
    iconPath: "/images/chu-de/filter_co_qua.png",
  },
];

export interface TabProduct {
  id: string;
  brand: string;
  ageBadge?: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  rating: number;
  soldCount: string;
  giftBadge?: boolean;
  sizeBadge?: string;
  topBadgeText?: string;
  hasBlueBorder?: boolean;
  hasOrangeBorder?: boolean;
  href: string;
}

const TAB_PRODUCTS_MAP: Record<string, TabProduct[]> = {
  "danh-cho-ban": [
    {
      id: "p1",
      brand: "Animo",
      name: "Tã Quần Animo Siêu Mềm Thoáng (XXL, 50 miếng)",
      image: "/images/san-qua/animo_xl.png",
      price: 229000,
      rating: 4.9,
      soldCount: "Đã bán 200K+",
      hasBlueBorder: true,
      topBadgeText: "DEAL HỜI ĐÓN TRẮNG • MUA LÀ TẶNG",
      giftBadge: true,
      sizeBadge: "Tã quần XXL | 50",
      href: "/product/ta-quan-animo-xxl",
    },
    {
      id: "p2",
      brand: "Animo",
      name: "Tã Quần Animo Siêu Mềm Thoáng (XL, 50 miếng)",
      image: "/images/san-qua/animo_l.png",
      price: 229000,
      rating: 4.9,
      soldCount: "Đã bán 200K+",
      hasBlueBorder: true,
      topBadgeText: "DEAL HỜI ĐÓN TRẮNG • MUA LÀ TẶNG",
      giftBadge: true,
      sizeBadge: "Tã quần XL | 50",
      href: "/product/ta-quan-animo-xl",
    },
    {
      id: "p3",
      brand: "Smartbibi",
      name: "Siro bổ sung Kẽm và Vitamin C Smartbibi ZinC",
      image: "/images/ban-chay/prod_1.png",
      price: 275000,
      rating: 4.8,
      soldCount: "Đã bán 50K+",
      giftBadge: true,
      href: "/product/siro-smartbibi-zinc",
    },
    {
      id: "p4",
      brand: "Fitobimbi",
      name: "Thực phẩm bảo vệ sức khỏe FITOBIMBI APPETITO",
      image: "/images/ban-chay/prod_2.png",
      price: 340000,
      rating: 4.8,
      soldCount: "Đã bán 100K+",
      giftBadge: true,
      href: "/product/thuc-pham-fitobimbi-appetito",
    },
    {
      id: "p5",
      brand: "Fitobimbi",
      name: "Thực phẩm bảo vệ sức khỏe Fitobimbi Sonno",
      image: "/images/ban-chay/prod_3.png",
      price: 345000,
      rating: 4.9,
      soldCount: "Đã bán 50K+",
      href: "/product/thuc-pham-fitobimbi-sonno",
    },
    {
      id: "p6",
      brand: "Fitobimbi",
      name: "Thực phẩm bảo vệ sức khỏe FITOBIMBI OMEGA JUNIOR",
      image: "/images/ban-chay/prod_4.png",
      price: 390000,
      rating: 4.8,
      soldCount: "Đã bán 20K+",
      giftBadge: true,
      href: "/product/thuc-pham-fitobimbi-omega",
    },
    {
      id: "p7",
      brand: "Fitobimbi",
      name: "Thực phẩm bảo vệ sức khỏe FITOBIMBI FERRO C",
      image: "/images/ban-chay/prod_5.png",
      price: 335000,
      rating: 4.8,
      soldCount: "Đã bán 20K+",
      giftBadge: true,
      href: "/product/thuc-pham-fitobimbi-ferro",
    },
    {
      id: "p8",
      brand: "Smartbibi",
      name: "Thực phẩm bảo vệ sức khỏe Smartbibi Fesom",
      image: "/images/ban-chay/prod_1.png",
      price: 245000,
      rating: 4.8,
      soldCount: "Đã bán 500+",
      giftBadge: true,
      href: "/product/smartbibi-fesom",
    },
    {
      id: "p9",
      brand: "Takato",
      name: "Tã quần Takato siêu mềm mại (XL, 62 miếng)",
      image: "/images/deals/takato_hd.png",
      price: 319000,
      originalPrice: 345000,
      discountPercentage: 7.5,
      rating: 4.8,
      soldCount: "Đã bán 200K+",
      hasOrangeBorder: true,
      topBadgeText: "TÃ SỮA -30%",
      sizeBadge: "Tã quần XL | 62",
      href: "/product/ta-quan-takato-xl",
    },
    {
      id: "p10",
      brand: "Takato",
      name: "Tã quần Takato siêu mềm mại (XXL, 56 miếng)",
      image: "/images/deals/takato_hd.png",
      price: 319000,
      originalPrice: 345000,
      discountPercentage: 7.5,
      rating: 4.8,
      soldCount: "Đã bán 200K+",
      hasOrangeBorder: true,
      topBadgeText: "TÃ SỮA -30%",
      sizeBadge: "Tã quần XXL | 56",
      href: "/product/ta-quan-takato-xxl",
    },
  ],

  "hot-sale-thang-9": [
    {
      id: "hs-1",
      brand: "Moony",
      ageBadge: "9 - 14 tháng",
      name: "Tã quần Moony Natural Siêu Cao Cấp Size L 36 miếng",
      image: "/images/mua-nhanh/animo_car_seat.png",
      price: 385000,
      originalPrice: 450000,
      discountPercentage: 14,
      rating: 4.9,
      soldCount: "Đã bán 1420",
      href: "/product/moony-natural-l",
    },
    {
      id: "hs-2",
      brand: "Friso",
      ageBadge: "1 - 3 tuổi",
      name: "Sữa bột Friso Gold số 3 1400g (12 - 36 tháng)",
      image: "/images/deals/growplus_hd.png",
      price: 699000,
      originalPrice: 780000,
      discountPercentage: 10,
      rating: 4.8,
      soldCount: "Đã bán 2300",
      href: "/product/friso-gold-3",
    },
    {
      id: "hs-3",
      brand: "Baobaohao",
      ageBadge: "6 - 36 tháng",
      name: "Xe đẩy em bé hai chiều gấp gọn siêu nhẹ Baobaohao",
      image: "/images/mua-nhanh/animo_car_seat.png",
      price: 1250000,
      originalPrice: 1590000,
      discountPercentage: 21,
      rating: 4.7,
      soldCount: "Đã bán 680",
      href: "/product/xe-day-baobaohao",
    },
    {
      id: "hs-4",
      brand: "Ergobaby",
      ageBadge: "0 - 4 tuổi",
      name: "Địu em bé 4 tư thế Ergonomic Ergobaby Premium",
      image: "/images/mua-nhanh/animo_car_seat.png",
      price: 3490000,
      originalPrice: 4200000,
      discountPercentage: 17,
      rating: 5.0,
      soldCount: "Đã bán 310",
      href: "/product/diu-em-be-ergobaby",
    },
  ],

  "sieu-toc-giao-1h": [
    {
      id: "1h-1",
      brand: "Animo",
      name: "Khăn Ướt Dịu Nhẹ Animo không mùi (100 tờ)",
      image: "/images/ban-chay/prod_5.png",
      price: 35000,
      rating: 4.9,
      soldCount: "Đã bán 15K+",
      href: "/product/khan-uot-animo",
    },
    {
      id: "1h-2",
      brand: "Vinamilk",
      name: "Sữa tươi tiệt trùng Vinamilk 180ml - Lốc 4 hộp",
      image: "/images/deals/growplus_hd.png",
      price: 37000,
      rating: 4.9,
      soldCount: "Đã bán 40K+",
      href: "/product/vinamilk-180ml",
    },
    {
      id: "1h-3",
      brand: "Abbott Grow",
      name: "Sữa Abbott Grow Gold hương vani 110ml - Lốc 4 hộp",
      image: "/images/deals/growplus_hd.png",
      price: 55000,
      rating: 4.8,
      soldCount: "Đã bán 30K+",
      href: "/product/abbott-grow-110ml",
    },
    {
      id: "1h-4",
      brand: "GrowPLUS+",
      name: "Sữa GrowPLUS+ ít đường 110ml - Lốc 4 hộp",
      image: "/images/deals/growplus_hd.png",
      price: 36000,
      rating: 4.9,
      soldCount: "Đã bán 60K+",
      href: "/product/growplus-110ml",
    },
  ],

  "tat-ca-freeship": [
    {
      id: "fs-1",
      brand: "Aptamil",
      name: "Aptamil Profutura Cesarbiotik 1 800g (0-12 tháng)",
      image: "/images/deals/aptamil_hd.png",
      price: 764000,
      rating: 4.9,
      soldCount: "Đã bán 12K+",
      href: "/product/aptamil-profutura",
    },
    {
      id: "fs-2",
      brand: "Pediasure",
      name: "Thực phẩm dinh dưỡng Pediasure 1.6kg Hương Vani",
      image: "/images/deals/pediasure_hd.png",
      price: 1235000,
      rating: 4.9,
      soldCount: "Đã bán 25K+",
      href: "/product/pediasure-16kg",
    },
    {
      id: "fs-3",
      brand: "Meiji",
      name: "Sữa Meiji Infant Formula 800g (0-12 tháng)",
      image: "/images/deals/aptamil_hd.png",
      price: 575000,
      rating: 4.9,
      soldCount: "Đã bán 18K+",
      href: "/product/meiji-800g",
    },
    {
      id: "fs-4",
      brand: "Huggies",
      name: "Bỉm tã dán Huggies Nature Made Size M 64 miếng",
      image: "/images/deals/huggies_hd.png",
      price: 299000,
      rating: 4.8,
      soldCount: "Đã bán 35K+",
      href: "/product/huggies-nature-made",
    },
  ],

  "mua-la-co-qua": [
    {
      id: "g-1",
      brand: "Animo",
      name: "Tã Quần Animo Siêu Mềm Thoáng XXL 50 miếng + Tặng Khăn lau hạ sốt",
      image: "/images/san-qua/animo_xl.png",
      price: 229000,
      rating: 4.9,
      soldCount: "Đã bán 200K+",
      giftBadge: true,
      href: "/product/ta-quan-animo-xxl",
    },
    {
      id: "g-2",
      brand: "Smartbibi",
      name: "Siro bổ sung Kẽm Smartbibi ZinC + Tặng Khăn Muslin cao cấp",
      image: "/images/ban-chay/prod_1.png",
      price: 275000,
      rating: 4.8,
      soldCount: "Đã bán 50K+",
      giftBadge: true,
      href: "/product/siro-smartbibi-zinc",
    },
    {
      id: "g-3",
      brand: "LineaBon",
      name: "Thực phẩm bảo vệ sức khỏe LineaBon K2 + D3 + Tặng Móc khóa gấu",
      image: "/images/ban-chay/prod_4.png",
      price: 295000,
      rating: 4.9,
      soldCount: "Đã bán 30K+",
      giftBadge: true,
      href: "/product/lineabon-k2-d3",
    },
    {
      id: "g-4",
      brand: "Fitobimbi",
      name: "FITOBIMBI APPETITO 200ml + Tặng Đồ chơi thông minh",
      image: "/images/ban-chay/prod_2.png",
      price: 340000,
      rating: 4.8,
      soldCount: "Đã bán 100K+",
      giftBadge: true,
      href: "/product/fitobimbi-appetito",
    },
  ],
};

export function TopicsForYouSection() {
  const [activeTabId, setActiveTabId] = useState<string>("danh-cho-ban");

  const currentProducts = TAB_PRODUCTS_MAP[activeTabId] || TAB_PRODUCTS_MAP["danh-cho-ban"];

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  };

  return (
    <section className="w-full space-y-4 pt-1">
      <h2 className={styles.heading}>Chủ Đề Cho Bạn</h2>
      <div className={styles.topics}>
        {topics.map(topic => <a key={topic.href} href={topic.href} className={styles.pill} style={{ background: topic.background, borderColor: topic.border }}>
          <img src={topic.image} alt="" width={45} height={45} /><span>{topic.title}</span>
        </a>)}
      </div>
      <div className={styles.filters} aria-label="Lọc sản phẩm">
        {FEATURE_FILTER_TABS.map((tab, index) => <button type="button" key={tab.id} aria-pressed={activeTabId === tab.id} onClick={() => setActiveTabId(tab.id)} className={activeTabId === tab.id ? styles.active : ""}>
          <img src={`/images/chu-de/tab-${index}.png`} alt="" width={40} height={40} /><span>{tab.label}</span>
        </button>)}
      </div>
      {/* DYNAMIC PRODUCT GRID FOR ACTIVE TAB */}
      {activeTabId === "danh-cho-ban" ? <ForYouProducts /> : activeTabId === "hot-sale-thang-9" ? <ForYouProducts items={hotSaleProducts} /> : (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 pt-1">
        {currentProducts.map((product) => (
          <Link
            key={product.id}
            href={product.href}
            className={`w-full bg-white rounded-2xl p-3 flex flex-col justify-between group/product hover:-translate-y-0.5 transition-all shadow-xs h-full relative ${
              product.hasBlueBorder
                ? "border-2 border-[#1E88E5]"
                : product.hasOrangeBorder
                ? "border-2 border-[#FF5722]"
                : "border border-slate-100"
            }`}
          >
            {/* Top Promotional Header Badge */}
            {product.topBadgeText && (
              <div
                className={`absolute top-0 left-0 right-0 py-0.5 px-1 text-center text-[9px] sm:text-[10px] font-extrabold text-white uppercase rounded-t-[14px] z-10 ${
                  product.hasBlueBorder
                    ? "bg-[#1E88E5]"
                    : "bg-gradient-to-r from-red-600 to-orange-500"
                }`}
              >
                {product.topBadgeText}
              </div>
            )}

            <div className={`space-y-2 ${product.topBadgeText ? "pt-3" : ""}`}>
              {/* Product Image Showcase */}
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-white flex items-center justify-center">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={200}
                  height={150}
                  unoptimized
                  className="w-full h-full object-contain select-none rounded-xl"
                />

                {/* "Chính hãng" Badge */}
                <div className="absolute top-1 left-1 bg-emerald-50 border border-emerald-300 text-emerald-700 text-[8px] sm:text-[9px] font-extrabold px-1.5 py-0.2 rounded-full flex items-center gap-0.5 shadow-2xs">
                  <span>✓</span>
                  <span>Chính hãng</span>
                </div>

                {/* Gift Badge Overlay */}
                {product.giftBadge && (
                  <div className="absolute top-1 right-1 bg-[#F72585] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">
                    Tặng
                  </div>
                )}

                {/* Diaper Size / Age Badge Overlay */}
                {product.sizeBadge && (
                  <div className="absolute bottom-1 right-1 bg-[#00A859] text-white text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-md flex flex-col items-center leading-tight shadow-xs">
                    <span>{product.sizeBadge.split("|")[0]}</span>
                    <span className="text-[7px] font-medium">
                      {product.sizeBadge.split("|")[1]}
                    </span>
                  </div>
                )}
              </div>

              {/* Brand & Age Tag */}
              <div className="flex items-center justify-between gap-1 text-[10px] sm:text-[11px] text-slate-500 font-semibold">
                <span className="text-[#F72585] font-bold">{product.brand}</span>
                {product.ageBadge && (
                  <span className="bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded-md">
                    {product.ageBadge}
                  </span>
                )}
              </div>

              {/* Product Title */}
              <h3 className="text-[12px] sm:text-[13px] font-medium text-[#222222] leading-snug line-clamp-2 min-h-[34px] group-hover/product:text-[#F72585] transition-colors">
                {product.name}
              </h3>
            </div>

            {/* Price & Cart Actions */}
            <div className="space-y-1.5 mt-2.5">
              {/* Rating & Sold count */}
              <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500">
                <div className="flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-[#FFC107] text-[#FFC107]" />
                  <span className="font-bold text-slate-700">{product.rating}</span>
                </div>
                <span>{product.soldCount}</span>
              </div>

              {/* Price & Add to Cart Button Row */}
              <div className="flex items-center justify-between gap-1">
                <div>
                  <div className="text-[14px] sm:text-[16px] font-extrabold text-[#E53935] leading-none">
                    {formatPrice(product.price)}
                  </div>
                  {product.originalPrice && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-[10px] text-slate-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                      {product.discountPercentage && (
                        <span className="text-[9px] font-bold text-white bg-[#E53935] px-1 py-0.2 rounded-sm">
                          -{product.discountPercentage}%
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="bg-[#F72585] hover:bg-rose-600 text-white p-1.5 sm:px-2.5 sm:py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 shadow-xs transition-colors shrink-0"
                  aria-label="Thêm vào giỏ"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Thêm</span>
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
      )}
    </section>
  );
}



