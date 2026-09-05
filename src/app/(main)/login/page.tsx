"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Phone, Lock, Eye, EyeOff, CheckSquare, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import styles from "./login.module.css";

const loginSchema = z.object({
  phone: z
    .string()
    .min(1, "Vui lòng nhập số điện thoại")
    .regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, "Số điện thoại không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải chứa ít nhất 6 ký tự"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    setServerSuccess(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setServerError(result.error || "Đăng nhập thất bại.");
        return;
      }

      // Save user session to localStorage & trigger auth change event
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(result.user));
        window.dispatchEvent(new Event("user-auth-change"));
      }

      setServerSuccess(`Xin chào ba mẹ ${result.user.fullName}! Đăng nhập thành công.`);
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (err: any) {
      setServerError("Lỗi kết nối server. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className={styles.page}>
      {/* Top Header Bar */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <div className="relative h-12 w-[134px]">
              <Image
                src="/images/header/logo-concung.png"
                alt="Con Cưng Logo"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>
          <span className={styles.divider} aria-hidden="true" />
          <h1 className={styles.title}>
            Đăng Nhập
          </h1>
        </div>
      </header>

      <div className={styles.content}>
        <div className={styles.banner} role="img" aria-label="Con Cưng Super Center cùng ba mẹ nuôi con" />
        {/* Keep the existing login form and its behavior. */}
        <div className={styles.formColumn}>
          <div className="w-full max-w-[420px] bg-white rounded-[28px] p-6 sm:p-9 shadow-xl border border-pink-100/60 space-y-6">
            {/* Form Title & Subtitle */}
            <div className="space-y-1.5">
              <h2 className="text-xl sm:text-[22px] font-extrabold text-slate-900 tracking-tight">
                Vui chào đón ba mẹ,
              </h2>
              <p className="text-xs sm:text-[13px] text-slate-500">
                Đăng nhập hoặc{" "}
                <Link
                  href="/register"
                  className="font-bold text-[#F72585] hover:underline"
                >
                  Đăng ký ngay tài khoản
                </Link>
              </p>
            </div>

            {/* Error or Success Alert */}
            {serverError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold">
                ⚠️ {serverError}
              </div>
            )}
            {serverSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                ✓ {serverSuccess}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Field 1: Phone Number */}
              <div className="space-y-1">
                <Input
                  label="Số điện thoại *"
                  placeholder="Ba mẹ nhập vào số điện thoại"
                  {...register("phone")}
                  error={errors.phone?.message}
                  leftIcon={<Phone className="h-4 w-4 text-slate-400" />}
                  className="h-12 bg-slate-50/80 border-slate-200 focus:bg-white rounded-xl text-sm"
                />
              </div>

              {/* Field 2: Password */}
              <div className="space-y-1">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    label="Mật khẩu *"
                    placeholder="Ba mẹ nhập mật khẩu"
                    {...register("password")}
                    error={errors.password?.message}
                    leftIcon={<Lock className="h-4 w-4 text-slate-400" />}
                    className="h-12 bg-slate-50/80 border-slate-200 focus:bg-white rounded-xl text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-600 focus:outline-none"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
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
                    className={`w-4 h-4 ${
                      agreed ? "fill-[#F72585] text-white" : "text-slate-300"
                    }`}
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
      </div>
    </div>
  );
}
