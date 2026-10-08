import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CustomerLayout } from "@/components/layout/CustomerLayout";
import { mockOrders, mockProducts } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Package, Truck, ExternalLink, Heart } from "lucide-react";

export default function AccountPage() {
  const customerOrders = mockOrders.slice(0, 3);
  const wishlistItems = mockProducts.slice(0, 3);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge variant="success">Delivered</Badge>;
      case "shipped":
        return <Badge variant="accent">Shipped</Badge>;
      case "processing":
        return <Badge variant="warning">Processing</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <CustomerLayout>
      <div className="space-y-8">
        {/* Recent Orders Section */}
        <section id="orders" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#1C1C1C] flex items-center gap-2">
              <Package className="w-4 h-4 text-[#8B3A4A]" />
              <span>Recent Orders ({customerOrders.length})</span>
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#737373]">Updated live</span>
              <Link href="/orders" className="text-xs text-[#8B3A4A] hover:underline font-medium">
                View All Orders →
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            {customerOrders.map((order) => (
              <Card key={order.id}>
                <CardHeader className="flex flex-row items-center justify-between py-4">
                  <div>
                    <Link
                      href={`/orders/${order.id}`}
                      className="text-xs font-mono font-semibold text-[#1C1C1C] hover:text-[#8B3A4A] transition-colors"
                    >
                      Order #{order.orderNumber}
                    </Link>
                    <p className="text-[11px] text-[#737373]">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.status)}
                    <span className="text-sm font-semibold text-[#1C1C1C]">
                      {formatCurrency(order.totalAmount)}
                    </span>
                    <Link href={`/orders/${order.id}`}>
                      <ExternalLink className="w-4 h-4 text-[#737373] hover:text-[#8B3A4A] transition-colors" />
                    </Link>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 py-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-14 rounded bg-[#F1ECE6] overflow-hidden shrink-0 border border-[#E5E1DC]">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-[#242424]">{item.title}</p>
                          <p className="text-[11px] text-[#737373]">
                            Qty: {item.quantity} • {item.selectedColor || item.selectedSize || "Standard"}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-[#242424]">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}

                  {order.trackingNumber && (
                    <div className="mt-3 pt-3 border-t border-[#E5E1DC]/60 flex items-center justify-between text-xs text-[#737373]">
                      <span className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-[#4F7A61]" />
                        Tracking: {order.trackingNumber}
                      </span>
                      <a href="#" className="text-[#8B3A4A] hover:underline flex items-center gap-1">
                        Track parcel <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Saved Wishlist Section */}
        <section id="wishlist" className="space-y-4 pt-4 border-t border-[#E5E1DC]">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#1C1C1C] flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#8B3A4A]" />
              <span>Saved in Wishlist ({wishlistItems.length})</span>
            </h2>
            <Link href="/products" className="text-xs text-[#8B3A4A] hover:underline">
              Browse More Pieces
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {wishlistItems.map((prod) => (
              <div
                key={prod.id}
                className="bg-white border border-[#E5E1DC] rounded-xl p-3 flex items-center gap-3 shadow-xs"
              >
                <div className="relative w-14 h-16 rounded-lg bg-[#F1ECE6] overflow-hidden shrink-0 border border-[#E5E1DC]">
                  <Image
                    src={prod.images[0]}
                    alt={prod.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-[#242424] truncate">{prod.title}</p>
                  <p className="text-xs font-semibold text-[#1C1C1C] mt-0.5">
                    {formatCurrency(prod.price)}
                  </p>
                  <Link
                    href={`/products/${prod.id}`}
                    className="text-[11px] text-[#8B3A4A] hover:underline font-medium block mt-1"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </CustomerLayout>
  );
}
