import React from "react";
import Link from "next/link";

export function HeaderBanner() {
  return (
    <div className="w-full bg-[#a60000] block m-0 p-0 border-0 outline-none leading-none overflow-hidden">
      <Link
        href="https://concung.com/landingpages-sua-thung-qua-to.html"
        className="w-full text-center block m-0 p-0 border-0 outline-none hover:opacity-95 transition-opacity"
      >
        <img
          src="/images/header-campaign.webp"
          alt="Sữa thùng giảm đến 40% và 100% quà to"
          width={2400}
          height={140}
          className="w-full mx-auto block border-0 outline-none p-0 h-auto md:h-[70px] object-contain object-center"
        />
      </Link>
    </div>
  );
}

