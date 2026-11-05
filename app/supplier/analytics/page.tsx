"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Banknote,
  TrendingUp,
  ShoppingBag,
  Eye,
  ArrowUpRight,
  Calendar,
  ChevronDown,
  Check,
  MapPin,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Dropdown } from "@/components/ui/Dropdown";
import { useProducts } from "@/context/ProductContext";
import { useOrders } from "@/context/OrderContext";
import { formatCurrency } from "@/lib/utils";

type Timeframe = "7d" | "30d" | "90d";

export default function SupplierAnalyticsPage() {
  const { products } = useProducts();
  const { orders } = useOrders();

  const [timeframe, setTimeframe] = useState<Timeframe>("30d");
  const [selectedPointIndex, setSelectedPointIndex] = useState<number>(3);

  const timeframeOptions: { id: Timeframe; label: string }[] = [
    { id: "7d", label: "Last 7 Days" },
    { id: "30d", label: "Last 30 Days" },
    { id: "90d", label: "Last 90 Days" },
  ];

  const currentTimeframeLabel =
    timeframeOptions.find((t) => t.id === timeframe)?.label || "Last 30 Days";

  // Supplier products
  const supplierProducts = useMemo(() => {
    return products.filter(
      (p) => p.supplierId === "sup-1" || !p.supplierId || p.supplierId === "all"
    );
  }, [products]);

  // Scale factor per timeframe
  const scaleFactor = timeframe === "7d" ? 0.28 : timeframe === "30d" ? 1 : 2.85;

  // Core KPI metrics in PKR (100% Cash on Delivery)
  const metrics = useMemo(() => {
    const liveOrdersRev = orders
      .filter((o) => (o.status || "").toLowerCase() !== "cancelled")
      .reduce((sum, o) => sum + (o.total || o.totalAmount || 0), 0);

    const baseMonthlyRev = 142900 + liveOrdersRev;
    const revenue = Math.round(baseMonthlyRev * scaleFactor);
    const completedOrders = Math.max(
      1,
      Math.round((139 + orders.length) * scaleFactor)
    );
    const avgOrderValue = Math.round(revenue / completedOrders);
    const views = Math.round(
      (9560 + supplierProducts.length * 120) * scaleFactor
    );

    return {
      revenue,
      completedOrders,
      avgOrderValue,
      views,
    };
  }, [orders, supplierProducts.length, scaleFactor]);

  // Chart points per timeframe
  const chartPoints = useMemo(() => {
    if (timeframe === "7d") {
      return [
        { label: "Mon", revenue: 14200, orders: 5 },
        { label: "Tue", revenue: 21800, orders: 8 },
        { label: "Wed", revenue: 18900, orders: 6 },
        { label: "Thu", revenue: 27500, orders: 10 },
        { label: "Fri", revenue: 31200, orders: 12 },
        { label: "Sat", revenue: 24100, orders: 9 },
        { label: "Sun", revenue: 19500, orders: 7 },
      ];
    }
    if (timeframe === "30d") {
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
  }, [timeframe]);

  // Smooth Catmull-Rom SVG Spline calculation
  const splineChartData = useMemo(() => {
    const maxVal = Math.max(...chartPoints.map((d) => d.revenue));
    const scaleMax = Math.ceil((maxVal * 1.25) / 1000) * 1000 || 100000;
    const baseY = 135;
    const topY = 24;
    const rangeY = baseY - topY;
    const startX = 52;
    const totalW = 420;
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

  // Category revenue share scaled to timeframe
  const categoryDistribution = useMemo(() => {
    const shares = [
      { name: "Clothing & Tailoring", percentage: 38, color: "bg-[#8B3A4A]" },
      { name: "Seasonal Outerwear", percentage: 27, color: "bg-[#1C1C1C]" },
      { name: "Accessories & Bags", percentage: 21, color: "bg-[#4F7A61]" },
      { name: "Artisan Footwear", percentage: 14, color: "bg-[#B78628]" },
    ];
    return shares.map((cat) => ({
      ...cat,
      amount: Math.round((metrics.revenue * cat.percentage) / 100),
    }));
  }, [metrics.revenue]);

  // Top 5 best-selling products
  const bestSellers = useMemo(() => {
    return [...supplierProducts]
      .sort(
        (a, b) =>
          b.price * (b.reviewCount || 10) - a.price * (a.reviewCount || 10)
      )
      .slice(0, 5)
      .map((p, idx) => {
        const baseUnits = Math.max(4, Math.round((38 - idx * 6) * scaleFactor));
        return {
          ...p,
          unitsSold: baseUnits,
          totalRevenue: baseUnits * p.price,
        };
      });
  }, [supplierProducts, scaleFactor]);

  return (
    <div className="space-y-5">
      {/* Clean Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E5E1DC]/60 relative z-30">
        <div className="flex items-center gap-2.5">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#1C1C1C]">
            Performance Analytics
          </h2>
          <Badge
            variant="outline"
            size="sm"
            className="border-[#8B3A4A]/30 text-[#8B3A4A] bg-[#8B3A4A]/5 text-[10px] px-2 py-0.5 font-medium"
          >
            100% COD
          </Badge>
        </div>

        {/* Clean Timeframe Dropdown */}
        <Dropdown
          align="right"
          className="w-48 p-1.5 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.08)] border-[#E5E1DC] rounded-xl"
          trigger={
            <button
              type="button"
              className="h-9 px-3.5 rounded-lg border border-[#E5E1DC] bg-white hover:border-[#8B3A4A]/40 hover:bg-[#FAF8F5] text-xs font-medium text-[#1C1C1C] flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
            >
              <Calendar className="w-3.5 h-3.5 text-[#8B3A4A]" />
              <span>{currentTimeframeLabel}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#737373] ml-0.5" />
            </button>
          }
        >
          <div className="px-3 py-1.5 border-b border-[#E5E1DC]/60 mb-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#737373]">
              Select Period
            </p>
          </div>
          {timeframeOptions.map((opt) => {
            const isSelected = timeframe === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setTimeframe(opt.id);
                  setSelectedPointIndex(
                    opt.id === "7d" ? 6 : opt.id === "30d" ? 3 : 2
                  );
                }}
                className={`w-full px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-[#8B3A4A]/10 text-[#8B3A4A] font-semibold"
                    : "text-[#242424] hover:bg-[#FAF8F5] hover:text-[#1C1C1C]"
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#8B3A4A]" />}
              </button>
            );
          })}
        </Dropdown>
      </div>

      {/* 4 Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* 1. COD Revenue */}
        <Card className="group relative overflow-hidden bg-white border border-[#E5E1DC] hover:border-[#8B3A4A]/50 rounded-xl hover:shadow-[0_4px_16px_rgba(139,58,74,0.08)] hover:-translate-y-0.5 transition-all duration-200">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#8B3A4A] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <CardContent className="p-3.5 sm:p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#737373]">
                COD Revenue
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#8B3A4A]/10 border border-[#8B3A4A]/20 flex items-center justify-center text-[#8B3A4A] shadow-xs group-hover:bg-[#8B3A4A] group-hover:text-white group-hover:border-[#8B3A4A] transition-all duration-200 shrink-0">
                <Banknote className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-1.5">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#1C1C1C]">
                {formatCurrency(metrics.revenue)}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#4F7A61] bg-[#4F7A61]/10 px-1.5 py-0.5 rounded">
                  <TrendingUp className="w-2.5 h-2.5" />
                  +18.4%
                </span>
                <span className="text-[10px] text-[#737373]">vs previous period</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. Completed Orders */}
        <Card className="group relative overflow-hidden bg-white border border-[#E5E1DC] hover:border-[#8B3A4A]/50 rounded-xl hover:shadow-[0_4px_16px_rgba(139,58,74,0.08)] hover:-translate-y-0.5 transition-all duration-200">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#8B3A4A] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <CardContent className="p-3.5 sm:p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#737373]">
                Orders Fulfilled
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#8B3A4A]/10 border border-[#8B3A4A]/20 flex items-center justify-center text-[#8B3A4A] shadow-xs group-hover:bg-[#8B3A4A] group-hover:text-white group-hover:border-[#8B3A4A] transition-all duration-200 shrink-0">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-1.5">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#1C1C1C]">
                {metrics.completedOrders}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[10px] font-semibold text-[#4F7A61] bg-[#4F7A61]/10 px-1.5 py-0.5 rounded">
                  97.4% Delivered
                </span>
                <span className="text-[10px] text-[#737373]">courier SLA</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. Avg Order Value */}
        <Card className="group relative overflow-hidden bg-white border border-[#E5E1DC] hover:border-[#8B3A4A]/50 rounded-xl hover:shadow-[0_4px_16px_rgba(139,58,74,0.08)] hover:-translate-y-0.5 transition-all duration-200">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#8B3A4A] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <CardContent className="p-3.5 sm:p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#737373]">
                Avg. Order Value
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#8B3A4A]/10 border border-[#8B3A4A]/20 flex items-center justify-center text-[#8B3A4A] shadow-xs group-hover:bg-[#8B3A4A] group-hover:text-white group-hover:border-[#8B3A4A] transition-all duration-200 shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-1.5">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#1C1C1C]">
                {formatCurrency(metrics.avgOrderValue)}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[10px] font-medium text-[#737373] bg-[#FAF8F5] border border-[#E5E1DC] px-1.5 py-0.5 rounded">
                  Doorstep COD
                </span>
                <span className="text-[10px] text-[#737373]">per parcel</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 4. Storefront Views */}
        <Card className="group relative overflow-hidden bg-white border border-[#E5E1DC] hover:border-[#8B3A4A]/50 rounded-xl hover:shadow-[0_4px_16px_rgba(139,58,74,0.08)] hover:-translate-y-0.5 transition-all duration-200">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#8B3A4A] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <CardContent className="p-3.5 sm:p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#737373]">
                Product Views
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#8B3A4A]/10 border border-[#8B3A4A]/20 flex items-center justify-center text-[#8B3A4A] shadow-xs group-hover:bg-[#8B3A4A] group-hover:text-white group-hover:border-[#8B3A4A] transition-all duration-200 shrink-0">
                <Eye className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-1.5">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#1C1C1C]">
                {metrics.views.toLocaleString()}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[10px] font-semibold text-[#8B3A4A] bg-[#8B3A4A]/10 px-1.5 py-0.5 rounded">
                  4.2% Conv.
                </span>
                <span className="text-[10px] text-[#737373]">checkout rate</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Grid: Revenue Curve (7 Cols) & Category Breakdown (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Revenue Trajectory Spline Card */}
        <Card className="lg:col-span-7 rounded-xl border border-[#E5E1DC] h-full flex flex-col justify-between">
          <CardHeader className="py-3.5 px-4 sm:px-5 flex flex-row items-center justify-between shrink-0 border-b border-[#E5E1DC]/60">
            <CardTitle className="text-sm sm:text-base font-semibold text-[#1C1C1C]">
              Revenue Trajectory
            </CardTitle>
            <Badge
              variant="outline"
              size="sm"
              className="font-mono text-[10px] text-[#8B3A4A] border-[#8B3A4A]/30 bg-[#8B3A4A]/5 px-2 py-0.5"
            >
              {activePoint.label}: {formatCurrency(activePoint.revenue)}
            </Badge>
          </CardHeader>

          <CardContent className="px-4 sm:px-5 pb-5 pt-2 flex-1 flex flex-col justify-center">
            <div className="relative pt-1 pb-1">
              <svg
                viewBox="0 0 500 160"
                className="w-full h-48 sm:h-52 overflow-visible select-none"
              >
                <defs>
                  <linearGradient
                    id="analyticsSplineGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#8B3A4A" stopOpacity="0.26" />
                    <stop offset="75%" stopColor="#8B3A4A" stopOpacity="0.04" />
                    <stop offset="100%" stopColor="#8B3A4A" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid Guidelines */}
                <g>
                  <line
                    x1="52"
                    y1="32"
                    x2="480"
                    y2="32"
                    stroke="#E5E1DC"
                    strokeDasharray="3 3"
                    strokeOpacity="0.7"
                  />
                  <text
                    x="0"
                    y="35"
                    fontSize="8.5"
                    fill="#737373"
                    fontFamily="monospace"
                  >
                    {formatCurrency(Math.round(splineChartData.scaleMax * 0.8))}
                  </text>

                  <line
                    x1="52"
                    y1="66"
                    x2="480"
                    y2="66"
                    stroke="#E5E1DC"
                    strokeDasharray="3 3"
                    strokeOpacity="0.7"
                  />
                  <text
                    x="0"
                    y="69"
                    fontSize="8.5"
                    fill="#737373"
                    fontFamily="monospace"
                  >
                    {formatCurrency(Math.round(splineChartData.scaleMax * 0.5))}
                  </text>

                  <line
                    x1="52"
                    y1="101"
                    x2="480"
                    y2="101"
                    stroke="#E5E1DC"
                    strokeDasharray="3 3"
                    strokeOpacity="0.7"
                  />
                  <text
                    x="0"
                    y="104"
                    fontSize="8.5"
                    fill="#737373"
                    fontFamily="monospace"
                  >
                    {formatCurrency(Math.round(splineChartData.scaleMax * 0.25))}
                  </text>

                  <line
                    x1="45"
                    y1="135"
                    x2="480"
                    y2="135"
                    stroke="#E5E1DC"
                    strokeOpacity="0.9"
                  />
                </g>

                {/* Area Gradient */}
                <path
                  d={splineChartData.areaPath}
                  fill="url(#analyticsSplineGradient)"
                  className="transition-all duration-300"
                />

                {/* Smooth Spline Line */}
                <path
                  d={splineChartData.path}
                  fill="none"
                  stroke="#8B3A4A"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Active Vertical Cursor */}
                {activePoint && (
                  <line
                    x1={activePoint.x}
                    y1={24}
                    x2={activePoint.x}
                    y2={splineChartData.baseY}
                    stroke="#8B3A4A"
                    strokeOpacity="0.35"
                    strokeDasharray="3 3"
                  />
                )}

                {/* Nodes */}
                {splineChartData.points.map((pt, idx) => {
                  const isSelected = selectedPointIndex === idx;
                  return (
                    <g key={pt.label}>
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isSelected ? 5 : 3.5}
                        fill={isSelected ? "#8B3A4A" : "#FFFFFF"}
                        stroke="#8B3A4A"
                        strokeWidth={isSelected ? 2.5 : 2}
                        className="transition-all duration-200"
                      />
                      {isSelected && (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={10}
                          fill="#8B3A4A"
                          fillOpacity="0.14"
                        />
                      )}
                    </g>
                  );
                })}

                {/* Floating Tooltip */}
                {activePoint && (
                  <g
                    transform={`translate(${activePoint.x}, ${Math.max(22, activePoint.y - 12)})`}
                    className="pointer-events-none"
                  >
                    <rect
                      x="-42"
                      y="-20"
                      width="84"
                      height="18"
                      rx="5"
                      fill="#1C1C1C"
                    />
                    <text
                      x="0"
                      y="-8"
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="9"
                      fontWeight="600"
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
                      key={`lbl-${pt.label}`}
                      x={pt.x}
                      y="152"
                      textAnchor="middle"
                      fontSize="10"
                      fill={isSelected ? "#8B3A4A" : "#737373"}
                      fontWeight={isSelected ? "700" : "500"}
                    >
                      {pt.label}
                    </text>
                  );
                })}

                {/* Interactive Hit Zones */}
                {splineChartData.points.map((pt, idx) => (
                  <rect
                    key={`hit-${pt.label}`}
                    x={pt.x - 28}
                    y="15"
                    width="56"
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
                <span className="text-[11px]">Cash on Delivery Remittance</span>
              </div>
              <div className="text-[11px] font-medium text-[#1C1C1C]">
                Selected:{" "}
                <span className="font-semibold text-[#8B3A4A]">
                  {activePoint.orders} COD orders
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category & Regional Breakdown Card */}
        <Card className="lg:col-span-5 rounded-xl border border-[#E5E1DC] h-full flex flex-col justify-between">
          <CardHeader className="py-3.5 px-4 sm:px-5 flex flex-row items-center justify-between shrink-0 border-b border-[#E5E1DC]/60">
            <CardTitle className="text-sm sm:text-base font-semibold text-[#1C1C1C]">
              Sales by Category
            </CardTitle>
            <Badge
              variant="outline"
              size="sm"
              className="text-[10px] text-[#737373] border-[#E5E1DC] bg-[#FAF8F5]"
            >
              PKR Share
            </Badge>
          </CardHeader>

          <CardContent className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-4">
            <div className="space-y-4">
              {categoryDistribution.map((cat) => (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#242424]">{cat.name}</span>
                    <span className="font-semibold text-[#1C1C1C]">
                      {formatCurrency(cat.amount)}{" "}
                      <span className="text-[#737373] font-normal">
                        ({cat.percentage}%)
                      </span>
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[#FAF8F5] rounded-full overflow-hidden border border-[#E5E1DC]/60">
                    <div
                      className={`h-full ${cat.color} rounded-full transition-all duration-300`}
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Compact Pakistan City Demand Strip */}
            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E1DC] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-[#8B3A4A]/10 text-[#8B3A4A] flex items-center justify-center shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-[#1C1C1C]">
                    Top COD Destinations
                  </p>
                  <p className="text-[10px] text-[#737373] truncate">
                    Lahore (42%) • Karachi (31%) • Islamabad (19%)
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Selling Products Table (Streamlined, No Horizontal Scrollbar) */}
      <Card className="rounded-xl border border-[#E5E1DC]">
        <CardHeader className="py-3.5 px-4 sm:px-6 flex flex-row items-center justify-between border-b border-[#E5E1DC]">
          <CardTitle className="text-sm sm:text-base font-semibold text-[#1C1C1C]">
            Top Selling Garments
          </CardTitle>
          <Link
            href="/supplier/products"
            className="text-xs font-semibold text-[#8B3A4A] hover:underline flex items-center gap-1"
          >
            <span>View Catalog</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#242424]">
              <thead className="bg-[#FAF8F5] border-b border-[#E5E1DC] text-[#737373] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 sm:px-6">Garment</th>
                  <th className="py-3 px-4 sm:px-6">Category</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Unit Price</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Units Sold</th>
                  <th className="py-3 px-4 sm:px-6 text-right">COD Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E1DC]">
                {bestSellers.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[#FAF8F5]/60 transition-colors"
                  >
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[11px] font-bold text-[#8B3A4A] w-5 shrink-0">
                          #{index + 1}
                        </span>
                        <div className="relative w-9 h-11 rounded-md bg-[#F1ECE6] overflow-hidden shrink-0 border border-[#E5E1DC]">
                          <Image
                            src={item.images[0] || ""}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-[#1C1C1C] truncate max-w-[220px]">
                            {item.title}
                          </p>
                          <span className="font-mono text-[10px] text-[#737373]">
                            {item.sku}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-[#737373] whitespace-nowrap">
                      {item.category}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-right font-medium text-[#1C1C1C] whitespace-nowrap">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-right font-medium text-[#1C1C1C] whitespace-nowrap">
                      {item.unitsSold} pcs
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-right font-semibold text-[#8B3A4A] whitespace-nowrap">
                      {formatCurrency(item.totalRevenue)}
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
