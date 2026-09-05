"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    $crisp: any[];
    CRISP_WEBSITE_ID: string;
  }
}

export function CrispChat() {
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
