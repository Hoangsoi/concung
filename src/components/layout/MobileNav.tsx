"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, History, Wallet, Headphones, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();

  const navTabs = [
    {
      name: "Trang chủ",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      name: "Lịch sử",
      href: "/history",
      icon: History,
      isActive: pathname === "/history" || pathname.startsWith("/history/"),
    },
    {
      name: "Ví",
      href: "/wallet",
      icon: Wallet,
      isActive:
        pathname === "/wallet" ||
        pathname === "/vi" ||
        pathname.startsWith("/wallet/") ||
        pathname.startsWith("/vi/"),
    },
    {
      name: "CSKH",
      href: "/cskh",
      icon: Headphones,
      isActive: pathname === "/cskh" || pathname.startsWith("/cskh/"),
    },
    {
      name: "Tôi",
      href: "/account",
      icon: User,
      isActive:
        pathname === "/account" ||
        pathname.startsWith("/account/") ||
        pathname === "/login" ||
        pathname === "/register",
    },
  ];

  return (
    <nav
      aria-label="Thanh điều hướng chân trang cố định"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] py-1.5 px-2 md:hidden"
    >
      <div className="grid grid-cols-5 items-center max-w-md mx-auto">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.isActive;

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all duration-200 group relative",
                isActive
                  ? "text-[#F52862] font-bold"
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              <div className="relative flex items-center justify-center mb-0.5">
                <Icon
                  className={cn(
                    "h-5 w-5 transition-transform group-active:scale-95",
                    isActive ? "text-[#F52862] stroke-[2.5]" : "text-slate-500"
                  )}
                />
                {isActive && (
                  <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-[#F52862]" />
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] sm:text-[11px] leading-tight transition-all truncate max-w-full px-0.5",
                  isActive ? "font-bold text-[#F52862]" : "font-medium text-slate-600"
                )}
              >
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
