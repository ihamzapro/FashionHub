"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  Search,
  Eye,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { useOrders } from "@/context/OrderContext";
import { useProducts } from "@/context/ProductContext";
import { Order, OrderStatus } from "@/lib/types";

export default function AdminOrdersPage() {
  const { toast } = useToast();
  const { orders, updateOrderStatus } = useOrders();
  const { products } = useProducts();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Helper to determine supplier name for an order
  const getSupplierNameForOrder = (order: Order) => {
    if (order.items && order.items.length > 0) {
      const firstItem = order.items[0];
      const prod = products.find((p) => p.id === firstItem.productId);
      if (prod?.supplierName) return prod.supplierName;
    }
    return "Atelier V";
  };

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const currentStatus = (o.status || o.orderStatus || "pending").toString().toLowerCase();
      if (statusFilter !== "all" && currentStatus !== statusFilter.toLowerCase()) {
        return false;
      }

      if (
        search &&
        !o.orderNumber.toLowerCase().includes(search.toLowerCase()) &&
        !o.customerName.toLowerCase().includes(search.toLowerCase()) &&
        !o.customerEmail?.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [orders, statusFilter, search]);

  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    const success = updateOrderStatus(orderId, newStatus);
    if (success) {
      toast({
        title: "Order Status Updated",
        message: `Order #${orderId} marked as ${newStatus}.`,
        type: "success",
      });
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    switch (s) {
      case "delivered":
        return (
          <Badge variant="success" size="sm" className="gap-1">
            <CheckCircle className="w-3 h-3" />
            Delivered
          </Badge>
        );
      case "shipped":
        return (
          <Badge variant="accent" size="sm" className="gap-1 bg-[#8B3A4A] text-white">
            <Truck className="w-3 h-3" />
            Shipped
          </Badge>
        );
      case "processing":
        return (
          <Badge variant="warning" size="sm" className="gap-1">
            <Clock className="w-3 h-3" />
            Processing
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="error" size="sm" className="gap-1">
            <XCircle className="w-3 h-3" />
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" size="sm" className="gap-1 border-[#B78628] text-[#B78628] bg-[#B78628]/10">
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
            Marketplace Order Fulfillment & Escrow
          </h2>
          <p className="text-xs text-[#737373] mt-0.5">
            Supervise fulfillment timelines, audit supplier settlements, and update shipment statuses.
          </p>
        </div>

        <span className="text-xs font-mono font-medium text-[#737373] bg-[#FAF8F5] px-3 py-1.5 rounded-lg border border-[#E5E1DC]">
          {filteredOrders.length} Transactions Listed
        </span>
      </div>

      {/* Orders Table Card */}
      <Card>
        <CardHeader className="py-4 border-b border-[#E5E1DC]">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="w-full sm:max-w-sm">
              <Input
                placeholder="Search by order ID or customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-[#737373]" />}
              />
            </div>

            <div className="flex flex-wrap items-center gap-1 bg-[#FAF8F5] p-1 rounded-lg border border-[#E5E1DC]">
              <span className="text-[10px] font-semibold text-[#737373] px-2 uppercase tracking-wider">
                Status:
              </span>
              {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer ${
                    statusFilter === s
                      ? "bg-[#8B3A4A] text-white shadow-xs"
                      : "text-[#737373] hover:text-[#1C1C1C]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#242424]">
              <thead className="bg-[#FAF8F5] border-b border-[#E5E1DC] text-[#737373] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-6">Order ID</th>
                  <th className="py-3 px-6">Customer</th>
                  <th className="py-3 px-6">Supplier Atelier</th>
                  <th className="py-3 px-6">Date</th>
                  <th className="py-3 px-6">Amount</th>
                  <th className="py-3 px-6">Status Update</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E1DC]">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#737373]">
                      No transactions found matching the selected filter parameters.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const currentStatus = (order.status || order.orderStatus || "pending").toString().toLowerCase();
                    const supplierName = getSupplierNameForOrder(order);

                    return (
                      <tr key={order.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                        {/* Order ID */}
                        <td className="py-3.5 px-6 font-mono font-semibold text-[#1C1C1C]">
                          {order.orderNumber}
                        </td>

                        {/* Customer */}
                        <td className="py-3.5 px-6">
                          <p className="font-semibold text-[#242424]">{order.customerName}</p>
                          <p className="text-[10px] text-[#737373] font-mono">{order.customerEmail}</p>
                        </td>

                        {/* Supplier */}
                        <td className="py-3.5 px-6 font-medium text-[#8B3A4A]">
                          {supplierName}
                        </td>

                        {/* Date */}
                        <td className="py-3.5 px-6 text-[#737373]">
                          {formatDate(order.createdAt)}
                        </td>

                        {/* Amount */}
                        <td className="py-3.5 px-6 font-semibold text-[#1C1C1C]">
                          {formatCurrency(order.totalAmount || order.total || 0)}
                        </td>

                        {/* Status Dropdown */}
                        <td className="py-3.5 px-6">
                          <select
                            value={currentStatus}
                            onChange={(e) => handleStatusUpdate(order.id, e.target.value as OrderStatus)}
                            className="text-xs px-2.5 py-1 bg-white border border-[#E5E1DC] rounded-md font-medium text-[#242424] focus:outline-none focus:border-[#8B3A4A] cursor-pointer"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-6 text-right">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 text-[#737373] hover:text-[#1C1C1C] hover:bg-[#F1ECE6] rounded-md transition-colors"
                            title="Inspect Order Breakdown"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
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

      {/* Order Details Modal */}
      {selectedOrder && (
        <Modal
          isOpen={Boolean(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
          title={`Order Breakdown: #${selectedOrder.orderNumber}`}
        >
          <div className="space-y-5 text-xs">
            <div className="flex items-center justify-between p-3.5 bg-[#FAF8F5] rounded-xl border border-[#E5E1DC]">
              <div>
                <p className="font-semibold text-sm text-[#1C1C1C]">
                  Total: {formatCurrency(selectedOrder.totalAmount || selectedOrder.total || 0)}
                </p>
                <p className="text-[11px] text-[#737373]">
                  Placed on {formatDate(selectedOrder.createdAt)}
                </p>
              </div>
              <div>{getStatusBadge((selectedOrder.status || selectedOrder.orderStatus || "pending").toString())}</div>
            </div>

            {/* Customer & Shipping info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white border border-[#E5E1DC] rounded-lg">
                <span className="text-[10px] text-[#737373] uppercase tracking-wider block font-semibold">
                  Customer
                </span>
                <p className="font-semibold text-[#1C1C1C] mt-1">{selectedOrder.customerName}</p>
                <p className="text-[#737373] font-mono text-[11px]">{selectedOrder.customerEmail}</p>
                <p className="text-[#737373]">{selectedOrder.customerPhone || selectedOrder.shippingAddress?.phone}</p>
              </div>

              <div className="p-3 bg-white border border-[#E5E1DC] rounded-lg">
                <span className="text-[10px] text-[#737373] uppercase tracking-wider block font-semibold">
                  Shipping Address
                </span>
                <p className="text-[#242424] mt-1">
                  {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city},{" "}
                  {selectedOrder.shippingAddress?.country}
                </p>
              </div>
            </div>

            {/* Line items */}
            <div>
              <span className="text-[10px] text-[#737373] uppercase tracking-wider block font-semibold mb-2">
                Purchased Pieces
              </span>
              <div className="border border-[#E5E1DC] rounded-lg divide-y divide-[#E5E1DC] overflow-hidden">
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between bg-white">
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <div className="relative w-9 h-11 rounded bg-[#FAF8F5] overflow-hidden border border-[#E5E1DC] shrink-0">
                            <Image src={item.image} alt={item.title} fill className="object-cover" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-[#1C1C1C]">{item.title}</p>
                          <p className="text-[11px] text-[#737373]">
                            Qty: {item.quantity} {item.selectedSize ? `• Size: ${item.selectedSize}` : ""}
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-[#1C1C1C]">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-[#737373]">Single curated order piece</div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E5E1DC]">
              <Button variant="outline" size="sm" onClick={() => setSelectedOrder(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
