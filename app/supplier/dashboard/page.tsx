"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Banknote,
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
  ChevronRight,
  Store,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useProducts } from "@/context/ProductContext";
import { useOrders } from "@/context/OrderContext";
import { useAuth } from "@/context/AuthContext";
import { formatCurrency } from "@/lib/utils";

export default function SupplierDashboardPage() {
  const { user } = useAuth();
  const { products } = useProducts();
  const { orders } = useOrders();
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
  const [selectedPointIndex, setSelectedPointIndex] = useState<number>(3);

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
  const chartPoints = useMemo(() => {
    if (timeRange === "7d") {
      return [
        { label: "Mon", revenue: 14200, orders: 4 },
        { label: "Tue", revenue: 21800, orders: 7 },
        { label: "Wed", revenue: 18900, orders: 5 },
        { label: "Thu", revenue: 27500, orders: 9 },
        { label: "Fri", revenue: 31200, orders: 11 },
        { label: "Sat", revenue: 24100, orders: 8 },
        { label: "Sun", revenue: 19500, orders: 6 },
      ];
    }
    if (timeRange === "30d") {
      return [
        { label: "Week 1", revenue: 28450, orders: 28 },
        { label: "Week 2", revenue: 38200, orders: 36 },
        { label: "Week 3", revenue: 31800, orders: 31 },
        { label: "Week 4", revenue: 44450, orders: 44 },
      ];
    }
    return [
      { label: "Aug", revenue: 112400, orders: 112 },
      { label: "Sep", revenue: 138900, orders: 134 },
      { label: "Oct", revenue: 156200, orders: 158 },
    ];
  }, [timeRange]);

  // Dynamic Spline Curve Calculation matching Admin Dashboard
  const splineChartData = useMemo(() => {
    const maxVal = Math.max(...chartPoints.map((d) => d.revenue));
    const scaleMax = maxVal * 1.25 || 100000;
    const baseY = 135;
    const topY = 24;
    const rangeY = baseY - topY;
    const startX = 45;
    const totalW = 430;
    const stepX = totalW / (chartPoints.length - 1 || 1);

    const points = chartPoints.map((item, idx) => {
      const x = startX + idx * stepX;
      const y = baseY - (item.revenue / scaleMax) * rangeY;
      return { x, y, ...item };
    });

    let path = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? i : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }

    const areaPath = `${path} L ${points[points.length - 1].x.toFixed(1)} ${baseY} L ${points[0].x.toFixed(1)} ${baseY} Z`;

    return { points, path, areaPath, baseY, scaleMax };
  }, [chartPoints]);

  const activePoint =
    splineChartData.points[selectedPointIndex] ||
    splineChartData.points[splineChartData.points.length - 1];

  const workshopName = user?.storeName || "Atelier V Studios";

  return (
    <div className="space-y-5">
      {/* Header matching Admin Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E5E1DC]/60">
        <div className="flex items-center gap-2">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#1C1C1C]">
            {workshopName} Workspace
          </h2>
          <Badge variant="outline" size="sm" className="border-[#8B3A4A]/30 text-[#8B3A4A] bg-[#8B3A4A]/5 text-[9px] px-1.5 py-0 font-medium">
            Verified Artisan
          </Badge>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Badge variant="success" size="sm" className="gap-1 py-0.5 px-2.5 text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4F7A61] animate-pulse" />
            Operational
          </Badge>

          <Link href="/supplier/products/add">
            <Button
              variant="default"
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              className="bg-[#8B3A4A] hover:bg-[#722F3D] text-white text-xs h-8 px-3 shadow-xs cursor-pointer"
            >
              Add Product
            </Button>
          </Link>

          <Link href="/supplier/orders">
            <Button
              variant="outline"
              size="sm"
              className="border-[#E5E1DC] text-[#242424] hover:border-[#8B3A4A]/40 hover:bg-[#FAF8F5] text-xs h-8 px-3 cursor-pointer"
            >
              Manage Orders
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Compact, Modern KPI Cards matching Admin Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* 1. Total Sales Revenue (COD) */}
        <Card className="group relative overflow-hidden bg-white border border-[#E5E1DC] hover:border-[#8B3A4A]/50 rounded-xl hover:shadow-[0_4px_16px_rgba(139,58,74,0.08)] hover:-translate-y-0.5 transition-all duration-200">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#8B3A4A] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <CardContent className="p-3.5 sm:p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#737373]">
                Total COD Sales
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#8B3A4A]/10 border border-[#8B3A4A]/20 flex items-center justify-center text-[#8B3A4A] shadow-xs group-hover:bg-[#8B3A4A] group-hover:text-white group-hover:border-[#8B3A4A] transition-all duration-200 shrink-0">
                <Banknote className="w-4 h-4 transition-transform duration-200 group-hover:scale-105" />
              </div>
            </div>

            <div className="mt-1.5">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#1C1C1C]">
                {formatCurrency(stats.totalSales)}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#4F7A61] bg-[#4F7A61]/10 px-1.5 py-0.5 rounded">
                  <TrendingUp className="w-2.5 h-2.5" />
                  +18.4%
                </span>
                <span className="text-[10px] text-[#737373]">this period (PKR)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. Total Orders */}
        <Card className="group relative overflow-hidden bg-white border border-[#E5E1DC] hover:border-[#8B3A4A]/50 rounded-xl hover:shadow-[0_4px_16px_rgba(139,58,74,0.08)] hover:-translate-y-0.5 transition-all duration-200">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#8B3A4A] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <CardContent className="p-3.5 sm:p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#737373]">
                Fulfillment Orders
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#8B3A4A]/10 border border-[#8B3A4A]/20 flex items-center justify-center text-[#8B3A4A] shadow-xs group-hover:bg-[#8B3A4A] group-hover:text-white group-hover:border-[#8B3A4A] transition-all duration-200 shrink-0">
                <ShoppingBag className="w-4 h-4 transition-transform duration-200 group-hover:scale-105" />
              </div>
            </div>

            <div className="mt-1.5">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#1C1C1C]">
                {stats.totalOrders} Orders
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <span className={`inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                  orderBreakdown.pending > 0
                    ? "text-[#B78628] bg-[#B78628]/10"
                    : "text-[#4F7A61] bg-[#4F7A61]/10"
                }`}>
                  <Clock className="w-2.5 h-2.5" />
                  {orderBreakdown.pending} to dispatch
                </span>
                <span className="text-[10px] text-[#737373]">courier transit</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. Catalog Products & Units Sold */}
        <Card className="group relative overflow-hidden bg-white border border-[#E5E1DC] hover:border-[#8B3A4A]/50 rounded-xl hover:shadow-[0_4px_16px_rgba(139,58,74,0.08)] hover:-translate-y-0.5 transition-all duration-200">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#8B3A4A] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <CardContent className="p-3.5 sm:p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#737373]">
                Artisan Catalog
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#8B3A4A]/10 border border-[#8B3A4A]/20 flex items-center justify-center text-[#8B3A4A] shadow-xs group-hover:bg-[#8B3A4A] group-hover:text-white group-hover:border-[#8B3A4A] transition-all duration-200 shrink-0">
                <Package className="w-4 h-4 transition-transform duration-200 group-hover:scale-105" />
              </div>
            </div>

            <div className="mt-1.5">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#1C1C1C]">
                {stats.totalProducts} Pieces
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[10px] font-semibold text-[#4F7A61] bg-[#4F7A61]/10 px-1.5 py-0.5 rounded">
                  {stats.productsSold.toLocaleString()} sold
                </span>
                <span className="text-[10px] text-[#737373]">active designs</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 4. Patron Quality & Views */}
        <Card className="group relative overflow-hidden bg-white border border-[#E5E1DC] hover:border-[#8B3A4A]/50 rounded-xl hover:shadow-[0_4px_16px_rgba(139,58,74,0.08)] hover:-translate-y-0.5 transition-all duration-200">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#8B3A4A] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <CardContent className="p-3.5 sm:p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#737373]">
                Patron Rating & Views
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#8B3A4A]/10 border border-[#8B3A4A]/20 flex items-center justify-center text-[#8B3A4A] shadow-xs group-hover:bg-[#8B3A4A] group-hover:text-white group-hover:border-[#8B3A4A] transition-all duration-200 shrink-0">
                <Star className="w-4 h-4 fill-current transition-transform duration-200 group-hover:scale-105" />
              </div>
            </div>

            <div className="mt-1.5">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#1C1C1C] flex items-baseline gap-1">
                {stats.avgRating} <span className="text-xs font-normal text-[#737373]">/ 5.0</span>
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[10px] font-medium text-[#737373] bg-[#FAF8F5] border border-[#E5E1DC] px-1.5 py-0.5 rounded">
                  {stats.productViews.toLocaleString()} views
                </span>
                <span className="text-[10px] text-[#4F7A61] font-semibold">+12.6% traffic</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Primary Section: Sales Trajectory & Order Lifecycle Breakdown (12 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Sales Trajectory (7 cols) - Spline Graph */}
        <Card className="lg:col-span-7 rounded-xl border border-[#E5E1DC] h-full flex flex-col justify-between">
          <CardHeader className="py-3.5 px-4 sm:px-5 flex flex-row items-center justify-between shrink-0 border-b border-[#E5E1DC]/60">
            <CardTitle className="text-sm sm:text-base font-semibold text-[#1C1C1C]">
              Workshop Sales Trajectory
            </CardTitle>

            {/* Timeframe Toggle Buttons */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-[#FAF8F5] border border-[#E5E1DC] rounded-lg p-0.5 text-xs">
                {(["7d", "30d", "90d"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setTimeRange(r);
                      setSelectedPointIndex(r === "7d" ? 6 : r === "30d" ? 3 : 2);
                    }}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                      timeRange === r
                        ? "bg-[#8B3A4A] text-white shadow-xs font-semibold"
                        : "text-[#737373] hover:text-[#1C1C1C]"
                    }`}
                  >
                    {r === "7d" ? "7D" : r === "30d" ? "30D" : "90D"}
                  </button>
                ))}
              </div>

              <Badge variant="outline" size="sm" className="font-mono text-[10px] text-[#8B3A4A] border-[#8B3A4A]/30 bg-[#8B3A4A]/5 px-2 py-0.5 hidden sm:inline-block">
                {activePoint.label}: {formatCurrency(activePoint.revenue)}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="px-4 sm:px-5 pb-5 pt-2 flex-1 flex flex-col justify-center">
            {/* Responsive Spline Graph Container */}
            <div className="relative pt-1 pb-1">
              <svg
                viewBox="0 0 500 160"
                className="w-full h-48 sm:h-52 overflow-visible select-none"
              >
                <defs>
                  {/* Soft Luxury Burgundy Gradient Fill */}
                  <linearGradient id="supplierSplineAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B3A4A" stopOpacity="0.28" />
                    <stop offset="70%" stopColor="#8B3A4A" stopOpacity="0.04" />
                    <stop offset="100%" stopColor="#8B3A4A" stopOpacity="0.00" />
                  </linearGradient>

                  <filter id="supplierPointGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#8B3A4A" floodOpacity="0.3" />
                  </filter>
                </defs>

                {/* Horizontal Guideline Grids & Currency Benchmarks */}
                <g className="text-[#A39E96]">
                  <line x1="45" y1="32" x2="480" y2="32" stroke="#E5E1DC" strokeDasharray="3 3" strokeOpacity="0.7" />
                  <text x="0" y="35" fontSize="8.5" fill="#737373" fontFamily="monospace">
                    {formatCurrency(splineChartData.scaleMax * 0.8)}
                  </text>

                  <line x1="45" y1="66" x2="480" y2="66" stroke="#E5E1DC" strokeDasharray="3 3" strokeOpacity="0.7" />
                  <text x="0" y="69" fontSize="8.5" fill="#737373" fontFamily="monospace">
                    {formatCurrency(splineChartData.scaleMax * 0.5)}
                  </text>

                  <line x1="45" y1="101" x2="480" y2="101" stroke="#E5E1DC" strokeDasharray="3 3" strokeOpacity="0.7" />
                  <text x="0" y="104" fontSize="8.5" fill="#737373" fontFamily="monospace">
                    {formatCurrency(splineChartData.scaleMax * 0.25)}
                  </text>

                  <line x1="35" y1="135" x2="480" y2="135" stroke="#E5E1DC" strokeOpacity="0.9" />
                </g>

                {/* Smooth Spline Area Gradient */}
                <path
                  d={splineChartData.areaPath}
                  fill="url(#supplierSplineAreaGradient)"
                  className="transition-all duration-300"
                />

                {/* Smooth Continuous Spline Curve */}
                <path
                  d={splineChartData.path}
                  fill="none"
                  stroke="#8B3A4A"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Vertical Cursor Indicator Line */}
                {activePoint && (
                  <line
                    x1={activePoint.x}
                    y1={24}
                    x2={activePoint.x}
                    y2={splineChartData.baseY}
                    stroke="#8B3A4A"
                    strokeOpacity="0.35"
                    strokeDasharray="3 3"
                    className="transition-all duration-200"
                  />
                )}

                {/* Data Points on the Spline */}
                {splineChartData.points.map((pt, idx) => {
                  const isSelected = selectedPointIndex === idx;
                  return (
                    <g key={pt.label} className="transition-all duration-200">
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isSelected ? 5 : 3.5}
                        fill={isSelected ? "#8B3A4A" : "#FFFFFF"}
                        stroke="#8B3A4A"
                        strokeWidth={isSelected ? 2.5 : 1.5}
                        filter={isSelected ? "url(#supplierPointGlow)" : undefined}
                        className="transition-all duration-200"
                      />
                      {isSelected && (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={10}
                          fill="#8B3A4A"
                          fillOpacity="0.15"
                          className="animate-pulse"
                        />
                      )}
                    </g>
                  );
                })}

                {/* Floating Interactive Tooltip above active point */}
                {activePoint && (
                  <g
                    transform={`translate(${activePoint.x}, ${Math.max(20, activePoint.y - 12)})`}
                    className="transition-all duration-200 pointer-events-none"
                  >
                    <rect
                      x="-44"
                      y="-20"
                      width="88"
                      height="18"
                      rx="5"
                      fill="#1C1C1C"
                      className="filter drop-shadow-sm"
                    />
                    <text
                      x="0"
                      y="-8"
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="9"
                      fontWeight="600"
                      fontFamily="sans-serif"
                    >
                      {formatCurrency(activePoint.revenue)}
                    </text>
                    <polygon points="-3,-2 3,-2 0,2" fill="#1C1C1C" />
                  </g>
                )}

                {/* X-Axis Labels */}
                {splineChartData.points.map((pt, idx) => {
                  const isSelected = selectedPointIndex === idx;
                  return (
                    <text
                      key={`label-${pt.label}`}
                      x={pt.x}
                      y="152"
                      textAnchor="middle"
                      fontSize="10"
                      fill={isSelected ? "#8B3A4A" : "#737373"}
                      fontWeight={isSelected ? "700" : "500"}
                      className="transition-colors duration-200 select-none"
                    >
                      {pt.label}
                    </text>
                  );
                })}

                {/* Interactive Hover Hit Zones for touch & mouse */}
                {splineChartData.points.map((pt, idx) => (
                  <rect
                    key={`hit-${pt.label}`}
                    x={pt.x - 30}
                    y="15"
                    width="60"
                    height="140"
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setSelectedPointIndex(idx)}
                    onClick={() => setSelectedPointIndex(idx)}
                  />
                ))}
              </svg>
            </div>

            <div className="flex items-center justify-between text-xs text-[#737373] pt-3 px-1 border-t border-[#E5E1DC]/60 mt-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#8B3A4A]" />
                <span className="text-[11px]">Direct Atelier Cash Collection</span>
              </div>
              <div className="text-[11px] font-medium text-[#1C1C1C]">
                Active Selection: <span className="font-semibold text-[#8B3A4A]">{activePoint.orders} COD orders</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Status Breakdown (5 cols) */}
        <Card className="lg:col-span-5 rounded-xl border border-[#E5E1DC] h-full flex flex-col justify-between">
          <CardHeader className="py-3.5 px-4 sm:px-5 flex flex-row items-center justify-between shrink-0 border-b border-[#E5E1DC]/60">
            <CardTitle className="text-sm sm:text-base font-semibold text-[#1C1C1C]">
              Fulfillment Lifecycle
            </CardTitle>
            <Badge variant="outline" size="sm" className="text-[10px] text-[#4F7A61] border-[#4F7A61]/30 bg-[#4F7A61]/5 font-semibold">
              100% COD
            </Badge>
          </CardHeader>

          <CardContent className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
            <div className="space-y-2.5">
              {/* 1. Pending */}
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E1DC] flex items-center justify-between hover:border-[#B78628]/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#B78628]/10 text-[#B78628] flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#1C1C1C]">Pending Packaging</h4>
                    <p className="text-[10px] text-[#737373]">Awaiting courier dispatch</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-[#1C1C1C]">
                    {orderBreakdown.pending}
                  </span>
                  <Badge variant="warning" size="sm">Action</Badge>
                </div>
              </div>

              {/* 2. Shipped */}
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E1DC] flex items-center justify-between hover:border-[#8B3A4A]/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#8B3A4A]/10 text-[#8B3A4A] flex items-center justify-center shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#1C1C1C]">In Courier Transit</h4>
                    <p className="text-[10px] text-[#737373]">With courier logistics rider</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-[#1C1C1C]">
                    {orderBreakdown.shipped}
                  </span>
                  <Badge variant="accent" size="sm">Transit</Badge>
                </div>
              </div>

              {/* 3. Delivered */}
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E1DC] flex items-center justify-between hover:border-[#4F7A61]/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#4F7A61]/10 text-[#4F7A61] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#1C1C1C]">Delivered & Reconciled</h4>
                    <p className="text-[10px] text-[#737373]">Doorstep cash collected</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-[#1C1C1C]">
                    {orderBreakdown.delivered}
                  </span>
                  <Badge variant="success" size="sm">Paid</Badge>
                </div>
              </div>

              {/* 4. Cancelled */}
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E1DC] flex items-center justify-between hover:border-[#B84A4A]/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#E5E1DC] text-[#737373] flex items-center justify-center shrink-0">
                    <XCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#1C1C1C]">Returned / Voided</h4>
                    <p className="text-[10px] text-[#737373]">RTO or customer cancel</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-[#737373]">
                    {orderBreakdown.cancelled}
                  </span>
                  <Badge variant="secondary" size="sm">Void</Badge>
                </div>
              </div>
            </div>

            <Link href="/supplier/orders" className="block pt-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs h-9 justify-center cursor-pointer border-[#E5E1DC] hover:border-[#8B3A4A] hover:text-[#8B3A4A]"
              >
                <span>Review All Fulfillment Orders</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Garments Table */}
      <Card className="rounded-xl border border-[#E5E1DC]">
        <CardHeader className="py-3.5 px-4 sm:px-6 flex flex-row items-center justify-between border-b border-[#E5E1DC]">
          <CardTitle className="text-sm sm:text-base font-semibold text-[#1C1C1C]">
            Top Performing Artisan Pieces
          </CardTitle>
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
                  <th className="py-3 px-6">Garment Piece</th>
                  <th className="py-3 px-6">Category</th>
                  <th className="py-3 px-6 text-right">Units Sold</th>
                  <th className="py-3 px-6 text-right">Revenue (PKR)</th>
                  <th className="py-3 px-6 text-right">Views</th>
                  <th className="py-3 px-6 text-right">Stock Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E1DC]">
                {topProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-12 rounded-lg bg-[#F1ECE6] overflow-hidden shrink-0 border border-[#E5E1DC]">
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
                    <td className="py-3.5 px-6 text-right font-medium text-[#1C1C1C]">
                      {prod.unitsSold} pcs
                    </td>
                    <td className="py-3.5 px-6 text-right font-semibold text-[#8B3A4A]">
                      {formatCurrency(prod.revenue)}
                    </td>
                    <td className="py-3.5 px-6 text-right text-[#737373]">
                      {prod.views.toLocaleString()} views
                    </td>
                    <td className="py-3.5 px-6 text-right">
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
    </div>
  );
}
