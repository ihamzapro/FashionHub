import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CartItem } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Banknote, ShieldCheck } from "lucide-react";

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  className?: string;
}

export function OrderSummary({
  items,
  subtotal,
  shippingFee,
  total,
  className,
}: OrderSummaryProps) {
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Card className={className}>
      <CardHeader className="border-b border-[#E5E1DC]/80 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle>Order Summary</CardTitle>
          <span className="text-xs text-[#737373] font-mono">
            {totalItemCount} {totalItemCount === 1 ? "item" : "items"}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-4">
        {/* Scrollable Items List */}
        <div className="max-h-72 overflow-y-auto space-y-3.5 pr-1 divide-y divide-[#E5E1DC]/60">
          {items.map((item) => (
            <div
              key={item.id}
              className="pt-3.5 first:pt-0 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-14 h-16 rounded-lg bg-[#F1ECE6] border border-[#E5E1DC] overflow-hidden shrink-0">
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 space-y-0.5">
                  <p className="font-medium text-[#1C1C1C] truncate">
                    {item.product.title}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-[#737373]">
                    {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                    {item.selectedSize && item.selectedColor && <span>•</span>}
                    {item.selectedColor && <span>Shade: {item.selectedColor}</span>}
                  </div>
                  <p className="text-[11px] text-[#737373] font-mono">
                    Qty: {item.quantity} × {formatCurrency(item.product.price)}
                  </p>
                </div>
              </div>

              <span className="font-mono text-xs font-semibold text-[#1C1C1C] shrink-0 text-right">
                {formatCurrency(item.product.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Pricing Breakdown */}
        <div className="space-y-2.5 pt-4 border-t border-[#E5E1DC] text-xs">
          <div className="flex justify-between text-[#737373]">
            <span>Subtotal</span>
            <span className="font-mono text-[#1C1C1C] font-medium">
              {formatCurrency(subtotal)}
            </span>
          </div>

          <div className="flex justify-between text-[#737373]">
            <span>Shipping</span>
            <span className="font-medium text-[#1C1C1C]">
              {shippingFee === 0 ? (
                <span className="text-[#4F7A61] font-semibold">Complimentary</span>
              ) : (
                formatCurrency(shippingFee)
              )}
            </span>
          </div>

          <div className="pt-3 border-t border-[#E5E1DC] flex justify-between text-base font-semibold text-[#1C1C1C]">
            <span>Total (COD)</span>
            <span className="font-mono text-[#8B3A4A]">{formatCurrency(total)}</span>
          </div>
        </div>

        {/* Cash on Delivery Notice */}
        <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E5E1DC] text-xs space-y-1.5">
          <div className="flex items-center gap-2 text-[#4F7A61] font-medium">
            <Banknote className="w-4 h-4" />
            <span>Pay on Delivery</span>
          </div>
          <p className="text-[11px] text-[#737373] leading-relaxed">
            No advance credit card or digital payment required. You will pay in cash when the package arrives.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-[#737373] pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#4F7A61] shrink-0" />
          <span>Curated fashion guarantee with complimentary 30-day returns</span>
        </div>

        <div className="pt-2 text-center">
          <Link
            href="/cart"
            className="text-xs text-[#8B3A4A] hover:underline font-medium"
          >
            ← Modify items in Shopping Bag
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
