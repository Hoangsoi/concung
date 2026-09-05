"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, Flame, X, ChevronRight, Camera } from "lucide-react";
import { POPULAR_SEARCH_TAGS } from "@/lib/constants";
import { MOCK_PRODUCTS } from "@/data/mockProducts";
import { formatVND } from "@/lib/utils";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  placeholder = "Ba mẹ muốn tìm mua gì hôm nay ?",
  className = "",
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleTagClick = (tag: string) => {
    setQuery(tag);
    setIsOpen(false);
    router.push(`/search?q=${encodeURIComponent(tag)}`);
  };

  const suggestedProducts = query.trim()
    ? MOCK_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.brand.toLowerCase().includes(query.toLowerCase()) ||
          p.categoryName.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 4)
    : MOCK_PRODUCTS.slice(0, 4);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search Input Box - Reconstructing concung rounded-[16px], border-2 border-[#ff379b] */}
      <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
        <div className="relative flex-1 flex items-center bg-white rounded-[16px] border-2 border-[#ff379b] transition-all h-[52px] pl-[20px] overflow-hidden shadow-none">
          <input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            className="w-full bg-transparent text-[16px] text-[#333333] placeholder:text-[#6E6E73] focus:outline-none pr-2 font-normal"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 mr-2 shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Camera Search Icon */}
          <button
            type="button"
            className="p-1.5 text-[#6E6E73] hover:text-[#ff379b] transition-colors mr-2.5 hidden sm:flex items-center justify-center shrink-0"
            title="Tìm kiếm bằng hình ảnh"
          >
            <Camera className="h-[21px] w-[21px] stroke-[1.6]" />
          </button>

          {/* Search Action Button - Exact 1:1 Con Cung Sparkles Search Icon */}
          <button
            type="submit"
            className="h-full w-14 md:w-[72px] bg-[#ff379b] hover:bg-[#e02268] text-white flex items-center justify-center shrink-0 transition-colors"
            aria-label="Tìm kiếm"
          >
            <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Open C-Arc for Lens */}
              <path
                d="M 11 4.5 C 7.2 4.5 4.2 7.5 4.2 11.3 C 4.2 15.1 7.2 18.1 11 18.1 C 13.5 18.1 15.7 16.8 16.9 14.8"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Handle Line */}
              <path
                d="M 15.5 15.5 L 19.5 19.5"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              {/* LARGE Star inside the Lens (Center-Right) */}
              <path
                d="M 12.5 5.2 C 12.5 7.3 14.2 9 16.3 9 C 14.2 9 12.5 10.7 12.5 12.8 C 12.5 10.7 10.8 9 8.7 9 C 10.8 9 12.5 7.3 12.5 5.2 Z"
                fill="currentColor"
              />
              {/* SMALL Star at Top-Right */}
              <path
                d="M 17.5 3 C 17.5 4.2 18.5 5.2 19.7 5.2 C 18.5 5.2 17.5 6.2 17.5 7.4 C 17.5 6.2 16.5 5.2 15.3 5.2 C 16.5 5.2 17.5 4.2 17.5 3 Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </form>

      {/* Suggestion Dropdown Popover */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-100 shadow-2xl z-50 overflow-hidden p-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Popular Search Tags */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Flame className="h-4 w-4 text-rose-500 fill-rose-500" />
              <span>Từ khóa tìm kiếm phổ biến</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_SEARCH_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagClick(tag)}
                  className="bg-slate-100 hover:bg-rose-50 hover:text-[#ED1B68] text-slate-700 text-xs px-3 py-1.5 rounded-lg transition-colors font-semibold"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Suggested Products List */}
          <div className="space-y-2 border-t border-slate-100 pt-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">
                {query ? "Sản phẩm tìm được" : "Gợi ý hot cho Ba Mẹ"}
              </span>
              <span className="text-[11px] text-slate-400 font-normal">
                {suggestedProducts.length} kết quả
              </span>
            </div>

            {suggestedProducts.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {suggestedProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 py-2 px-1 hover:bg-slate-50 rounded-xl transition-colors group"
                  >
                    <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 group-hover:text-[#ED1B68] truncate">
                        {product.name}
                      </h4>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-xs font-black text-[#ED1B68]">
                          {formatVND(product.price)}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-[10px] text-slate-400 line-through">
                            {formatVND(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-[#ED1B68] shrink-0" />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-2 text-center">
                Không tìm thấy sản phẩm khớp với từ khóa
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

