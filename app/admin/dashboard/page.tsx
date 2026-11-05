"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  Package,
  AlertCircle,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useProducts } from "@/context/ProductContext";
import { useOrders } from "@/context/OrderContext";
import { useReviews } from "@/context/ReviewContext";
import { useCategories } from "@/context/CategoryContext";

export default function AdminDashboardPage() {
  const { users } = useAuth();
  const { products } = useProducts();
  const { orders } = useOrders();
  const { getPendingReviews } = useReviews();
  const { categories } = useCategories();

  // Core metrics
  const suppliersCount = users.filter((u) => u.role === "supplier").length;
  const productsCount = products.length;
  const ordersCount = orders.length;

  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, order) => sum + (order.totalAmount || order.total || 0), 0);
  }, [orders]);

  const pendingOrdersCount = useMemo(() => {
    return orders.filter(
      (o) => o.status?.toLowerCase() === "pending" || (o.orderStatus as string)?.toLowerCase() === "pending"
    ).length;
  }, [orders]);

  const pendingReviewsList = useMemo(() => {
    return getPendingReviews();
  }, [getPendingReviews]);

  const pendingReviewsCount = pendingReviewsList.length;
  const totalPendingActions = pendingOrdersCount + pendingReviewsCount;

  // Monthly sales overview data
  const monthlySales = [
    { month: "May", revenue: 42300, orders: 124 },
    { month: "Jun", revenue: 58900, orders: 168 },
    { month: "Jul", revenue: 71200, orders: 195 },
    { month: "Aug", revenue: 89400, orders: 242 },
    { month: "Sep", revenue: 114500, orders: 310 },
    { month: "Oct", revenue: 142890, orders: 386 },
  ];

  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(5);

  const splineChartData = useMemo(() => {
    const scaleMax = 160000;
    const baseY = 135;
    const topY = 24;
    const rangeY = baseY - topY;

    const points = monthlySales.map((item, idx) => {
      const x = 45 + idx * 84;
      const y = baseY - (item.revenue / scaleMax) * rangeY;
      return { x, y, ...item };
    });

    let path = `M ${points[0].x} ${points[0].y}`;
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

    const areaPath = `${path} L ${points[points.length - 1].x} ${baseY} L ${points[0].x} ${baseY} Z`;

    return { points, path, areaPath, baseY };
  }, [monthlySales]);

  const activePoint = splineChartData.points[selectedMonthIndex] || splineChartData.points[5];

  // Top 4 categories
  const topCategories = [
    { name: "Womenswear & Apparel", count: 142, share: 41 },
    { name: "Leather Goods & Bags", count: 98, share: 24 },
    { name: "Footwear & Shoes", count: 64, share: 18 },
    { name: "Jewelry & Accessories", count: 51, share: 17 },
  ];

  // Recent 5 orders
  const recentOrders = useMemo(() => {
    return orders.slice(0, 5);
  }, [orders]);

  const formatOrderTime = (isoString?: string) => {
    if (!isoString) return "Recent";
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return "Recent";
    }
  };

  const getOrderStatusBadge = (status: string) => {
    const s = status?.toLowerCase() || "pending";
    if (s === "delivered") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#4F7A61]/10 text-[#4F7A61]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4F7A61]" />
          Delivered
        </span>
      );
    }
    if (s === "shipped") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#8B3A4A]/10 text-[#8B3A4A]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8B3A4A]" />
          In Transit
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#B78628]/10 text-[#B78628]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#B78628]" />
        Pending
      </span>
    );
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E5E1DC]/60">
        <div className="flex items-center gap-2">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#1C1C1C]">
            Marketplace Overview
          </h2>
          <Badge variant="outline" size="sm" className="border-[#8B3A4A]/30 text-[#8B3A4A] bg-[#8B3A4A]/5 text-[9px] px-1.5 py-0">
            Live
          </Badge>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="success" size="sm" className="gap-1 py-0.5 px-2.5 text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4F7A61] animate-pulse" />
            Operational
          </Badge>
          <span className="text-[10px] font-mono text-[#737373] bg-white px-2.5 py-0.5 rounded-full border border-[#E5E1DC]">
            Oct 2026
          </span>
        </div>
      </div>

      {/* 4 Compact, Modern KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* 1. Gross Revenue */}
        <Card className="group relative overflow-hidden bg-white border border-[#E5E1DC] hover:border-[#8B3A4A]/50 rounded-xl hover:shadow-[0_4px_16px_rgba(139,58,74,0.08)] hover:-translate-y-0.5 transition-all duration-200">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#8B3A4A] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <CardContent className="p-3.5 sm:p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#737373]">
                Total Revenue
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#8B3A4A]/10 border border-[#8B3A4A]/20 flex items-center justify-center text-[#8B3A4A] shadow-xs group-hover:bg-[#8B3A4A] group-hover:text-white group-hover:border-[#8B3A4A] transition-all duration-200 shrink-0">
                <DollarSign className="w-4 h-4 transition-transform duration-200 group-hover:scale-105" />
              </div>
            </div>

            <div className="mt-1.5">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#1C1C1C]">
                {formatCurrency(totalRevenue || 142890)}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#4F7A61] bg-[#4F7A61]/10 px-1.5 py-0.5 rounded">
                  <TrendingUp className="w-2.5 h-2.5" />
                  +18.7%
                </span>
                <span className="text-[10px] text-[#737373]">vs last mo</span>
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
                Orders Fulfilled
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#8B3A4A]/10 border border-[#8B3A4A]/20 flex items-center justify-center text-[#8B3A4A] shadow-xs group-hover:bg-[#8B3A4A] group-hover:text-white group-hover:border-[#8B3A4A] transition-all duration-200 shrink-0">
                <ShoppingBag className="w-4 h-4 transition-transform duration-200 group-hover:scale-105" />
              </div>
            </div>

            <div className="mt-1.5">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#1C1C1C]">
                {ordersCount || 386}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#4F7A61] bg-[#4F7A61]/10 px-1.5 py-0.5 rounded">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  98.6%
                </span>
                <span className="text-[10px] text-[#737373]">on-time rate</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. Catalog Products */}
        <Card className="group relative overflow-hidden bg-white border border-[#E5E1DC] hover:border-[#8B3A4A]/50 rounded-xl hover:shadow-[0_4px_16px_rgba(139,58,74,0.08)] hover:-translate-y-0.5 transition-all duration-200">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#8B3A4A] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <CardContent className="p-3.5 sm:p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#737373]">
                Artisan Pieces
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#8B3A4A]/10 border border-[#8B3A4A]/20 flex items-center justify-center text-[#8B3A4A] shadow-xs group-hover:bg-[#8B3A4A] group-hover:text-white group-hover:border-[#8B3A4A] transition-all duration-200 shrink-0">
                <Package className="w-4 h-4 transition-transform duration-200 group-hover:scale-105" />
              </div>
            </div>

            <div className="mt-1.5">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#1C1C1C]">
                {productsCount}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[10px] font-medium text-[#737373] bg-[#FAF8F5] border border-[#E5E1DC] px-1.5 py-0.5 rounded">
                  {categories.length || 6} Collections
                </span>
                <span className="text-[10px] text-[#737373]">{suppliersCount} ateliers</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 4. Pending Actions */}
        <Card className="group relative overflow-hidden bg-white border border-[#E5E1DC] hover:border-[#8B3A4A]/50 rounded-xl hover:shadow-[0_4px_16px_rgba(139,58,74,0.08)] hover:-translate-y-0.5 transition-all duration-200">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#8B3A4A] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <CardContent className="p-3.5 sm:p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#737373]">
                Pending Actions
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#8B3A4A]/10 border border-[#8B3A4A]/20 flex items-center justify-center text-[#8B3A4A] shadow-xs group-hover:bg-[#8B3A4A] group-hover:text-white group-hover:border-[#8B3A4A] transition-all duration-200 shrink-0">
                <AlertCircle className="w-4 h-4 transition-transform duration-200 group-hover:scale-105" />
              </div>
            </div>

            <div className="mt-1.5">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#8B3A4A]">
                {totalPendingActions} Tasks
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[10px] text-[#737373] truncate">
                  {pendingReviewsCount} reviews · {pendingOrdersCount} to ship
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Primary Section: Sales Trajectory & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Sales Trajectory (7 cols) - Spline Graph */}
        <Card className="lg:col-span-7 rounded-xl border border-[#E5E1DC] h-full flex flex-col justify-between">
          <CardHeader className="py-3.5 px-4 sm:px-5 flex flex-row items-center justify-between shrink-0">
            <CardTitle className="text-sm sm:text-base font-semibold text-[#1C1C1C]">
              Revenue & Sales Growth
            </CardTitle>
            <Badge variant="outline" size="sm" className="font-mono text-[10px] text-[#8B3A4A] border-[#8B3A4A]/30 bg-[#8B3A4A]/5 px-2 py-0.5">
              {activePoint.month}: {formatCurrency(activePoint.revenue)} ({activePoint.orders} orders)
            </Badge>
          </CardHeader>
          <CardContent className="px-4 sm:px-5 pb-5 pt-1.5 flex-1 flex flex-col justify-center">
            {/* Responsive Spline Graph Container */}
            <div className="relative pt-1 pb-1">
              <svg
                viewBox="0 0 500 160"
                className="w-full h-48 sm:h-52 overflow-visible select-none"
              >
                <defs>
                  {/* Soft luxury Burgundy Gradient Fill */}
                  <linearGradient id="splineAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B3A4A" stopOpacity="0.28" />
                    <stop offset="70%" stopColor="#8B3A4A" stopOpacity="0.04" />
                    <stop offset="100%" stopColor="#8B3A4A" stopOpacity="0.00" />
                  </linearGradient>

                  {/* Glow filter for active spline node */}
                  <filter id="pointGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#8B3A4A" floodOpacity="0.3" />
                  </filter>
                </defs>

                {/* Horizontal Guideline Grids & Currency Benchmarks */}
                <g className="text-[#A39E96]">
                  <line x1="45" y1="32" x2="480" y2="32" stroke="#E5E1DC" strokeDasharray="3 3" strokeOpacity="0.7" />
                  <text x="0" y="35" fontSize="8.5" fill="#737373" fontFamily="monospace">PKR 150k</text>

                  <line x1="45" y1="66" x2="480" y2="66" stroke="#E5E1DC" strokeDasharray="3 3" strokeOpacity="0.7" />
                  <text x="0" y="69" fontSize="8.5" fill="#737373" fontFamily="monospace">PKR 100k</text>

                  <line x1="45" y1="101" x2="480" y2="101" stroke="#E5E1DC" strokeDasharray="3 3" strokeOpacity="0.7" />
                  <text x="0" y="104" fontSize="8.5" fill="#737373" fontFamily="monospace">PKR 50k</text>

                  <line x1="35" y1="135" x2="480" y2="135" stroke="#E5E1DC" strokeOpacity="0.9" />
                </g>

                {/* Smooth Spline Area Gradient */}
                <path
                  d={splineChartData.areaPath}
                  fill="url(#splineAreaGradient)"
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
                  const isSelected = selectedMonthIndex === idx;
                  return (
                    <g key={pt.month} className="transition-all duration-200">
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isSelected ? 5 : 3.5}
                        fill={isSelected ? "#8B3A4A" : "#FFFFFF"}
                        stroke="#8B3A4A"
                        strokeWidth={isSelected ? 2.5 : 1.5}
                        filter={isSelected ? "url(#pointGlow)" : undefined}
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
                      x="-36"
                      y="-20"
                      width="72"
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
                      fontSize="9.5"
                      fontWeight="600"
                      fontFamily="sans-serif"
                    >
                      {formatCurrency(activePoint.revenue)}
                    </text>
                    <polygon points="-3,-2 3,-2 0,2" fill="#1C1C1C" />
                  </g>
                )}

                {/* X-Axis Month Labels */}
                {splineChartData.points.map((pt, idx) => {
                  const isSelected = selectedMonthIndex === idx;
                  return (
                    <text
                      key={`label-${pt.month}`}
                      x={pt.x}
                      y="152"
                      textAnchor="middle"
                      fontSize="10"
                      fill={isSelected ? "#8B3A4A" : "#737373"}
                      fontWeight={isSelected ? "700" : "500"}
                      className="transition-colors duration-200 select-none"
                    >
                      {pt.month}
                    </text>
                  );
                })}

                {/* Interactive Hover Hit Zones for touch & mouse */}
                {splineChartData.points.map((pt, idx) => (
                  <rect
                    key={`hit-${pt.month}`}
                    x={pt.x - 42}
                    y="15"
                    width="84"
                    height="140"
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setSelectedMonthIndex(idx)}
                    onClick={() => setSelectedMonthIndex(idx)}
                  />
                ))}
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions (5 cols) */}
        <Card className="lg:col-span-5 rounded-xl border border-[#E5E1DC] h-full flex flex-col justify-between">
          <CardHeader className="py-3.5 px-4 sm:px-5 flex flex-row items-center justify-between shrink-0">
            <CardTitle className="text-sm sm:text-base font-semibold text-[#1C1C1C]">
              Recent Orders
            </CardTitle>
            <Link
              href="/admin/orders"
              className="text-[11px] font-semibold text-[#8B3A4A] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent className="px-4 sm:px-5 pb-5 pt-1.5 flex-1 flex flex-col justify-between">
            <div className="divide-y divide-[#E5E1DC]/60 flex-1 flex flex-col justify-between">
              {recentOrders.map((order) => {
                const itemCount = order.items?.length || 1;
                return (
                  <div key={order.id} className="py-2.5 sm:py-3 flex items-center justify-between gap-2.5 first:pt-1 last:pb-1">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Avatar name={order.customerName} size="sm" className="w-8 h-8 text-[11px] shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#1C1C1C] truncate">
                          {order.customerName}
                        </p>
                        <p className="text-[10px] text-[#737373] flex items-center gap-1">
                          <span className="font-mono">#{order.orderNumber || order.id}</span>
                          <span>•</span>
                          <span>{itemCount} {itemCount === 1 ? "pc" : "pcs"}</span>
                          <span>•</span>
                          <span>{formatOrderTime(order.createdAt)}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-0.5 shrink-0">
                      <span className="text-xs font-bold text-[#1C1C1C]">
                        {formatCurrency(order.totalAmount || order.total || 0)}
                      </span>
                      {getOrderStatusBadge(order.status || (order.orderStatus as string))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Section: Department Performance & Action Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Department Distribution (6 cols) */}
        <Card className="lg:col-span-6 rounded-xl border border-[#E5E1DC] h-full flex flex-col justify-between">
          <CardHeader className="py-3.5 px-4 sm:px-5 flex flex-row items-center justify-between shrink-0">
            <CardTitle className="text-sm sm:text-base font-semibold text-[#1C1C1C]">
              Collection Distribution
            </CardTitle>
            <Link
              href="/admin/categories"
              className="text-[11px] font-semibold text-[#8B3A4A] hover:underline flex items-center gap-1"
            >
              <span>Manage</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent className="px-4 sm:px-5 pb-5 pt-1.5 space-y-3 flex-1 flex flex-col justify-around">
            {topCategories.map((cat) => (
              <div key={cat.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8B3A4A]" />
                    <span className="font-medium text-[#1C1C1C] text-[11px]">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#737373]">{cat.count} pcs</span>
                    <span className="font-mono font-semibold text-[11px] text-[#1C1C1C]">{cat.share}%</span>
                  </div>
                </div>
                <div className="w-full h-1 bg-[#FAF8F5] rounded-full overflow-hidden border border-[#E5E1DC]/60">
                  <div
                    className="h-full rounded-full bg-[#8B3A4A] transition-all duration-500"
                    style={{ width: `${cat.share}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Action Hub & Moderation (6 cols) */}
        <Card className="lg:col-span-6 rounded-xl border border-[#E5E1DC] h-full flex flex-col justify-between">
          <CardHeader className="py-3.5 px-4 sm:px-5 flex flex-row items-center justify-between shrink-0">
            <CardTitle className="text-sm sm:text-base font-semibold text-[#1C1C1C]">
              Administrative Tasks & Approvals
            </CardTitle>
            <Badge variant="outline" size="sm" className="font-mono text-[10px] text-[#8B3A4A] border-[#8B3A4A]/30 bg-[#8B3A4A]/5 px-2 py-0.5">
              {totalPendingActions} Pending
            </Badge>
          </CardHeader>
          <CardContent className="px-4 sm:px-5 pb-5 pt-1.5 space-y-2.5 flex-1 flex flex-col justify-between">
            {/* Reviews queue */}
            <div className="p-2.5 sm:p-3 bg-[#FAF8F5] rounded-lg border border-[#E5E1DC]/80 flex items-center justify-between hover:border-[#8B3A4A]/40 transition-colors">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7.5 h-7.5 rounded-lg bg-[#8B3A4A]/10 border border-[#8B3A4A]/20 flex items-center justify-center text-[#8B3A4A] shrink-0">
                  <MessageSquare className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#1C1C1C] truncate">
                    Customer Reviews Queue
                  </p>
                  <p className="text-[10px] text-[#737373] truncate">
                    {pendingReviewsCount} review{pendingReviewsCount === 1 ? "" : "s"} awaiting authenticity check
                  </p>
                </div>
              </div>
              <Link
                href="/admin/reviews"
                className="text-[11px] px-2.5 py-1 bg-[#8B3A4A] text-white rounded-md hover:bg-[#722F3D] font-medium transition-colors shrink-0 ml-2"
              >
                Review ({pendingReviewsCount})
              </Link>
            </div>

            {/* Orders queue */}
            <div className="p-2.5 sm:p-3 bg-[#FAF8F5] rounded-lg border border-[#E5E1DC]/80 flex items-center justify-between hover:border-[#8B3A4A]/40 transition-colors">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7.5 h-7.5 rounded-lg bg-[#8B3A4A]/10 border border-[#8B3A4A]/20 flex items-center justify-center text-[#8B3A4A] shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#1C1C1C] truncate">
                    Dispatch Processing Queue
                  </p>
                  <p className="text-[10px] text-[#737373] truncate">
                    {pendingOrdersCount} order{pendingOrdersCount === 1 ? "" : "s"} waiting for courier handoff
                  </p>
                </div>
              </div>
              <Link
                href="/admin/orders"
                className="text-[11px] px-2.5 py-1 bg-white border border-[#E5E1DC] text-[#242424] hover:bg-[#F1ECE6] rounded-md font-medium transition-colors shrink-0 ml-2"
              >
                Inspect ({pendingOrdersCount})
              </Link>
            </div>

            {/* SLA Status */}
            <div className="p-2.5 bg-white rounded-lg border border-[#E5E1DC]/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <ShieldCheck className="w-3.5 h-3.5 text-[#4F7A61] shrink-0" />
                <span className="font-medium text-[#242424] text-[11px] truncate">Atelier Quality & Dispatch Standard</span>
              </div>
              <Badge variant="success" size="sm" className="text-[9px] px-1.5 py-0 shrink-0">98.4% Compliant</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
