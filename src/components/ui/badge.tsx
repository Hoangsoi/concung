import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "brand" | "sale" | "official" | "outline" | "neutral" | "warning";
}

export function Badge({
  className,
  variant = "brand",
  children,
  ...props
}: BadgeProps) {
  const variants = {
    brand: "bg-brand-50 text-brand-600 border border-brand-100",
    sale: "bg-red-500 text-white font-bold",
    official: "bg-emerald-50 text-emerald-600 border border-emerald-200",
    outline: "border border-slate-200 text-slate-700 bg-white",
    neutral: "bg-slate-100 text-slate-700",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
