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

export default function AdminOrdersPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");

  const orders = mockOrders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1C1C1C]">
          Global Orders & Settlements
        </h2>
        <p className="text-xs text-[#737373] mt-0.5">
          Audit transactions, monitor escrow settlements, and inspect delivery SLAs.
        </p>
      </div>

      <Card>
        <CardHeader className="py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full sm:max-w-sm">
              <Input
                placeholder="Search orders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-[#737373]" />}
              />
            </div>
            <span className="text-xs text-[#737373]">
              {orders.length} total transactions
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#242424]">
              <thead className="bg-[#FAF8F5] border-b border-[#E5E1DC] text-[#737373] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-6">Order ID</th>
                  <th className="py-3 px-6">Customer</th>
                  <th className="py-3 px-6">Date</th>
                  <th className="py-3 px-6">Total Amount</th>
                  <th className="py-3 px-6">Payment</th>
                  <th className="py-3 px-6">Fulfillment</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E1DC]">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    <td className="py-3.5 px-6 font-mono font-medium text-[#1C1C1C]">
                      {order.orderNumber}
                    </td>
                    <td className="py-3.5 px-6 font-medium text-[#242424]">
                      {order.customerName}
                    </td>
                    <td className="py-3.5 px-6 text-[#737373]">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="py-3.5 px-6 font-semibold text-[#1C1C1C]">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="capitalize text-[#4F7A61] font-medium">
                        {order.paymentStatus}
                      </span>
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
                        onClick={() =>
                          toast({
                            title: "Order Details",
                            message: `Order ledger details for ${order.orderNumber} will connect in Phase 2.`,
                            type: "info",
                          })
                        }
                        className="text-[11px] h-7 px-2.5"
                      >
                        Inspect
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
