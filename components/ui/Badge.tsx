import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "accent" | "success" | "warning" | "error" | "outline";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center font-medium tracking-wide uppercase transition-colors rounded-full select-none";

  const variants = {
    default: "bg-[#1C1C1C]/10 text-[#1C1C1C]",
    secondary: "bg-[#F1ECE6] text-[#242424]",
    accent: "bg-[#8B3A4A]/10 text-[#8B3A4A]",
    success: "bg-[#4F7A61]/10 text-[#4F7A61]",
    warning: "bg-[#B78628]/10 text-[#B78628]",
    error: "bg-[#B84A4A]/10 text-[#B84A4A]",
    outline: "border border-[#E5E1DC] text-[#242424] bg-transparent",
  };

  const sizes = {
    sm: "text-[10px] px-2 py-0.5 tracking-wider",
    md: "text-xs px-2.5 py-0.5",
  };

  return (
    <span
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </span>
  );
}
