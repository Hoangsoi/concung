"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";

export interface MegaMenuColumn {
  title: string;
  items: { name: string; href: string }[];
}

interface MegaMenuProps {
  columns: MegaMenuColumn[];
  categoryName: string;
  categoryHref: string;
  onClose?: () => void;
}

export function MegaMenu({
  columns,
  categoryName,
  categoryHref,
  onClose,
}: MegaMenuProps) {
  return (
    <div
      className="absolute top-full left-0 right-0 w-full bg-white border-t border-slate-200 shadow-2xl z-50 p-6 animate-in fade-in slide-in-from-top-1 duration-200"
      onMouseLeave={onClose}
    >
      <div className="max-w-container mx-auto space-y-4">
        {/* Header line inside Mega Menu */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand-500" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Danh mục {categoryName}
            </h3>
          </div>
          <Link
            href={categoryHref}
            onClick={onClose}
            className="text-xs font-bold text-brand-500 hover:underline flex items-center gap-1"
          >
            <span>Xem tất cả {categoryName}</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* 3-4 Columns Grid */}
        <div className="grid grid-cols-3 gap-8 pt-1">
          {columns.map((col, idx) => (
            <div key={idx} className="space-y-2.5">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider border-l-2 border-brand-500 pl-2">
                {col.title}
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {col.items.map((item, itemIdx) => (
                  <li key={itemIdx}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="hover:text-brand-600 hover:font-bold transition-all block py-1"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
