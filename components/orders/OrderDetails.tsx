import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Order } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { OrderStatusTimeline } from "./OrderStatusTimeline";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Banknote,
  MapPin,
  User,
  Mail,
  Phone,
  ShieldCheck,
  RotateCcw,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";

interface OrderDetailsProps {
  order: Order;
}

export function OrderDetails({ order }: OrderDetailsProps) {
  const finalTotal = order.totalAmount ?? order.total ?? 0;

  return (
    <div className="space-y-10">
      {/* Top Header & Back Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E1DC] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-[#737373] mb-2">
            <Link
              href="/orders"
              className="hover:text-[#1C1C1C] flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All Orders</span>
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-editorial text-2xl sm:text-3xl text-[#1C1C1C] font-normal">
              Order #{order.orderNumber}
            </h1>
            <OrderStatusBadge status={order.status || order.orderStatus || "Pending"} />
          </div>
          <p className="text-xs text-[#737373]">
            Placed on {formatDate(order.createdAt)} • Ref: {order.id}
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Link href="/products">
            <Button variant="outline" size="sm" className="gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Continue Shopping</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Order Status Timeline Section */}
      <Card className="p-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#737373] mb-4">
          Fulfillment Status
        </h3>
        <OrderStatusTimeline status={order.status || order.orderStatus || "Pending"} />
      </Card>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Ordered Items & Delivery Address */}
        <div className="lg:col-span-8 space-y-6">
          {/* Items Card */}
          <Card>
            <CardHeader>
              <CardTitle>Ordered Items ({order.items.length})</CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-[#E5E1DC]/80">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-20 sm:w-20 sm:h-24 rounded-lg bg-[#F1ECE6] border border-[#E5E1DC] overflow-hidden shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <Link
                        href={`/products/${item.productId}`}
                        className="text-sm font-medium text-[#1C1C1C] hover:text-[#8B3A4A] transition-colors line-clamp-1"
                      >
                        {item.title}
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-[#737373]">
                        {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                        {item.selectedSize && item.selectedColor && <span>•</span>}
                        {item.selectedColor && <span>Shade: {item.selectedColor}</span>}
                      </div>
                      <p className="text-xs text-[#737373]">
                        Qty: {item.quantity} × {formatCurrency(item.price)}
                      </p>
                    </div>
                  </div>

                  <span className="font-mono text-sm font-semibold text-[#1C1C1C] text-right">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Delivery & Customer Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#8B3A4A]" />
                <span>Delivery & Customer Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* Customer Info */}
              <div className="space-y-2.5">
                <span className="text-[10px] uppercase tracking-wider text-[#737373] font-semibold block">
                  Customer Contact
                </span>
                <p className="font-medium text-[#1C1C1C] flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-[#737373]" />
                  <span>{order.customerName || order.customer?.fullName}</span>
                </p>
                <p className="text-[#737373] flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#737373]" />
                  <span>{order.customerEmail || order.customer?.email}</span>
                </p>
                {(order.customerPhone || order.shippingAddress.phone || order.customer?.phone) && (
                  <p className="text-[#737373] flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#737373]" />
                    <span>
                      {order.customerPhone || order.shippingAddress.phone || order.customer?.phone}
                    </span>
                  </p>
                )}
              </div>

              {/* Shipping Address */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-[#737373] font-semibold block">
                  Destination Address
                </span>
                <div className="text-[#242424] leading-relaxed space-y-0.5">
                  <p className="font-medium">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.postalCode}
                  </p>
                  <p className="text-[#737373]">{order.shippingAddress.country}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Order Summary & COD Instructions */}
        <div className="lg:col-span-4 space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex justify-between text-[#737373]">
                <span>Items Subtotal</span>
                <span className="text-[#1C1C1C] font-mono font-medium">
                  {formatCurrency(order.subtotal)}
                </span>
              </div>

              <div className="flex justify-between text-[#737373]">
                <span>Insured Express Shipping</span>
                <span className="text-[#1C1C1C] font-medium">
                  {order.shippingFee === 0 ? (
                    <span className="text-[#4F7A61] font-semibold">Complimentary</span>
                  ) : (
                    formatCurrency(order.shippingFee)
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-[#E5E1DC] flex justify-between text-base font-semibold text-[#1C1C1C]">
                <span>Total Due</span>
                <span className="font-mono text-[#8B3A4A]">{formatCurrency(finalTotal)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Details (COD) */}
          <Card className="bg-[#FAF8F5] border-[#E5E1DC]">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs flex items-center gap-2">
                <Banknote className="w-4 h-4 text-[#4F7A61]" />
                <span>Payment Method: Cash on Delivery</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-[#737373] leading-relaxed">
              <p>
                Please prepare <strong className="text-[#1C1C1C]">{formatCurrency(finalTotal)}</strong> in cash to hand directly to the courier when your package arrives at your doorstep.
              </p>
              <div className="p-2.5 bg-white rounded-lg border border-[#E5E1DC] text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span>Payment Status:</span>
                  <strong className="text-[#B78628]">{order.paymentStatus || "Pending"}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Receipt Mode:</span>
                  <span className="text-[#1C1C1C]">Doorstep Cash Handover</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Guarantees */}
          <div className="space-y-2.5 text-xs text-[#737373] p-4 bg-white border border-[#E5E1DC] rounded-xl">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#4F7A61]" />
              <span>Insured delivery with atelier verification</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-[#8B3A4A]" />
              <span>Complimentary 30-day doorstep return pickup</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
