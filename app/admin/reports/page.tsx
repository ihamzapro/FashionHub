"use client";

import React, { useState, useMemo } from "react";
import {
  Download,
  Calendar,
  DollarSign,
  Package,
  Store,
  Users,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import { useProducts } from "@/context/ProductContext";
import { useAuth } from "@/context/AuthContext";

type DateFilter = "Today" | "Week" | "Month" | "Year" | "Custom";
type ReportTab = "sales" | "products" | "suppliers" | "customers";

export default function AdminReportsPage() {
  const { toast } = useToast();
  const { products } = useProducts();
  const { users } = useAuth();

  const [dateFilter, setDateFilter] = useState<DateFilter>("Month");
  const [activeTab, setActiveTab] = useState<ReportTab>("sales");
  const [customStart, setCustomStart] = useState("2026-09-01");
  const [customEnd, setCustomEnd] = useState("2026-10-09");

  // Multiplier for mock timeframe scaling
  const timeframeMultiplier = useMemo(() => {
    switch (dateFilter) {
      case "Today":
        return 0.05;
      case "Week":
        return 0.25;
      case "Month":
        return 1.0;
      case "Year":
        return 11.4;
      case "Custom":
        return 0.8;
      default:
        return 1.0;
    }
  }, [dateFilter]);

  // Scaled summary figures
  const baseRevenue = 142890;
  const scaledRevenue = Math.round(baseRevenue * timeframeMultiplier);
  const baseOrders = 386;
  const scaledOrders = Math.max(1, Math.round(baseOrders * timeframeMultiplier));
  const avgOrderValue = Math.round(scaledRevenue / scaledOrders);

  // Best sellers
  const bestSellers = useMemo(() => {
    return [
      { title: "Artisan Boxy Heavyweight Tee", category: "Clothing", units: Math.round(184 * timeframeMultiplier), gmv: Math.round(23920 * timeframeMultiplier) },
      { title: "Burgundy Noir Sculptural Tote", category: "Accessories", units: Math.round(89 * timeframeMultiplier), gmv: Math.round(57850 * timeframeMultiplier) },
      { title: "Tuscan Calfskin Minimalist Sneaker", category: "Shoes", units: Math.round(76 * timeframeMultiplier), gmv: Math.round(29640 * timeframeMultiplier) },
      { title: "Grade-A Mongolian Cashmere Sweater", category: "Clothing", units: Math.round(62 * timeframeMultiplier), gmv: Math.round(24180 * timeframeMultiplier) },
    ];
  }, [timeframeMultiplier]);

  // Low stock pieces
  const lowStockProducts = useMemo(() => {
    return products.filter((p) => p.stock <= 10);
  }, [products]);

  // Most viewed products
  const mostViewedProducts = useMemo(() => {
    return [
      { title: "Burgundy Noir Sculptural Tote", views: Math.round(4820 * timeframeMultiplier), conversion: "4.8%" },
      { title: "Okayama Selvedge Denim Trouser", views: Math.round(3940 * timeframeMultiplier), conversion: "3.9%" },
      { title: "Artisan Boxy Heavyweight Tee", views: Math.round(3650 * timeframeMultiplier), conversion: "5.1%" },
      { title: "Cold-Pressed Botanical Facial Nectar", views: Math.round(2890 * timeframeMultiplier), conversion: "3.2%" },
    ];
  }, [timeframeMultiplier]);

  // Suppliers metrics
  const supplierReports = useMemo(() => {
    return [
      {
        name: "Atelier V",
        sales: Math.round(48900 * timeframeMultiplier),
        orders: Math.round(142 * timeframeMultiplier),
        sla: "99.4%",
        engagementScore: "98/100",
      },
      {
        name: "Maison Blanche",
        sales: Math.round(36400 * timeframeMultiplier),
        orders: Math.round(98 * timeframeMultiplier),
        sla: "98.1%",
        engagementScore: "94/100",
      },
      {
        name: "Kyoto Craft Studio",
        sales: Math.round(29800 * timeframeMultiplier),
        orders: Math.round(76 * timeframeMultiplier),
        sla: "97.5%",
        engagementScore: "92/100",
      },
      {
        name: "Sartoria Napoli",
        sales: Math.round(18200 * timeframeMultiplier),
        orders: Math.round(45 * timeframeMultiplier),
        sla: "95.8%",
        engagementScore: "89/100",
      },
    ];
  }, [timeframeMultiplier]);

  // Customer statistics
  const customerMetrics = useMemo(() => {
    const totalCust = users.filter((u) => u.role === "customer").length;
    return {
      totalCustomers: totalCust,
      newCustomers: Math.max(1, Math.round(totalCust * 0.35 * timeframeMultiplier)),
      repeatRate: "42.8%",
      topCustomers: [
        { name: "Elena Rostova", orders: Math.max(1, Math.round(8 * timeframeMultiplier)), spend: Math.round(3200 * timeframeMultiplier) },
        { name: "Marcus Vance", orders: Math.max(1, Math.round(6 * timeframeMultiplier)), spend: Math.round(2450 * timeframeMultiplier) },
        { name: "Siddharth Rao", orders: Math.max(1, Math.round(4 * timeframeMultiplier)), spend: Math.round(1890 * timeframeMultiplier) },
      ],
    };
  }, [users, timeframeMultiplier]);

  const handleExportCSV = (reportType: string) => {
    toast({
      title: "Ledger Export Generated",
      message: `${reportType} report for [${dateFilter}] downloaded successfully in CSV format.`,
      type: "success",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1C1C1C]">
            Marketplace Analytics & Financial Reports
          </h2>
          <p className="text-xs text-[#737373] mt-0.5">
            Audit platform sales trends, inventory velocity, seller engagement, and client retention.
          </p>
        </div>

        <Button
          variant="default"
          size="sm"
          leftIcon={<Download className="w-4 h-4" />}
          onClick={() => handleExportCSV(`${activeTab.toUpperCase()} Analysis`)}
          className="bg-[#8B3A4A] hover:bg-[#722F3D] text-white shrink-0"
        >
          Export Report (CSV)
        </Button>
      </div>

      {/* Date Filters Control Card */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#737373] uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Reporting Period:
            </span>
            <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-lg border border-[#E5E1DC]">
              {(["Today", "Week", "Month", "Year", "Custom"] as DateFilter[]).map((df) => (
                <button
                  key={df}
                  onClick={() => setDateFilter(df)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer ${
                    dateFilter === df
                      ? "bg-[#8B3A4A] text-white shadow-xs"
                      : "text-[#737373] hover:text-[#1C1C1C]"
                  }`}
                >
                  {df}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Date Pickers */}
          {dateFilter === "Custom" && (
            <div className="flex items-center gap-2 text-xs">
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="px-2.5 py-1.5 border border-[#E5E1DC] rounded-lg bg-white text-[#242424] focus:outline-none focus:border-[#8B3A4A]"
              />
              <span className="text-[#737373]">to</span>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="px-2.5 py-1.5 border border-[#E5E1DC] rounded-lg bg-white text-[#242424] focus:outline-none focus:border-[#8B3A4A]"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Report Section Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E5E1DC] pb-2">
        {[
          { key: "sales" as ReportTab, label: "Sales & GMV", icon: DollarSign },
          { key: "products" as ReportTab, label: "Products & Stock", icon: Package },
          { key: "suppliers" as ReportTab, label: "Suppliers & Ateliers", icon: Store },
          { key: "customers" as ReportTab, label: "Customers & Cohorts", icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors cursor-pointer ${
                isActive
                  ? "bg-[#8B3A4A] text-white shadow-xs"
                  : "bg-white text-[#737373] hover:text-[#1C1C1C] border border-[#E5E1DC]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Sales Report */}
      {activeTab === "sales" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <span className="text-[10px] uppercase font-semibold text-[#737373]">Gross Revenue</span>
                <h3 className="text-2xl font-bold text-[#1C1C1C] mt-1">{formatCurrency(scaledRevenue)}</h3>
                <p className="text-[11px] text-[#4F7A61] mt-0.5">+18.7% vs previous period</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <span className="text-[10px] uppercase font-semibold text-[#737373]">Total Orders</span>
                <h3 className="text-2xl font-bold text-[#1C1C1C] mt-1">{scaledOrders} orders</h3>
                <p className="text-[11px] text-[#4F7A61] mt-0.5">Average checkout completed</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <span className="text-[10px] uppercase font-semibold text-[#737373]">Average Order Value</span>
                <h3 className="text-2xl font-bold text-[#1C1C1C] mt-1">{formatCurrency(avgOrderValue)}</h3>
                <p className="text-[11px] text-[#B78628] mt-0.5">Premium multi-piece carts</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Sales Trends Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#242424]">
                  <thead className="bg-[#FAF8F5] border-b border-[#E5E1DC] text-[#737373] uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-6">Segment</th>
                      <th className="py-3 px-6">Transactions</th>
                      <th className="py-3 px-6">Gross Sales</th>
                      <th className="py-3 px-6">Platform Commission (12.5%)</th>
                      <th className="py-3 px-6 text-right">Net Payout</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E1DC]">
                    <tr className="hover:bg-[#FAF8F5]/60">
                      <td className="py-3.5 px-6 font-semibold text-[#1C1C1C]">Credit Card & Digital Pay</td>
                      <td className="py-3.5 px-6 font-mono">{Math.round(scaledOrders * 0.72)}</td>
                      <td className="py-3.5 px-6 font-semibold text-[#1C1C1C]">{formatCurrency(scaledRevenue * 0.75)}</td>
                      <td className="py-3.5 px-6 text-[#4F7A61] font-mono">{formatCurrency(scaledRevenue * 0.75 * 0.125)}</td>
                      <td className="py-3.5 px-6 text-right font-mono">{formatCurrency(scaledRevenue * 0.75 * 0.875)}</td>
                    </tr>
                    <tr className="hover:bg-[#FAF8F5]/60">
                      <td className="py-3.5 px-6 font-semibold text-[#1C1C1C]">Cash on Delivery (COD)</td>
                      <td className="py-3.5 px-6 font-mono">{Math.round(scaledOrders * 0.28)}</td>
                      <td className="py-3.5 px-6 font-semibold text-[#1C1C1C]">{formatCurrency(scaledRevenue * 0.25)}</td>
                      <td className="py-3.5 px-6 text-[#4F7A61] font-mono">{formatCurrency(scaledRevenue * 0.25 * 0.125)}</td>
                      <td className="py-3.5 px-6 text-right font-mono">{formatCurrency(scaledRevenue * 0.25 * 0.875)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 2: Products Report */}
      {activeTab === "products" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Best Sellers */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Best-Selling Garments</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] border-b border-[#E5E1DC] text-[#737373] text-[10px] uppercase">
                    <tr>
                      <th className="py-2.5 px-4">Product Piece</th>
                      <th className="py-2.5 px-4">Units Sold</th>
                      <th className="py-2.5 px-4 text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E1DC]">
                    {bestSellers.map((item) => (
                      <tr key={item.title}>
                        <td className="py-3 px-4 font-semibold text-[#1C1C1C]">{item.title}</td>
                        <td className="py-3 px-4 font-mono">{item.units} pcs</td>
                        <td className="py-3 px-4 text-right font-semibold text-[#1C1C1C]">{formatCurrency(item.gmv)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {/* Most Viewed */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Most Viewed Pieces</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] border-b border-[#E5E1DC] text-[#737373] text-[10px] uppercase">
                    <tr>
                      <th className="py-2.5 px-4">Piece</th>
                      <th className="py-2.5 px-4">Page Views</th>
                      <th className="py-2.5 px-4 text-right">Conversion</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E1DC]">
                    {mostViewedProducts.map((item) => (
                      <tr key={item.title}>
                        <td className="py-3 px-4 font-semibold text-[#1C1C1C]">{item.title}</td>
                        <td className="py-3 px-4 font-mono">{item.views.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right text-[#4F7A61] font-semibold">{item.conversion}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>

          {/* Low Stock Alerts */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Low Stock & Inventory Velocity</CardTitle>
                <p className="text-xs text-[#737373]">Pieces with 10 units or less requiring replenishment.</p>
              </div>
              <Badge variant="warning" size="sm">{lowStockProducts.length} Alert Items</Badge>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] border-b border-[#E5E1DC] text-[#737373] text-[10px] uppercase">
                  <tr>
                    <th className="py-3 px-6">Product Title</th>
                    <th className="py-3 px-6">SKU</th>
                    <th className="py-3 px-6">Supplier</th>
                    <th className="py-3 px-6">Units Left</th>
                    <th className="py-3 px-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E1DC]">
                  {lowStockProducts.map((p) => (
                    <tr key={p.id}>
                      <td className="py-3.5 px-6 font-semibold text-[#1C1C1C]">{p.title}</td>
                      <td className="py-3.5 px-6 font-mono text-[#737373]">{p.sku}</td>
                      <td className="py-3.5 px-6 text-[#242424]">{p.supplierName}</td>
                      <td className="py-3.5 px-6 font-mono font-bold text-[#B84A4A]">{p.stock}</td>
                      <td className="py-3.5 px-6 text-right">
                        <Badge variant={p.stock === 0 ? "error" : "warning"} size="sm">
                          {p.stock === 0 ? "Depleted" : "Critical"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 3: Suppliers Report */}
      {activeTab === "suppliers" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Supplier Performance & SLA Engagement</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] border-b border-[#E5E1DC] text-[#737373] text-[10px] uppercase">
                <tr>
                  <th className="py-3 px-6">Atelier Brand</th>
                  <th className="py-3 px-6">Gross Sales</th>
                  <th className="py-3 px-6">Orders Handled</th>
                  <th className="py-3 px-6">On-Time SLA</th>
                  <th className="py-3 px-6 text-right">Engagement Index</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E1DC]">
                {supplierReports.map((s) => (
                  <tr key={s.name}>
                    <td className="py-3.5 px-6 font-semibold text-[#1C1C1C]">{s.name}</td>
                    <td className="py-3.5 px-6 font-semibold text-[#8B3A4A]">{formatCurrency(s.sales)}</td>
                    <td className="py-3.5 px-6 font-mono">{s.orders}</td>
                    <td className="py-3.5 px-6 text-[#4F7A61] font-semibold">{s.sla}</td>
                    <td className="py-3.5 px-6 text-right font-mono font-medium text-[#1C1C1C]">{s.engagementScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Tab 4: Customers Report */}
      {activeTab === "customers" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <span className="text-[10px] uppercase font-semibold text-[#737373]">Total Customer Accounts</span>
                <h3 className="text-2xl font-bold text-[#1C1C1C] mt-1">{customerMetrics.totalCustomers}</h3>
                <p className="text-[11px] text-[#4F7A61] mt-0.5">Verified platform shoppers</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <span className="text-[10px] uppercase font-semibold text-[#737373]">New Customers Acquired</span>
                <h3 className="text-2xl font-bold text-[#1C1C1C] mt-1">+{customerMetrics.newCustomers}</h3>
                <p className="text-[11px] text-[#4F7A61] mt-0.5">In selected period [{dateFilter}]</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <span className="text-[10px] uppercase font-semibold text-[#737373]">Repeat Purchase Rate</span>
                <h3 className="text-2xl font-bold text-[#1C1C1C] mt-1">{customerMetrics.repeatRate}</h3>
                <p className="text-[11px] text-[#B78628] mt-0.5">High client loyalty</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Top Customer Cohort by Lifetime Spend</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] border-b border-[#E5E1DC] text-[#737373] text-[10px] uppercase">
                  <tr>
                    <th className="py-3 px-6">Customer Name</th>
                    <th className="py-3 px-6">Orders Placed</th>
                    <th className="py-3 px-6 text-right">Lifetime Spend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E1DC]">
                  {customerMetrics.topCustomers.map((c) => (
                    <tr key={c.name}>
                      <td className="py-3.5 px-6 font-semibold text-[#1C1C1C]">{c.name}</td>
                      <td className="py-3.5 px-6 font-mono">{c.orders} orders</td>
                      <td className="py-3.5 px-6 text-right font-semibold text-[#1C1C1C]">{formatCurrency(c.spend)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
