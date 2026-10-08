import React from "react";
import Link from "next/link";
import {
  Users,
  Package,
  DollarSign,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { mockUsers, mockProducts, mockOrders } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default function AdminDashboardPage() {
  const recentOrders = mockOrders.slice(0, 4);
  const pendingSuppliers = mockUsers.filter((u) => u.role === "supplier");

  return (
    <div className="space-y-8">
      {/* Platform Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1C1C1C]">
            Marketplace Command Center
          </h2>
          <p className="text-xs text-[#737373] mt-0.5">
            Real-time overview across customer volume, supplier operations, and catalog integrity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" size="md" className="gap-1.5 py-1 px-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4F7A61] animate-pulse" />
            All Systems Operational
          </Badge>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#737373]">
                Total Platform GMV
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-[#1C1C1C] mt-1">
                $142,890.00
              </h3>
              <p className="text-[11px] text-[#4F7A61] font-medium mt-1">
                +18.7% month-over-month
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E5E1DC] flex items-center justify-center text-[#1C1C1C]">
              <DollarSign className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#737373]">
                Total Accounts
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-[#1C1C1C] mt-1">
                {mockUsers.length * 240}+ Users
              </h3>
              <p className="text-[11px] text-[#4F7A61] font-medium mt-1">
                98% verified status
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E5E1DC] flex items-center justify-center text-[#8B3A4A]">
              <Users className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#737373]">
                Catalog Items
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-[#1C1C1C] mt-1">
                {mockProducts.length * 18} Pieces
              </h3>
              <p className="text-[11px] text-[#737373] mt-1">
                Across 7 core departments
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E5E1DC] flex items-center justify-center text-[#1C1C1C]">
              <Package className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#737373]">
                Pending Verifications
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-[#1C1C1C] mt-1">
                3 Ateliers
              </h3>
              <p className="text-[11px] text-[#B78628] font-medium mt-1">
                Audit queue requires review
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E5E1DC] flex items-center justify-center text-[#B78628]">
              <AlertCircle className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid: Global Activity & Supplier Verification */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Platform Orders */}
        <div className="lg:col-span-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Global Marketplace Orders</CardTitle>
                <p className="text-xs text-[#737373]">
                  Most recent transactions across customer and supplier nodes.
                </p>
              </div>
              <Link
                href="/admin/orders"
                className="text-xs font-semibold text-[#8B3A4A] hover:underline flex items-center gap-1"
              >
                <span>View All Orders</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#242424]">
                  <thead className="bg-[#FAF8F5] border-b border-[#E5E1DC] text-[#737373] uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-6">Order ID</th>
                      <th className="py-3 px-6">Customer</th>
                      <th className="py-3 px-6">Total</th>
                      <th className="py-3 px-6">Payment</th>
                      <th className="py-3 px-6">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E1DC]">
                    {recentOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                        <td className="py-3 px-6 font-mono font-medium text-[#1C1C1C]">
                          {ord.orderNumber}
                        </td>
                        <td className="py-3 px-6 font-medium text-[#242424]">
                          {ord.customerName}
                        </td>
                        <td className="py-3 px-6 font-semibold text-[#1C1C1C]">
                          {formatCurrency(ord.totalAmount)}
                        </td>
                        <td className="py-3 px-6">
                          <span className="capitalize text-[#4F7A61] font-medium">
                            {ord.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3 px-6">
                          <Badge
                            variant={
                              ord.status === "delivered"
                                ? "success"
                                : ord.status === "shipped"
                                ? "accent"
                                : "warning"
                            }
                            size="sm"
                          >
                            {ord.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Supplier Verification Queue */}
        <div className="lg:col-span-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Supplier Verification Queue</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingSuppliers.map((sup) => (
                <div
                  key={sup.id}
                  className="p-3 bg-[#FAF8F5] border border-[#E5E1DC] rounded-xl space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#1C1C1C]">
                      {sup.storeName || sup.name}
                    </span>
                    <Badge variant="warning" size="sm">
                      Pending Audit
                    </Badge>
                  </div>
                  <p className="text-[11px] text-[#737373]">
                    {sup.bio || "Boutique fashion collective requesting marketplace onboarding."}
                  </p>
                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#E5E1DC]/60">
                    <button className="text-[11px] text-[#737373] hover:text-[#1C1C1C] px-2 py-1">
                      Inspect Dossier
                    </button>
                    <button className="text-[11px] bg-[#1C1C1C] text-white px-2.5 py-1 rounded-md font-medium hover:bg-[#8B3A4A] transition-colors">
                      Verify Atelier
                    </button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
