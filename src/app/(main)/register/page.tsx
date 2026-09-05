"use client";

import React, { useState } from "react";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Phone, Lock, Eye, EyeOff, ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import styles from "../login/login.module.css";

const registerSchema = z.object({
  fullName: z.string().min(2, "Vui lòng nhập họ và tên của ba mẹ"),
  phone: z
    .string()
    .min(1, "Vui lòng nhập số điện thoại")
    .regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, "Số điện thoại không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải chứa ít nhất 6 ký tự"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);
    setServerSuccess(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setServerError(result.error || "Đăng ký thất bại. Vui lòng thử lại.");
        return;
      }

      // Save user session to localStorage & trigger auth change event
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(result.user));
        window.dispatchEvent(new Event("user-auth-change"));
      }

      setServerSuccess(`Xin chào ba mẹ ${result.user.fullName}! Đăng ký tài khoản thành công.`);
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (err: any) {
      setServerError("Lỗi mạng hoặc server. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.formShell}>
        <Link href="/auth" className={styles.back} aria-label="Về màn hình chào"><ChevronLeft size={20} /></Link>
        <h1 className={styles.title}>Đăng ký</h1>
        <p className={styles.subtitle}>Cùng Con Cưng chăm sóc bé yêu!</p>
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

            {/* Register Form */}
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
              {/* Field 1: Full Name */}
              <div className="space-y-1">
                <Input
                  label="Họ và tên"
                  placeholder="Ba mẹ nhập họ và tên"
                  {...register("fullName")}
                  error={errors.fullName?.message}
                  leftIcon={<User className="h-4 w-4 text-pink-500" />}
                  className={styles.input}
                />
              </div>

              {/* Field 2: Phone Number */}
              <div className="space-y-1">
                <Input
                  label="Số điện thoại"
                  placeholder="0901 234 567" inputMode="tel" autoComplete="tel"
                  {...register("phone")}
                  error={errors.phone?.message}
                  leftIcon={<Phone className="h-4 w-4 text-pink-500" />}
                  className={styles.input}
                />
              </div>

              {/* Field 3: Password */}
              <div className="space-y-1">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    label="Mật khẩu"
                    placeholder="••••••••" autoComplete="new-password"
                    {...register("password")}
                    error={errors.password?.message}
                    leftIcon={<Lock className="h-4 w-4 text-pink-500" />}
                    className={styles.input}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={styles.eye}
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
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
                className={styles.primary}
              >
                <span>{isSubmitting ? "Đang tạo tài khoản..." : "Đăng ký"}</span>

              </button>
            </form>

        <p className={styles.switchLink}>Đã có tài khoản? <Link href="/login">Đăng nhập ngay</Link></p>
        <Link href="/admin" className={styles.admin}>Cổng quản trị</Link>
      </div>
    </div>
  );
}