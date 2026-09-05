"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./TopBar.module.css";

export interface UserSession {
  id?: number;
  fullName: string;
  phone: string;
}

export function TopBar() {
  const [user, setUser] = useState<UserSession | null>(null);

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
    }
  };

  useEffect(() => {
    checkUserSession();

    // Listen for custom auth state changes
    window.addEventListener("user-auth-change", checkUserSession);
    window.addEventListener("storage", checkUserSession);
    return () => {
      window.removeEventListener("user-auth-change", checkUserSession);
      window.removeEventListener("storage", checkUserSession);
    };
  }, []);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem("user");
    setUser(null);
    window.dispatchEvent(new Event("user-auth-change"));
  };

  return (
    <div className={styles.bar}>
      <div className={styles.container}>
        <div className={styles.hotline}>
          <span>Mua hàng và CSKH:</span>
          <a href="tel:18006609">1800 6609</a>
          <img src="/images/header/free-call.png" alt="Gọi miễn phí" />
        </div>

        <Link href="/stores" className={styles.store}>
          <img src="/images/header/store.png" alt="" />
          <span>
            Tìm Siêu Thị <strong>(1158)</strong>
          </span>
        </Link>

        <Link href="/account" className={styles.address}>
          <span className={styles.clock} aria-hidden="true">
            ◷<small>1h</small>
          </span>
          <span>Nhập địa chỉ để mua hàng giao Siêu Tốc 1h</span>
        </Link>

        {user ? (
          <div className="flex items-center gap-2">
            <Link href="/account" className={styles.login}>
              <img src="/images/header/customer-login.png" alt="" />
              <span className="font-bold text-[#F72585] max-w-[130px] truncate">
                {user.fullName || user.phone}
              </span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="text-[11px] text-slate-400 hover:text-rose-600 underline font-medium cursor-pointer"
            >
              (Đăng xuất)
            </button>
          </div>
        ) : (
          <Link href="/login" className={styles.login}>
            <img src="/images/header/customer-login.png" alt="" />
            <span>Đăng nhập</span>
          </Link>
        )}
      </div>
    </div>
  );
}
