"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/register") {
    return <main>{children}</main>;
  }

  if (pathname === "/wallet") {
    return <><main className="min-h-screen pb-24">{children}</main><MobileNav /></>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pb-20 md:pb-12">{children}</main>
      <Footer />
      <MobileNav />
    </div>
  );
}
