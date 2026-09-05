"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

export function SidePromoBanner() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed top-[735px] xl:left-[calc(50%+592px)] right-3 z-40 hidden lg:block pointer-events-auto transition-all">
      <div className="relative w-[95px] sm:w-[105px] transition-transform hover:scale-105">
        {/* Close Button (X) */}
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-800/90 text-white hover:bg-slate-950 flex items-center justify-center shadow-lg z-20 transition-colors"
          aria-label="Đóng banner"
        >
          <X className="w-3.5 h-3.5 stroke-[3]" />
        </button>

        {/* 3D Rendered Banner Image Asset */}
        <div className="relative w-full aspect-square drop-shadow-xl">
          <Image
            src="/banner-sua-thung-clean.png"
            alt="Khuyến mãi Sữa thùng đến 40% + 100% quà to"
            width={270}
            height={270}
            className="w-full h-auto object-contain select-none"
            priority
          />
        </div>
      </div>
    </div>
  );
}
