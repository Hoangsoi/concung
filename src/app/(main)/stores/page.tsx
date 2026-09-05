"use client";

import React, { useState } from "react";
import { MapPin, Phone, Clock, Search, Navigation } from "lucide-react";
import { MOCK_STORES } from "@/data/mockStores";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function StoresPage() {
  const [selectedCity, setSelectedCity] = useState<string>("Tất cả");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredStores = MOCK_STORES.filter((store) => {
    const matchesCity = selectedCity === "Tất cả" || store.city === selectedCity;
    const matchesQuery =
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.district.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesQuery;
  });

  return (
    <div className="max-w-container mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-brand-900 text-white p-6 sm:p-8 shadow-card space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-brand-500/20 text-brand-300 text-xs px-3 py-1 rounded-full font-bold">
          <MapPin className="h-3.5 w-3.5" />
          HỆ THỐNG TOÀN QUỐC
        </div>
        <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">
          Tìm Siêu Thị BabyMart Gần Bạn Nhất
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
          Hệ thống cửa hàng trải rộng khắp các quận huyện với đầy đủ hàng trăm sản phẩm Mẹ & Bé chính hãng, phục vụ tư vấn nhiệt tình.
        </p>
      </div>

      {/* Filter & Search Controls */}
      <div className="rounded-2xl bg-white p-4 border border-slate-100 shadow-subtle flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-slate-700 shrink-0">Thành phố:</span>
          {["Tất cả", "Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng"].map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                selectedCity === city
                  ? "bg-brand-500 text-white font-bold"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72">
          <Input
            placeholder="Tìm theo đường, quận huyện..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
      </div>

      {/* Stores List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStores.map((store) => (
          <div
            key={store.id}
            className="rounded-xl border border-slate-100 bg-white p-5 shadow-subtle space-y-3 hover:border-brand-200 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <MapPin className="h-5 w-5 text-brand-500 shrink-0" />
                <span>{store.name}</span>
              </h3>
              {store.is24h && <Badge variant="sale">24/7</Badge>}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium pl-7">
              {store.address}, {store.district}, {store.city}
            </p>

            <div className="space-y-1 text-xs text-slate-500 pl-7 pt-1">
              <p className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-brand-500" />
                <span>Điện thoại: <strong>{store.phone}</strong></span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-amber-500" />
                <span>Giờ mở cửa: {store.openingHours}</span>
              </p>
            </div>

            <div className="pt-2">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(store.address + " " + store.city)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:underline"
              >
                <Navigation className="h-3.5 w-3.5" />
                <span>Chỉ đường trên Google Maps</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
