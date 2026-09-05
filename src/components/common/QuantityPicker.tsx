"use client";

import React from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantityPickerProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
}

export function QuantityPicker({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "md",
}: QuantityPickerProps) {
  const handleDecrease = () => {
    if (value > min) onChange(value - 1);
  };

  const handleIncrease = () => {
    if (value < max) onChange(value + 1);
  };

  const sizeClasses = {
    sm: "h-7 w-7 text-xs",
    md: "h-9 w-9 text-sm",
  };

  return (
    <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white p-0.5">
      <button
        type="button"
        onClick={handleDecrease}
        disabled={value <= min}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-transparent",
          sizeClasses[size]
        )}
        aria-label="Decrease quantity"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>

      <span
        className={cn(
          "font-semibold text-slate-800 text-center px-2",
          size === "sm" ? "w-7 text-xs" : "w-10 text-sm"
        )}
      >
        {value}
      </span>

      <button
        type="button"
        onClick={handleIncrease}
        disabled={value >= max}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-transparent",
          sizeClasses[size]
        )}
        aria-label="Increase quantity"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
