"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Headphones, PhoneCall, MessageCircle, HelpCircle, ShieldCheck, Truck, RotateCcw, ChevronDown, ChevronUp, Send, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HOTLINE_CUSTOMER_CARE, HOTLINE_PURCHASE } from "@/lib/constants";
import { openCrispChat } from "@/components/common/CrispChat";

export default function CSKHPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [submitted, setSubmitted] = useState(false);

  const faqs = [
    {
      q: "Thời gian giao hàng Siêu Tốc 1h là như thế nào?",
      a: "Đơn hàng nội thành Hà Nội & TP.HCM được xử lý và giao siêu tốc trong 1 giờ từ siêu thị Con Cưng gần nhất đối với các sản phẩm có biểu tượng Giao 1H.",
    },
    {
      q: "Chính sách 15 ngày đổi trả sản phẩm quy định ra sao?",
      a: "Khách hàng được đổi trả sản phẩm trong vòng 15 ngày kể từ ngày nhận hàng nếu sản phẩm còn nguyên tem, chưa qua sử dụng hoặc có lỗi từ nhà sản xuất.",
    },
    {
      q: "Làm thế nào để tích điểm và đổi quà Con Cưng Club?",
      a: "Khi mua sắm tại cửa hàng hoặc ứng dụng/website Con Cưng, bạn chỉ cần đọc số điện thoại đã đăng ký để tích 1% - 3% giá trị đơn hàng vào ví điểm.",
    },
    {
      q: "Tôi muốn thay đổi địa chỉ giao hàng thì làm thế nào?",
      a: "Vui lòng gọi ngay Hotline CSKH 1800 6609 (miễn phí) hoặc nhắn tin qua nút Chat Trực Tuyến Crisp CSKH để nhân viên hỗ trợ cập nhật thông tin đơn hàng kịp thời.",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-container mx-auto px-4 py-6 space-y-6">
      {/* Header section */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-rose-50 text-[#F52862] flex items-center justify-center font-bold">
          <Headphones className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Trung Tâm Chăm Sóc Khách Hàng</h1>
          <p className="text-xs text-slate-500">Con Cưng luôn sẵn sàng hỗ trợ & tư vấn 24/7 với Crisp Live Chat</p>
        </div>
      </div>

      {/* Quick Action Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Hotline Call Box */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PhoneCall className="h-5 w-5 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider">Tổng đài miễn cước</span>
            </div>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">08:00 - 22:00</span>
          </div>

          <div>
            <p className="text-xs text-rose-100">Hotline tư vấn & Khiếu nại:</p>
            <a
              href={`tel:${HOTLINE_CUSTOMER_CARE.replace(/\s+/g, "")}`}
              className="text-2xl sm:text-3xl font-black hover:underline tracking-tight block"
            >
              {HOTLINE_CUSTOMER_CARE}
            </a>
          </div>

          <div className="pt-2 flex gap-2">
            <a
              href={`tel:${HOTLINE_CUSTOMER_CARE.replace(/\s+/g, "")}`}
              className="flex-1 bg-white text-[#F52862] text-xs font-black py-2.5 px-4 rounded-xl text-center shadow hover:bg-rose-50 transition-colors"
            >
              Gọi Ngay Miễn Phí
            </a>
          </div>
        </div>

        {/* Crisp Live Chat Box */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white space-y-3 shadow-md border border-indigo-900/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sky-400">
              <MessageCircle className="h-5 w-5 animate-pulse text-sky-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">Chat Trực Tuyến Crisp CSKH</span>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
              ● Trực tuyến 24/7
            </span>
          </div>

          <div>
            <p className="text-xs text-slate-300">Nhắn tin trực tiếp với Chuyên viên CSKH Con Cưng:</p>
            <p className="text-lg font-black text-white">Crisp Live Chat Siêu Tốc</p>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              onClick={openCrispChat}
              className="flex-1 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white text-xs font-black py-2.5 px-4 rounded-xl text-center transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="h-4 w-4" />
              Chat Trực Tuyến Ngay
            </button>
            <a
              href="https://zalo.me"
              target="_blank"
              rel="noreferrer"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-2.5 px-4 rounded-xl text-center transition-colors"
            >
              Zalo OA
            </a>
          </div>
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
          <h4 className="text-xs font-bold text-slate-900">Tổng Đài 24/7</h4>
          <p className="text-[10px] text-slate-500">Miễn phí cước gọi</p>
        </div>
      </div>

      {/* FAQ & Form Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border border-slate-200">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-[#F52862]" />
              Câu Hỏi Thường Gặp (FAQ)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="border border-slate-100 rounded-xl overflow-hidden bg-slate-50/50">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-3 text-left font-bold text-xs text-slate-900 flex items-center justify-between gap-2 hover:bg-slate-100 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="h-4 w-4 shrink-0 text-slate-400" /> : <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />}
                  </button>
                  {isOpen && (
                    <div className="p-3 pt-0 text-xs text-slate-600 border-t border-slate-100 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card className="border border-slate-200">
          <CardHeader>
            <CardTitle className="text-base">Gửi Yêu Cầu Hỗ Trợ</CardTitle>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl text-center space-y-2 border border-emerald-200">
                <p className="font-bold text-xs">Gửi thành công!</p>
                <p className="text-[11px]">Đội ngũ CSKH Con Cưng sẽ liên hệ lại với bạn trong vòng 30 phút.</p>
                <Button size="sm" variant="outline" onClick={() => setSubmitted(false)} className="text-xs">
                  Gửi yêu cầu khác
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Họ và tên</label>
                  <Input required placeholder="Ví dụ: Nguyễn Văn A" className="h-9 text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Số điện thoại</label>
                  <Input required type="tel" placeholder="0988xxxxxx" className="h-9 text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Nội dung cần hỗ trợ</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Mô tả thắc mắc hoặc sự cố của bạn..."
                    className="w-full rounded-md border border-slate-300 p-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#F52862]"
                  />
                </div>
                <Button type="submit" className="w-full bg-[#F52862] hover:bg-[#d91d51] text-white text-xs font-bold h-9">
                  <Send className="h-3.5 w-3.5 mr-1" /> Gửi Yêu Cầu
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
