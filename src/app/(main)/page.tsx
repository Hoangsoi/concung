import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Flame,
  MapPin,
  ShieldCheck,
  HeartHandshake,
  Award,
} from "lucide-react";
import { HeroSlider } from "@/features/home/HeroSlider";
import { SidebarCategory } from "@/components/layout/SidebarCategory";
import { VoucherStrip } from "@/features/home/VoucherStrip";
import { UtilityServicesSection } from "@/features/home/UtilityServicesSection";
import { ExclusiveOnlineDealsSection } from "@/features/home/ExclusiveOnlineDealsSection";
import { SanQuaTaSuaSection } from "@/features/home/SanQuaTaSuaSection";
import { MuaNhanhGiamNgaySection } from "@/features/home/MuaNhanhGiamNgaySection";
import { BrandDealsSection } from "@/features/home/BrandDealsSection";
import { BestSellersSection } from "@/features/home/BestSellersSection";
import { PinkSection } from "@/features/home/PinkSection";
import { TopicsForYouSection } from "@/features/home/TopicsForYouSection";
import { CategoryCard } from "@/components/common/CategoryCard";
import { ProductCard } from "@/components/common/ProductCard";
import { MOCK_CATEGORIES } from "@/data/mockCategories";
import { MOCK_PRODUCTS } from "@/data/mockProducts";
import { Button } from "@/components/ui/button";
import { SidePromoBanner } from "@/components/common/SidePromoBanner";

export default function HomePage() {
  return (
    <div className="max-w-container mx-auto px-3 pt-2 pb-5 sm:pb-6 relative pointer-events-none select-none">
      {/* Floating Side Promotional Banner */}
      <SidePromoBanner />

      {/* Master 2-Column Grid Layout: Fixed Left 220px Column + Scrollable Right Column */}
      <div className="flex gap-4 items-start mt-2.5 relative">
        {/* LEFT FIXED COLUMN: Sidebar Category + Vertical Campaign Banner */}
        <div className="w-[220px] shrink-0 fixed top-[190px] z-30 hidden lg:block space-y-3">
          <SidebarCategory />

          {/* Left Vertical Campaign Banner Image */}
          <div className="relative w-full rounded-2xl overflow-hidden shadow-subtle border border-slate-100 hover:opacity-95 transition-opacity">
            <Link href="/category/sua-thuc-pham">
              <Image
                src="/sidebar-vertical-banner.png"
                alt="Khuyến mãi Sữa thùng 40% Freeship 2h"
                width={220}
                height={420}
                className="w-full h-auto object-cover rounded-2xl"
                priority
              />
            </Link>
          </div>
        </div>

        {/* RIGHT SCROLLABLE COLUMN: All page content sections (lg:ml-[236px] offset) */}
        <div className="flex-1 min-w-0 lg:ml-[236px] space-y-5 sm:space-y-6">
          <HeroSlider />
          <VoucherStrip />
          <UtilityServicesSection />
          <ExclusiveOnlineDealsSection />
          <SanQuaTaSuaSection />
          <MuaNhanhGiamNgaySection />
          <BrandDealsSection />
          <BestSellersSection />
          <PinkSection />
          <TopicsForYouSection />

          {/* Trust & Service Commitment Banner */}
          <section className="rounded-2xl bg-white border border-slate-100 p-5 sm:p-6 shadow-subtle grid grid-cols-1 md:grid-cols-3 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="flex flex-col items-center gap-2 pt-3 md:pt-0">
              <div className="h-11 w-11 rounded-2xl bg-rose-50 text-[#F52862] flex items-center justify-center">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Thương Hiệu Hàng Đầu</h3>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                Được kiểm định an toàn nghiêm ngặt, đảm bảo sức khỏe tối đa cho bé.
              </p>
            </div>

            <div className="flex flex-col items-center gap-2 pt-3 md:pt-0">
              <div className="h-11 w-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Hàng Chính Hãng 100%</h3>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                Nhập khẩu trực tiếp từ Nhật Bản, Hà Lan, Mỹ, Thụy Sĩ và các thương hiệu uy tín.
              </p>
            </div>

            <div className="flex flex-col items-center gap-2 pt-3 md:pt-0">
              <div className="h-11 w-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Tích Điểm BabyClub</h3>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                Tích điểm đổi quà siêu hấp dẫn cho mỗi hóa đơn mua sắm trực tuyến hoặc siêu thị.
              </p>
            </div>
          </section>

          {/* Store Locator Banner */}
          <section className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-brand-900 text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 bg-[#F52862]/20 border border-[#F52862]/30 text-rose-300 text-xs px-3 py-1 rounded-full font-bold">
                <MapPin className="h-3.5 w-3.5" />
                HỆ THỐNG TOÀN QUỐC
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Gần 150 Siêu Thị BabyMart Trên Toàn Quốc
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                Trải nghiệm mua sắm hiện đại, máy thử bỉm sữa và đội ngũ nhân viên tư vấn tận tâm.
              </p>
            </div>

            <Link href="/stores">
              <Button size="lg" className="bg-[#F52862] hover:bg-rose-600 text-white font-bold shrink-0 shadow-lg">
                <span>Tìm siêu thị gần bạn</span>
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
