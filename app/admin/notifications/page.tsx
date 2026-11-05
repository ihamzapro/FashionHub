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
  ChevronDown,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
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
    message: "Order #ORD-2026-9481 valued at PKR 1,420 was created by Elena Rostova. Escrow funds secured.",
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

  const filterOptions = [
    { key: "all" as NotificationFilterTab, label: "All Activity", icon: Bell },
    { key: "order" as NotificationFilterTab, label: "New Orders", icon: ShoppingBag },
    { key: "supplier" as NotificationFilterTab, label: "New Suppliers", icon: Store },
    { key: "review" as NotificationFilterTab, label: "Pending Reviews", icon: MessageSquare },
    { key: "system" as NotificationFilterTab, label: "System Alerts", icon: AlertCircle },
  ];

  const filterCounts = useMemo(() => {
    return {
      all: notifications.length,
      order: notifications.filter((n) => n.category === "order").length,
      supplier: notifications.filter((n) => n.category === "supplier").length,
      review: notifications.filter((n) => n.category === "review").length,
      system: notifications.filter((n) => n.category === "system").length,
    };
  }, [notifications]);

  const currentFilter = filterOptions.find((f) => f.key === filterTab) || filterOptions[0];
  const CurrentFilterIcon = currentFilter.icon;

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
        <div className="flex items-center gap-2.5">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1C1C1C]">
            Admin Notification Center
          </h2>
          {unreadCount > 0 && (
            <Badge variant="accent" size="sm" className="bg-[#8B3A4A] text-white font-medium">
              {unreadCount} Unread
            </Badge>
          )}
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            leftIcon={<Check className="w-3.5 h-3.5" />}
            className="self-start sm:self-auto cursor-pointer border-[#E5E1DC] text-[#242424] hover:border-[#8B3A4A]/50 hover:bg-[#FAF8F5]"
          >
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Controls Bar: Activity Filter Dropdown & Quick Counts */}
      <Card className="overflow-visible relative z-30">
        <CardContent className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 overflow-visible">
          <div className="flex flex-wrap items-center gap-2.5">
            <Dropdown
              align="left"
              className="w-64 p-1.5 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.08)] border-[#E5E1DC] rounded-xl"
              trigger={
                <button
                  type="button"
                  className={`h-10 px-3.5 rounded-lg border text-xs font-medium flex items-center gap-2.5 transition-all cursor-pointer shadow-xs ${
                    filterTab !== "all"
                      ? "bg-[#8B3A4A]/10 border-[#8B3A4A] text-[#8B3A4A]"
                      : "bg-white border-[#E5E1DC] text-[#242424] hover:border-[#8B3A4A]/40 hover:bg-[#FAF8F5]"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                      filterTab !== "all" ? "bg-[#8B3A4A] text-white" : "bg-[#8B3A4A]/10 text-[#8B3A4A]"
                    }`}
                  >
                    <CurrentFilterIcon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[#737373] text-[11px] font-normal">Activity:</span>
                  <span className="font-semibold text-[#1C1C1C]">
                    {currentFilter.label}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-[#FAF8F5] text-[#737373] border border-[#E5E1DC] ml-0.5">
                    {filterCounts[filterTab]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#737373] ml-0.5" />
                </button>
              }
            >
              <div className="px-3 py-1.5 border-b border-[#E5E1DC]/60 mb-1">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#737373]">
                  Filter by Activity
                </p>
              </div>

              <div className="space-y-0.5">
                {filterOptions.map((item) => {
                  const Icon = item.icon;
                  const isSelected = filterTab === item.key;
                  const count = filterCounts[item.key] ?? 0;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setFilterTab(item.key)}
                      className={`w-full px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-[#8B3A4A]/10 text-[#8B3A4A] font-semibold"
                          : "text-[#242424] hover:bg-[#FAF8F5] hover:text-[#1C1C1C]"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-[#8B3A4A]" : "text-[#737373]"}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                            isSelected
                              ? "bg-[#8B3A4A]/15 text-[#8B3A4A]"
                              : "bg-[#FAF8F5] text-[#737373] border border-[#E5E1DC]"
                          }`}
                        >
                          {count}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#8B3A4A]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </Dropdown>

            {filterTab !== "all" && (
              <button
                type="button"
                onClick={() => setFilterTab("all")}
                className="text-xs text-[#8B3A4A] hover:underline font-medium px-2 py-1 cursor-pointer"
              >
                Reset Filter
              </button>
            )}
          </div>

          <div className="text-xs text-[#737373] font-medium flex items-center gap-2">
            <span>
              Showing <strong className="text-[#1C1C1C]">{filteredList.length}</strong> of {notifications.length} alerts
            </span>
          </div>
        </CardContent>
      </Card>

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
