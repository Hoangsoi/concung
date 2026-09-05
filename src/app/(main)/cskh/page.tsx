"use client";

import React from "react";
import { Headphones, MessageCircle, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { openCrispChat } from "@/components/common/CrispChat";

export default function CSKHPage() {
  return (
    <div className="max-w-container mx-auto px-4 py-6 space-y-6">
      {/* Header section */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-rose-50 text-[#F52862] flex items-center justify-center font-bold">
          <Headphones className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Trung Tâm Chăm Sóc Khách Hàng</h1>
          <p className="text-xs text-slate-500">Con Cưng luôn sẵn sàng hỗ trợ & tư vấn 24/7</p>
        </div>
      </div>

      {/* Live Chat Box */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white space-y-4 shadow-md border border-indigo-900/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sky-400">
            <MessageCircle className="h-5 w-5 animate-pulse text-sky-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">Chat Trực Tuyến CSKH</span>
          </div>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full font-bold">
            ● Trực tuyến 24/7
          </span>
        </div>

        <div>
          <p className="text-xs text-slate-300">Nhắn tin trực tiếp với Chuyên viên CSKH Con Cưng:</p>
          <p className="text-xl font-black text-white mt-1">Chat Trực Tuyến Siêu Tốc</p>
        </div>

        <div className="pt-2 flex gap-3">
          <button
            onClick={openCrispChat}
            className="flex-1 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white text-sm font-black py-3 px-4 rounded-xl text-center transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="h-5 w-5" />
            Chat Trực Tuyến Ngay
          </button>
          <a
            href="https://zalo.me"
            target="_blank"
            rel="noreferrer"
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-bold py-3 px-6 rounded-xl text-center transition-colors flex items-center justify-center"
          >
            Zalo OA
          </a>
        </div>
      </div>

      {/* 4 Guarantees */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
        <div className="p-3 bg-white rounded-xl border border-slate-100 space-y-1">
          <ShieldCheck className="h-5 w-5 text-[#F52862] mx-auto" />
          <h4 className="text-xs font-bold text-slate-900">100% Chính Hãng</h4>
          <p className="text-[10px] text-slate-500">Cam kết chất lượng</p>
        </div>
        <div className="p-3 bg-white rounded-xl border border-slate-100 space-y-1">
          <Truck className="h-5 w-5 text-amber-500 mx-auto" />
          <h4 className="text-xs font-bold text-slate-900">Giao 1 Giờ</h4>
          <p className="text-[10px] text-slate-500">Siêu tốc tận nhà</p>
        </div>
        <div className="p-3 bg-white rounded-xl border border-slate-100 space-y-1">
          <RotateCcw className="h-5 w-5 text-emerald-500 mx-auto" />
          <h4 className="text-xs font-bold text-slate-900">15 Ngày Đổi Trả</h4>
          <p className="text-[10px] text-slate-500">Miễn phí thủ tục</p>
        </div>
        <div className="p-3 bg-white rounded-xl border border-slate-100 space-y-1">
          <Headphones className="h-5 w-5 text-sky-500 mx-auto" />
          <h4 className="text-xs font-bold text-slate-900">Hỗ Trợ 24/7</h4>
          <p className="text-[10px] text-slate-500">Giải đáp siêu tốc</p>
        </div>
      </div>
    </div>
  );
}
