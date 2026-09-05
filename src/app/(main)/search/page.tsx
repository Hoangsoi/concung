"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, ShoppingBag } from "lucide-react";
import { MOCK_PRODUCTS } from "@/data/mockProducts";
import { ProductCard } from "@/components/common/ProductCard";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const results = query
    ? MOCK_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.brand.toLowerCase().includes(query.toLowerCase()) ||
          p.categoryName.toLowerCase().includes(query.toLowerCase())
      )
    : MOCK_PRODUCTS;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 border border-slate-100 shadow-subtle space-y-2">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
          <Search className="h-6 w-6 text-brand-500" />
          <span>Kết Quả Tìm Kiếm: &quot;{query}&quot;</span>
        </h1>
        <p className="text-xs text-slate-500">
          Tìm thấy <strong className="text-brand-600 font-bold">{results.length}</strong> sản phẩm phù hợp với từ khóa của bạn.
        </p>
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-white p-12 text-center border border-slate-100 shadow-subtle space-y-4">
          <div className="h-16 w-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Không tìm thấy sản phẩm nào</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Rất tiếc, không tìm thấy kết quả nào cho từ khóa &quot;{query}&quot;. Vui lòng thử tìm kiếm với từ khóa khác như Bỉm, Sữa, Xe đẩy.
          </p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="max-w-container mx-auto px-4 py-6">
      <Suspense fallback={<div className="text-center py-12 text-slate-400">Đang tìm kiếm...</div>}>
        <SearchContent />
      </Suspense>
    </div>
  );
}
