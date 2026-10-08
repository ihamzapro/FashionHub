import React from "react";
import { OrderStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Clock, Truck, CheckCircle2, XCircle } from "lucide-react";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const normalized = status.toLowerCase();

  switch (normalized) {
    case "delivered":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#4F7A61]/10 text-[#4F7A61] border border-[#4F7A61]/20",
            className
          )}
        >
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>Delivered</span>
        </span>
      );
    case "shipped":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#1C1C1C]/10 text-[#1C1C1C] border border-[#1C1C1C]/20",
            className
          )}
        >
          <Truck className="w-3.5 h-3.5 shrink-0" />
          <span>Shipped</span>
        </span>
      );
    case "cancelled":
    case "refunded":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#B84A4A]/10 text-[#B84A4A] border border-[#B84A4A]/20",
            className
          )}
        >
          <XCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{normalized === "cancelled" ? "Cancelled" : "Refunded"}</span>
        </span>
      );
    case "processing":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#8B3A4A]/10 text-[#8B3A4A] border border-[#8B3A4A]/20",
            className
          )}
        >
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span>Processing</span>
        </span>
      );
    case "pending":
    default:
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#B78628]/10 text-[#B78628] border border-[#B78628]/25",
            className
          )}
        >
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span>Pending (COD)</span>
        </span>
      );
  }
}
