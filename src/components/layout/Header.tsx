"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingCart,
  Bell,
  Menu,
  X,
  MapPin,
  User,
  Wallet,
} from "lucide-react";
import { BRAND_NAME, MAIN_NAV_ITEMS } from "@/lib/constants";
import { useCart } from "@/hooks/useCart";
import { HeaderBanner } from "./HeaderBanner";
import { TopBar } from "./TopBar";
import { SearchBar } from "./SearchBar";
import styles from "./Header.module.css";

export function Header() {
  const { totalItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`${styles.header} w-full bg-white sticky top-0 z-50 transition-shadow ${isScrolled ? "shadow-md" : ""}`}>
      {/* 1. Topmost Campaign Banner Image */}
      <HeaderBanner />

      {/* 2. Top Utility Bar (#FFF4F7 Pinkish Bg) */}
      <TopBar />

      {/* 3. Main Header Bar - Reconstructing concung 1:1 exact layout */}
      <div className={styles.main}>
        <div className={styles.row}>
          {/* Left Area: Fixed 220px matching SidebarCategory width */}
          <div className={styles.logoArea}>
            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 md:hidden"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Con Cung Image Logo - Shifted right inside 220px sidebar column */}
            <Link href="/" className="flex items-center shrink-0 md:pointer-events-none md:cursor-default">
              <div className="relative h-[48px] w-[134px] hover:opacity-95 transition-opacity">
                <Image
                  src="/images/header/logo-concung.png"
                  alt="Con Cưng Logo"
                  fill
                  className="object-contain object-center md:object-right"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Search Bar - Starts right at the 220px boundary matching Abbott main banner */}
          <div className={`${styles.search} md:pointer-events-none`}>
            <SearchBar placeholder="Ba mẹ muốn tìm mua gì hôm nay ?" />
          </div>

          {/* Right Shortcuts: Giỏ hàng & Ưu đãi + Speech Bubble Badge */}
          <div className={styles.shortcuts}>
            {/* Giỏ hàng Shortcut */}
            <div
              className="flex flex-col items-center justify-center text-[#333333] transition-colors group relative md:pointer-events-none md:cursor-default"
            >
              <div className="relative">
                <img src="/images/header/cart-top.png" alt="" width={30} height={30} />
                <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF9500] text-[10px] font-bold text-white border border-white">
                  {totalItems}
                </span>
              </div>
              <span className="text-[14px] font-medium mt-0.5 text-[#777777]">Giỏ hàng</span>
            </div>

            {/* Ví Shortcut (ALLOWED) */}
            <Link
              href="/wallet"
              className="flex flex-col items-center justify-center text-[#333333] hover:text-[#ED1B68] transition-colors group relative cursor-pointer"
            >
              <div className="relative">
                <Wallet className="h-7 w-7 text-[#888888] stroke-[1.5] group-hover:text-[#ED1B68]" />
              </div>
              <span className="text-[14px] font-medium mt-0.5 text-[#777777]">Ví</span>
            </Link>

            {/* Ưu đãi Shortcut with Speech Bubble Badge */}
            <div
              className="flex items-center gap-2 group relative md:pointer-events-none md:cursor-default"
            >
              <div className="flex flex-col items-center justify-center text-[#333333] transition-colors">
                <div className="relative">
                  <Bell className="h-8 w-8 text-[#888888] stroke-[1.5]" />
                  <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF9500] text-[10px] font-bold text-white border border-white">
                    2
                  </span>
                </div>
                <span className="text-[14px] font-medium mt-0.5 text-[#777777]">Ưu đãi</span>
              </div>

              {/* Speech Bubble Badge with left pointing arrow */}
              <div className={`${styles.promo} hidden lg:block relative bg-[#FFF9EB] rounded-2xl px-3 py-2 text-left shadow-2xs ml-1`}>
                {/* Speech Bubble Left Pointer Arrow */}
                <div className="absolute -left-[6px] top-1/2 -translate-y-1/2 w-0 h-0 border-y-[5px] border-y-transparent border-r-[7px] border-r-[#FFF9EB]" />
                <div className="text-[14px] leading-[20px] font-medium text-[#8E4B31] whitespace-nowrap">
                  <div>SẬP GIÁ MUA 2</div>
                  <div>TÍNH 1</div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Right Cart Button */}
          <div className="flex items-center gap-2 md:hidden pointer-events-none">
            <div
              className="relative p-2 rounded-xl bg-rose-50 text-[#ED1B68] font-bold text-xs"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#ED1B68] text-[9px] font-black text-white">
                  {totalItems}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Input Row */}
        <div className="mt-2.5 md:hidden pointer-events-none">
          <SearchBar placeholder="Tìm sản phẩm cho bé..." />
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex bg-slate-900/60 backdrop-blur-sm md:hidden">
          <div className="w-4/5 max-w-sm bg-white h-full p-5 overflow-y-auto flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2"
                >
                  <div className="relative h-10 w-36">
                    <Image
                      src="/images/header/logo-concung.png"
                      alt="Con Cưng Logo"
                      fill
                      className="object-contain object-left"
                    />
                  </div>
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:bg-slate-100"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
                  Danh mục sản phẩm
                </p>
                {MAIN_NAV_ITEMS.map((item) => (
                  <Link
                    key={item.slug}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-rose-50 hover:text-[#ED1B68]"
                  >
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <Link
                href="/stores"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-slate-50 text-slate-700 font-semibold text-sm"
              >
                <MapPin className="h-4 w-4 text-[#ED1B68]" />
                <span>Hệ thống cửa hàng</span>
              </Link>
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-[#ED1B68] text-white font-bold text-sm"
              >
                <User className="h-4 w-4" />
                <span>Đăng nhập / Đăng ký</span>
              </Link>
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)}></div>
        </div>
      )}
    </header>
  );
}


