"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, ChevronDown } from "lucide-react";
import { MAIN_NAV_ITEMS, CategoryNavItem } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { MegaMenu } from "./MegaMenu";

export function CategoryNav() {
  const pathname = usePathname();
  const [activeMegaCategory, setActiveMegaCategory] = useState<CategoryNavItem | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (item: CategoryNavItem) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (item.hasMegaMenu && item.megaMenuData) {
      setActiveMegaCategory(item);
    } else {
      setActiveMegaCategory(null);
    }
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMegaCategory(null);
    }, 150);
  };

  return (
    <nav
      className="bg-white border-b border-slate-200 hidden lg:block relative z-40"
      onMouseLeave={handleMouseLeave}
    >
      <div className="max-w-container mx-auto px-4">
        <div className="flex items-center justify-between py-2 overflow-x-auto scrollbar-none">
          {MAIN_NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const isMegaActive = activeMegaCategory?.slug === item.slug;

            if (item.isHot) {
              return (
                <Link
                  key={item.slug}
                  href={item.href}
                  onMouseEnter={() => handleMouseEnter(item)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 transition-all shrink-0 shadow-sm"
                >
                  <Flame className="h-4 w-4 fill-amber-300 text-amber-300 animate-bounce" />
                  <span>{item.name}</span>
                </Link>
              );
            }

            return (
              <div
                key={item.slug}
                onMouseEnter={() => handleMouseEnter(item)}
                className="relative flex items-center shrink-0"
              >
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all",
                    isActive || isMegaActive
                      ? "bg-brand-50 text-brand-600 font-bold"
                      : "text-slate-800 hover:bg-slate-50 hover:text-brand-600"
                  )}
                >
                  <span>{item.name}</span>
                  {item.hasMegaMenu && (
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isMegaActive ? "rotate-180 text-brand-600" : "text-slate-400"}`} />
                  )}
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mega Menu Dropdown */}
      {activeMegaCategory && activeMegaCategory.megaMenuData && (
        <MegaMenu
          categoryName={activeMegaCategory.name}
          categoryHref={activeMegaCategory.href}
          columns={activeMegaCategory.megaMenuData.columns}
          onClose={() => setActiveMegaCategory(null)}
        />
      )}
    </nav>
  );
}
