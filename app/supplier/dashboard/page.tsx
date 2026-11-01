"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  DollarSign,
  Package,
  ShoppingBag,
  TrendingUp,
  Eye,
  Star,
  ArrowUpRight,
  Plus,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useProducts } from "@/context/ProductContext";
import { useOrders } from "@/context/OrderContext";
import { formatCurrency } from "@/lib/utils";

export default function SupplierDashboardPage() {
  const { products } = useProducts();
  const { orders } = useOrders();
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");

  // Filter supplier products (defaulting to sup-1 for the demo studio Atelier V)
  const supplierProducts = useMemo(() => {
    return products.filter((p) => p.supplierId === "sup-1" || !p.supplierId || p.supplierId === "all");
  }, [products]);

  // Order stats & breakdown
  const orderBreakdown = useMemo(() => {
    const counts = {
      pending: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    orders.forEach((o) => {
      const st = (o.status || o.orderStatus || "pending").toLowerCase();
      if (st === "pending" || st === "processing") counts.pending++;
      else if (st === "shipped") counts.shipped++;
      else if (st === "delivered") counts.delivered++;
      else if (st === "cancelled" || st === "refunded") counts.cancelled++;
      else counts.pending++;
    });

    return counts;
  }, [orders]);

  // Calculate high-level statistics
  const stats = useMemo(() => {
    const totalOrdersCount = orders.length;
    const totalDeliveredOrActive = orders.filter(
      (o) => (o.status || "").toLowerCase() !== "cancelled"
    );

    const baseSales = totalDeliveredOrActive.reduce(
      (acc, o) => acc + (o.total || o.totalAmount || 0),
      0
    );
    // Combined realistic base + dynamic orders
    const totalSales = 18450 + baseSales;

    const totalSoldUnits = orders.reduce((acc, o) => {
      return acc + (o.items ? o.items.reduce((s, it) => s + it.quantity, 0) : 1);
    }, 420);

    const avgRating =
      supplierProducts.length > 0
        ? (
            supplierProducts.reduce((sum, p) => sum + (p.rating || 4.8), 0) /
            supplierProducts.length
          ).toFixed(1)
        : "4.9";

    return {
      totalSales,
      totalOrders: totalOrdersCount,
      totalProducts: supplierProducts.length,
      productsSold: totalSoldUnits,
      productViews: 18420 + supplierProducts.length * 45,
      avgRating,
    };
  }, [orders, supplierProducts]);

  // Top products calculation
  const topProducts = useMemo(() => {
    return supplierProducts.slice(0, 4).map((p, idx) => {
      const unitsSold = 142 - idx * 28 + (p.stock < 15 ? 45 : 12);
      const views = 2400 - idx * 450;
      const revenue = unitsSold * p.price;
      return {
        ...p,
        unitsSold,
        views,
        revenue,
      };
    });
  }, [supplierProducts]);

  // Chart data points based on time range
  const chartData = useMemo(() => {
    if (timeRange === "7d") {
      return [
        { label: "Mon", revenue: 1420, orders: 4, height: 45 },
        { label: "Tue", revenue: 2180, orders: 7, height: 68 },
        { label: "Wed", revenue: 1890, orders: 5, height: 58 },
        { label: "Thu", revenue: 2750, orders: 9, height: 86 },
        { label: "Fri", revenue: 3120, orders: 11, height: 96 },
        { label: "Sat", revenue: 2410, orders: 8, height: 75 },
        { label: "Sun", revenue: 1950, orders: 6, height: 62 },
      ];
    }
    if (timeRange === "30d") {
      return [
        { label: "Week 1", revenue: 8450, orders: 28, height: 65 },
        { label: "Week 2", revenue: 11200, orders: 36, height: 84 },
        { label: "Week 3", revenue: 9800, orders: 31, height: 74 },
        { label: "Week 4", revenue: 13450, orders: 44, height: 100 },
      ];
    }
    return [
      { label: "July", revenue: 32400, orders: 112, height: 70 },
      { label: "August", revenue: 38900, orders: 134, height: 85 },
      { label: "September", revenue: 46200, orders: 158, height: 100 },
    ];
  }, [timeRange]);

  return (
    <div className="space-y-8">
      {/* Welcome & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1C1C1C]">
              Atelier V Studios Workspace
            </h2>
            <Badge variant="outline" size="sm" className="border-[#8B3A4A]/30 text-[#8B3A4A] bg-[#8B3A4A]/5">
              Verified Artisan
            </Badge>
          </div>
          <p className="text-xs text-[#737373] mt-1">
            Supplier Code: <span className="font-mono text-[#1C1C1C] font-medium">sup-1</span> • Paris, France • Cash on Delivery (COD) Fulfillment
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/supplier/products/add">
            <Button
              variant="accent"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add New Product
            </Button>
          </Link>
          <Link href="/supplier/orders">
            <Button variant="outline" size="sm" className="hover:border-[#8B3A4A] hover:text-[#8B3A4A]">
              Manage Orders
            </Button>
          </Link>
        </div>
      </div>

      {/* 6 Core Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* 1. Total Sales */}
        <Card className="hover:border-[#8B3A4A]/40 transition-colors">
          <CardContent className="p-4.5">
            <div className="flex items-center justify-between text-[#737373] mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider">
                Total Sales
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#8B3A4A]/10 border border-[#8B3A4A]/20 flex items-center justify-center text-[#8B3A4A]">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-bold tracking-tight text-[#1C1C1C]">
              {formatCurrency(stats.totalSales)}
            </div>
            <div className="text-[10px] text-[#4F7A61] font-medium mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>+18.4% this mo</span>
            </div>
          </CardContent>
        </Card>

        {/* 2. Total Orders */}
        <Card className="hover:border-[#8B3A4A]/40 transition-colors">
          <CardContent className="p-4.5">
            <div className="flex items-center justify-between text-[#737373] mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider">
                Total Orders
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#8B3A4A]/10 border border-[#8B3A4A]/20 flex items-center justify-center text-[#8B3A4A]">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-bold tracking-tight text-[#1C1C1C]">
              {stats.totalOrders}
            </div>
            <div className="text-[10px] text-[#737373] mt-1">
              {orderBreakdown.pending} requiring action
            </div>
          </CardContent>
        </Card>

        {/* 3. Total Products */}
        <Card className="hover:border-[#8B3A4A]/40 transition-colors">
          <CardContent className="p-4.5">
            <div className="flex items-center justify-between text-[#737373] mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider">
                Total Products
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#8B3A4A]/10 border border-[#8B3A4A]/20 flex items-center justify-center text-[#8B3A4A]">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-bold tracking-tight text-[#1C1C1C]">
              {stats.totalProducts}
            </div>
            <div className="text-[10px] text-[#737373] mt-1">
              Active in catalog
            </div>
          </CardContent>
        </Card>

        {/* 4. Products Sold */}
        <Card className="hover:border-[#8B3A4A]/40 transition-colors">
          <CardContent className="p-4.5">
            <div className="flex items-center justify-between text-[#737373] mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider">
                Products Sold
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#E5E1DC] flex items-center justify-center text-[#4F7A61]">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-bold tracking-tight text-[#1C1C1C]">
              {stats.productsSold.toLocaleString()}
            </div>
            <div className="text-[10px] text-[#4F7A61] font-medium mt-1">
              Garments dispatched
            </div>
          </CardContent>
        </Card>

        {/* 5. Product Views */}
        <Card className="hover:border-[#8B3A4A]/40 transition-colors">
          <CardContent className="p-4.5">
            <div className="flex items-center justify-between text-[#737373] mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider">
                Product Views
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#8B3A4A]/10 border border-[#8B3A4A]/20 flex items-center justify-center text-[#8B3A4A]">
                <Eye className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-bold tracking-tight text-[#1C1C1C]">
              {stats.productViews.toLocaleString()}
            </div>
            <div className="text-[10px] text-[#4F7A61] font-medium mt-1">
              +12.6% traffic
            </div>
          </CardContent>
        </Card>

        {/* 6. Average Rating */}
        <Card className="hover:border-[#8B3A4A]/40 transition-colors">
          <CardContent className="p-4.5">
            <div className="flex items-center justify-between text-[#737373] mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider">
                Avg. Rating
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#E5E1DC] flex items-center justify-center text-[#8B3A4A]">
                <Star className="w-4 h-4 fill-[#8B3A4A]" />
              </div>
            </div>
            <div className="text-xl font-bold tracking-tight text-[#1C1C1C]">
              {stats.avgRating} <span className="text-xs font-normal text-[#737373]">/ 5.0</span>
            </div>
            <div className="text-[10px] text-[#4F7A61] font-medium mt-1">
              Top Tier Quality
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Grid: Sales Overview Chart + Orders Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales Overview Chart (8 Cols) */}
        <div className="lg:col-span-8">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Sales Overview</CardTitle>
                <p className="text-xs text-[#737373] mt-0.5">
                  Revenue trajectory and buyer purchasing trends
                </p>
              </div>

              {/* Time Range Toggle */}
              <div className="flex items-center bg-[#FAF8F5] border border-[#E5E1DC] rounded-lg p-0.5 text-xs">
                {(["7d", "30d", "90d"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setTimeRange(r)}
                    className={`px-3 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                      timeRange === r
                        ? "bg-[#8B3A4A] text-white shadow-xs font-semibold"
                        : "text-[#737373] hover:text-[#1C1C1C]"
                    }`}
                  >
                    {r === "7d" ? "7 Days" : r === "30d" ? "30 Days" : "90 Days"}
                  </button>
                ))}
              </div>
            </CardHeader>

            <CardContent className="pt-4">
              {/* Chart Visualizer */}
              <div className="h-60 w-full flex items-end gap-3 sm:gap-6 pt-6 pb-2 px-2 border-b border-[#E5E1DC]">
                {chartData.map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 bg-[#8B3A4A] text-white text-[10px] rounded px-2.5 py-1 shadow-md pointer-events-none whitespace-nowrap z-10 border border-[#722F3D]">
                      ${bar.revenue.toLocaleString()} ({bar.orders} orders)
                    </div>

                    {/* Bar container */}
                    <div className="w-full bg-[#FAF8F5] rounded-t-md h-44 flex items-end overflow-hidden">
                      <div
                        className="w-full bg-[#8B3A4A] group-hover:bg-[#732F3D] transition-all duration-500 rounded-t-md"
                        style={{ height: `${bar.height}%` }}
                      />
                    </div>

                    {/* Label */}
                    <span className="text-[11px] font-medium text-[#737373] group-hover:text-[#1C1C1C]">
                      {bar.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-[#737373] pt-4 px-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8B3A4A]" />
                  <span>Workshop Revenue (COD)</span>
                </div>
                <div className="font-medium text-[#1C1C1C]">
                  Peak Period: <span className="font-semibold text-[#8B3A4A]">+32% Velocity</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Status Breakdown (4 Cols) */}
        <div className="lg:col-span-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Orders Status</CardTitle>
              <p className="text-xs text-[#737373] mt-0.5">
                Current order lifecycle distribution
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Pending */}
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E1DC] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#FAF8F5] border border-[#B78628]/30 text-[#B78628] flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#1C1C1C]">Pending</h4>
                    <p className="text-[10px] text-[#737373]">Awaiting packaging & courier</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold text-[#1C1C1C]">
                    {orderBreakdown.pending}
                  </span>
                  <Badge variant="warning" size="sm" className="ml-2">Action</Badge>
                </div>
              </div>

              {/* Shipped */}
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E1DC] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#FAF8F5] border border-[#8B3A4A]/30 text-[#8B3A4A] flex items-center justify-center">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#1C1C1C]">Shipped</h4>
                    <p className="text-[10px] text-[#737373]">In courier transit</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold text-[#1C1C1C]">
                    {orderBreakdown.shipped}
                  </span>
                  <Badge variant="accent" size="sm" className="ml-2">Transit</Badge>
                </div>
              </div>

              {/* Delivered */}
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E1DC] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#FAF8F5] border border-[#4F7A61]/30 text-[#4F7A61] flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#1C1C1C]">Delivered</h4>
                    <p className="text-[10px] text-[#737373]">Payment collected (COD)</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold text-[#1C1C1C]">
                    {orderBreakdown.delivered}
                  </span>
                  <Badge variant="success" size="sm" className="ml-2">Paid</Badge>
                </div>
              </div>

              {/* Cancelled */}
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E1DC] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#FAF8F5] border border-[#B84A4A]/30 text-[#B84A4A] flex items-center justify-center">
                    <XCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#1C1C1C]">Cancelled</h4>
                    <p className="text-[10px] text-[#737373]">Returned / Voided</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold text-[#737373]">
                    {orderBreakdown.cancelled}
                  </span>
                </div>
              </div>

              <Link href="/supplier/orders" className="block pt-2">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Review All Fulfillment Orders
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Top Products Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Top Performing Garments</CardTitle>
            <p className="text-xs text-[#737373] mt-0.5">
              Ranked by revenue generation and customer demand
            </p>
          </div>
          <Link
            href="/supplier/products"
            className="text-xs font-semibold text-[#8B3A4A] hover:underline flex items-center gap-1"
          >
            <span>View Full Catalog</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#242424]">
              <thead className="bg-[#FAF8F5] border-b border-[#E5E1DC] text-[#737373] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-6">Product</th>
                  <th className="py-3 px-6">Category</th>
                  <th className="py-3 px-6">Units Sold</th>
                  <th className="py-3 px-6">Revenue</th>
                  <th className="py-3 px-6">Views</th>
                  <th className="py-3 px-6">Stock Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E1DC]">
                {topProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-12 rounded bg-[#F1ECE6] overflow-hidden shrink-0 border border-[#E5E1DC]">
                          <Image
                            src={prod.images[0]}
                            alt={prod.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-[#1C1C1C] line-clamp-1 max-w-[220px]">
                            {prod.title}
                          </p>
                          <span className="font-mono text-[10px] text-[#737373]">{prod.sku}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-6 text-[#737373]">{prod.category}</td>
                    <td className="py-3.5 px-6 font-medium text-[#1C1C1C]">
                      {prod.unitsSold} units
                    </td>
                    <td className="py-3.5 px-6 font-semibold text-[#1C1C1C]">
                      {formatCurrency(prod.revenue)}
                    </td>
                    <td className="py-3.5 px-6 text-[#737373]">
                      {prod.views.toLocaleString()} views
                    </td>
                    <td className="py-3.5 px-6">
                      <Badge
                        variant={prod.stock > 10 ? "success" : prod.stock > 0 ? "warning" : "error"}
                        size="sm"
                      >
                        {prod.stock > 10 ? `${prod.stock} in stock` : prod.stock > 0 ? `Low (${prod.stock})` : "Out of Stock"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Stock Attention Notice */}
      <div className="p-4 bg-white border-l-4 border-l-[#B78628] border border-[#E5E1DC] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-[#B78628] shrink-0" />
          <div>
            <p className="text-xs font-semibold text-[#1C1C1C]">
              Inventory Alert: Sculptural Soft Leather Shoulder Tote has 12 units remaining
            </p>
            <p className="text-[11px] text-[#737373]">
              High reorder demand detected. Consider replenishing workshop stock to prevent stockout.
            </p>
          </div>
        </div>
        <Link href="/supplier/products">
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            Update Stock
          </Button>
        </Link>
      </div>
    </div>
  );
}
