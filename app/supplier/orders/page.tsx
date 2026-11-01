"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Printer,
  Eye,
  AlertCircle,
} from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
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
        return <Badge variant="success" size="sm">Delivered</Badge>;
      case "shipped":
        return <Badge variant="accent" size="sm">Shipped</Badge>;
      case "cancelled":
      case "refunded":
        return <Badge variant="error" size="sm">Cancelled</Badge>;
      default:
        return <Badge variant="warning" size="sm">Pending</Badge>;
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
          <p className="text-xs text-[#737373] mt-0.5">
            Manage dispatch workflows, courier handovers, and Cash on Delivery (COD) settlements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs py-1 px-3 border-[#8B3A4A]/30 text-[#8B3A4A] bg-[#8B3A4A]/5">
            Cash on Delivery (COD) Only
          </Badge>
        </div>
      </div>

      {/* Tabs & Search */}
      <Card>
        <CardHeader className="py-4 border-b border-[#E5E1DC]">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#FAF8F5] border border-[#E5E1DC] rounded-xl text-xs font-medium">
              {[
                { id: "all", label: "All Orders", count: orders.length },
                {
                  id: "pending",
                  label: "Pending",
                  count: orders.filter((o) => (o.status || "").toLowerCase() === "pending").length,
                },
                {
                  id: "shipped",
                  label: "Shipped",
                  count: orders.filter((o) => (o.status || "").toLowerCase() === "shipped").length,
                },
                {
                  id: "delivered",
                  label: "Delivered",
                  count: orders.filter((o) => (o.status || "").toLowerCase() === "delivered").length,
                },
                {
                  id: "cancelled",
                  label: "Cancelled",
                  count: orders.filter((o) => (o.status || "").toLowerCase() === "cancelled").length,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg transition-all text-xs flex items-center gap-1.5 cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-[#8B3A4A] text-white shadow-xs font-semibold"
                      : "text-[#737373] hover:text-[#1C1C1C] hover:bg-neutral-200/50"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      activeTab === tab.id
                        ? "bg-white/20 text-white"
                        : "bg-neutral-200 text-[#737373]"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
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

        {/* Orders Table */}
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#242424]">
              <thead className="bg-[#FAF8F5] border-b border-[#E5E1DC] text-[#737373] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-6">Order ID</th>
                  <th className="py-3 px-6">Customer</th>
                  <th className="py-3 px-6">Products</th>
                  <th className="py-3 px-6">Qty</th>
                  <th className="py-3 px-6">Amount (COD)</th>
                  <th className="py-3 px-6">Date</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Status Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E1DC]">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-[#737373]">
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

                    return (
                      <tr
                        key={order.id}
                        className="hover:bg-[#FAF8F5]/60 transition-colors group"
                      >
                        {/* Order ID */}
                        <td className="py-3.5 px-6">
                          <div className="flex flex-col">
                            <span className="font-mono font-semibold text-[#1C1C1C]">
                              {order.orderNumber}
                            </span>
                            <span className="text-[10px] text-[#737373] font-mono">
                              ID: {order.id.slice(-6)}
                            </span>
                          </div>
                        </td>

                        {/* Customer */}
                        <td className="py-3.5 px-6">
                          <div>
                            <p className="font-semibold text-[#1C1C1C]">
                              {order.customerName}
                            </p>
                            <p className="text-[11px] text-[#737373]">
                              {order.shippingAddress?.city}, {order.shippingAddress?.country}
                            </p>
                            {order.customerPhone && (
                              <p className="text-[10px] text-[#737373] font-mono">
                                {order.customerPhone}
                              </p>
                            )}
                          </div>
                        </td>

                        {/* Products */}
                        <td className="py-3.5 px-6">
                          <div className="space-y-1 max-w-[200px]">
                            {order.items?.map((it, i) => (
                              <div key={i} className="flex items-center gap-2">
                                {it.image && (
                                  <div className="relative w-6 h-7 rounded bg-neutral-200 overflow-hidden shrink-0 border border-[#E5E1DC]">
                                    <Image
                                      src={it.image}
                                      alt={it.title}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                )}
                                <span className="truncate text-xs text-[#242424]" title={it.title}>
                                  {it.quantity}x {it.title}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>

                        {/* Quantity */}
                        <td className="py-3.5 px-6 font-mono font-medium text-[#1C1C1C]">
                          {totalQty}
                        </td>

                        {/* Amount */}
                        <td className="py-3.5 px-6">
                          <div>
                            <span className="font-semibold text-[#1C1C1C] block">
                              {formatCurrency(order.total || order.totalAmount || 0)}
                            </span>
                            <span className="text-[10px] text-[#8B3A4A] font-medium uppercase tracking-wider">
                              COD Pending
                            </span>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="py-3.5 px-6 text-[#737373] whitespace-nowrap">
                          {formatDate(order.createdAt)}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-6 whitespace-nowrap">
                          {getStatusBadge(order.status || order.orderStatus || "pending")}
                        </td>

                        {/* Actions & Status Controls */}
                        <td className="py-3.5 px-6 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            {/* Interactive Status Selector */}
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
                              className="bg-white border border-[#E5E1DC] text-[11px] rounded-lg px-2 py-1 text-[#242424] focus:outline-hidden focus:border-[#8B3A4A] cursor-pointer font-medium"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>

                            {/* Print Packing Slip */}
                            <button
                              type="button"
                              onClick={() => setPackingSlipOrder(order)}
                              title="Print Packing Slip"
                              className="p-1.5 text-[#737373] hover:text-[#1C1C1C] rounded hover:bg-[#F1ECE6] transition-colors cursor-pointer"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>

                            {/* View customer order details */}
                            <Link
                              href={`/orders/${order.id}`}
                              target="_blank"
                              title="Customer View"
                              className="p-1.5 text-[#737373] hover:text-[#8B3A4A] rounded hover:bg-[#F1ECE6] transition-colors"
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
