"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    $crisp: any[];
    CRISP_WEBSITE_ID: string;
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

      // Hide floating Crisp icon by default so it never covers the bottom nav or other pages
      window.$crisp.push(["safe", true]);
      window.$crisp.push(["do", "chat:hide"]);
    }
  }, []);

  // Control Crisp visibility dynamically per route
  useEffect(() => {
    if (typeof window === "undefined" || !window.$crisp) return;

    if (pathname === "/cskh" || pathname.startsWith("/cskh/")) {
      // On CSKH page: Crisp remains hidden until user triggers chat or can be opened
      window.$crisp.push(["do", "chat:hide"]);
    } else {
      // On any other page (Trang chủ, Lịch sử, Ví, Tôi...): forcibly close and hide Crisp
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
          // Immediately hide Crisp floating icon when user closes the chat window
          window.$crisp.push(["do", "chat:hide"]);
        },
      ]);
    } catch {
      // Ignore
    }
  }, []);

  return null;
}

export function openCrispChat() {
  if (typeof window !== "undefined") {
    window.$crisp = window.$crisp || [];
    window.$crisp.push(["do", "chat:show"]);
    window.$crisp.push(["do", "chat:open"]);
  }
}
