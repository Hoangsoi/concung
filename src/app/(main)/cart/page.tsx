"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { formatVND } from "@/lib/utils";
import { QuantityPicker } from "@/components/common/QuantityPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PriceTag } from "@/components/common/PriceTag";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice, totalItems, isHydrated } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === "BABYMART50") {
      setDiscountAmount(50000);
      setCouponApplied(true);
    } else if (couponCode.trim()) {
      alert("Mã giảm giá không hợp lệ hoặc đã hết hạn!");
    }
  };

  const finalTotal = Math.max(0, totalPrice - discountAmount);

  if (!isHydrated) {
    return (
      <div className="max-w-container mx-auto px-4 py-12 text-center text-slate-400">
        Đang tải giỏ hàng...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-container mx-auto px-4 py-16">
        <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center shadow-subtle space-y-4 max-w-lg mx-auto">
          <div className="h-20 w-20 bg-brand-50 text-brand-500 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="h-10 w-10" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Giỏ hàng của bạn đang trống</h2>
          <p className="text-xs text-slate-500">
            Hãy khám phá hàng ngàn sản phẩm Mẹ & Bé chính hãng giá tốt tại BabyMart ngay hôm nay!
          </p>
          <Link href="/">
            <Button variant="primary" size="lg" className="font-bold shadow-md">
              <span>Tiếp tục mua sắm</span>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-container mx-auto px-4 py-6 space-y-6">
      <h1 className="text-xl sm:text-2xl font-black text-slate-900">
        Giỏ Hàng Của Bạn ({totalItems} sản phẩm)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Item List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-slate-100 bg-white p-4 sm:p-6 shadow-subtle divide-y divide-slate-100">
            {items.map((item) => {
              const itemKey = `${item.product.id}-${item.selectedVariantId || ""}`;
              return (
                <div key={itemKey} className="py-4 first:pt-0 last:pb-0 flex items-start gap-4">
                  {/* Item Image */}
                  <div className="relative h-20 w-20 sm:h-24 sm:w-24 overflow-hidden rounded-xl bg-slate-50 border border-slate-100 shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link
                          href={`/product/${item.product.slug}`}
                          className="font-bold text-xs sm:text-sm text-slate-800 hover:text-brand-500 line-clamp-2"
                        >
                          {item.product.name}
                        </Link>
                        {item.selectedVariantName && (
                          <span className="text-[11px] text-brand-600 bg-brand-50 px-2 py-0.5 rounded font-semibold inline-block mt-1">
                            Phân loại: {item.selectedVariantName}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.product.id, item.selectedVariantId)}
                        className="text-slate-400 hover:text-red-500 p-1"
                        aria-label="Xóa sản phẩm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <PriceTag price={item.selectedPrice} size="sm" showDiscountBadge={false} />

                      <QuantityPicker
                        value={item.quantity}
                        onChange={(val) =>
                          updateQuantity(item.product.id, val, item.selectedVariantId)
                        }
                        size="sm"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cart Order Summary Sidebar */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-subtle space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Tóm Tắt Đơn Hàng
            </h3>

            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <Tag className="h-3.5 w-3.5 text-brand-500" />
                <span>Mã giảm giá (Gợi ý: BABYMART50)</span>
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="Nhập mã voucher"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="text-xs"
                />
                <Button type="submit" variant="soft" size="sm" className="font-bold shrink-0">
                  Áp dụng
                </Button>
              </div>
              {couponApplied && (
                <p className="text-xs text-emerald-600 font-semibold">
                  ✓ Đã áp dụng mã giảm 50.000đ!
                </p>
              )}
            </form>

            {/* Price Calculations */}
            <div className="space-y-2.5 text-xs border-t border-slate-100 pt-4">
              <div className="flex justify-between text-slate-600">
                <span>Tạm tính ({totalItems} sp):</span>
                <span className="font-semibold text-slate-800">{formatVND(totalPrice)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Giảm giá Voucher:</span>
                  <span className="font-bold">-{formatVND(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Phí vận chuyển:</span>
                <span className="text-emerald-600 font-semibold">Miễn phí giao hàng</span>
              </div>

              <div className="flex justify-between text-sm font-extrabold text-slate-900 border-t border-slate-100 pt-3">
                <span>Tổng tiền thanh toán:</span>
                <span className="text-price text-lg font-black">{formatVND(finalTotal)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <Link href="/checkout" className="block pt-2">
              <Button variant="primary" size="lg" className="w-full font-bold shadow-md gap-2">
                <span>Tiến Hành Đặt Hàng</span>
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>

            <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              Bảo mật thông tin thanh toán 100%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
