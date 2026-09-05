import React from "react";
import Link from "next/link";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Package,
  Baby,
  ArrowUpRight,
  Plus,
  Home,
} from "lucide-react";
import { formatVND } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  const stats = [
    {
      title: "Doanh thu tháng này",
      value: formatVND(1485000000),
      change: "+18.4%",
      icon: TrendingUp,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      title: "Đơn hàng thành công",
      value: "3,420 đơn",
      change: "+12.1%",
      icon: ShoppingBag,
      color: "text-brand-600 bg-brand-50",
    },
    {
      title: "Khách hàng BabyClub",
      value: "45,820 mẹ",
      change: "+8.5%",
      icon: Users,
      color: "text-amber-600 bg-amber-50",
    },
    {
      title: "Tổng sản phẩm tồn kho",
      value: "10,240 sp",
      change: "Ổn định",
      icon: Package,
      color: "text-sky-600 bg-sky-50",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-8 space-y-8 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-brand-500 text-white flex items-center justify-center font-bold">
            <Baby className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              BabyMart Admin System
              <Badge variant="sale" className="text-[10px]">v1.0 Pro</Badge>
            </h1>
            <p className="text-xs text-slate-400">
              Bảng điều khiển quản trị chuỗi siêu thị Mẹ & Bé
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="outline" size="sm" className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
              <Home className="h-4 w-4" />
              <span>Xem Cửa Hàng Public</span>
            </Button>
          </Link>

          <Button variant="primary" size="sm" className="font-bold gap-1">
            <Plus className="h-4 w-4" />
            <span>Thêm sản phẩm mới</span>
          </Button>
        </div>
      </div>

      {/* Stats Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">{stat.title}</span>
                <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-xl sm:text-2xl font-extrabold text-white">{stat.value}</span>
                <span className="text-xs font-bold text-emerald-400 flex items-center">
                  {stat.change}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity & Orders Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="font-bold text-white text-base">Đơn Hàng Mới Nhất</h3>
          <span className="text-xs font-semibold text-brand-400 cursor-pointer hover:underline">
            Xem tất cả đơn hàng →
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-900/50 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Mã Đơn</th>
                <th className="py-3 px-4">Khách Hàng</th>
                <th className="py-3 px-4">Sản Phẩm Main</th>
                <th className="py-3 px-4">Tổng Tiền</th>
                <th className="py-3 px-4">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              <tr>
                <td className="py-3.5 px-4 font-bold text-white">#BM-9921</td>
                <td className="py-3.5 px-4">Nguyễn Thị Mai (0988***456)</td>
                <td className="py-3.5 px-4">Tã Moony Natural L36 + Friso 3</td>
                <td className="py-3.5 px-4 font-bold text-emerald-400">1.084.000₫</td>
                <td className="py-3.5 px-4">
                  <span className="bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full text-[11px] font-bold">
                    Hoàn thành 2h
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-white">#BM-9920</td>
                <td className="py-3.5 px-4">Lê Hoàng Nam (0903***789)</td>
                <td className="py-3.5 px-4">Xe đẩy gấp gọn Baobaohao V8</td>
                <td className="py-3.5 px-4 font-bold text-emerald-400">1.250.000₫</td>
                <td className="py-3.5 px-4">
                  <span className="bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-full text-[11px] font-bold">
                    Đang đóng gói
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-white">#BM-9919</td>
                <td className="py-3.5 px-4">Trần Thanh Trúc (0912***334)</td>
                <td className="py-3.5 px-4">Máy hút sữa Medela Hands-Free</td>
                <td className="py-3.5 px-4 font-bold text-emerald-400">8.990.000₫</td>
                <td className="py-3.5 px-4">
                  <span className="bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-full text-[11px] font-bold">
                    Chờ thanh toán VNPAY
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
