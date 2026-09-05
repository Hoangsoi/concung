"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingCart, ShieldCheck } from "lucide-react";
import { Product } from "@/types/product";
import { PriceTag } from "./PriceTag";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useCart } from "@/hooks/useCart";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = React.useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-slate-100 bg-white p-3 sm:p-4 shadow-subtle transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-hover">
      <div>
        {/* Image & Badges */}
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-slate-50 mb-3">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
            {product.isOfficial && (
              <Badge variant="official" className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                <span className="text-[10px]">Chính hãng</span>
              </Badge>
            )}
            {product.isHot && (
              <Badge variant="sale" className="text-[10px]">
                HOT
              </Badge>
            )}
          </div>
        </div>

        {/* Brand & Category */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span className="font-medium text-brand-600 truncate">{product.brand}</span>
          {product.ageRange && (
            <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px]">
              {product.ageRange}
            </span>
          )}
        </div>

        {/* Title */}
        <Link href={`/product/${product.slug}`} className="block">
          <h3 className="line-clamp-2 text-xs sm:text-sm font-semibold text-slate-800 transition-colors group-hover:text-brand-500 min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        {/* Rating & Sold count */}
        <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
          <div className="flex items-center text-amber-400">
            <Star className="h-3.5 w-3.5 fill-current" />
            <span className="ml-1 font-semibold text-slate-700">{product.rating}</span>
          </div>
          <span>•</span>
          <span className="truncate">Đã bán {product.soldCount}</span>
        </div>
      </div>

      {/* Footer: Price & Add to Cart button */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <PriceTag price={product.price} originalPrice={product.originalPrice} size="sm" />

        <Button
          size="sm"
          variant={added ? "secondary" : "primary"}
          onClick={handleAddToCart}
          className="rounded-lg shrink-0 px-2.5 sm:px-3"
          aria-label="Thêm vào giỏ"
        >
          <ShoppingCart className="h-4 w-4" />
          <span className="hidden sm:inline text-xs">{added ? "Đã thêm" : "Thêm"}</span>
        </Button>
      </div>
    </div>
  );
}
