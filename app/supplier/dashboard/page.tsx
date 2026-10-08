import React from "react";
import Link from "next/link";
import {
  DollarSign,
  Package,
  Clock,
  Star,
  ArrowUpRight,
  Plus,
  AlertTriangle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { mockOrders, mockProducts } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function SupplierDashboardPage() {
  const supplierProducts = mockProducts.filter((p) => p.supplierId === "sup-1");
  const recentOrders = mockOrders.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1C1C1C]">
            Atelier V Studios Dashboard
          </h2>
          <p className="text-xs text-[#737373] mt-0.5">
            Store ID: <span className="font-mono text-[#242424]">sup-1</span> • Paris, France • Verified Supplier
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/supplier/products">
            <Button
              variant="default"
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add New Garment
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#737373]">
                Total Store GMV
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-[#1C1C1C] mt-1">
                $18,450.00
              </h3>
              <p className="text-[11px] text-[#4F7A61] font-medium mt-1">
                +14.2% from last month
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
                Active Garments
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-[#1C1C1C] mt-1">
                {supplierProducts.length} Listings
              </h3>
              <p className="text-[11px] text-[#737373] mt-1">
                Across 4 categories
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E5E1DC] flex items-center justify-center text-[#8B3A4A]">
              <Package className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#737373]">
                Pending Orders
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-[#1C1C1C] mt-1">
                2 To Pack
              </h3>
              <p className="text-[11px] text-[#B78628] font-medium mt-1">
                Dispatch SLA: 24h remaining
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E5E1DC] flex items-center justify-center text-[#B78628]">
              <Clock className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#737373]">
                Atelier Rating
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-[#1C1C1C] mt-1">
                4.95 / 5
              </h3>
              <p className="text-[11px] text-[#4F7A61] font-medium mt-1">
                Top Rated Seller badge
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E5E1DC] flex items-center justify-center text-[#8B3A4A]">
              <Star className="w-5 h-5 fill-[#8B3A4A]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stock Attention Notice */}
      <div className="p-4 bg-white border-l-4 border-l-[#B78628] border border-[#E5E1DC] rounded-xl flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-[#B78628] shrink-0" />
          <div>
            <p className="text-xs font-semibold text-[#1C1C1C]">
              Inventory Alert: Sculptural Soft Leather Shoulder Tote has 12 units remaining
            </p>
            <p className="text-[11px] text-[#737373]">
              High reorder demand detected. Consider replenishing workshop stock.
            </p>
          </div>
        </div>
        <Link href="/supplier/products">
          <Button variant="outline" size="sm">
            Manage Stock
          </Button>
        </Link>
      </div>

      {/* Recent Orders Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Orders for Fulfillment</CardTitle>
            <p className="text-xs text-[#737373] mt-0.5">
              Live marketplace orders requiring your packaging & dispatch.
            </p>
          </div>
          <Link
            href="/supplier/orders"
            className="text-xs font-semibold text-[#8B3A4A] hover:underline flex items-center gap-1"
          >
            <span>All Orders</span>
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
                  <th className="py-3 px-6">Items</th>
                  <th className="py-3 px-6">Date</th>
                  <th className="py-3 px-6">Total</th>
                  <th className="py-3 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E1DC]">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    <td className="py-3.5 px-6 font-mono font-medium text-[#1C1C1C]">
                      {order.orderNumber}
                    </td>
                    <td className="py-3.5 px-6 font-medium">
                      {order.customerName}
                    </td>
                    <td className="py-3.5 px-6 text-[#737373]">
                      {order.items.map((i) => i.title).join(", ")}
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
