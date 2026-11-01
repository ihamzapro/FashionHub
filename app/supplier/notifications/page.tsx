"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  ShoppingBag,
  Truck,
  AlertTriangle,
  Package,
  CheckCheck,
  Trash2,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";

export interface SupplierNotificationItem {
  id: string;
  type: "new_order" | "order_update" | "low_stock" | "product_alert";
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionLabel?: string;
  actionHref?: string;
}

const INITIAL_NOTIFICATIONS: SupplierNotificationItem[] = [
  {
    id: "notif-1",
    type: "new_order",
    title: "New Order Placed: #FH-94823",
    message: "Elena Rostova placed an order for 2x Organic Heavyweight Boxy Tee ($130.00). Cash on Delivery fulfillment pending.",
    time: "12 minutes ago",
    read: false,
    actionLabel: "Fulfill Order",
    actionHref: "/supplier/orders",
  },
  {
    id: "notif-2",
    type: "low_stock",
    title: "Low Stock Alert: Selvedge Raw Denim Jeans",
    message: "Only 4 units remaining in workshop inventory. Demand velocity indicates potential stockout within 48 hours.",
    time: "1 hour ago",
    read: false,
    actionLabel: "Update Stock",
    actionHref: "/supplier/products",
  },
  {
    id: "notif-3",
    type: "order_update",
    title: "Courier Handover Confirmed: #FH-94821",
    message: "DHL Express picked up Sculptural Soft Leather Shoulder Tote from Paris Atelier. Tracking manifests dispatched.",
    time: "3 hours ago",
    read: false,
    actionLabel: "View Order",
    actionHref: "/supplier/orders",
  },
  {
    id: "notif-4",
    type: "product_alert",
    title: "Product Verification Approved",
    message: "Artisanal Double-Breasted Cashmere Coat has passed marketplace authenticity compliance and is now trending on the storefront.",
    time: "1 day ago",
    read: true,
    actionLabel: "View Listing",
    actionHref: "/products/prod-7",
  },
  {
    id: "notif-5",
    type: "order_update",
    title: "COD Payment Collected: #FH-94819",
    message: "Customer completed cash payment of $240.00 upon courier delivery. Remittance credited to your workshop ledger.",
    time: "2 days ago",
    read: true,
    actionLabel: "Ledger",
    actionHref: "/supplier/analytics",
  },
  {
    id: "notif-6",
    type: "low_stock",
    title: "Low Stock Alert: Chunky Ribbed Alpaca Knit",
    message: "Available inventory has dropped to 6 units. Reorder yarn supplies to maintain Autumn capsule availability.",
    time: "3 days ago",
    read: true,
    actionLabel: "Restock",
    actionHref: "/supplier/products",
  },
];

export default function SupplierNotificationsPage() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<SupplierNotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "orders") return n.type === "new_order" || n.type === "order_update";
    if (activeFilter === "low_stock") return n.type === "low_stock";
    if (activeFilter === "product_alert") return n.type === "product_alert";
    return true;
  });

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast({
      title: "All Caught Up",
      message: "All supplier alerts marked as read.",
      type: "success",
    });
  };

  const clearAll = () => {
    setNotifications([]);
    toast({
      title: "Notifications Cleared",
      message: "All alerts have been cleared from your notification feed.",
      type: "info",
    });
  };

  const getIcon = (type: SupplierNotificationItem["type"]) => {
    switch (type) {
      case "new_order":
        return (
          <div className="w-9 h-9 rounded-xl bg-[#8B3A4A]/10 text-[#8B3A4A] flex items-center justify-center shrink-0">
            <ShoppingBag className="w-4 h-4" />
          </div>
        );
      case "order_update":
        return (
          <div className="w-9 h-9 rounded-xl bg-[#4F7A61]/10 text-[#4F7A61] flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4" />
          </div>
        );
      case "low_stock":
        return (
          <div className="w-9 h-9 rounded-xl bg-[#B84A4A]/10 text-[#B84A4A] flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
        );
      case "product_alert":
        return (
          <div className="w-9 h-9 rounded-xl bg-[#1C1C1C]/10 text-[#1C1C1C] flex items-center justify-center shrink-0">
            <Package className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1C1C1C]">
              Supplier Notifications
            </h2>
            {unreadCount > 0 && (
              <Badge variant="accent" size="sm">
                {unreadCount} Unread
              </Badge>
            )}
          </div>
          <p className="text-xs text-[#737373] mt-0.5">
            Operational alerts for new orders, delivery handovers, low inventory, and garment status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              leftIcon={<CheckCheck className="w-3.5 h-3.5" />}
            >
              Mark all read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAll}
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#FAF8F5] border border-[#E5E1DC] rounded-xl text-xs font-medium">
        {[
          { id: "all", label: "All Alerts", count: notifications.length },
          {
            id: "orders",
            label: "Orders & Shipping",
            count: notifications.filter(
              (n) => n.type === "new_order" || n.type === "order_update"
            ).length,
          },
          {
            id: "low_stock",
            label: "Low Stock Alerts",
            count: notifications.filter((n) => n.type === "low_stock").length,
          },
          {
            id: "product_alert",
            label: "Product Alerts",
            count: notifications.filter((n) => n.type === "product_alert").length,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3 py-1.5 rounded-lg transition-all text-xs flex items-center gap-1.5 cursor-pointer ${
              activeFilter === tab.id
                ? "bg-[#8B3A4A] text-white shadow-xs font-semibold"
                : "text-[#737373] hover:text-[#1C1C1C] hover:bg-neutral-200/50"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeFilter === tab.id
                  ? "bg-white/20 text-white"
                  : "bg-neutral-200 text-[#737373]"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Notification List */}
      <Card>
        <CardContent className="p-0">
          {filteredNotifications.length === 0 ? (
            <div className="py-16 text-center text-[#737373] space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#E5E1DC] flex items-center justify-center mx-auto text-[#737373]">
                <Bell className="w-5 h-5" />
              </div>
              <p className="font-semibold text-sm text-[#1C1C1C]">No notifications</p>
              <p className="text-xs text-[#737373] max-w-xs mx-auto">
                You are all caught up! New order dispatches and inventory updates will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#E5E1DC]">
              {filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors cursor-pointer ${
                    !notif.read ? "bg-[#FAF8F5]/80 hover:bg-[#FAF8F5]" : "hover:bg-[#FAF8F5]/40"
                  }`}
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    {getIcon(notif.type)}
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-semibold text-[#1C1C1C]">
                          {notif.title}
                        </h4>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-[#8B3A4A] shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-[#737373] leading-relaxed">
                        {notif.message}
                      </p>
                      <div className="flex items-center gap-2 pt-0.5 text-[10px] text-[#737373]">
                        <Clock className="w-3 h-3" />
                        <span>{notif.time}</span>
                      </div>
                    </div>
                  </div>

                  {notif.actionHref && (
                    <div className="sm:shrink-0 flex items-center gap-2">
                      <Link href={notif.actionHref}>
                        <Button
                          variant="outline"
                          size="sm"
                          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                          className="text-xs whitespace-nowrap"
                        >
                          {notif.actionLabel || "View"}
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
