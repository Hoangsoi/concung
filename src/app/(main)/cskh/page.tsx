"use client";

import React from "react";
import { Headphones, MessageCircle, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { openCrispChat } from "@/components/common/CrispChat";

export default function CSKHPage() {
  return (
    <div className="min-h-screen bg-[#fff7fb] py-6 px-4">
      <div className="max-w-container mx-auto space-y-6">
        {/* Header section */}
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-[#ffedf5] text-[#f52885] flex items-center justify-center font-bold shadow-sm">
            <Headphones className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#263449]">Trung Tâm Chăm Sóc Khách Hàng</h1>
            <p className="text-xs text-[#748093]">Con Cưng luôn sẵn sàng hỗ trợ & tư vấn 24/7</p>
          </div>
        </div>

        {/* Live Chat Box - Styled with Wallet's Pink Gradient Theme */}
        <div
          className="p-6 rounded-3xl text-white space-y-5 shadow-xl shadow-[#f52885]/20 border border-[#ffffff40]"
          style={{
            background: "radial-gradient(circle at 100% 0, #ff82b5 0, transparent 45%), linear-gradient(125deg,#fa398c,#e91970)"
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <MessageCircle className="h-5 w-5 animate-pulse text-white/90" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-white">Chat Trực Tuyến CSKH</span>
            </div>
            <span className="text-[10px] bg-white/20 text-white border border-white/30 px-2.5 py-1 rounded-full font-bold backdrop-blur-sm">
              ● Trực tuyến 24/7
            </span>
          </div>

          <div>
            <p className="text-xs text-white/80">Nhắn tin trực tiếp với Chuyên viên CSKH Con Cưng:</p>
            <p className="text-2xl font-black text-white mt-1 tracking-tight">Chat Trực Tuyến Siêu Tốc</p>
          </div>

          <div className="pt-2">
            <button
              onClick={openCrispChat}
              className="w-full bg-white text-[#e91970] hover:bg-rose-50 text-sm font-black py-3.5 px-4 rounded-xl text-center transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <MessageCircle className="h-5 w-5 text-[#e91970]" />
              Chat Trực Tuyến Ngay
            </button>
          </div>
        </div>

        {/* 4 Guarantees - Wallet panel style */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div className="p-4 bg-white rounded-2xl border border-[#f3e7ee] space-y-1 shadow-sm">
            <ShieldCheck className="h-6 w-6 text-[#f52885] mx-auto" />
            <h4 className="text-xs font-bold text-[#263449]">100% Chính Hãng</h4>
            <p className="text-[10px] text-[#748093]">Cam kết chất lượng</p>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-[#f3e7ee] space-y-1 shadow-sm">
            <Truck className="h-6 w-6 text-amber-500 mx-auto" />
            <h4 className="text-xs font-bold text-[#263449]">Giao 1 Giờ</h4>
            <p className="text-[10px] text-[#748093]">Siêu tốc tận nhà</p>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-[#f3e7ee] space-y-1 shadow-sm">
            <RotateCcw className="h-6 w-6 text-emerald-500 mx-auto" />
            <h4 className="text-xs font-bold text-[#263449]">15 Ngày Đổi Trả</h4>
            <p className="text-[10px] text-[#748093]">Miễn phí thủ tục</p>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-[#f3e7ee] space-y-1 shadow-sm">
            <Headphones className="h-6 w-6 text-[#f52885] mx-auto" />
            <h4 className="text-xs font-bold text-[#263449]">Hỗ Trợ 24/7</h4>
            <p className="text-[10px] text-[#748093]">Giải đáp siêu tốc</p>
          </div>
        </div>
      </div>
    </div>
  );
}
