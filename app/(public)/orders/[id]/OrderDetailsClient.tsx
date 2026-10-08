"use client";

import React from "react";
import Link from "next/link";
import { useOrders } from "@/context";
import { OrderDetails } from "@/components/orders/OrderDetails";
import { Button } from "@/components/ui/Button";
import { PackageX, ArrowLeft } from "lucide-react";

import { ProtectedRoute } from "@/components/auth";

interface OrderDetailsClientProps {
  orderId: string;
}

export function OrderDetailsClient({ orderId }: OrderDetailsClientProps) {
  const { getOrderById } = useOrders();
  const order = getOrderById(orderId);

  return (
    <ProtectedRoute allowedRoles={["customer", "supplier", "admin"]}>
      {order ? (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <OrderDetails order={order} />
        </div>
      ) : (
        <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#E5E1DC] flex items-center justify-center mx-auto text-[#737373]">
            <PackageX className="w-8 h-8 text-[#B84A4A]" />
          </div>
          <div>
            <h1 className="font-editorial text-2xl sm:text-3xl text-[#1C1C1C]">
              Order Not Found
            </h1>
            <p className="text-xs text-[#737373] mt-1.5 max-w-sm mx-auto leading-relaxed">
              We could not find an order matching identifier <strong className="font-mono text-[#1C1C1C]">{orderId}</strong>. It may have been removed or placed in a different browser session.
            </p>
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <Link href="/orders">
              <Button variant="default" size="md" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Orders</span>
              </Button>
            </Link>
            <Link href="/products">
              <Button variant="outline" size="md">
                Browse Boutique
              </Button>
            </Link>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
