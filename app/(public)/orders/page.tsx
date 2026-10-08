"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useOrders } from "@/context";
import { OrderCard } from "@/components/orders/OrderCard";
import { Button } from "@/components/ui/Button";
import { Package, ShoppingBag, ChevronRight, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

import { ProtectedRoute } from "@/components/auth";

type FilterStatus = "all" | "pending" | "shipped" | "delivered";

export default function OrdersHistoryPage() {
  const { orders } = useOrders();
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");

  const filteredOrders = orders.filter((order) => {
    if (statusFilter === "all") return true;
    const s = (order.status || order.orderStatus || "pending").toLowerCase();
    return s === statusFilter;
  });

  return (
    <ProtectedRoute allowedRoles={["customer", "supplier", "admin"]}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-[#737373] border-b border-[#E5E1DC] pb-4">
        <Link href="/" className="hover:text-[#1C1C1C] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#1C1C1C] font-medium">Order History</span>
      </nav>

      {/* Page Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[#8B3A4A]">
            Personal Account
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl text-[#1C1C1C] font-normal mt-1">
            Order History ({orders.length})
          </h1>
          <p className="text-xs text-[#737373] mt-1.5">
            Track and view fulfillment status for all your Cash on Delivery orders.
          </p>
        </div>

        <Link href="/products" className="self-start sm:self-auto">
          <Button variant="outline" size="sm" className="gap-1.5 hover:border-[#1C1C1C]">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Browse Products</span>
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      {orders.length > 0 && (
        <div className="flex items-center gap-2 border-b border-[#E5E1DC] pb-3 overflow-x-auto scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-[#737373] shrink-0 mr-1" />
          {(
            [
              { label: `All (${orders.length})`, value: "all" },
              {
                label: `Pending (${orders.filter((o) => (o.status || o.orderStatus || "").toLowerCase() === "pending").length})`,
                value: "pending",
              },
              {
                label: `Shipped (${orders.filter((o) => (o.status || o.orderStatus || "").toLowerCase() === "shipped").length})`,
                value: "shipped",
              },
              {
                label: `Delivered (${orders.filter((o) => (o.status || o.orderStatus || "").toLowerCase() === "delivered").length})`,
                value: "delivered",
              },
            ] as const
          ).map((tab) => {
            const isActive = statusFilter === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setStatusFilter(tab.value)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer",
                  isActive
                    ? "bg-[#1C1C1C] text-white shadow-xs"
                    : "bg-[#FAF8F5] border border-[#E5E1DC] text-[#737373] hover:text-[#1C1C1C]"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white border border-[#E5E1DC] rounded-2xl max-w-lg mx-auto p-8 space-y-5 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#E5E1DC] flex items-center justify-center mx-auto text-[#737373]">
            <Package className="w-8 h-8 text-[#8B3A4A]" />
          </div>
          <div>
            <h2 className="text-xl font-editorial text-[#1C1C1C]">No Orders Yet</h2>
            <p className="text-xs text-[#737373] mt-1.5 max-w-sm mx-auto leading-relaxed">
              You haven&apos;t placed any orders yet. Explore our curated collections and place your first Cash on Delivery order with complimentary shipping over $250.
            </p>
          </div>
          <div className="pt-2">
            <Link href="/products">
              <Button variant="accent" size="md">
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white border border-[#E5E1DC] rounded-xl p-8 space-y-3">
          <p className="text-sm font-medium text-[#1C1C1C]">
            No orders found matching the selected filter
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setStatusFilter("all")}
          >
            Show All Orders
          </Button>
        </div>
      ) : (
        /* Orders List */
        <div className="space-y-5">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
    </ProtectedRoute>
  );
}
