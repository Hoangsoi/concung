"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Users,
  ShieldCheck,
  Home,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowDownToLine,
  ArrowUpFromLine,
  Lock,
  User,
  LogOut,
  RefreshCcw,
  Search,
  Landmark,
} from "lucide-react";
import { formatVND } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Customer {
  id: number;
  fullName: string;
  phone: string;
  createdAt: string;
  bankName?: string;
  accountNumber?: string;
  accountHolder?: string;
  balance?: number;
}

interface Transaction {
  id: number;
  userId: number;
  userName: string;
  userPhone: string;
  type: "deposit" | "withdraw";
  amount: number;
  bankName?: string;
  accountNumber?: string;
  accountHolder?: string;
  status: "pending" | "approved" | "rejected";
  note?: string;
  createdAt: string;
}

export default function AdminPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminUser, setAdminUser] = useState<string>("admin");
  const [usernameInput, setUsernameInput] = useState("admin");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  // Admin Dashboard State
  const [activeTab, setActiveTab] = useState<"overview" | "customers" | "transactions">("overview");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [txFilter, setTxFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingData, setLoadingData] = useState(false);

  // Check Admin Authentication on Load
  const checkAdminAuth = async () => {
    try {
      const res = await fetch("/api/admin/login", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setIsAuthenticated(data.authenticated);
        if (data.authenticated) {
          void loadAdminData();
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    void checkAdminAuth();
  }, []);

  const loadAdminData = async () => {
    setLoadingData(true);
    try {
      const [custRes, txRes] = await Promise.all([
        fetch("/api/admin/customers", { cache: "no-store" }),
        fetch("/api/admin/transactions", { cache: "no-store" }),
      ]);

      if (custRes.ok) {
        const custData = await custRes.json();
        setCustomers(custData.customers || []);
      }

      if (txRes.ok) {
        const txData = await txRes.json();
        setTransactions(txData.transactions || []);
      }
    } catch (err) {
      console.warn("Failed to load admin data:", err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsSubmittingLogin(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameInput,
          password: passwordInput,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || "Tài khoản hoặc mật khẩu không chính xác.");
        return;
      }

      setAdminUser(data.admin?.username || "admin");
      setIsAuthenticated(true);
      void loadAdminData();
    } catch (err) {
      setLoginError("Không thể kết nối đến server. Vui lòng thử lại.");
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  const handleAdminLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      // Ignore
    }
    setIsAuthenticated(false);
    setPasswordInput("");
  };

  const handleUpdateTxStatus = async (txId: number, newStatus: "approved" | "rejected") => {
    try {
      const res = await fetch("/api/admin/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateStatus",
          transactionId: txId,
          status: newStatus,
        }),
      });

      if (res.ok) {
        setTransactions((prev) =>
          prev.map((tx) => (tx.id === txId ? { ...tx, status: newStatus } : tx))
        );
      }
    } catch (err) {
      console.error("Error updating transaction status:", err);
    }
  };

  // Render Login Portal View if not authenticated
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="h-14 w-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-[#F52862] flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="h-8 w-8 text-[#F52862]" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Cổng Quản Trị Hệ Thống</h1>
            <p className="text-xs text-slate-400">Đăng nhập tài khoản Admin để truy cập dashboard</p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-bold flex items-center gap-2">
              <XCircle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">Tài khoản Admin</label>
              <div className="relative">
                <User className="h-4 w-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm font-semibold text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">Mật khẩu Admin</label>
              <div className="relative">
                <Lock className="h-4 w-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm font-semibold text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmittingLogin}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-black py-3.5 rounded-xl shadow-lg shadow-rose-500/20 text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmittingLogin ? (
                <>
                  <RefreshCcw className="h-4 w-4 animate-spin" />
                  <span>Đang xác thực...</span>
                </>
              ) : (
                <span>Đăng Nhập Cổng Quản Trị</span>
              )}
            </button>
          </form>

          <div className="pt-2 text-center border-t border-slate-800">
            <Link href="/" className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1">
              <Home className="h-3.5 w-3.5" />
              <span>Quay lại trang chủ Con Cưng</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <RefreshCcw className="h-6 w-6 animate-spin text-rose-500" />
      </div>
    );
  }

  // Filter transactions
  const filteredTxs = transactions.filter((tx) => {
    if (txFilter !== "all" && tx.status !== txFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        tx.userName?.toLowerCase().includes(q) ||
        tx.userPhone?.includes(q) ||
        tx.bankName?.toLowerCase().includes(q) ||
        tx.accountNumber?.includes(q)
      );
    }
    return true;
  });

  // Filter customers
  const filteredCustomers = customers.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.fullName?.toLowerCase().includes(q) ||
      c.phone?.includes(q) ||
      c.bankName?.toLowerCase().includes(q) ||
      c.accountNumber?.includes(q)
    );
  });

  const pendingCount = transactions.filter((t) => t.status === "pending").length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 space-y-6 font-sans">
      {/* Top Bar Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white flex items-center justify-center font-bold shadow-lg shadow-rose-500/20">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Quản Trị Hệ Thống Con Cưng
            </h1>
            <p className="text-xs text-slate-400">
              Quản lý tài khoản khách hàng, liên kết ngân hàng & duyệt nạp/rút tiền
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={loadAdminData}
            variant="outline"
            size="sm"
            className="bg-slate-900 border-slate-800 text-slate-300 hover:text-white"
          >
            <RefreshCcw className={`h-4 w-4 ${loadingData ? "animate-spin text-rose-400" : ""}`} />
            <span>Làm mới</span>
          </Button>

          <Link href="/">
            <Button variant="outline" size="sm" className="bg-slate-900 border-slate-800 text-slate-300 hover:text-white">
              <Home className="h-4 w-4" />
              <span>Trang chủ</span>
            </Button>
          </Link>

          <Button
            onClick={handleAdminLogout}
            size="sm"
            className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 font-bold"
          >
            <LogOut className="h-4 w-4" />
            <span>Đăng xuất</span>
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "overview"
              ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          <span>Tổng quan</span>
        </button>

        <button
          onClick={() => setActiveTab("transactions")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 relative ${
            activeTab === "transactions"
              ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <ArrowUpFromLine className="h-4 w-4" />
          <span>Quản lý Nạp / Rút</span>
          {pendingCount > 0 && (
            <span className="bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded-full text-[10px] font-black animate-pulse">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("customers")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "customers"
              ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Quản lý Khách Hàng</span>
        </button>
      </div>

      {/* SEARCH BAR FOR TABLES */}
      {(activeTab === "transactions" || activeTab === "customers") && (
        <div className="relative max-w-md">
          <Search className="h-4 w-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên, SĐT, tên ngân hàng hoặc số tài khoản..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>
      )}

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-2">
              <span className="text-xs text-slate-400 font-medium">Khách Hàng Đã Đăng Ký</span>
              <p className="text-2xl font-black text-white">{customers.length} khách hàng</p>
              <span className="text-[11px] text-emerald-400 font-bold">Tài khoản hoạt động</span>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-2">
              <span className="text-xs text-slate-400 font-medium">Yêu Cầu Nạp/Rút Chờ Duyệt</span>
              <p className="text-2xl font-black text-amber-400">{pendingCount} yêu cầu</p>
              <span className="text-[11px] text-amber-300">Cần admin xử lý</span>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-2">
              <span className="text-xs text-slate-400 font-medium">Tổng Đã Duyệt Nạp</span>
              <p className="text-2xl font-black text-emerald-400">
                {formatVND(
                  transactions
                    .filter((t) => t.type === "deposit" && t.status === "approved")
                    .reduce((sum, t) => sum + Number(t.amount), 0)
                )}
              </p>
              <span className="text-[11px] text-slate-400">Đã cộng số dư ví</span>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-2">
              <span className="text-xs text-slate-400 font-medium">Tổng Đã Duyệt Rút</span>
              <p className="text-2xl font-black text-rose-400">
                {formatVND(
                  transactions
                    .filter((t) => t.type === "withdraw" && t.status === "approved")
                    .reduce((sum, t) => sum + Number(t.amount), 0)
                )}
              </p>
              <span className="text-[11px] text-slate-400">Đã chi trả về ngân hàng</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TRANSACTIONS (NẠP / RÚT TIỀN) */}
      {activeTab === "transactions" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-800">
            <div className="flex gap-2">
              {(["all", "pending", "approved", "rejected"] as const).map((filterVal) => (
                <button
                  key={filterVal}
                  onClick={() => setTxFilter(filterVal)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    txFilter === filterVal
                      ? "bg-rose-500 text-white"
                      : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {filterVal === "all" && "Tất cả"}
                  {filterVal === "pending" && `Chờ duyệt (${pendingCount})`}
                  {filterVal === "approved" && "Đã duyệt"}
                  {filterVal === "rejected" && "Từ chối"}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="border-b border-slate-800 bg-slate-950 text-slate-400 uppercase font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Mã GD</th>
                    <th className="py-3.5 px-4">Khách Hàng</th>
                    <th className="py-3.5 px-4">Loại GD</th>
                    <th className="py-3.5 px-4">Số Tiền</th>
                    <th className="py-3.5 px-4">Thông Tin Ngân Hàng</th>
                    <th className="py-3.5 px-4">Thời Gian</th>
                    <th className="py-3.5 px-4">Trạng Thái</th>
                    <th className="py-3.5 px-4 text-right">Xử Lý Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredTxs.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-500">
                        Không tìm thấy lịch sử giao dịch nào
                      </td>
                    </tr>
                  ) : (
                    filteredTxs.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-white">#{tx.id}</td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white">{tx.userName}</div>
                          <div className="text-[11px] text-slate-400">{tx.userPhone}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          {tx.type === "deposit" ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                              <ArrowDownToLine className="h-3 w-3" /> Nạp Tiền
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-rose-400 font-bold bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-md">
                              <ArrowUpFromLine className="h-3 w-3" /> Rút Tiền
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-black text-sm text-white">
                          {formatVND(Number(tx.amount))}
                        </td>
                        <td className="py-3.5 px-4">
                          {tx.bankName ? (
                            <div>
                              <div className="font-bold text-slate-200">{tx.bankName}</div>
                              <div className="text-[11px] text-slate-400 font-mono">{tx.accountNumber}</div>
                              <div className="text-[10px] text-slate-400 uppercase">{tx.accountHolder}</div>
                            </div>
                          ) : (
                            <span className="text-slate-500 italic">Chưa liên kết</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                          {new Date(tx.createdAt).toLocaleString("vi-VN")}
                        </td>
                        <td className="py-3.5 px-4">
                          {tx.status === "pending" && (
                            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1">
                              <Clock className="h-3 w-3" /> Chờ Duyệt
                            </span>
                          )}
                          {tx.status === "approved" && (
                            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" /> Đã Duyệt
                            </span>
                          )}
                          {tx.status === "rejected" && (
                            <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1">
                              <XCircle className="h-3 w-3" /> Từ Chối
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {tx.status === "pending" ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleUpdateTxStatus(tx.id, "approved")}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg font-bold text-[11px] transition-colors cursor-pointer shadow-sm"
                              >
                                Duyệt
                              </button>
                              <button
                                onClick={() => handleUpdateTxStatus(tx.id, "rejected")}
                                className="bg-red-600/80 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg font-bold text-[11px] transition-colors cursor-pointer shadow-sm"
                              >
                                Từ chối
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-500 font-semibold">Đã xử lý</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOMERS */}
      {activeTab === "customers" && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-slate-800 bg-slate-950 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Mã KH</th>
                  <th className="py-3.5 px-4">Họ và Tên</th>
                  <th className="py-3.5 px-4">Số Điện Thoại</th>
                  <th className="py-3.5 px-4">Tài Khoản Ngân Hàng Liên Kết</th>
                  <th className="py-3.5 px-4">Ngày Đăng Ký</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      Chưa có khách hàng nào trong cơ sở dữ liệu
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white">#KH-{c.id}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-100">{c.fullName}</td>
                      <td className="py-3.5 px-4 font-mono text-rose-400 font-bold">{c.phone}</td>
                      <td className="py-3.5 px-4">
                        {c.bankName ? (
                          <div className="space-y-0.5">
                            <div className="font-bold text-emerald-400 flex items-center gap-1">
                              <Landmark className="h-3 w-3" />
                              {c.bankName}
                            </div>
                            <div className="font-mono text-slate-300 text-[11px]">{c.accountNumber}</div>
                            <div className="text-[10px] text-slate-400 uppercase">{c.accountHolder}</div>
                          </div>
                        ) : (
                          <span className="text-slate-500 italic">Chưa liên kết ngân hàng</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {new Date(c.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
