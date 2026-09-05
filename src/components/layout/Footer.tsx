import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
} from "lucide-react";
import {
  BRAND_NAME,
  BRAND_TAGLINE,
  HOTLINE_PURCHASE,
  HOTLINE_CUSTOMER_CARE,
} from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 text-sm">
      {/* 1. Value Proposition Banner */}
      <div className="border-b border-slate-800 bg-slate-950 py-6 px-4">
        <div className="max-w-container mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
          <div className="flex flex-col items-center gap-2 p-2">
            <div className="h-10 w-10 rounded-full bg-[#F52862]/10 text-[#F52862] flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white">100% Chính Hãng</h4>
            <p className="text-[11px] text-slate-400">Cam kết chất lượng chuẩn quốc tế</p>
          </div>

          <div className="flex flex-col items-center gap-2 p-2">
            <div className="h-10 w-10 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Truck className="h-5 w-5" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white">Giao Hàng 1 Giờ</h4>
            <p className="text-[11px] text-slate-400">Áp dụng nội thành Hà Nội & TP.HCM</p>
          </div>

          <div className="flex flex-col items-center gap-2 p-2">
            <div className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <RotateCcw className="h-5 w-5" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white">15 Ngày Đổi Trả</h4>
            <p className="text-[11px] text-slate-400">Đổi trả dễ dàng nếu có lỗi NSX</p>
          </div>

          <div className="flex flex-col items-center gap-2 p-2">
            <div className="h-10 w-10 rounded-full bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <Headphones className="h-5 w-5" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white">Hỗ Trợ 24/7</h4>
            <p className="text-[11px] text-slate-400">Tư vấn tận tâm, giải đáp siêu tốc</p>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Links */}
      <div className="max-w-container mx-auto px-4 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-12 w-48">
                <Image
                  src="/logo-concung.png"
                  alt="Con Cung Logo"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {BRAND_TAGLINE}. Hệ thống siêu thị Mẹ & Bé hàng đầu với hơn 1158 cửa hàng trên toàn quốc.
            </p>

            <div className="space-y-2 text-xs text-slate-400 pt-2">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#F52862] shrink-0" />
                Trụ sở: 66 Nguyễn Du, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#F52862] shrink-0" />
                Email: cskh@concung.com
              </p>
            </div>
          </div>

          {/* Hotlines Column */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Tổng đài hỗ trợ
            </h4>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 block">Gọi mua hàng (8h00 - 22h00)</span>
                <a
                  href={`tel:${HOTLINE_PURCHASE.replace(/\s+/g, "")}`}
                  className="text-base font-extrabold text-[#F52862] hover:underline"
                >
                  {HOTLINE_PURCHASE}
                </a>
              </div>
              <div>
                <span className="text-slate-400 block">Khiếu nại & Góp ý</span>
                <a
                  href={`tel:${HOTLINE_CUSTOMER_CARE.replace(/\s+/g, "")}`}
                  className="text-sm font-bold text-amber-400 hover:underline"
                >
                  {HOTLINE_CUSTOMER_CARE}
                </a>
              </div>
            </div>
          </div>

          {/* Customer Care Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Về {BRAND_NAME}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/stores" className="hover:text-white transition-colors">
                  Hệ thống 1158+ Cửa hàng
                </Link>
              </li>
              <li>
                <Link href="/category/ta-bim" className="hover:text-white transition-colors">
                  Chính sách giao hàng Siêu Tốc 1h
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-white transition-colors">
                  Chính sách đổi trả & bảo hành
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-white transition-colors">
                  Tích điểm thành viên Con Cung Club
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  Quản trị hệ thống (Admin)
                </Link>
              </li>
            </ul>
          </div>

          {/* Payment & App download */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Thanh toán & Giao hàng
            </h4>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded text-xs font-semibold">
                VNPAY-QR
              </span>
              <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded text-xs font-semibold">
                MoMo
              </span>
              <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded text-xs font-semibold">
                ZaloPay
              </span>
              <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded text-xs font-semibold">
                Visa / Master
              </span>
              <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded text-xs font-semibold">
                COD (Tiền mặt)
              </span>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 {BRAND_NAME} Corporation. Bản quyền thuộc về Con Cưng Vietnam.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Điều khoản dịch vụ</span>
            <span className="hover:text-slate-400 cursor-pointer">Bảo mật thông tin</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
