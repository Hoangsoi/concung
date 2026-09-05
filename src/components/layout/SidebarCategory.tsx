"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";
import { CategoryNavItem } from "@/lib/constants";

const SIDEBAR_ITEMS: CategoryNavItem[] = [
  {
    name: "Sữa bột cao cấp",
    href: "/category/sua-thuc-pham",
    slug: "sua-bot",
    hasMegaMenu: true,
    megaMenuData: {
      columns: [
        {
          title: "Loại Sữa Bột",
          items: [
            { name: "Sữa Mỹ", href: "/search?q=Sua+My" },
            { name: "Sữa Nhật", href: "/search?q=Sua+Nhat" },
            { name: "Sữa Úc", href: "/search?q=Sua+Uc" },
            { name: "Sữa Châu Âu", href: "/search?q=Chau+Au" },
          ],
        },
        {
          title: "Theo Độ Tuổi",
          items: [
            { name: "0 - 1 tuổi", href: "/category/sua-thuc-pham?age=0-1" },
            { name: "1 - 2 tuổi", href: "/category/sua-thuc-pham?age=1-2" },
            { name: "> 2 tuổi", href: "/category/sua-thuc-pham?age=2plus" },
            { name: "Sữa bầu", href: "/category/cham-soc-me-bau" },
          ],
        },
        {
          title: "Thương Hiệu Nổi Tiếng",
          items: [
            { name: "Friso Gold", href: "/search?q=Friso" },
            { name: "Aptamil Essensis", href: "/search?q=Aptamil" },
            { name: "Meiji", href: "/search?q=Meiji" },
            { name: "Enfamil & Similac", href: "/search?q=Enfa" },
          ],
        },
      ],
    },
  },
  {
    name: "Bỉm Tã khuyến mãi",
    href: "/category/ta-bim",
    slug: "ta-bim",
    hasMegaMenu: true,
    megaMenuData: {
      columns: [
        {
          title: "Loại Tã Bỉm",
          items: [
            { name: "Tã dán sơ sinh", href: "/category/ta-bim?type=dan" },
            { name: "Tã quần cao cấp", href: "/category/ta-bim?type=quan" },
            { name: "Khăn ướt em bé", href: "/category/ta-bim?type=khan-uot" },
          ],
        },
        {
          title: "Kích Thước Size Tã",
          items: [
            { name: "Size NewBorn (< 5kg)", href: "/category/ta-bim?size=nb" },
            { name: "Size S (4 - 8kg)", href: "/category/ta-bim?size=s" },
            { name: "Size M (6 - 11kg)", href: "/category/ta-bim?size=m" },
            { name: "Size L (9 - 14kg)", href: "/category/ta-bim?size=l" },
          ],
        },
        {
          title: "Thương Hiệu",
          items: [
            { name: "Moony Natural", href: "/search?q=Moony" },
            { name: "Huggies Platinum", href: "/search?q=Huggies" },
            { name: "Bobby Extra Soft", href: "/search?q=Bobby" },
            { name: "Merries Nhật", href: "/search?q=Merries" },
          ],
        },
      ],
    },
  },
  { name: "Sữa nước", href: "/category/sua-thuc-pham", slug: "sua-nuoc" },
  { name: "Ăn dặm, dinh dưỡng", href: "/category/sua-thuc-pham", slug: "an-dam" },
  { name: "Vitamin & sức khỏe", href: "/category/sua-thuc-pham", slug: "vitamin" },
  { name: "Chăm sóc da & Vệ sinh", href: "/category/cham-soc-me-bau", slug: "cham-soc-da" },
  { name: "Đồ dùng mẹ & bé", href: "/category/xe-day-diu", slug: "do-dung" },
  { name: "Ghế ngồi ô tô", href: "/category/xe-day-diu", slug: "ghe-o-to" },
  { name: "Thời trang & Phụ kiện", href: "/category/thoi-trang-tre-em", slug: "thoi-trang" },
  { name: "Đồ chơi, học tập", href: "/category/do-choi-hoc-tap", slug: "do-choi" },
  { name: "Ứng dụng Mẹ & Bé", href: "/", slug: "app-me-be" },
  { name: "Gói hội viên", href: "/account", slug: "hoi-vien" },
];

export function SidebarCategory() {
  const [activeCategory, setActiveCategory] = useState<CategoryNavItem | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (item: CategoryNavItem) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (item.hasMegaMenu && item.megaMenuData) {
      setActiveCategory(item);
    } else {
      setActiveCategory(null);
    }
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveCategory(null);
    }, 150);
  };

  return (
    <div
      className="w-full relative bg-white rounded-t-xl rounded-b-2xl border border-slate-100 shadow-subtle pt-0.5 pb-1 h-fit"
      onMouseLeave={handleMouseLeave}
    >
      <ul className="divide-y divide-slate-50 px-1">
        {SIDEBAR_ITEMS.map((item) => {
          const isHovered = activeCategory?.slug === item.slug;

          return (
            <li
              key={item.slug}
              onMouseEnter={() => handleMouseEnter(item)}
              className="relative"
            >
              <Link
                href={item.href}
                className={`flex items-center justify-between h-[34px] px-3 text-[13px] font-medium transition-all ${
                  isHovered
                    ? "bg-rose-50 text-[#F52862] font-bold rounded-lg"
                    : "text-slate-700 hover:bg-slate-50 hover:text-[#F52862]"
                }`}
              >
                <span className="truncate">{item.name}</span>
                <ChevronRight className="h-3.5 w-3.5 text-slate-300 shrink-0" />
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Flyout Submenu Panel directly to the right of the sidebar */}
      {activeCategory && activeCategory.megaMenuData && (
        <div
          className="absolute top-0 left-[225px] w-[740px] bg-white rounded-2xl border border-slate-100 shadow-2xl z-50 p-5 space-y-4 animate-in fade-in slide-in-from-left-2 duration-200"
          onMouseEnter={() => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
          }}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#F52862]" />
              <h3 className="text-sm font-bold text-slate-900 uppercase">
                {activeCategory.name}
              </h3>
            </div>
            <Link
              href={activeCategory.href}
              className="text-xs font-bold text-[#F52862] hover:underline flex items-center gap-1"
            >
              <span>Xem tất cả</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-1">
            {activeCategory.megaMenuData.columns.map((col, idx) => (
              <div key={idx} className="space-y-2">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider border-l-2 border-[#F52862] pl-2">
                  {col.title}
                </h4>
                <ul className="space-y-1 text-xs text-slate-600">
                  {col.items.map((sub, subIdx) => (
                    <li key={subIdx}>
                      <Link
                        href={sub.href}
                        className="hover:text-[#F52862] hover:font-bold transition-all block py-0.5"
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
