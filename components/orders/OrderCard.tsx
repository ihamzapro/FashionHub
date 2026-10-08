import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Order } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/Card";
import { Banknote, ArrowRight } from "lucide-react";

interface OrderCardProps {
  order: Order;
  className?: string;
}

export function OrderCard({ order, className }: OrderCardProps) {
  const totalItemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const previewItems = order.items.slice(0, 4);
  const remainingCount = order.items.length - previewItems.length;

  return (
    <Card className={className}>
      {/* Order Header */}
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E1DC]/80 pb-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-sm font-semibold text-[#1C1C1C]">
              Order #{order.orderNumber}
            </span>
            <OrderStatusBadge status={order.status || order.orderStatus || "Pending"} />
          </div>
          <p className="text-xs text-[#737373]">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-[10px] uppercase tracking-wider text-[#737373] block">
            Total Due
          </span>
          <span className="font-editorial text-lg text-[#1C1C1C] font-semibold">
            {formatCurrency(order.totalAmount ?? order.total ?? 0)}
          </span>
        </div>
      </CardHeader>

      {/* Order Content */}
      <CardContent className="py-4 space-y-4">
        {/* Thumbnails row & item count */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {previewItems.map((item) => (
              <div
                key={item.id}
                className="relative w-14 h-16 rounded-lg bg-[#F1ECE6] border border-[#E5E1DC] overflow-hidden shrink-0"
                title={`${item.title} (x${item.quantity})`}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
                {item.quantity > 1 && (
                  <span className="absolute bottom-1 right-1 bg-[#1C1C1C]/80 text-white text-[9px] font-mono px-1 rounded">
                    x{item.quantity}
                  </span>
                )}
              </div>
            ))}

            {remainingCount > 0 && (
              <div className="w-14 h-16 rounded-lg bg-[#FAF8F5] border border-dashed border-[#E5E1DC] flex items-center justify-center text-[11px] font-mono text-[#737373] shrink-0">
                +{remainingCount}
              </div>
            )}
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs text-[#737373] block">
              {totalItemCount} {totalItemCount === 1 ? "piece" : "pieces"}
            </span>
          </div>
        </div>

        {/* Payment info bar */}
        <div className="flex items-center justify-between text-xs p-3 bg-[#FAF8F5] rounded-lg border border-[#E5E1DC]">
          <span className="text-[#737373] flex items-center gap-1.5">
            <Banknote className="w-4 h-4 text-[#4F7A61]" />
            <span>Payment Method:</span>
            <strong className="text-[#1C1C1C] font-medium">Cash on Delivery (COD)</strong>
          </span>
          <span className="text-[11px] text-[#737373]">
            Status: <span className="text-[#B78628] font-medium">{order.paymentStatus || "Pending"}</span>
          </span>
        </div>
      </CardContent>

      {/* Order Footer Actions */}
      <CardFooter className="flex items-center justify-between pt-3 border-t border-[#E5E1DC]/80">
        <span className="text-xs text-[#737373]">
          Delivering to: <strong className="text-[#1C1C1C]">{order.shippingAddress.city}, {order.shippingAddress.state}</strong>
        </span>

        <Link href={`/orders/${order.id}`}>
          <Button variant="outline" size="sm" className="gap-1.5 hover:border-[#1C1C1C]">
            <span>View Order</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
