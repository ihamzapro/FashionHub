"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useOrders } from "@/context";
import { formatCurrency, formatDate } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import {
  CheckCircle2,
  Banknote,
  MapPin,
  Package,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { orders, getOrderById, isHydrated } = useOrders();

  // Find order by ID or fall back to the most recent order
  const order = orderId ? getOrderById(orderId) : orders[0];

  if (!isHydrated) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-2 border-[#1C1C1C] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-[#737373]">Loading order confirmation...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-xl font-editorial text-[#1C1C1C]">Order Confirmation</h2>
        <p className="text-xs text-[#737373]">
          No recent order found in this session. You can view your past orders below.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link href="/orders">
            <Button variant="default" size="md">
              View Order History
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="outline" size="md">
              Browse Boutique
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const finalTotal = order.totalAmount ?? order.total ?? 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Hero Success Notification Card */}
      <div className="bg-white border border-[#E5E1DC] rounded-2xl p-6 sm:p-10 text-center space-y-4 shadow-xs">
        <div className="w-16 h-16 rounded-full bg-[#4F7A61]/10 text-[#4F7A61] flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[#4F7A61]">
            Order Placed Successfully
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl text-[#1C1C1C] font-normal">
            Thank You for Your Order
          </h1>
          <p className="text-xs sm:text-sm text-[#737373] max-w-md mx-auto leading-relaxed">
            Your selection has been received and allocated to our atelier logistics partners.
          </p>
        </div>

        {/* Quick Order Header Details */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs">
          <div className="px-3 py-1.5 bg-[#FAF8F5] border border-[#E5E1DC] rounded-lg">
            <span className="text-[#737373]">Order Number: </span>
            <strong className="font-mono text-[#1C1C1C]">#{order.orderNumber}</strong>
          </div>

          <div className="px-3 py-1.5 bg-[#FAF8F5] border border-[#E5E1DC] rounded-lg">
            <span className="text-[#737373]">Order Date: </span>
            <strong className="text-[#1C1C1C]">{formatDate(order.createdAt)}</strong>
          </div>

          <OrderStatusBadge status={order.status || order.orderStatus || "Pending"} />
        </div>
      </div>

      {/* COD Payment Highlight Card */}
      <div className="bg-[#FAF8F5] border-2 border-[#1C1C1C] rounded-xl p-5 sm:p-6 space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#4F7A61]/15 text-[#4F7A61] flex items-center justify-center shrink-0">
            <Banknote className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#1C1C1C]">
              Payment Method: Cash on Delivery (COD)
            </h3>
            <p className="text-xs text-[#737373] mt-0.5">
              Please have <strong className="text-[#1C1C1C]">{formatCurrency(finalTotal)}</strong> in cash ready when the courier arrives at your doorstep.
            </p>
          </div>
        </div>
      </div>

      {/* Order Summary & Destination Split Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Delivery Address */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xs uppercase tracking-wider flex items-center gap-2 text-[#737373]">
              <MapPin className="w-4 h-4 text-[#8B3A4A]" />
              <span>Delivery Address</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-xs text-[#242424]">
            <p className="font-semibold text-sm text-[#1C1C1C]">
              {order.shippingAddress.fullName}
            </p>
            <p>{order.shippingAddress.street}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
              {order.shippingAddress.postalCode}
            </p>
            <p className="text-[#737373]">{order.shippingAddress.country}</p>
            <p className="pt-2 text-[#737373]">
              Phone: {order.customerPhone || order.shippingAddress.phone}
            </p>
          </CardContent>
        </Card>

        {/* Pricing Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xs uppercase tracking-wider flex items-center gap-2 text-[#737373]">
              <Package className="w-4 h-4 text-[#8B3A4A]" />
              <span>Payment Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 text-xs">
            <div className="flex justify-between text-[#737373]">
              <span>Subtotal ({order.items.length} items)</span>
              <span className="font-mono text-[#1C1C1C] font-medium">
                {formatCurrency(order.subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-[#737373]">
              <span>Insured Shipping</span>
              <span className="font-medium text-[#1C1C1C]">
                {order.shippingFee === 0 ? (
                  <span className="text-[#4F7A61] font-semibold">Complimentary</span>
                ) : (
                  formatCurrency(order.shippingFee)
                )}
              </span>
            </div>
            <div className="pt-2 border-t border-[#E5E1DC] flex justify-between text-base font-semibold text-[#1C1C1C]">
              <span>Total (Pay on Delivery)</span>
              <span className="font-mono text-[#8B3A4A]">{formatCurrency(finalTotal)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ordered Items Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Ordered Pieces</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-[#E5E1DC]/70">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4 text-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-14 h-16 rounded-lg bg-[#F1ECE6] border border-[#E5E1DC] overflow-hidden shrink-0">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <p className="font-medium text-[#1C1C1C] truncate">{item.title}</p>
                  <div className="flex items-center gap-2 text-[11px] text-[#737373]">
                    {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                    {item.selectedSize && item.selectedColor && <span>•</span>}
                    {item.selectedColor && <span>Shade: {item.selectedColor}</span>}
                  </div>
                  <p className="text-[11px] text-[#737373] font-mono">
                    Qty: {item.quantity} × {formatCurrency(item.price)}
                  </p>
                </div>
              </div>

              <span className="font-mono font-semibold text-[#1C1C1C] text-right">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Trust & Dispatch Assurances */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white border border-[#E5E1DC] rounded-xl text-xs text-[#737373]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#4F7A61]" />
          <span>Hand-inspected for provenance and authenticity before dispatch</span>
        </div>
        <span>30-day doorstep return pickup guarantee</span>
      </div>

      {/* Bottom Action Buttons */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link href={`/orders/${order.id}`} className="w-full sm:w-auto">
          <Button variant="accent" size="lg" className="w-full sm:w-auto gap-2 shadow-md">
            <span>View Order</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>

        <Link href="/products" className="w-full sm:w-auto">
          <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 border-[#1C1C1C]">
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-2 border-[#1C1C1C] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs text-[#737373]">Loading confirmation...</p>
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
