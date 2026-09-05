"use client";

import React, { useState, useEffect } from "react";
import { Zap, Clock } from "lucide-react";
import { MOCK_PRODUCTS } from "@/data/mockProducts";
import { ProductCard } from "@/components/common/ProductCard";

export function FlashSaleSection() {
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 24, seconds: 12 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashSaleProducts = MOCK_PRODUCTS.slice(0, 4);

  return (
    <section className="rounded-2xl border border-rose-100 bg-gradient-to-b from-rose-50/50 to-white p-4 sm:p-6 shadow-subtle space-y-4">
      {/* Header with Countdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-100 pb-4">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-brand-500 text-white flex items-center justify-center animate-bounce">
            <Zap className="h-5 w-5 fill-current" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
              Flash Sale Giá Sốc
              <span className="bg-red-500 text-white text-[11px] px-2 py-0.5 rounded-full font-bold">
                GIẢM ĐẾN 50%
              </span>
            </h2>
            <p className="text-xs text-slate-500">Số lượng có hạn - Nhanh tay săn ngay!</p>
          </div>
        </div>

        {/* Timer Box */}
        <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-rose-200 shadow-sm shrink-0">
          <Clock className="h-4 w-4 text-brand-500" />
          <span className="text-xs font-semibold text-slate-600">Kết thúc sau:</span>
          <div className="flex items-center gap-1 font-mono text-xs font-black text-white">
            <span className="bg-slate-900 px-2 py-1 rounded">{String(timeLeft.hours).padStart(2, "0")}</span>
            <span className="text-slate-900 font-bold">:</span>
            <span className="bg-slate-900 px-2 py-1 rounded">{String(timeLeft.minutes).padStart(2, "0")}</span>
            <span className="text-slate-900 font-bold">:</span>
            <span className="bg-brand-500 px-2 py-1 rounded">{String(timeLeft.seconds).padStart(2, "0")}</span>
          </div>
        </div>
      </div>

      {/* Product List Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {flashSaleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
