"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingCart,
  Zap,
  CheckCircle2,
  ChevronRight,
  Home,
  MapPin,
} from "lucide-react";
import { MOCK_PRODUCTS } from "@/data/mockProducts";
import { PriceTag } from "@/components/common/PriceTag";
import { QuantityPicker } from "@/components/common/QuantityPicker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { ProductCard } from "@/components/common/ProductCard";

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product =
    MOCK_PRODUCTS.find((p) => p.slug === params.slug) || MOCK_PRODUCTS[0];

  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(product.images[0] || product.image);
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem(
      product,
      quantity,
      selectedVariant?.id,
      selectedVariant?.name,
      selectedVariant?.price
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const activePrice = selectedVariant?.price || product.price;
  const activeOriginalPrice = selectedVariant?.originalPrice || product.originalPrice;

  return (
    <div className="max-w-container mx-auto px-4 py-4 sm:py-6 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="flex items-center gap-1 hover:text-brand-500">
          <Home className="h-3.5 w-3.5" />
          <span>Trang chủ</span>
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
        <Link href={`/category/${product.categorySlug}`} className="hover:text-brand-500">
          {product.categoryName}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
        <span className="font-semibold text-slate-800 truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Product Main Container */}
      <div className="rounded-2xl border border-slate-100 bg-white p-4 sm:p-6 shadow-subtle grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              className="object-cover object-center"
              priority
            />
            {product.isOfficial && (
              <div className="absolute top-3 left-3">
                <Badge variant="official" className="flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4" />
                  <span>100% Chính Hãng</span>
                </Badge>
              </div>
            )}
          </div>

          {/* Thumbnail list */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative h-16 w-16 overflow-hidden rounded-lg border-2 transition-all shrink-0 ${
                    selectedImage === img
                      ? "border-brand-500 ring-2 ring-brand-500/20"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <Image src={img} alt={`Thumb ${idx}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Information & Purchase Form */}
        <div className="space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            {/* Brand & Origin */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-brand-600 uppercase bg-brand-50 px-2.5 py-1 rounded-md">
                Thương hiệu: {product.brand}
              </span>
              {product.origin && (
                <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                  Xuất xứ: {product.origin}
                </span>
              )}
            </div>

            {/* Product Title */}
            <h1 className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug">
              {product.name}
            </h1>

            {/* Rating & Sales stats */}
            <div className="flex items-center gap-4 text-xs text-slate-500 border-b border-slate-100 pb-3">
              <div className="flex items-center text-amber-400">
                <Star className="h-4 w-4 fill-current" />
                <span className="ml-1 font-bold text-slate-800">{product.rating}</span>
                <span className="ml-1 text-slate-400">({product.reviewCount} đánh giá)</span>
              </div>
              <span>•</span>
              <span>Đã bán <strong>{product.soldCount}</strong> sản phẩm</span>
            </div>

            {/* Price Box */}
            <div className="rounded-xl bg-slate-50 p-4 space-y-1">
              <PriceTag price={activePrice} originalPrice={activeOriginalPrice} size="lg" />
              <p className="text-[11px] text-slate-500 flex items-center gap-1 pt-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                Giá đã bao gồm thuế VAT và bảo hành chính hãng
              </p>
            </div>

            {/* Variant selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Chọn phân loại:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                        selectedVariant?.id === v.id
                          ? "border-brand-500 bg-brand-50 text-brand-600 shadow-sm"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Picker */}
            <div className="flex items-center gap-4 pt-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Số lượng:
              </span>
              <QuantityPicker value={quantity} onChange={setQuantity} min={1} max={10} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={handleAddToCart}
                className="w-full font-bold border-2 border-brand-500 text-brand-600 hover:bg-brand-50"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>{added ? "Đã thêm vào giỏ!" : "Thêm vào giỏ hàng"}</span>
              </Button>

              <Link href="/checkout" className="w-full">
                <Button variant="primary" size="lg" className="w-full font-bold shadow-md">
                  <Zap className="h-5 w-5 fill-current" />
                  <span>Mua Ngay Giao 2H</span>
                </Button>
              </Link>
            </div>

            {/* Service Promises */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-slate-50 p-3 rounded-xl">
              <span className="flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-brand-500" />
                Giao hàng nhanh 2h nội thành
              </span>
              <span className="flex items-center gap-1.5">
                <RotateCcw className="h-4 w-4 text-emerald-500" />
                Đổi trả trong 15 ngày
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications & Detailed Description */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Description & Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-subtle space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Mô Tả Sản Phẩm
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>
        </div>

        {/* Specifications Table */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-subtle space-y-4 h-fit">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Thông Số Kỹ Thuật
          </h3>
          <div className="space-y-2 text-xs">
            {Object.entries(product.specifications).map(([key, val]) => (
              <div key={key} className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500 font-medium">{key}</span>
                <span className="font-semibold text-slate-800 text-right">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Sản Phẩm Tương Tự</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {MOCK_PRODUCTS.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
