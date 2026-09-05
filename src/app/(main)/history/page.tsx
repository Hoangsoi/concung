"use client";

import React from "react";
import { History } from "lucide-react";
import { WalletHistory } from "@/components/wallet/WalletHistory";

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-[#fff7fb] py-6 px-4">
      <div className="max-w-container mx-auto space-y-6">
        {/* Header section */}
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-[#ffedf5] text-[#f52885] flex items-center justify-center font-bold shadow-sm">
            <History className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#263449]">Lịch sử giao dịch</h1>
            <p className="text-xs text-[#748093]">Theo dõi nạp/rút tiền của ví</p>
          </div>
        </div>

        {/* Wallet History Component */}
        <WalletHistory />
      </div>
    </div>
  );
}
