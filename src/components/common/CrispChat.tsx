"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    $crisp: any[];
    CRISP_WEBSITE_ID: string;
  }
}

export function openCrispChat() {
  if (typeof window !== "undefined") {
    window.$crisp = window.$crisp || [];
    window.$crisp.push(["do", "chat:show"]);
    window.$crisp.push(["do", "chat:open"]);

    // Retry opening to ensure Crisp SDK processes command after async load
    let count = 0;
    const timer = setInterval(() => {
      count++;
      if (typeof window !== "undefined" && window.$crisp) {
        window.$crisp.push(["do", "chat:show"]);
        window.$crisp.push(["do", "chat:open"]);
      }
      if (count >= 5) clearInterval(timer);
    }, 400);
  }
}

export function CrispChat() {
  const pathname = usePathname();

  useEffect(() => {
    window.$crisp = window.$crisp || [];
    window.CRISP_WEBSITE_ID = "be3b7983-f559-4a65-8562-376ac00f201c";

    if (!document.getElementById("crisp-chat-script")) {
      const d = document;
      const s = d.createElement("script");
      s.id = "crisp-chat-script";
      s.src = "https://client.crisp.chat/l.js";
      s.async = true;
      d.getElementsByTagName("head")[0].appendChild(s);

      window.$crisp.push(["safe", true]);
    }
  }, []);

  // Route change listener: Auto-open Crisp on /cskh, auto-hide on all other pages
  useEffect(() => {
    if (typeof window === "undefined" || !window.$crisp) return;

    if (pathname === "/cskh" || pathname.startsWith("/cskh/")) {
      // Automatically open Crisp chat when arriving on CSKH page
      openCrispChat();
    } else {
      // Forcibly close and hide Crisp chat on any non-CSKH page (Trang chủ, Lịch sử, Ví, Tôi)
      window.$crisp.push(["do", "chat:close"]);
      window.$crisp.push(["do", "chat:hide"]);
    }
  }, [pathname]);

  // Listen for user closing Crisp chat window
  useEffect(() => {
    if (typeof window === "undefined" || !window.$crisp) return;

    try {
      window.$crisp.push([
        "on",
        "chat:closed",
        () => {
          // Hide floating bubble when user closes chat window
          window.$crisp.push(["do", "chat:hide"]);
        },
      ]);
    } catch {
      // Ignore
    }
  }, []);

  return null;
}
