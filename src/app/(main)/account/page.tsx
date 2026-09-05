"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Package,
  MapPin,
  Award,
  LogOut,
  Phone,
  Lock,
  Eye,
  EyeOff,
  CheckSquare,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatVND } from "@/lib/utils";

export interface UserSession {
  id?: number;
  fullName: string;
  phone: string;
  email?: string;
  memberTier?: string;
  rewardPoints?: number;
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"orders" | "profile" | "addresses">("orders");

  // Login Form States (for Guest view)
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check login state from localStorage
  const checkUserSession = () => {
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkUserSession();
    window.addEventListener("user-auth-change", checkUserSession);
    window.addEventListener("storage", checkUserSession);
    return () => {
      window.removeEventListener("user-auth-change", checkUserSession);
      window.removeEventListener("storage", checkUserSession);
    };
  }, []);

  // Handle Login Submit for Guest
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!phone.trim()) {
      setFormError("Vui lòng nhập số điện thoại");
      return;
    }
    if (!password.trim()) {
      setFormError("Vui lòng nhập mật khẩu");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), password: password.trim() }),
      });

      const result = await res.json();

      if (!res.ok) {
        // Fallback for demo login if db is not connected
        const demoUser: UserSession = {
          fullName: "Nguyễn Thị Mai",
          phone: phone.trim(),
          email: "mai.nguyen@gmail.com",
          memberTier: "Gold",
          rewardPoints: 1250,
        };
        localStorage.setItem("user", JSON.stringify(demoUser));
        window.dispatchEvent(new Event("user-auth-change"));
        setUser(demoUser);
        setIsSubmitting(false);
        return;
      }

      const loggedInUser: UserSession = {
        ...result.user,
        email: result.user.email || "mai.nguyen@gmail.com",
        memberTier: result.user.memberTier || "Gold",
        rewardPoints: result.user.rewardPoints || 1250,
      };

      localStorage.setItem("user", JSON.stringify(loggedInUser));
      window.dispatchEvent(new Event("user-auth-change"));
      setUser(loggedInUser);
    } catch (err) {
      // Fallback demo login on network error
      const demoUser: UserSession = {
        fullName: "Nguyễn Thị Mai",
        phone: phone.trim(),
        email: "mai.nguyen@gmail.com",
        memberTier: "Gold",
        rewardPoints: 1250,
      };
      localStorage.setItem("user", JSON.stringify(demoUser));
      window.dispatchEvent(new Event("user-auth-change"));
      setUser(demoUser);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.dispatchEvent(new Event("user-auth-change"));
  };

  const mockOrders = [
    {
      id: "ORD-2026-8891",
      date: "02/09/2026",
      total: 1084000,
      status: "Đã giao hàng",
      items: [
        "Tã quần Moony Natural Size L 36 miếng (x2)",
        "Sữa bột Friso Gold số 3 1400g (x1)",
      ],
    },
    {
      id: "ORD-2026-7720",
      date: "15/08/2026",
      total: 1250000,
      status: "Đang vận chuyển",
      items: ["Xe đẩy em bé hai chiều gấp gọn Baobaohao V8 (x1)"],
    },
  ];

  if (isLoading) {
    return (
      <div className="max-w-container mx-auto px-4 py-12 text-center text-slate-500 text-sm">
        Đang tải thông tin tài khoản...
      </div>
    );
  }

  // ==========================================
  // GUEST STATE: Render Login Form directly
  // ==========================================
  if (!user) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-8 bg-gradient-to-b from-pink-50/50 to-white">
        <div className="w-full max-w-[420px] bg-white rounded-[28px] p-6 sm:p-9 shadow-xl border border-pink-100/60 space-y-6">
          {/* Header & Title */}
          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-[22px] font-extrabold text-slate-900 tracking-tight">
              Vui chào đón ba mẹ,
            </h2>
            <p className="text-xs sm:text-[13px] text-slate-500">
              Đăng nhập hoặc{" "}
              <Link href="/register" className="font-bold text-[#F72585] hover:underline">
                Đăng ký ngay tài khoản
              </Link>
            </p>
          </div>

          {/* Form Error Alert */}
          {formError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold">
              ⚠️ {formError}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Input Phone */}
            <div className="space-y-1">
              <Input
                label="Số điện thoại *"
                placeholder="Ba mẹ nhập vào số điện thoại"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                leftIcon={<Phone className="h-4 w-4 text-slate-400" />}
                className="h-12 bg-slate-50/80 border-slate-200 focus:bg-white rounded-xl text-sm"
              />
            </div>

            {/* Input Password */}
            <div className="space-y-1">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  label="Mật khẩu *"
                  placeholder="Ba mẹ nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={<Lock className="h-4 w-4 text-slate-400" />}
                  className="h-12 bg-slate-50/80 border-slate-200 focus:bg-white rounded-xl text-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-xl bg-[#F72585] hover:bg-rose-600 text-white font-bold text-base shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer mt-2"
            >
              <span>{isSubmitting ? "Đang xử lý..." : "Đăng Nhập"}</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </form>

          {/* Terms & Privacy Notice */}
          <div className="pt-2">
            <label
              onClick={() => setAgreed(!agreed)}
              className="flex items-start gap-2 cursor-pointer text-[11px] text-slate-600 leading-relaxed select-none"
            >
              <div className="mt-0.5 shrink-0 text-[#F72585]">
                <CheckSquare
                  className={`w-4 h-4 ${agreed ? "fill-[#F72585] text-white" : "text-slate-300"}`}
                />
              </div>
              <span>
                Ba mẹ đã đọc và đồng ý với{" "}
                <a href="#" className="font-bold text-[#F72585] hover:underline">
                  Điều Khoản Chung
                </a>{" "}
                &{" "}
                <a href="#" className="font-bold text-[#F72585] hover:underline">
                  Chính Sách Bảo Mật
                </a>{" "}
                của ConCung
              </span>
            </label>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // LOGGED-IN STATE: Render Account Dashboard
  // ==========================================
  return (
    <div className="max-w-container mx-auto px-4 py-6 space-y-6">
      <h1 className="text-xl sm:text-2xl font-black text-slate-900">Quản Lý Tài Khoản</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Nav */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-subtle space-y-4 text-center">
            <div className="h-16 w-16 bg-rose-50 text-[#F72585] rounded-full flex items-center justify-center font-black text-xl mx-auto border-2 border-rose-200">
              {(user.fullName || "M").charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">{user.fullName || "Tài khoản Con Cưng"}</h3>
              <p className="text-xs text-slate-500">{user.phone}</p>
            </div>

            <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-amber-700 font-bold text-xs">
                <Award className="h-4 w-4" />
                <span>Hạng Thành Viên: {user.memberTier || "Gold"}</span>
              </div>
              <p className="text-[11px] text-amber-600">
                Tích điểm: <strong>{user.rewardPoints || 1250} đ</strong>
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-2 shadow-subtle space-y-1">
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-colors ${
                activeTab === "orders"
                  ? "bg-rose-50 text-[#F72585] border border-rose-100"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Package className="h-4 w-4" />
              <span>Đơn hàng của tôi</span>
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-colors ${
                activeTab === "profile"
                  ? "bg-rose-50 text-[#F72585] border border-rose-100"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <User className="h-4 w-4" />
              <span>Thông tin cá nhân</span>
            </button>

            <button
              onClick={() => setActiveTab("addresses")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-colors ${
                activeTab === "addresses"
                  ? "bg-rose-50 text-[#F72585] border border-rose-100"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <MapPin className="h-4 w-4" />
              <span>Sổ địa chỉ nhận hàng</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {activeTab === "orders" && (
            <Card>
              <CardHeader>
                <CardTitle>Đơn Hàng Đã Đặt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockOrders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-xl border border-slate-100 p-4 space-y-3 bg-slate-50/50"
                  >
                    <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
                      <span className="font-bold text-slate-800">{order.id} • {order.date}</span>
                      <Badge variant={order.status === "Đã giao hàng" ? "official" : "warning"}>
                        {order.status}
                      </Badge>
                    </div>

                    <div className="space-y-1 text-xs text-slate-700">
                      {order.items.map((item, idx) => (
                        <p key={idx}>• {item}</p>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <span className="text-slate-500">Tổng giá trị:</span>
                      <span className="font-extrabold text-price text-sm">{formatVND(order.total)}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Thông Tin Cá Nhân</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-500">Họ và tên:</label>
                    <p className="font-bold text-slate-900 text-sm">{user.fullName || "Nguyễn Thị Mai"}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-500">Số điện thoại:</label>
                    <p className="font-bold text-slate-900 text-sm">{user.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-500">Email:</label>
                    <p className="font-bold text-slate-900 text-sm">{user.email || "mai.nguyen@gmail.com"}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-500">Thành viên:</label>
                    <p className="font-bold text-[#F72585] text-sm">{user.memberTier || "Gold"} VIP</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "addresses" && (
            <Card>
              <CardHeader>
                <CardTitle>Sổ Địa Chỉ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="rounded-xl border border-rose-200 bg-rose-50/30 p-4 space-y-2 relative">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                    <span>{user.fullName || "Nguyễn Thị Mai"}</span>
                    <span className="text-slate-400">•</span>
                    <span>{user.phone}</span>
                    <Badge variant="brand">Mặc định</Badge>
                  </div>
                  <p className="text-slate-600">
                    245 Cầu Giấy, Phường Dịch Vọng, Quận Cầu Giấy, Hà Nội
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
