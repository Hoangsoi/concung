import React from "react";
import Link from "next/link";
import { SlidersHorizontal, ChevronRight, Home } from "lucide-react";
import { MOCK_CATEGORIES } from "@/data/mockCategories";
import { MOCK_PRODUCTS } from "@/data/mockProducts";
import { ProductCard } from "@/components/common/ProductCard";
import { Badge } from "@/components/ui/badge";

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const currentCategory = MOCK_CATEGORIES.find((c) => c.slug === params.slug) || {
    name: params.slug === "tat-ca" ? "Tất Cả Sản Phẩm" : "Danh Mục Sản Phẩm",
    slug: params.slug,
    description: "Khám phá các sản phẩm chất lượng cao dành riêng cho Mẹ & Bé",
    subCategories: [],
  };

  const filteredProducts =
    params.slug === "tat-ca"
      ? MOCK_PRODUCTS
      : MOCK_PRODUCTS.filter((p) => p.categorySlug === params.slug || true);

  return (
    <div className="max-w-container mx-auto px-4 py-4 sm:py-6 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="flex items-center gap-1 hover:text-brand-500">
          <Home className="h-3.5 w-3.5" />
          <span>Trang chủ</span>
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
        <span className="font-semibold text-slate-800">{currentCategory.name}</span>
      </nav>

      {/* Category Banner Header */}
      <div className="rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white p-6 sm:p-8 shadow-card">
        <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">
          {currentCategory.name}
        </h1>
        {currentCategory.description && (
          <p className="text-xs sm:text-sm text-white/90 mt-2 max-w-2xl leading-relaxed">
            {currentCategory.description}
          </p>
        )}

        {/* Subcategories tags */}
        {currentCategory.subCategories && currentCategory.subCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/20">
            {currentCategory.subCategories.map((sub) => (
              <span
                key={sub.id}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg font-semibold cursor-pointer transition-colors"
              >
                {sub.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Layout with Sidebar Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <aside className="hidden lg:block space-y-6 rounded-xl border border-slate-100 bg-white p-5 shadow-subtle h-fit">
          <div className="flex items-center gap-2 font-bold text-slate-900 border-b border-slate-100 pb-3">
            <SlidersHorizontal className="h-4 w-4 text-brand-500" />
            <span>Bộ Lọc Sản Phẩm</span>
          </div>

          {/* Filter by Price */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Khoảng Giá</h4>
            <div className="space-y-1.5 text-xs text-slate-600">
              <label className="flex items-center gap-2 cursor-pointer hover:text-brand-600">
                <input type="checkbox" className="rounded text-brand-500 focus:ring-brand-500" />
                Dưới 200.000đ
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:text-brand-600">
                <input type="checkbox" className="rounded text-brand-500 focus:ring-brand-500" />
                200.000đ - 500.000đ
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:text-brand-600">
                <input type="checkbox" className="rounded text-brand-500 focus:ring-brand-500" />
                500.000đ - 1.000.000đ
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:text-brand-600">
                <input type="checkbox" className="rounded text-brand-500 focus:ring-brand-500" />
                Trên 1.000.000đ
              </label>
            </div>
          </div>

          {/* Filter by Brand */}
          <div className="space-y-2 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Thương Hiệu</h4>
            <div className="space-y-1.5 text-xs text-slate-600">
              {["Moony", "Friso", "Baobaohao", "Ergobaby", "Medela", "Lego", "Dnee"].map((brand) => (
                <label key={brand} className="flex items-center gap-2 cursor-pointer hover:text-brand-600">
                  <input type="checkbox" className="rounded text-brand-500 focus:ring-brand-500" />
                  {brand}
                </label>
              ))}
            </div>
          </div>

          {/* Filter by Origin */}
          <div className="space-y-2 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Xuất Xứ</h4>
            <div className="space-y-1.5 text-xs text-slate-600">
              {["Nhật Bản", "Hà Lan", "Mỹ", "Thụy Sĩ", "Thái Lan", "Việt Nam"].map((origin) => (
                <label key={origin} className="flex items-center gap-2 cursor-pointer hover:text-brand-600">
                  <input type="checkbox" className="rounded text-brand-500 focus:ring-brand-500" />
                  {origin}
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-4">
          {/* Top Bar Sort options */}
          <div className="flex items-center justify-between bg-white p-3 sm:p-4 rounded-xl border border-slate-100 shadow-subtle text-xs sm:text-sm">
            <span className="font-semibold text-slate-700">
              Hiển thị <strong className="text-brand-600">{filteredProducts.length}</strong> sản phẩm
            </span>

            <div className="flex items-center gap-2">
              <span className="text-slate-500 hidden sm:inline">Sắp xếp:</span>
              <select className="rounded-lg border border-slate-200 bg-white py-1.5 px-3 text-xs font-medium text-slate-700 focus:border-brand-500 focus:outline-none">
                <option value="popular">Bán chạy nhất</option>
                <option value="price-low">Giá: Thấp đến Cao</option>
                <option value="price-high">Giá: Cao đến Thấp</option>
                <option value="newest">Sản phẩm mới nhất</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
