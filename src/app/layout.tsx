import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/constants";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-be-vietnam",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${BRAND_NAME} - Chuỗi Siêu Thị Mẹ & Bé Chính Hãng`,
    template: `%s | ${BRAND_NAME}`,
  },
  description: BRAND_TAGLINE,
  keywords: ["Mẹ và Bé", "Tã bỉm em bé", "Sữa bột chính hãng", "Xe đẩy em bé", "BabyMart"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${beVietnamPro.variable} scroll-smooth`}>
      <body className="font-sans bg-surface-muted min-h-screen text-slate-800 flex flex-col">
        {children}
      </body>
    </html>
  );
}
