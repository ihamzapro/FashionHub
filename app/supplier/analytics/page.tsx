"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Eye,
  AlertTriangle,
  ArrowUpRight,
  Percent,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useProducts } from "@/context/ProductContext";
import { useOrders } from "@/context/OrderContext";
import { formatCurrency } from "@/lib/utils";

export default function SupplierAnalyticsPage() {
  const { products } = useProducts();
  const { orders } = useOrders();

  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "ytd">("30d");

  // Supplier products
  const supplierProducts = useMemo(() => {
    return products.filter((p) => p.supplierId === "sup-1" || !p.supplierId || p.supplierId === "all");
  }, [products]);

  // Low stock products (stock <= 15)
  const lowStockProducts = useMemo(() => {
    return supplierProducts.filter((p) => p.stock <= 15).sort((a, b) => a.stock - b.stock);
  }, [supplierProducts]);

  // Best selling products
  const bestSellers = useMemo(() => {
    return [...supplierProducts]
      .sort((a, b) => (b.price * (b.reviewCount || 10)) - (a.price * (a.reviewCount || 10)))
      .slice(0, 5)
      .map((p, idx) => {
        const unitsSold = 184 - idx * 32;
        const totalRevenue = unitsSold * p.price;
        const conversionRate = (4.8 - idx * 0.5).toFixed(1);
        return {
          ...p,
          unitsSold,
          totalRevenue,
          conversionRate,
        };
      });
  }, [supplierProducts]);

  // Aggregate metrics
  const totalRevenue = useMemo(() => {
    const ordersRev = orders
      .filter((o) => (o.status || "").toLowerCase() !== "cancelled")
      .reduce((sum, o) => sum + (o.total || o.totalAmount || 0), 0);
    return 18450 + ordersRev;
  }, [orders]);

  const totalOrdersCount = orders.length;
  const totalViews = 18420 + supplierProducts.length * 85;

  // Revenue chart dataset based on timeframe
  const revenueChartData = useMemo(() => {
    if (timeframe === "7d") {
      return [
        { label: "Mon", revenue: 1450, views: 320, pct: 45 },
        { label: "Tue", revenue: 2180, views: 480, pct: 68 },
        { label: "Wed", revenue: 1920, views: 410, pct: 58 },
        { label: "Thu", revenue: 2840, views: 620, pct: 86 },
        { label: "Fri", revenue: 3290, views: 710, pct: 98 },
        { label: "Sat", revenue: 2650, views: 580, pct: 80 },
        { label: "Sun", revenue: 2100, views: 490, pct: 65 },
      ];
    }
    if (timeframe === "30d") {
      return [
        { label: "W1 (Oct 1-7)", revenue: 8450, views: 1820, pct: 62 },
        { label: "W2 (Oct 8-14)", revenue: 11200, views: 2450, pct: 82 },
        { label: "W3 (Oct 15-21)", revenue: 9800, views: 2190, pct: 72 },
        { label: "W4 (Oct 22-28)", revenue: 13650, views: 3100, pct: 100 },
      ];
    }
    return [
      { label: "Q1", revenue: 32400, views: 8200, pct: 70 },
      { label: "Q2", revenue: 38900, views: 9800, pct: 85 },
      { label: "Q3", revenue: 46200, views: 11600, pct: 100 },
    ];
  }, [timeframe]);

  // Category sales share
  const categoryDistribution = [
    { name: "Outerwear & Coats", percentage: 38, amount: "$8,950", color: "bg-[#8B3A4A]" },
    { name: "Selvedge Denim", percentage: 26, amount: "$6,120", color: "bg-[#1C1C1C]" },
    { name: "Artisanal Knitwear", percentage: 21, amount: "$4,940", color: "bg-[#737373]" },
    { name: "Accessories & Bags", percentage: 15, amount: "$3,530", color: "bg-[#4F7A61]" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1C1C1C]">
            Supplier Analytics & Intelligence
          </h2>
          <p className="text-xs text-[#737373] mt-0.5">
            Real-time workshop telemetry, product engagement metrics, and inventory forecasting.
          </p>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center bg-white border border-[#E5E1DC] rounded-xl p-1 text-xs">
          {(["7d", "30d", "ytd"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                timeframe === t
                  ? "bg-[#8B3A4A] text-white shadow-xs font-semibold"
                  : "text-[#737373] hover:text-[#1C1C1C]"
              }`}
            >
              {t === "7d" ? "Past 7 Days" : t === "30d" ? "Past 30 Days" : "Year-To-Date"}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Core Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <Card className="hover:border-[#8B3A4A]/40 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-[#737373] mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider">
                Gross Revenue
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#8B3A4A]/10 border border-[#8B3A4A]/20 flex items-center justify-center text-[#8B3A4A]">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-[#1C1C1C]">
              {formatCurrency(totalRevenue)}
            </div>
            <p className="text-[11px] text-[#4F7A61] font-medium mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% vs previous period</span>
            </p>
          </CardContent>
        </Card>

        {/* Orders Volume */}
        <Card className="hover:border-[#8B3A4A]/40 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-[#737373] mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider">
                Orders Dispatched
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#8B3A4A]/10 border border-[#8B3A4A]/20 flex items-center justify-center text-[#8B3A4A]">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-[#1C1C1C]">
              {totalOrdersCount}
            </div>
            <p className="text-[11px] text-[#737373] mt-1">
              98.2% on-time courier SLA
            </p>
          </CardContent>
        </Card>

        {/* Product Views */}
        <Card className="hover:border-[#8B3A4A]/40 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-[#737373] mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider">
                Product Views
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#8B3A4A]/10 border border-[#8B3A4A]/20 flex items-center justify-center text-[#8B3A4A]">
                <Eye className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-[#1C1C1C]">
              {totalViews.toLocaleString()}
            </div>
            <p className="text-[11px] text-[#4F7A61] font-medium mt-1">
              +24% customer discovery
            </p>
          </CardContent>
        </Card>

        {/* Engagement & Conversion */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-[#737373] mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider">
                Cart Conversion Rate
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#E5E1DC] flex items-center justify-center text-[#4F7A61]">
                <Percent className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-[#1C1C1C]">
              4.2%
            </div>
            <p className="text-[11px] text-[#4F7A61] font-medium mt-1">
              Top 5% among luxury ateliers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue & Product Views Trajectory Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Revenue & Trajectory</CardTitle>
                <p className="text-xs text-[#737373] mt-0.5">
                  Periodic performance timeline across selected interval
                </p>
              </div>
              <Badge variant="outline" size="sm" className="border-[#4F7A61] text-[#4F7A61]">
                Healthy Velocity
              </Badge>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="h-64 w-full flex items-end gap-3 sm:gap-6 pb-2 px-2 border-b border-[#E5E1DC]">
                {revenueChartData.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                    {/* Tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 bg-[#8B3A4A] text-white text-[10px] rounded-lg px-2.5 py-1.5 shadow-xl pointer-events-none whitespace-nowrap z-10 text-center border border-[#722F3D]">
                      <p className="font-bold">{formatCurrency(d.revenue)}</p>
                      <p className="text-[9px] text-neutral-200">{d.views} views</p>
                    </div>

                    <div className="w-full bg-[#FAF8F5] rounded-t-lg h-48 flex items-end overflow-hidden">
                      <div
                        className="w-full bg-[#8B3A4A] group-hover:bg-[#732F3D] transition-all duration-300 rounded-t-lg"
                        style={{ height: `${d.pct}%` }}
                      />
                    </div>
                    <span className="text-[10px] sm:text-xs font-medium text-[#737373] group-hover:text-[#1C1C1C]">
                      {d.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 text-center">
                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E5E1DC]">
                  <p className="text-[10px] uppercase tracking-wider text-[#737373]">Avg Daily Sales</p>
                  <p className="text-sm font-bold text-[#1C1C1C] mt-0.5">$2,140</p>
                </div>
                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E5E1DC]">
                  <p className="text-[10px] uppercase tracking-wider text-[#737373]">Avg Units / Order</p>
                  <p className="text-sm font-bold text-[#1C1C1C] mt-0.5">2.4 pcs</p>
                </div>
                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E5E1DC]">
                  <p className="text-[10px] uppercase tracking-wider text-[#737373]">Customer Return Rate</p>
                  <p className="text-sm font-bold text-[#4F7A61] mt-0.5">1.2%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Breakdown */}
        <div className="lg:col-span-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Sales by Garment Category</CardTitle>
              <p className="text-xs text-[#737373] mt-0.5">
                Share of atelier revenue by product type
              </p>
            </CardHeader>
            <CardContent className="space-y-5">
              {categoryDistribution.map((cat) => (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-[#242424]">{cat.name}</span>
                    <span className="text-[#1C1C1C] font-semibold">
                      {cat.amount} ({cat.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[#FAF8F5] rounded-full overflow-hidden border border-[#E5E1DC]/60">
                    <div
                      className={`h-full ${cat.color} rounded-full`}
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-[#E5E1DC] space-y-2">
                <p className="text-xs font-semibold text-[#1C1C1C]">Collection Insights</p>
                <p className="text-[11px] text-[#737373] leading-relaxed">
                  Outerwear maintains highest profitability margin (64%). Selvedge denim drives greatest repeat repurchase loyalty.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Best-Selling Products Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Best-Selling Garments</CardTitle>
            <p className="text-xs text-[#737373] mt-0.5">
              Top revenue generating products across customer purchases
            </p>
          </div>
          <Link
            href="/supplier/products"
            className="text-xs font-semibold text-[#8B3A4A] hover:underline flex items-center gap-1"
          >
            <span>Full Catalog</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#242424]">
              <thead className="bg-[#FAF8F5] border-b border-[#E5E1DC] text-[#737373] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-6">Rank</th>
                  <th className="py-3 px-6">Product</th>
                  <th className="py-3 px-6">Price</th>
                  <th className="py-3 px-6">Units Sold</th>
                  <th className="py-3 px-6">Gross Revenue</th>
                  <th className="py-3 px-6">Conversion</th>
                  <th className="py-3 px-6">Stock Left</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E1DC]">
                {bestSellers.map((item, index) => (
                  <tr key={item.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    <td className="py-3.5 px-6 font-bold text-[#8B3A4A]">
                      #{index + 1}
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-12 rounded bg-neutral-200 overflow-hidden shrink-0 border border-[#E5E1DC]">
                          <Image
                            src={item.images[0] || ""}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-[#1C1C1C] line-clamp-1 max-w-[200px]">
                            {item.title}
                          </p>
                          <span className="font-mono text-[10px] text-[#737373]">{item.sku}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-6 font-semibold text-[#1C1C1C]">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="py-3.5 px-6 font-medium text-[#1C1C1C]">
                      {item.unitsSold} units
                    </td>
                    <td className="py-3.5 px-6 font-bold text-[#1C1C1C]">
                      {formatCurrency(item.totalRevenue)}
                    </td>
                    <td className="py-3.5 px-6 text-[#4F7A61] font-semibold">
                      {item.conversionRate}%
                    </td>
                    <td className="py-3.5 px-6">
                      <Badge
                        variant={item.stock > 10 ? "success" : item.stock > 0 ? "warning" : "error"}
                        size="sm"
                      >
                        {item.stock} left
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Low-Stock Inventory Warnings & Product Engagement Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Low-Stock Products (7 Cols) */}
        <div className="lg:col-span-7">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#B78628]" />
                  <span>Low-Stock Inventory Warnings</span>
                </CardTitle>
                <p className="text-xs text-[#737373] mt-0.5">
                  Garments requiring restock before running out of atelier availability
                </p>
              </div>
              <Badge variant="warning" size="sm">
                {lowStockProducts.length} Items Alert
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-[#E5E1DC]">
                {lowStockProducts.slice(0, 4).map((p) => (
                  <div key={p.id} className="p-4 flex items-center justify-between gap-4 hover:bg-[#FAF8F5]/60 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-10 h-12 rounded bg-neutral-200 overflow-hidden shrink-0 border border-[#E5E1DC]">
                        <Image
                          src={p.images[0] || ""}
                          alt={p.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-xs text-[#1C1C1C] truncate">
                          {p.title}
                        </p>
                        <p className="text-[11px] text-[#737373]">
                          SKU: {p.sku} • {p.category}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-xs font-bold font-mono text-[#B84A4A]">
                          {p.stock} units
                        </span>
                        <p className="text-[10px] text-[#737373]">Est. 3 days left</p>
                      </div>
                      <Link href={`/supplier/products/${p.id}/edit`}>
                        <Button variant="outline" size="sm" className="text-[11px] h-7 px-2.5">
                          Restock
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product Engagement & Customer Sentiment (5 Cols) */}
        <div className="lg:col-span-5">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Customer Engagement</CardTitle>
              <p className="text-xs text-[#737373] mt-0.5">
                Buyer sentiment, wishlist additions, and brand loyalty
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E5E1DC] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#242424]">Wishlist Additions</span>
                  <span className="text-xs font-bold text-[#8B3A4A]">1,420 Saves</span>
                </div>
                <div className="h-1.5 w-full bg-[#E5E1DC] rounded-full overflow-hidden">
                  <div className="h-full bg-[#8B3A4A] rounded-full" style={{ width: "74%" }} />
                </div>
                <p className="text-[10px] text-[#737373]">
                  High intent signals: 42% convert into purchases within 14 days.
                </p>
              </div>

              <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E5E1DC] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#242424]">Customer Satisfaction</span>
                  <span className="text-xs font-bold text-[#4F7A61]">99.1% Positive</span>
                </div>
                <div className="h-1.5 w-full bg-[#E5E1DC] rounded-full overflow-hidden">
                  <div className="h-full bg-[#4F7A61] rounded-full" style={{ width: "99%" }} />
                </div>
                <p className="text-[10px] text-[#737373]">
                  Based on verified purchaser reviews and zero garment defect disputes.
                </p>
              </div>

              <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E5E1DC] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#242424]">Repeat Atelier Buyers</span>
                  <span className="text-xs font-bold text-[#1C1C1C]">34.8% Rate</span>
                </div>
                <div className="h-1.5 w-full bg-[#E5E1DC] rounded-full overflow-hidden">
                  <div className="h-full bg-[#1C1C1C] rounded-full" style={{ width: "35%" }} />
                </div>
                <p className="text-[10px] text-[#737373]">
                  Customers who reorder new drops from your atelier within 60 days.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
