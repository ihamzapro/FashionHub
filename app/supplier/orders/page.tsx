"use client";

import React, { useState } from "react";
import { mockOrders } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Search } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export default function SupplierOrdersPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");

  const orders = mockOrders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase())
  );

  const handlePrintSlip = (orderNum: string) => {
    toast({
      title: "Packing Slip Generated",
      message: `Packing slip and courier label ready for ${orderNum}.`,
      type: "success",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1C1C1C]">
            Orders & Courier Dispatch
          </h2>
          <p className="text-xs text-[#737373] mt-0.5">
            Review customer orders containing garments from your workshop.
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader className="py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full sm:max-w-sm">
              <Input
                placeholder="Search by order # or customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-[#737373]" />}
              />
            </div>
            <span className="text-xs text-[#737373]">
              {orders.length} orders total
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#242424]">
              <thead className="bg-[#FAF8F5] border-b border-[#E5E1DC] text-[#737373] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-6">Order Number</th>
                  <th className="py-3 px-6">Customer & Destination</th>
                  <th className="py-3 px-6">Garments</th>
                  <th className="py-3 px-6">Date Placed</th>
                  <th className="py-3 px-6">Order Value</th>
                  <th className="py-3 px-6">Dispatch Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E1DC]">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    <td className="py-3.5 px-6 font-mono font-medium text-[#1C1C1C]">
                      {order.orderNumber}
                    </td>
                    <td className="py-3.5 px-6">
                      <p className="font-medium text-[#1C1C1C]">{order.customerName}</p>
                      <p className="text-[11px] text-[#737373]">
                        {order.shippingAddress.city}, {order.shippingAddress.country}
                      </p>
                    </td>
                    <td className="py-3.5 px-6">
                      {order.items.map((it) => (
                        <p key={it.id} className="text-[#242424] truncate max-w-[200px]">
                          {it.quantity}x {it.title}
                        </p>
                      ))}
                    </td>
                    <td className="py-3.5 px-6 text-[#737373]">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="py-3.5 px-6 font-semibold text-[#1C1C1C]">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="py-3.5 px-6">
                      <Badge
                        variant={
                          order.status === "delivered"
                            ? "success"
                            : order.status === "shipped"
                            ? "accent"
                            : "warning"
                        }
                        size="sm"
                      >
                        {order.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePrintSlip(order.orderNumber)}
                        className="text-[11px] h-7 px-2.5"
                      >
                        Print Slip
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
