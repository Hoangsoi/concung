import React from "react";
import { formatVND, calculateDiscount } from "@/lib/utils";
import { Badge } from "../ui/badge";

interface PriceTagProps {
  price: number;
  originalPrice?: number;
  size?: "sm" | "md" | "lg";
  showDiscountBadge?: boolean;
}

export function PriceTag({
  price,
  originalPrice,
  size = "md",
  showDiscountBadge = true,
}: PriceTagProps) {
  const discountPercent = originalPrice ? calculateDiscount(originalPrice, price) : 0;

  const sizeClasses = {
    sm: "text-sm sm:text-base font-bold",
    md: "text-base sm:text-lg font-bold",
    lg: "text-xl sm:text-2xl font-extrabold",
  };

  return (
    <div className="flex items-baseline gap-2 flex-wrap">
      <span className={`text-price font-extrabold ${sizeClasses[size]}`}>
        {formatVND(price)}
      </span>
      {originalPrice && originalPrice > price && (
        <span className="text-xs sm:text-sm text-slate-400 line-through font-normal">
          {formatVND(originalPrice)}
        </span>
      )}
      {showDiscountBadge && discountPercent > 0 && (
        <Badge variant="sale" className="text-[10px] sm:text-xs">
          -{discountPercent}%
        </Badge>
      )}
    </div>
  );
}
