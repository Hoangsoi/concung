import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Category } from "@/types/category";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group flex flex-col items-center rounded-xl border border-slate-100 bg-white p-3 sm:p-4 text-center shadow-subtle transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-hover"
    >
      <div className="relative h-16 w-16 sm:h-20 sm:w-20 overflow-hidden rounded-full bg-brand-50 mb-2 sm:mb-3 p-1 border-2 border-brand-100 group-hover:border-brand-500 transition-colors">
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover rounded-full transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <h4 className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-brand-500 line-clamp-1">
        {category.name}
      </h4>
      <span className="text-[10px] sm:text-xs text-slate-400 mt-0.5">
        {category.itemCount}+ sản phẩm
      </span>
    </Link>
  );
}
