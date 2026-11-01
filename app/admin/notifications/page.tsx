"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Bell,
  ShoppingBag,
  Store,
  MessageSquare,
  AlertCircle,
  Trash2,
  Check,
  ExternalLink,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

type NotificationFilterTab = "all" | "order" | "supplier" | "review" | "system";

interface AdminNotificationItem {
  id: string;
  category: "order" | "supplier" | "review" | "system";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionHref?: string;
  actionLabel?: string;
  priority?: "normal" | "high";
}

const INITIAL_ADMIN_NOTIFICATIONS: AdminNotificationItem[] = [
  {
    id: "notif-1",
    category: "order",
    title: "High-Value Transaction Placed",
    message: "Order #ORD-2026-9481 valued at $1,420.00 was created by Elena Rostova. Escrow funds secured.",
    timestamp: "2026-10-09T08:30:00Z",
    read: false,
    actionHref: "/admin/orders",
    actionLabel: "Audit Order",
    priority: "high",
  },
  {
    id: "notif-2",
    category: "review",
    title: "Customer Review Awaiting Moderation",
    message: "Clara Beauchamp submitted feedback for 'Double-Breasted Melton Wool Overcoat'.",
    timestamp: "2026-10-08T16:15:00Z",
    read: false,
    actionHref: "/admin/reviews",
    actionLabel: "Review Feedback",
    priority: "normal",
  },
  {
    id: "notif-3",
    category: "supplier",
    title: "New Supplier Application Received",
    message: "Sartoria Milano submitted workshop documentation and tax certificate for partner verification.",
    timestamp: "2026-10-08T11:45:00Z",
    read: false,
    actionHref: "/admin/suppliers",
    actionLabel: "Inspect Atelier",
    priority: "high",
  },
  {
    id: "notif-4",
    category: "system",
    title: "Weekly Security & Escrow Ledger Reconciled",
    message: "Automated payment settlement audit completed with zero discrepancies across all suppliers.",
    timestamp: "2026-10-07T22:00:00Z",
    read: true,
    actionHref: "/admin/reports",
    actionLabel: "View Ledgers",
    priority: "normal",
  },
  {
    id: "notif-5",
    category: "order",
    title: "Express Fulfillment Dispatch Confirmed",
    message: "Kyoto Craft Studio dispatched order #ORD-2026-8812 via DHL Express.",
    timestamp: "2026-10-07T14:10:00Z",
    read: true,
    actionHref: "/admin/orders",
    actionLabel: "Track Order",
    priority: "normal",
  },
  {
    id: "notif-6",
    category: "system",
    title: "Catalog Image CDN Cache Purged",
    message: "Global edge CDN updated with newest optimized WebP garment imagery.",
    timestamp: "2026-10-06T09:00:00Z",
    read: true,
    priority: "normal",
  },
];

export default function AdminNotificationsPage() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<AdminNotificationItem[]>(INITIAL_ADMIN_NOTIFICATIONS);
  const [filterTab, setFilterTab] = useState<NotificationFilterTab>("all");

  const filteredList = useMemo(() => {
    if (filterTab === "all") return notifications;
    return notifications.filter((n) => n.category === filterTab);
  }, [notifications, filterTab]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast({
      title: "All Notifications Marked Read",
      message: "Notification queue has been marked as acknowledged.",
      type: "info",
    });
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast({
      title: "Notification Removed",
      message: "Alert has been deleted from your activity stream.",
      type: "info",
    });
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "order":
        return (
          <Badge variant="outline" size="sm" className="gap-1 border-[#1C1C1C] text-[#1C1C1C] bg-[#1C1C1C]/5">
            <ShoppingBag className="w-3 h-3" />
            New Order
          </Badge>
        );
      case "supplier":
        return (
          <Badge variant="outline" size="sm" className="gap-1 border-[#8B3A4A] text-[#8B3A4A] bg-[#8B3A4A]/10">
            <Store className="w-3 h-3" />
            New Supplier
          </Badge>
        );
      case "review":
        return (
          <Badge variant="warning" size="sm" className="gap-1">
            <MessageSquare className="w-3 h-3" />
            Pending Review
          </Badge>
        );
      case "system":
      default:
        return (
          <Badge variant="secondary" size="sm" className="gap-1">
            <AlertCircle className="w-3 h-3" />
            System Alert
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1C1C1C]">
              Admin Notification Center
            </h2>
            {unreadCount > 0 && (
              <Badge variant="accent" size="sm" className="bg-[#8B3A4A] text-white">
                {unreadCount} Unread
              </Badge>
            )}
          </div>
          <p className="text-xs text-[#737373] mt-0.5">
            Real-time administrative alerts for new marketplace transactions, supplier verifications, and system events.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            leftIcon={<Check className="w-3.5 h-3.5" />}
            className="self-start sm:self-auto"
          >
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E5E1DC] pb-3">
        {(
          [
            { key: "all", label: "All Activity", count: notifications.length },
            { key: "order", label: "New Orders", count: notifications.filter((n) => n.category === "order").length },
            { key: "supplier", label: "New Suppliers", count: notifications.filter((n) => n.category === "supplier").length },
            { key: "review", label: "Pending Reviews", count: notifications.filter((n) => n.category === "review").length },
            { key: "system", label: "System Alerts", count: notifications.filter((n) => n.category === "system").length },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterTab(tab.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2 ${
              filterTab === tab.key
                ? "bg-[#8B3A4A] text-white shadow-xs font-semibold"
                : "bg-white border border-[#E5E1DC] text-[#737373] hover:text-[#1C1C1C]"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                filterTab === tab.key ? "bg-white/20 text-white" : "bg-[#FAF8F5] text-[#737373]"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <Card>
        <CardContent className="p-0 divide-y divide-[#E5E1DC]">
          {filteredList.length === 0 ? (
            <div className="py-12 text-center text-[#737373] text-xs">
              No notifications found in this alert category.
            </div>
          ) : (
            filteredList.map((item) => (
              <div
                key={item.id}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row items-start justify-between gap-4 transition-colors ${
                  !item.read ? "bg-[#FAF8F5]/80 hover:bg-[#FAF8F5]" : "bg-white hover:bg-[#FAF8F5]/40"
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      !item.read
                        ? "bg-[#8B3A4A]/10 text-[#8B3A4A]"
                        : "bg-[#FAF8F5] text-[#737373] border border-[#E5E1DC]"
                    }`}
                  >
                    <Bell className="w-4 h-4" />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4
                        className={`text-sm tracking-tight ${
                          !item.read ? "font-bold text-[#1C1C1C]" : "font-medium text-[#242424]"
                        }`}
                      >
                        {item.title}
                      </h4>
                      {getCategoryBadge(item.category)}
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-[#8B3A4A] inline-block" />
                      )}
                    </div>

                    <p className="text-xs text-[#737373] leading-relaxed">
                      {item.message}
                    </p>

                    <div className="flex items-center gap-3 pt-1 text-[11px] text-[#737373]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(item.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {item.actionHref && item.actionLabel && (
                    <Link
                      href={item.actionHref}
                      className="px-3 py-1.5 text-xs font-semibold bg-[#8B3A4A] text-white hover:bg-[#722F3D] rounded-lg transition-colors flex items-center gap-1"
                    >
                      <span>{item.actionLabel}</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}

                  {!item.read && (
                    <button
                      onClick={() => handleMarkAsRead(item.id)}
                      className="p-1.5 text-[#737373] hover:text-[#4F7A61] hover:bg-[#4F7A61]/10 rounded-md transition-colors"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteNotification(item.id)}
                    className="p-1.5 text-[#737373] hover:text-[#B84A4A] hover:bg-[#B84A4A]/10 rounded-md transition-colors"
                    title="Dismiss alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
