"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Printer,
  Eye,
  AlertCircle,
  Filter,
  ChevronDown,
  Check,
  RotateCcw,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  ShoppingBag,
} from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Dropdown } from "@/components/ui/Dropdown";
import { useOrders } from "@/context/OrderContext";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import { Order, OrderStatus } from "@/lib/types";

export default function SupplierOrdersPage() {
  const { orders, updateOrderStatus } = useOrders();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [packingSlipOrder, setPackingSlipOrder] = useState<Order | null>(null);

  // Status counts for dropdown
  const statusCounts = useMemo(() => {
    return {
      all: orders.length,
      pending: orders.filter((o) => {
        const s = (o.status || o.orderStatus || "").toLowerCase();
        return s === "pending" || s === "processing";
      }).length,
      shipped: orders.filter((o) => (o.status || o.orderStatus || "").toLowerCase() === "shipped").length,
      delivered: orders.filter((o) => (o.status || o.orderStatus || "").toLowerCase() === "delivered").length,
      cancelled: orders.filter((o) => {
        const s = (o.status || o.orderStatus || "").toLowerCase();
        return s === "cancelled" || s === "refunded";
      }).length,
    };
  }, [orders]);

  const statusOptions = [
    { id: "all", label: "All Orders", icon: ShoppingBag },
    { id: "pending", label: "Pending Packaging", icon: Clock },
    { id: "shipped", label: "Shipped / In Transit", icon: Truck },
    { id: "delivered", label: "Delivered & Reconciled", icon: CheckCircle2 },
    { id: "cancelled", label: "Cancelled / Void", icon: XCircle },
  ];

  const currentTabOption = statusOptions.find((t) => t.id === activeTab) || statusOptions[0];
  const CurrentTabIcon = currentTabOption.icon;

  // Filter orders by search and status tab
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        o.customerName.toLowerCase().includes(search.toLowerCase()) ||
        (o.customerEmail && o.customerEmail.toLowerCase().includes(search.toLowerCase())) ||
        (o.items && o.items.some((it) => it.title.toLowerCase().includes(search.toLowerCase())));

      const st = (o.status || o.orderStatus || "pending").toLowerCase();
      let matchTab = true;
      if (activeTab === "pending") matchTab = st === "pending" || st === "processing";
      else if (activeTab === "shipped") matchTab = st === "shipped";
      else if (activeTab === "delivered") matchTab = st === "delivered";
      else if (activeTab === "cancelled") matchTab = st === "cancelled" || st === "refunded";

      return matchSearch && matchTab;
    });
  }, [orders, search, activeTab]);

  const handleStatusChange = (orderId: string, orderNumber: string, newStatus: OrderStatus) => {
    const success = updateOrderStatus(orderId, newStatus);
    if (success) {
      toast({
        title: "Order Status Updated",
        message: `Order #${orderNumber} transitioned to ${newStatus}.`,
        type: "success",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    switch (s) {
      case "delivered":
        return (
          <Badge variant="success" size="sm" className="gap-1 font-semibold text-[11px]">
            <CheckCircle2 className="w-3 h-3" />
            Delivered
          </Badge>
        );
      case "shipped":
        return (
          <Badge variant="accent" size="sm" className="gap-1 font-semibold text-[11px] bg-[#8B3A4A] text-white">
            <Truck className="w-3 h-3" />
            In Transit
          </Badge>
        );
      case "cancelled":
      case "refunded":
        return (
          <Badge variant="error" size="sm" className="gap-1 font-semibold text-[11px]">
            <XCircle className="w-3 h-3" />
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge variant="warning" size="sm" className="gap-1 font-semibold text-[11px]">
            <Clock className="w-3 h-3" />
            Pending
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1C1C1C]">
            Supplier Orders & Fulfillment
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs py-1 px-3 border-[#8B3A4A]/30 text-[#8B3A4A] bg-[#8B3A4A]/5">
            Cash on Delivery (COD) Only
          </Badge>
        </div>
      </div>

      {/* Dropdown Filters & Search */}
      <Card className="overflow-visible relative z-20">
        <CardHeader className="py-4 border-b border-[#E5E1DC] overflow-visible">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Status Dropdown Filter */}
            <div className="flex flex-wrap items-center gap-2.5">
              <Dropdown
                align="left"
                className="w-64 p-1.5 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.08)] border-[#E5E1DC] rounded-xl"
                trigger={
                  <button
                    type="button"
                    className={`h-10 px-3.5 rounded-lg border text-xs font-medium flex items-center gap-2.5 transition-all cursor-pointer shadow-xs ${
                      activeTab !== "all"
                        ? "bg-[#8B3A4A]/10 border-[#8B3A4A] text-[#8B3A4A]"
                        : "bg-white border-[#E5E1DC] text-[#242424] hover:border-[#8B3A4A]/40 hover:bg-[#FAF8F5]"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                        activeTab !== "all" ? "bg-[#8B3A4A] text-white" : "bg-[#8B3A4A]/10 text-[#8B3A4A]"
                      }`}
                    >
                      <CurrentTabIcon className="w-3.5 h-3.5" />
                    </div>
                    <span>{currentTabOption.label}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                        activeTab !== "all"
                          ? "bg-[#8B3A4A]/15 text-[#8B3A4A]"
                          : "bg-[#FAF8F5] text-[#737373] border border-[#E5E1DC]"
                      }`}
                    >
                      {statusCounts[activeTab as keyof typeof statusCounts] ?? filteredOrders.length}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#737373] ml-0.5" />
                  </button>
                }
              >
                <div className="px-3 py-1.5 border-b border-[#E5E1DC]/60 mb-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#737373]">
                    Filter by Status
                  </p>
                </div>

                {statusOptions.map((item) => {
                  const isSelected = activeTab === item.id;
                  const count = statusCounts[item.id as keyof typeof statusCounts] ?? 0;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-[#8B3A4A]/10 text-[#8B3A4A] font-semibold"
                          : "text-[#242424] hover:bg-[#FAF8F5] hover:text-[#1C1C1C]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-[#8B3A4A]" : "text-[#737373]"}`} />
                        <span>{item.label}</span>
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
              </Dropdown>

              {/* Reset Filters Quick Action */}
              {(activeTab !== "all" || search) && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("all");
                    setSearch("");
                  }}
                  className="h-10 px-2.5 text-xs text-[#737373] hover:text-[#8B3A4A] hover:bg-[#8B3A4A]/10 rounded-lg transition-colors flex items-center gap-1 cursor-pointer font-medium"
                  title="Reset all filters"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Filter</span>
                </button>
              )}
            </div>

            {/* Search Input */}
            <div className="w-full md:max-w-xs">
              <Input
                placeholder="Search orders, customers, items..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-[#737373]" />}
              />
            </div>
          </div>
        </CardHeader>

        {/* Orders Table - Streamlined 6-Column Layout (No Horizontal Scroll) */}
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#242424]">
              <thead className="bg-[#FAF8F5] border-b border-[#E5E1DC] text-[#737373] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 sm:px-5">Order</th>
                  <th className="py-3 px-4 sm:px-5">Customer</th>
                  <th className="py-3 px-4 sm:px-5">Garment Items</th>
                  <th className="py-3 px-4 sm:px-5">Amount (COD)</th>
                  <th className="py-3 px-4 sm:px-5">Status</th>
                  <th className="py-3 px-4 sm:px-5 text-right">Fulfillment Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E1DC]">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[#737373]">
                      <div className="max-w-xs mx-auto space-y-2">
                        <AlertCircle className="w-6 h-6 text-[#737373] mx-auto" />
                        <p className="font-medium text-sm text-[#1C1C1C]">No orders found</p>
                        <p className="text-xs text-[#737373]">
                          No orders match the selected filter criteria.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const totalQty = order.items
                      ? order.items.reduce((acc, it) => acc + it.quantity, 0)
                      : 1;
                    const currentStatus = (order.status || order.orderStatus || "pending").toLowerCase();
                    const primaryItem = order.items?.[0];

                    return (
                      <tr
                        key={order.id}
                        className="hover:bg-[#FAF8F5]/60 transition-colors group"
                      >
                        {/* Order & Date */}
                        <td className="py-3.5 px-4 sm:px-5 whitespace-nowrap">
                          <span className="font-mono font-semibold text-[#1C1C1C] block">
                            {order.orderNumber}
                          </span>
                          <span className="text-[11px] text-[#737373] block mt-0.5">
                            {formatDate(order.createdAt)}
                          </span>
                        </td>

                        {/* Customer */}
                        <td className="py-3.5 px-4 sm:px-5">
                          <p className="font-semibold text-[#1C1C1C] truncate max-w-[140px]">
                            {order.customerName}
                          </p>
                          <p className="text-[11px] text-[#737373] truncate max-w-[140px] mt-0.5">
                            {order.shippingAddress?.city || "Lahore"}, Pakistan
                          </p>
                        </td>

                        {/* Garment Items */}
                        <td className="py-3.5 px-4 sm:px-5">
                          <div className="flex items-center gap-2.5 max-w-[210px]">
                            {primaryItem?.image ? (
                              <div className="relative w-8 h-10 rounded-md bg-[#F1ECE6] overflow-hidden shrink-0 border border-[#E5E1DC]">
                                <Image
                                  src={primaryItem.image}
                                  alt={primaryItem.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-8 h-10 rounded-md bg-[#FAF8F5] border border-[#E5E1DC] flex items-center justify-center shrink-0 text-[#737373]">
                                <ShoppingBag className="w-3.5 h-3.5" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-medium text-xs text-[#1C1C1C] truncate" title={primaryItem?.title || "Garment"}>
                                {primaryItem?.title || "Artisanal Garment"}
                              </p>
                              <span className="text-[10px] text-[#737373] font-mono block mt-0.5">
                                {totalQty} {totalQty === 1 ? "pc" : "pcs"} {order.items && order.items.length > 1 ? `(+${order.items.length - 1} more)` : ""}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Amount (COD) */}
                        <td className="py-3.5 px-4 sm:px-5 whitespace-nowrap">
                          <span className="font-semibold text-[#1C1C1C] block">
                            {formatCurrency(order.total || order.totalAmount || 0)}
                          </span>
                          <span className="text-[10px] text-[#4F7A61] font-semibold bg-[#4F7A61]/10 px-1.5 py-0.5 rounded inline-block mt-0.5">
                            Doorstep COD
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 sm:px-5 whitespace-nowrap">
                          {getStatusBadge(order.status || order.orderStatus || "pending")}
                        </td>

                        {/* Fulfillment Actions */}
                        <td className="py-3.5 px-4 sm:px-5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <select
                              value={
                                currentStatus === "processing" ? "Pending" :
                                currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)
                              }
                              onChange={(e) =>
                                handleStatusChange(
                                  order.id,
                                  order.orderNumber,
                                  e.target.value as OrderStatus
                                )
                              }
                              className="bg-white border border-[#E5E1DC] text-[11px] rounded-lg px-2 py-1 text-[#242424] focus:outline-hidden focus:border-[#8B3A4A] cursor-pointer font-medium hover:border-[#8B3A4A]/50 transition-colors shadow-2xs"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>

                            <button
                              type="button"
                              onClick={() => setPackingSlipOrder(order)}
                              title="Print Packing Slip"
                              className="p-1.5 text-[#737373] hover:text-[#1C1C1C] rounded-lg hover:bg-[#F1ECE6] border border-transparent hover:border-[#E5E1DC] transition-all cursor-pointer"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>

                            <Link
                              href={`/orders/${order.id}`}
                              target="_blank"
                              title="Customer View"
                              className="p-1.5 text-[#737373] hover:text-[#8B3A4A] rounded-lg hover:bg-[#F1ECE6] border border-transparent hover:border-[#E5E1DC] transition-all"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Packing Slip Modal */}
      <Modal
        isOpen={Boolean(packingSlipOrder)}
        onClose={() => setPackingSlipOrder(null)}
        title={`Packing Slip — Order #${packingSlipOrder?.orderNumber}`}
        description="Fulfillment manifest and courier handover documentation."
        maxWidth="lg"
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPackingSlipOrder(null)}
            >
              Close
            </Button>
            <Button
              variant="accent"
              size="sm"
              leftIcon={<Printer className="w-3.5 h-3.5" />}
              onClick={() => {
                if (typeof window !== "undefined") window.print();
              }}
            >
              Print Manifest
            </Button>
          </>
        }
      >
        {packingSlipOrder && (
          <div className="space-y-6 text-xs text-[#242424] p-2 bg-white">
            {/* Header */}
            <div className="flex justify-between border-b border-[#E5E1DC] pb-4">
              <div>
                <h3 className="font-editorial text-lg tracking-widest text-[#1C1C1C]">
                  FASHIONHUB
                </h3>
                <p className="text-[10px] text-[#737373]">Atelier V Studios Fulfillment Hub</p>
                <p className="text-[10px] text-[#737373]">18 Rue du Faubourg Saint-Honoré, Paris</p>
              </div>
              <div className="text-right">
                <p className="font-mono font-bold text-sm text-[#1C1C1C]">
                  {packingSlipOrder.orderNumber}
                </p>
                <p className="text-[11px] text-[#737373]">
                  Date: {formatDate(packingSlipOrder.createdAt)}
                </p>
                <Badge variant="outline" size="sm" className="mt-1 border-[#8B3A4A] text-[#8B3A4A]">
                  Payment: Cash on Delivery (COD)
                </Badge>
              </div>
            </div>

            {/* Recipient */}
            <div className="grid grid-cols-2 gap-4 bg-[#FAF8F5] p-3 rounded-xl border border-[#E5E1DC]">
              <div>
                <p className="font-semibold uppercase tracking-wider text-[10px] text-[#737373] mb-1">
                  Deliver To
                </p>
                <p className="font-bold text-[#1C1C1C]">{packingSlipOrder.customerName}</p>
                <p>{packingSlipOrder.shippingAddress?.street}</p>
                <p>
                  {packingSlipOrder.shippingAddress?.city},{" "}
                  {packingSlipOrder.shippingAddress?.postalCode}
                </p>
                <p>{packingSlipOrder.shippingAddress?.country}</p>
                {packingSlipOrder.customerPhone && (
                  <p className="font-mono mt-1 text-[#737373]">Tel: {packingSlipOrder.customerPhone}</p>
                )}
              </div>
              <div>
                <p className="font-semibold uppercase tracking-wider text-[10px] text-[#737373] mb-1">
                  COD Collection Notice
                </p>
                <p className="text-xs text-[#1C1C1C] font-semibold">
                  Collect Total: {formatCurrency(packingSlipOrder.total || packingSlipOrder.totalAmount || 0)}
                </p>
                <p className="text-[11px] text-[#737373] mt-1">
                  Courier must collect exact cash amount in hand before releasing package seal.
                </p>
              </div>
            </div>

            {/* Items Table */}
            <div>
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] border-y border-[#E5E1DC] text-[#737373] text-[10px] uppercase">
                  <tr>
                    <th className="py-2 px-3">Item Description</th>
                    <th className="py-2 px-3 text-center">Qty</th>
                    <th className="py-2 px-3 text-right">Unit Price</th>
                    <th className="py-2 px-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E1DC]">
                  {packingSlipOrder.items?.map((it, idx) => (
                    <tr key={idx}>
                      <td className="py-2 px-3 font-medium text-[#1C1C1C]">
                        {it.title}
                        {it.selectedSize && <span className="text-[#737373] ml-1">({it.selectedSize})</span>}
                      </td>
                      <td className="py-2 px-3 text-center font-mono">{it.quantity}</td>
                      <td className="py-2 px-3 text-right font-mono">{formatCurrency(it.price)}</td>
                      <td className="py-2 px-3 text-right font-mono font-medium">
                        {formatCurrency(it.price * it.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
