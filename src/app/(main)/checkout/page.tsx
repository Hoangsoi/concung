"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  CreditCard,
  Truck,
  CheckCircle,
  MapPin,
  ShieldCheck,
  Phone,
  User,
  ArrowRight,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { formatVND } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Vui lòng nhập họ tên đầy đủ (tối thiểu 2 ký tự)"),
  phone: z.string().regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, "Số điện thoại không hợp lệ"),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  city: z.string().min(1, "Vui lòng chọn Tỉnh / Thành phố"),
  district: z.string().min(1, "Vui lòng nhập Quận / Huyện"),
  address: z.string().min(5, "Vui lòng nhập địa chỉ cụ thể (tên đường, số nhà)"),
  paymentMethod: z.enum(["cod", "vnpay", "momo"]),
  note: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      city: "TP. Hồ Chí Minh",
      district: "Quận 1",
      address: "",
      paymentMethod: "cod",
      note: "",
    },
  });

  const selectedPayment = watch("paymentMethod");

  const onSubmit = (data: CheckoutFormData) => {
    console.log("Order Data:", data, items);
    setIsSubmitted(true);
    clearCart();
  };

  if (isSubmitted) {
    return (
      <div className="max-w-container mx-auto px-4 py-16">
        <div className="rounded-2xl border border-emerald-100 bg-white p-8 sm:p-12 text-center shadow-subtle space-y-4 max-w-lg mx-auto">
          <div className="h-20 w-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="h-10 w-10" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Đặt Hàng Thành Công!</h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Cảm ơn bạn đã tin tưởng mua sắm tại <strong>BabyMart</strong>. Đơn hàng của bạn đang được hệ thống tiếp nhận và sẽ giao trong vòng 2 giờ.
          </p>
          <div className="pt-4">
            <Link href="/">
              <Button variant="primary" size="lg" className="font-bold shadow-md">
                Quay về trang chủ
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-container mx-auto px-4 py-6 space-y-6">
      <h1 className="text-xl sm:text-2xl font-black text-slate-900">Thanh Toán Đơn Hàng</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Columns: Shipping & Payment Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address Form Card */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 sm:p-6 shadow-subtle space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 font-bold text-slate-900 text-base">
              <MapPin className="h-5 w-5 text-brand-500" />
              <span>Thông Tin Giao Hàng</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Họ và tên người nhận *"
                placeholder="Ví dụ: Nguyễn Văn A"
                {...register("fullName")}
                error={errors.fullName?.message}
                leftIcon={<User className="h-4 w-4" />}
              />

              <Input
                label="Số điện thoại *"
                placeholder="Ví dụ: 0988 123 456"
                {...register("phone")}
                error={errors.phone?.message}
                leftIcon={<Phone className="h-4 w-4" />}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Tỉnh / Thành phố *
                </label>
                <select
                  {...register("city")}
                  className="w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3 text-sm text-slate-900 focus:border-brand-500 focus:outline-none"
                >
                  <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                  <option value="Bình Dương">Bình Dương</option>
                  <option value="Cần Thơ">Cần Thơ</option>
                </select>
              </div>

              <Input
                label="Quận / Huyện *"
                placeholder="Ví dụ: Quận Cầu Giấy hoặc Quận 1"
                {...register("district")}
                error={errors.district?.message}
              />
            </div>

            <Input
              label="Địa chỉ cụ thể (Số nhà, Tên đường, Phường/Xã) *"
              placeholder="Ví dụ: 245 Cầu Giấy, Phường Dịch Vọng"
              {...register("address")}
              error={errors.address?.message}
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Ghi chú cho shipper (Không bắt buộc)
              </label>
              <textarea
                rows={2}
                placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..."
                {...register("note")}
                className="w-full rounded-lg border border-slate-200 p-3 text-sm text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:outline-none"
              ></textarea>
            </div>
          </div>

          {/* Payment Method Selection Card */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 sm:p-6 shadow-subtle space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 font-bold text-slate-900 text-base">
              <CreditCard className="h-5 w-5 text-brand-500" />
              <span>Phương Thức Thanh Toán</span>
            </div>

            <div className="space-y-3">
              <label
                onClick={() => setValue("paymentMethod", "cod")}
                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedPayment === "cod"
                    ? "border-brand-500 bg-brand-50/50"
                    : "border-slate-100 hover:border-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-brand-500" />
                  <div>
                    <span className="font-bold text-sm text-slate-800 block">
                      Thanh toán khi nhận hàng (COD)
                    </span>
                    <span className="text-xs text-slate-500">
                      Thanh toán tiền mặt cho shipper khi nhận đúng hàng
                    </span>
                  </div>
                </div>
                <input
                  type="radio"
                  value="cod"
                  checked={selectedPayment === "cod"}
                  onChange={() => {}}
                  className="text-brand-500 focus:ring-brand-500"
                />
              </label>

              <label
                onClick={() => setValue("paymentMethod", "vnpay")}
                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedPayment === "vnpay"
                    ? "border-brand-500 bg-brand-50/50"
                    : "border-slate-100 hover:border-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <div>
                    <span className="font-bold text-sm text-slate-800 block">
                      Thanh toán VNPAY-QR / Thẻ ATM
                    </span>
                    <span className="text-xs text-slate-500">
                      Quét mã QR qua Mobile Banking tất cả ngân hàng
                    </span>
                  </div>
                </div>
                <input
                  type="radio"
                  value="vnpay"
                  checked={selectedPayment === "vnpay"}
                  onChange={() => {}}
                  className="text-brand-500 focus:ring-brand-500"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Items & Total */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-subtle space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Đơn Hàng Của Bạn ({items.length} sp)
            </h3>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 max-w-[70%]">
                    <span className="font-bold text-slate-900">{item.quantity}x</span>
                    <span className="text-slate-700 truncate">{item.product.name}</span>
                  </div>
                  <span className="font-semibold text-slate-900">
                    {formatVND(item.selectedPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs border-t border-slate-100 pt-4">
              <div className="flex justify-between text-slate-600">
                <span>Tạm tính:</span>
                <span className="font-semibold text-slate-800">{formatVND(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Phí giao hàng 2h:</span>
                <span className="text-emerald-600 font-semibold">Miễn phí</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-100 pt-3">
                <span>Tổng cộng:</span>
                <span className="text-price text-lg">{formatVND(totalPrice)}</span>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="w-full font-bold shadow-md gap-2"
            >
              <span>Xác Nhận Đặt Hàng</span>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
