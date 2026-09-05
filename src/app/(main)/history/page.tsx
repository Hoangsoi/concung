"use client";

import React, { useState } from "react";
import Link from "next/link";
import { History, Package, RotateCcw, ChevronRight, Clock, ShoppingBag, CheckCircle2, Truck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatVND } from "@/lib/utils";

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState<"orders" | "viewed">("orders");

  const mockOrders = [
    {
      id: "ORD-2026-8891",
      date: "02/09/2026 - 14:30",
      total: 1084000,
      status: "Đã giao hàng",
      statusColor: "official",
      itemsCount: 3,
      items: [
        { name: "Tã quần Moony Natural Size L 36 miếng", qty: 2, price: 395000 },
        { name: "Sữa bột Friso Gold số 3 1400g", qty: 1, price: 694000 },
      ],
    },
    {
      id: "ORD-2026-7720",
      date: "15/08/2026 - 09:15",
      total: 1250000,
      status: "Đang vận chuyển",
      statusColor: "warning",
      itemsCount: 1,
      items: [
        { name: "Xe đẩy em bé hai chiều gấp gọn Baobaohao V8", qty: 1, price: 1250000 },
      ],
    },
    {
      id: "ORD-2026-5510",
      date: "28/07/2026 - 18:45",
      total: 450000,
      status: "Đã hoàn thành",
      statusColor: "official",
      itemsCount: 2,
      items: [
        { name: "Bình sữa PPSU Moyuum 170ml Hàn Quốc", qty: 1, price: 330000 },
        { name: "Khăn ướt em bé Moony 80 tờ", qty: 2, price: 60000 },
      ],
    },
  ];

  const mockViewedProducts = [
    {
      id: "1",
      name: "Tã quần Moony Natural Size L 36 miếng (9 - 14kg)",
      price: 395000,
      originalPrice: 435000,
      image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=300&auto=format&fit=crop&q=80",
      slug: "ta-quan-moony-natural-size-l",
      viewedAt: "10 phút trước",
    },
    {
      id: "2",
      name: "Sữa bột Friso Gold số 3 1400g (1 - 2 tuổi)",
      price: 694000,
      originalPrice: 720000,
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80",
      slug: "sua-bot-friso-gold-so-3",
      viewedAt: "2 giờ trước",
    },
    {
      id: "3",
      name: "Xe đẩy em bé hai chiều gấp gọn Baobaohao V8",
      price: 1250000,
      originalPrice: 1500000,
      image: "https://images.unsplash.com/photo-1591154669695-5f2a8d20c089?w=300&auto=format&fit=crop&q=80",
      slug: "xe-day-em-be-baobaohao-v8",
      viewedAt: "Hôm qua",
    },
  ];

  return (
    <div className="max-w-container mx-auto px-4 py-6 space-y-6">
      {/* Header section */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-rose-50 text-[#F52862] flex items-center justify-center font-bold">
          <History className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Lịch Sử Mua Hàng & Xem Sản Phẩm</h1>
          <p className="text-xs text-slate-500">Theo dõi các đơn hàng và sản phẩm bạn đã xem gần đây</p>
        </div>
      </div>

      {/* Tabs selector */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-3 flex items-center gap-2 transition-colors relative ${
            activeTab === "orders" ? "text-[#F52862]" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Package className="h-4 w-4" />
          <span>Lịch sử đơn hàng ({mockOrders.length})</span>
          {activeTab === "orders" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F52862] rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("viewed")}
          className={`pb-3 flex items-center gap-2 transition-colors relative ${
            activeTab === "viewed" ? "text-[#F52862]" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>Sản phẩm đã xem ({mockViewedProducts.length})</span>
          {activeTab === "viewed" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F52862] rounded-full" />
          )}
        </button>
      </div>

      {/* Orders List */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          {mockOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden border border-slate-200 hover:border-rose-200 transition-colors">
              <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <ShoppingBag className="h-4 w-4 text-[#F52862]" />
                  <span>Mã đơn: {order.id}</span>
                  <span className="text-slate-400">•</span>
                  <span className="font-normal text-slate-500">{order.date}</span>
                </div>
                <Badge variant={order.status === "Đang vận chuyển" ? "warning" : "official"}>
                  {order.status === "Đang vận chuyển" ? (
                    <Truck className="h-3 w-3 inline mr-1" />
                  ) : (
                    <CheckCircle2 className="h-3 w-3 inline mr-1" />
                  )}
                  {order.status}
                </Badge>
              </div>

              <CardContent className="p-4 space-y-3">
                <div className="space-y-2 divide-y divide-slate-100 text-xs">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="pt-2 first:pt-0 flex items-center justify-between gap-2">
                      <span className="text-slate-700 font-medium line-clamp-1">{item.name}</span>
                      <span className="text-slate-500 shrink-0">x{item.qty}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500">Tổng thanh toán: </span>
                    <span className="text-sm font-extrabold text-[#F52862]">{formatVND(order.total)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-8 text-xs font-bold border-rose-200 text-[#F52862] hover:bg-rose-50">
                      <RotateCcw className="h-3.5 w-3.5 mr-1" /> Mua lại
                    </Button>
                    <Link href="/account">
                      <Button size="sm" className="h-8 text-xs font-bold bg-slate-900 text-white hover:bg-slate-800">
                        Chi tiết <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Viewed Products Grid */}
      {activeTab === "viewed" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockViewedProducts.map((product) => (
            <Card key={product.id} className="p-4 flex gap-3 items-center hover:shadow-md transition-shadow">
              <div className="h-16 w-16 bg-slate-100 rounded-lg shrink-0 overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <p className="text-xs font-bold text-slate-900 line-clamp-2">{product.name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-[#F52862]">{formatVND(product.price)}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-[11px] text-slate-400 line-through">
                      {formatVND(product.originalPrice)}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400">Xem {product.viewedAt}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
