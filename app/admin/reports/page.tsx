"use client";

import React, { useState, useMemo } from "react";
import {
  Download,
  Calendar,
  Banknote,
  Package,
  Store,
  Users,
  ChevronDown,
  Check,
  TrendingUp,
  ShoppingBag,
  CreditCard,
  CheckCircle2,
  Star,
  UserCheck,
  Repeat,
  MapPin,
  Truck,
  AlertCircle,
  Eye,
  ArrowUpRight,
  Clock,
  RotateCcw,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Dropdown } from "@/components/ui/Dropdown";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import { useProducts } from "@/context/ProductContext";
import { useAuth } from "@/context/AuthContext";
import { jsPDF } from "jspdf";

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

  const periodOptions: { id: DateFilter; label: string }[] = [
    { id: "Today", label: "Today" },
    { id: "Week", label: "This Week" },
    { id: "Month", label: "This Month" },
    { id: "Year", label: "This Year" },
    { id: "Custom", label: "Custom Range" },
  ];

  const reportTabs = [
    {
      key: "sales" as ReportTab,
      label: "COD Sales & Orders",
      subtitle: "100% Cash on Delivery revenue & courier remittance",
      icon: Banknote,
    },
    {
      key: "products" as ReportTab,
      label: "Products & Stock",
      subtitle: "Catalog velocity & low stock replenishment",
      icon: Package,
    },
    {
      key: "suppliers" as ReportTab,
      label: "Artisans & Workshops",
      subtitle: "Pakistani ateliers & order fulfillment SLA",
      icon: Store,
    },
    {
      key: "customers" as ReportTab,
      label: "Customers & Cities",
      subtitle: "VIP patrons, repeat buyers & city reach",
      icon: Users,
    },
  ];

  const currentReport = reportTabs.find((t) => t.key === activeTab) || reportTabs[0];
  const CurrentReportIcon = currentReport.icon;

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

  // Scaled summary figures in PKR (100% Cash on Delivery)
  const baseRevenue = 142890;
  const scaledRevenue = Math.round(baseRevenue * timeframeMultiplier);
  const baseOrders = 386;
  const scaledOrders = Math.max(1, Math.round(baseOrders * timeframeMultiplier));
  const avgOrderValue = Math.round(scaledRevenue / scaledOrders);

  // Pakistan Courier Logistics Partners (100% Cash on Delivery)
  const codCourierChannels = useMemo(() => {
    return [
      {
        courier: "TCS Express (COD)",
        reach: "National Express & Overnight Hubs",
        orders: Math.round(scaledOrders * 0.40),
        percentage: "40%",
        collected: Math.round(scaledRevenue * 0.40),
        successRate: "98.8%",
        remittanceStatus: "Remitted to Atelier",
      },
      {
        courier: "Trax Logistics (COD)",
        reach: "Metropolitan Doorstep Cash Delivery",
        orders: Math.round(scaledOrders * 0.33),
        percentage: "33%",
        collected: Math.round(scaledRevenue * 0.33),
        successRate: "98.2%",
        remittanceStatus: "Remitted to Atelier",
      },
      {
        courier: "Leopards Courier (COD)",
        reach: "Nationwide Tehsils & City Hubs",
        orders: Math.round(scaledOrders * 0.19),
        percentage: "19%",
        collected: Math.round(scaledRevenue * 0.19),
        successRate: "97.6%",
        remittanceStatus: "In Clearing (24h)",
      },
      {
        courier: "PostEx / M&P Express (COD)",
        reach: "Regional & Rural Access Centers",
        orders: Math.max(1, Math.round(scaledOrders * 0.08)),
        percentage: "8%",
        collected: Math.round(scaledRevenue * 0.08),
        successRate: "96.9%",
        remittanceStatus: "Cash in Transit",
      },
    ];
  }, [scaledOrders, scaledRevenue]);

  // COD Lifecycle Status Breakdown
  const codLifecycleMetrics = useMemo(() => {
    return [
      {
        label: "Doorstep Cash Collected",
        percentage: "97.2%",
        count: Math.round(scaledOrders * 0.972),
        badgeColor: "text-[#4F7A61] bg-[#4F7A61]/10",
        icon: CheckCircle2,
      },
      {
        label: "Out for Courier Delivery",
        percentage: "1.8%",
        count: Math.max(1, Math.round(scaledOrders * 0.018)),
        badgeColor: "text-[#8B3A4A] bg-[#8B3A4A]/10",
        icon: Clock,
      },
      {
        label: "Customer Rescheduled",
        percentage: "0.7%",
        count: Math.max(1, Math.round(scaledOrders * 0.007)),
        badgeColor: "text-[#737373] bg-[#737373]/10",
        icon: Truck,
      },
      {
        label: "Return to Origin (RTO)",
        percentage: "0.3%",
        count: Math.max(1, Math.round(scaledOrders * 0.003)),
        badgeColor: "text-[#B84A4A] bg-[#B84A4A]/10",
        icon: RotateCcw,
      },
    ];
  }, [scaledOrders]);

  // Deliveries by Pakistani Cities (100% COD)
  const cityBreakdown = useMemo(() => {
    return [
      { city: "Lahore", orders: Math.round(scaledOrders * 0.38), gmv: Math.round(scaledRevenue * 0.38), share: 38 },
      { city: "Karachi", orders: Math.round(scaledOrders * 0.32), gmv: Math.round(scaledRevenue * 0.32), share: 32 },
      { city: "Islamabad & Rawalpindi", orders: Math.round(scaledOrders * 0.18), gmv: Math.round(scaledRevenue * 0.18), share: 18 },
      { city: "Faisalabad & Sialkot", orders: Math.round(scaledOrders * 0.08), gmv: Math.round(scaledRevenue * 0.08), share: 8 },
      { city: "Peshawar & Multan", orders: Math.max(1, Math.round(scaledOrders * 0.04)), gmv: Math.round(scaledRevenue * 0.04), share: 4 },
    ];
  }, [scaledOrders, scaledRevenue]);

  // Best selling pieces in Pakistan (COD Orders)
  const bestSellers = useMemo(() => {
    return [
      { title: "Raw Silk Embroidered Formal Kurta", category: "Pret & Formals", units: Math.round(184 * timeframeMultiplier), gmv: Math.round(42500 * timeframeMultiplier) },
      { title: "Handspun Khaddi Cotton Luxury Tunic", category: "Festive Pret", units: Math.round(124 * timeframeMultiplier), gmv: Math.round(38200 * timeframeMultiplier) },
      { title: "Artisanal Pure Leather Khussa & Sneaker", category: "Footwear", units: Math.round(88 * timeframeMultiplier), gmv: Math.round(34100 * timeframeMultiplier) },
      { title: "Grade-A Pure Pashmina Shawl & Stole", category: "Accessories", units: Math.round(62 * timeframeMultiplier), gmv: Math.round(28090 * timeframeMultiplier) },
    ];
  }, [timeframeMultiplier]);

  // Low stock pieces
  const lowStockProducts = useMemo(() => {
    return products.filter((p) => p.stock <= 10);
  }, [products]);

  // Most viewed products
  const mostViewedProducts = useMemo(() => {
    return [
      { title: "Raw Silk Embroidered Formal Kurta", views: Math.round(4820 * timeframeMultiplier), conversion: "4.8%" },
      { title: "Handspun Khaddi Cotton Luxury Tunic", views: Math.round(3940 * timeframeMultiplier), conversion: "3.9%" },
      { title: "Artisanal Pure Leather Khussa & Sneaker", views: Math.round(3650 * timeframeMultiplier), conversion: "5.1%" },
      { title: "Grade-A Pure Pashmina Shawl & Stole", views: Math.round(2890 * timeframeMultiplier), conversion: "3.2%" },
    ];
  }, [timeframeMultiplier]);

  // Pakistani Ateliers & Workshops
  const supplierReports = useMemo(() => {
    return [
      {
        name: "Lahore Heritage Atelier",
        city: "Lahore (Gulberg)",
        sales: Math.round(58400 * timeframeMultiplier),
        orders: Math.round(154 * timeframeMultiplier),
        sla: "99.4%",
        engagementScore: "98/100",
      },
      {
        name: "Karachi Handloom & Silk Guild",
        city: "Karachi (Clifton)",
        sales: Math.round(44200 * timeframeMultiplier),
        orders: Math.round(112 * timeframeMultiplier),
        sla: "98.5%",
        engagementScore: "95/100",
      },
      {
        name: "Islamabad Couture House",
        city: "Islamabad (F-7)",
        sales: Math.round(28600 * timeframeMultiplier),
        orders: Math.round(74 * timeframeMultiplier),
        sla: "97.8%",
        engagementScore: "92/100",
      },
      {
        name: "Multan Khaddi & Crafts Studio",
        city: "Multan (Cantt)",
        sales: Math.round(11690 * timeframeMultiplier),
        orders: Math.round(46 * timeframeMultiplier),
        sla: "96.5%",
        engagementScore: "90/100",
      },
    ];
  }, [timeframeMultiplier]);

  // Customer statistics (Pakistani demographics - 100% COD Patrons)
  const customerMetrics = useMemo(() => {
    const totalCust = users.filter((u) => u.role === "customer").length;
    return {
      totalCustomers: totalCust,
      newCustomers: Math.max(1, Math.round(totalCust * 0.35 * timeframeMultiplier)),
      repeatRate: "44.6%",
      topCustomers: [
        { name: "Ayesha Khan", city: "Lahore (DHA)", orders: Math.max(1, Math.round(8 * timeframeMultiplier)), spend: Math.round(34500 * timeframeMultiplier) },
        { name: "Bilal Tariq", city: "Karachi (Clifton)", orders: Math.max(1, Math.round(6 * timeframeMultiplier)), spend: Math.round(26800 * timeframeMultiplier) },
        { name: "Zainab Malik", city: "Islamabad (F-8)", orders: Math.max(1, Math.round(5 * timeframeMultiplier)), spend: Math.round(21400 * timeframeMultiplier) },
        { name: "Hamza Chaudhry", city: "Faisalabad (Kohinoor)", orders: Math.max(1, Math.round(4 * timeframeMultiplier)), spend: Math.round(17200 * timeframeMultiplier) },
      ],
    };
  }, [users, timeframeMultiplier]);

  // Professional PDF Report Generator (100% Cash on Delivery in PKR)
  const handleExportPDF = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const dateScopeStr = dateFilter === "Custom" ? `${customStart}_to_${customEnd}` : dateFilter;
    const filename = `Atelier_Pakistan_COD_${activeTab}_report_${dateScopeStr}_${timestamp}.pdf`;

    const doc = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });

    // Atelier Luxury Theme Palette
    const BURGUNDY: [number, number, number] = [139, 58, 74];
    const CHARCOAL: [number, number, number] = [28, 28, 28];
    const MUTED: [number, number, number] = [115, 115, 115];
    const BORDER: [number, number, number] = [229, 225, 220];
    const CARD_BG: [number, number, number] = [250, 248, 245];
    const TH_BG: [number, number, number] = [242, 239, 235];
    const ROW_ALT: [number, number, number] = [252, 251, 249];
    const SAGE_GREEN: [number, number, number] = [79, 122, 97];

    const truncate = (text: string, maxWidth: number) => {
      if (doc.getTextWidth(text) <= maxWidth) return text;
      let truncated = text;
      while (truncated.length > 3 && doc.getTextWidth(truncated + "…") > maxWidth) {
        truncated = truncated.slice(0, -1);
      }
      return truncated + "…";
    };

    // 1. Top Decorative Brand Bar
    doc.setFillColor(...BURGUNDY);
    doc.rect(0, 0, 595.28, 6, "F");

    // 2. Header: Atelier Pakistan Wordmark & Subtitle
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(...CHARCOAL);
    doc.text("A T E L I E R   P A K I S T A N", 40, 40);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text("EXECUTIVE CASH ON DELIVERY (COD) AUDIT & FINANCIAL REPORT (PKR)", 40, 53);

    // Right Metadata Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...BURGUNDY);
    doc.text(`REPORT: ${currentReport.label.toUpperCase()}`, 555, 36, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...CHARCOAL);
    doc.text(
      `Period: ${dateFilter} • Model: 100% COD`,
      555,
      48,
      { align: "right" }
    );

    doc.setTextColor(...MUTED);
    doc.setFontSize(7.5);
    doc.text(
      `Generated: ${new Date().toLocaleDateString("en-PK", { year: "numeric", month: "short", day: "numeric" })}`,
      555,
      60,
      { align: "right" }
    );

    // Subtle Divider Line
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.75);
    doc.line(40, 68, 555, 68);

    // 3. Top 3 KPI Executive Cards
    interface KPICard {
      label: string;
      value: string;
      subtext: string;
    }

    let kpiCards: KPICard[] = [];
    if (activeTab === "sales") {
      kpiCards = [
        { label: "TOTAL COD REVENUE", value: formatCurrency(scaledRevenue), subtext: "100% Cash on Delivery" },
        { label: "COD PARCELS DELIVERED", value: `${scaledOrders} Delivered`, subtext: "98.6% Doorstep Collection SLA" },
        { label: "AVERAGE COD BASKET", value: formatCurrency(avgOrderValue), subtext: "Cash Ready upon Handover" },
      ];
    } else if (activeTab === "products") {
      kpiCards = [
        { label: "TOTAL ACTIVE DESIGNS", value: `${products.length} Garments`, subtext: "Curated artisan catalog" },
        { label: "TOP SELLING PIECE", value: bestSellers[0]?.title ? truncate(bestSellers[0].title, 130) : "Silk Kurta", subtext: `${formatCurrency(bestSellers[0]?.gmv || 0)} gross` },
        { label: "LOW STOCK REORDER ALERTS", value: `${lowStockProducts.length} Items Flagged`, subtext: "Requires workshop restock" },
      ];
    } else if (activeTab === "suppliers") {
      kpiCards = [
        { label: "PAKISTANI ATELIERS", value: `${supplierReports.length} Workshops`, subtext: "Lahore, Karachi, Islamabad" },
        { label: "DISPATCH SLA COMPLIANCE", value: "98.4% On-Time", subtext: "Standard delivery SLA" },
        { label: "ATELIER DISBURSEMENTS", value: formatCurrency(Math.round(scaledRevenue * 0.875)), subtext: "87.5% net of 12.5% fee" },
      ];
    } else {
      kpiCards = [
        { label: "REGISTERED COD PATRONS", value: `${customerMetrics.totalCustomers} Accounts`, subtext: "Pakistan luxury clientele" },
        { label: "NEW CLIENT ACQUISITIONS", value: `+${customerMetrics.newCustomers} Patrons`, subtext: "In selected period" },
        { label: "REPEAT BUYER RATE", value: customerMetrics.repeatRate, subtext: "Consistent doorstep re-orders" },
      ];
    }

    const cardW = 162;
    const cardH = 48;
    const cardY = 78;

    kpiCards.forEach((card, index) => {
      const cardX = 40 + index * (cardW + 14);

      doc.setFillColor(...CARD_BG);
      doc.setDrawColor(...BORDER);
      doc.roundedRect(cardX, cardY, cardW, cardH, 3, 3, "FD");

      doc.setFillColor(...BURGUNDY);
      doc.roundedRect(cardX, cardY, cardW, 2.5, 1, 1, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.5);
      doc.setTextColor(...MUTED);
      doc.text(card.label, cardX + 8, cardY + 13);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(...CHARCOAL);
      doc.text(truncate(card.value, 145), cardX + 8, cardY + 29);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(...SAGE_GREEN);
      doc.text(card.subtext, cardX + 8, cardY + 41);
    });

    // 4. Data Tables Helper Function
    interface ColumnDef {
      header: string;
      width: number;
      align?: "left" | "right" | "center";
    }

    const drawTable = (
      startY: number,
      title: string,
      columns: ColumnDef[],
      rows: (string | number)[][],
      totalRow?: (string | number)[]
    ): number => {
      let y = startY;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...CHARCOAL);
      doc.text(title, 40, y);

      doc.setFillColor(...BURGUNDY);
      doc.circle(34, y - 3, 2, "F");

      y += 8;

      const tableW = columns.reduce((sum, c) => sum + c.width, 0);

      doc.setFillColor(...TH_BG);
      doc.rect(40, y, tableW, 19, "F");
      doc.setDrawColor(...BORDER);
      doc.line(40, y + 19, 40 + tableW, y + 19);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(70, 70, 70);

      let curX = 40;
      columns.forEach((col) => {
        const textX =
          col.align === "right"
            ? curX + col.width - 8
            : col.align === "center"
            ? curX + col.width / 2
            : curX + 8;
        doc.text(col.header, textX, y + 12.5, { align: col.align || "left" });
        curX += col.width;
      });

      y += 19;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);

      rows.forEach((row, rowIndex) => {
        if (rowIndex % 2 === 1) {
          doc.setFillColor(...ROW_ALT);
          doc.rect(40, y, tableW, 18, "F");
        }

        doc.setDrawColor(240, 237, 232);
        doc.line(40, y + 18, 40 + tableW, y + 18);

        let cellX = 40;
        row.forEach((cell, cellIndex) => {
          const col = columns[cellIndex];
          const textX =
            col.align === "right"
              ? cellX + col.width - 8
              : col.align === "center"
              ? cellX + col.width / 2
              : cellX + 8;

          doc.setTextColor(35, 35, 35);
          const cellStr = truncate(String(cell), col.width - 16);
          doc.text(cellStr, textX, y + 12.5, { align: col.align || "left" });
          cellX += col.width;
        });

        y += 18;
      });

      if (totalRow) {
        doc.setFillColor(245, 242, 238);
        doc.rect(40, y, tableW, 19, "F");
        doc.setDrawColor(...BORDER);
        doc.line(40, y, 40 + tableW, y);
        doc.line(40, y + 19, 40 + tableW, y + 19);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);

        let cellX = 40;
        totalRow.forEach((cell, cellIndex) => {
          const col = columns[cellIndex];
          const textX =
            col.align === "right"
              ? cellX + col.width - 8
              : col.align === "center"
              ? cellX + col.width / 2
              : cellX + 8;

          doc.setTextColor(...CHARCOAL);
          const cellStr = truncate(String(cell), col.width - 16);
          doc.text(cellStr, textX, y + 12.5, { align: col.align || "left" });
          cellX += col.width;
        });

        y += 19;
      }

      return y + 16;
    };

    // 5. Draw Content Per Tab
    let currentY = 142;
    let auditNote = "";

    if (activeTab === "sales") {
      auditNote =
        "Operational model operates strictly under 100% Cash on Delivery (COD). Physical cash is collected at doorstep by partner couriers (TCS, Trax, Leopards, PostEx) and remitted directly to the atelier ledger in PKR.";

      currentY = drawTable(
        currentY,
        "COD Logistics Partners & Courier Cash Remittance (100% COD)",
        [
          { header: "COURIER PARTNER (COD)", width: 175, align: "left" },
          { header: "COVERAGE REACH", width: 130, align: "left" },
          { header: "ORDERS", width: 50, align: "right" },
          { header: "CASH (PKR)", width: 85, align: "right" },
          { header: "REMITTANCE", width: 75, align: "right" },
        ],
        codCourierChannels.map((c) => [
          c.courier,
          c.reach,
          c.orders.toLocaleString(),
          formatCurrency(c.collected),
          c.remittanceStatus,
        ]),
        [
          "Total Consolidated",
          "All Pakistan Logistics (100% COD)",
          scaledOrders.toLocaleString(),
          formatCurrency(scaledRevenue),
          "Reconciled",
        ]
      );

      currentY = drawTable(
        currentY,
        "Regional COD Order Volume by Major Pakistani Cities",
        [
          { header: "CITY HUB", width: 235, align: "left" },
          { header: "ORDERS DELIVERED", width: 110, align: "right" },
          { header: "COD SALES (PKR)", width: 110, align: "right" },
          { header: "SHARE (%)", width: 60, align: "right" },
        ],
        cityBreakdown.map((c) => [
          c.city,
          c.orders.toLocaleString(),
          formatCurrency(c.gmv),
          `${c.share}%`,
        ])
      );
    } else if (activeTab === "products") {
      auditNote =
        "Artisanal garment stock is monitored across our workshop network. Garments with 10 units or less left are automatically flagged for atelier weaver replenishment.";

      currentY = drawTable(
        currentY,
        "Top Performing Pakistani Garments (COD Orders)",
        [
          { header: "GARMENT / PIECE TITLE", width: 235, align: "left" },
          { header: "CATEGORY", width: 90, align: "left" },
          { header: "UNITS SOLD", width: 80, align: "right" },
          { header: "TOTAL REVENUE (PKR)", width: 110, align: "right" },
        ],
        bestSellers.map((item) => [
          item.title,
          item.category,
          item.units.toLocaleString(),
          formatCurrency(item.gmv),
        ])
      );

      currentY = drawTable(
        currentY,
        "Storefront Views & Conversion Rates",
        [
          { header: "PRODUCT TITLE", width: 265, align: "left" },
          { header: "PAGE VIEWS", width: 120, align: "right" },
          { header: "CONVERSION RATE", width: 130, align: "right" },
        ],
        mostViewedProducts.map((item) => [
          item.title,
          item.views.toLocaleString(),
          item.conversion,
        ])
      );

      if (lowStockProducts.length > 0) {
        currentY = drawTable(
          currentY,
          "Critical Low Stock Replenishment Notice",
          [
            { header: "PRODUCT TITLE", width: 215, align: "left" },
            { header: "SKU", width: 100, align: "left" },
            { header: "ATELIER", width: 110, align: "left" },
            { header: "UNITS LEFT", width: 90, align: "right" },
          ],
          lowStockProducts.slice(0, 4).map((p) => [
            p.title,
            p.sku,
            p.supplierName || "Lahore Heritage Atelier",
            `${p.stock} units`,
          ])
        );
      }
    } else if (activeTab === "suppliers") {
      auditNote =
        "Pakistani artisan ateliers maintain strict 95%+ on-time courier handover compliance. Bi-weekly payouts are disbursed upon courier cash remittance.";

      currentY = drawTable(
        currentY,
        "Pakistani Artisan Ateliers & SLA Performance",
        [
          { header: "ATELIER / WORKSHOP", width: 165, align: "left" },
          { header: "CITY LOCATION", width: 110, align: "left" },
          { header: "SALES (PKR)", width: 80, align: "right" },
          { header: "ORDERS", width: 60, align: "right" },
          { header: "DISPATCH SLA", width: 100, align: "right" },
        ],
        supplierReports.map((s) => [
          s.name,
          s.city,
          formatCurrency(s.sales),
          s.orders.toLocaleString(),
          s.sla,
        ])
      );

      currentY = drawTable(
        currentY,
        "Atelier Payouts & Net COD Disbursements (PKR)",
        [
          { header: "ARTISAN WORKSHOP", width: 175, align: "left" },
          { header: "GROSS VALUE", width: 110, align: "right" },
          { header: "ARTISAN SHARE (87.5%)", width: 120, align: "right" },
          { header: "PLATFORM FEE (12.5%)", width: 110, align: "right" },
        ],
        supplierReports.map((s) => [
          s.name,
          formatCurrency(s.sales),
          formatCurrency(Math.round(s.sales * 0.875)),
          formatCurrency(Math.round(s.sales * 0.125)),
        ])
      );
    } else {
      auditNote =
        "Client metrics reflect verified customer checkout profiles and city delivery records. All orders are completed via Cash on Delivery across Pakistan.";

      currentY = drawTable(
        currentY,
        "Customer Acquisition & Loyalty Indicators",
        [
          { header: "CORE INDICATOR", width: 235, align: "left" },
          { header: "CURRENT METRIC", width: 90, align: "right" },
          { header: "PAKISTAN TARGET", width: 100, align: "right" },
          { header: "STATUS", width: 90, align: "right" },
        ],
        [
          ["Total Registered Shoppers", `${customerMetrics.totalCustomers} Accounts`, "Growing", "Optimal"],
          ["New Client Registrations", `+${customerMetrics.newCustomers} Patrons`, "+20% MoM", "Surpassing"],
          ["Repeat Purchase Frequency", customerMetrics.repeatRate, "> 35%", "Exceptional"],
          ["Customer Satisfaction Rating", "4.92 / 5.0", "> 4.80", "High Loyalty"],
        ]
      );

      currentY = drawTable(
        currentY,
        "Top VIP Shoppers & Patrons by Spend (COD)",
        [
          { header: "CUSTOMER NAME", width: 165, align: "left" },
          { header: "CITY LOCATION", width: 120, align: "left" },
          { header: "ORDERS", width: 80, align: "right" },
          { header: "TOTAL SPEND (PKR)", width: 150, align: "right" },
        ],
        customerMetrics.topCustomers.map((c) => [
          c.name,
          c.city,
          `${c.orders} orders`,
          formatCurrency(c.spend),
        ])
      );
    }

    // 6. Executive Audit Note Box
    if (currentY <= 730 && auditNote) {
      doc.setFillColor(...CARD_BG);
      doc.setDrawColor(...BORDER);
      doc.roundedRect(40, currentY, 515, 36, 3, 3, "FD");

      doc.setFillColor(...BURGUNDY);
      doc.rect(40, currentY, 3, 36, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(...BURGUNDY);
      doc.text("EXECUTIVE AUDIT NOTE — 100% CASH ON DELIVERY (COD) FRAMEWORK", 52, currentY + 13);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(...MUTED);
      doc.text(truncate(auditNote, 490), 52, currentY + 25);
    }

    // 7. Footer
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.5);
    doc.line(40, 800, 555, 800);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...BURGUNDY);
    doc.text("CONFIDENTIAL", 40, 814);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...MUTED);
    doc.text("Atelier Pakistan — 100% Cash on Delivery (COD) Financial Audit Record", 105, 814);

    doc.text("Page 1 of 1 • Currency: PKR", 555, 814, { align: "right" });

    doc.save(filename);

    toast({
      title: "PDF Report Downloaded",
      message: `${currentReport.label} downloaded as ${filename}.`,
      type: "success",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1C1C1C]">
            Marketplace Analytics & Reports
          </h2>
          <p className="text-xs text-[#737373] mt-0.5">
            Pakistan Operations • 100% Cash on Delivery (COD) • All figures in Pakistani Rupee (PKR)
          </p>
        </div>

        <Button
          variant="default"
          size="sm"
          leftIcon={<Download className="w-4 h-4" />}
          onClick={handleExportPDF}
          className="bg-[#8B3A4A] hover:bg-[#722F3D] text-white shrink-0 cursor-pointer shadow-xs"
        >
          Export Report (PDF)
        </Button>
      </div>

      {/* Controls Card: Report Portion Dropdown (Left side) & Reporting Period Dropdown (Right side) */}
      <Card className="overflow-visible relative z-30">
        <CardContent className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 overflow-visible">
          {/* Left side: Report Portion / Domain Dropdown */}
          <div className="flex items-center gap-3">
            <Dropdown
              align="left"
              className="w-72 p-1.5 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.08)] border-[#E5E1DC] rounded-xl"
              trigger={
                <button
                  type="button"
                  className="h-10 px-3.5 rounded-lg border text-xs font-medium flex items-center gap-2.5 transition-all cursor-pointer bg-white border-[#E5E1DC] text-[#242424] hover:border-[#8B3A4A]/40 hover:bg-[#FAF8F5] shadow-xs"
                >
                  <div className="w-5 h-5 rounded-md bg-[#8B3A4A]/10 text-[#8B3A4A] flex items-center justify-center shrink-0">
                    <CurrentReportIcon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[#737373] text-[11px] font-normal">Section:</span>
                  <span className="font-semibold text-[#1C1C1C]">
                    {currentReport.label}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#737373] ml-0.5" />
                </button>
              }
            >
              <div className="px-3 py-1.5 border-b border-[#E5E1DC]/60 mb-1">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#737373]">
                  Select Report Section
                </p>
              </div>

              <div className="space-y-0.5">
                {reportTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isSelected = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveTab(tab.key)}
                      className={`w-full p-2.5 rounded-lg text-left flex items-center justify-between gap-2.5 transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-[#8B3A4A]/10 text-[#8B3A4A]"
                          : "hover:bg-[#FAF8F5] text-[#242424]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                            isSelected
                              ? "bg-[#8B3A4A] text-white"
                              : "bg-[#FAF8F5] text-[#737373]"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className={`text-xs font-semibold leading-tight ${isSelected ? "text-[#8B3A4A]" : "text-[#1C1C1C]"}`}>
                            {tab.label}
                          </p>
                          <p className="text-[10px] text-[#737373] truncate leading-tight mt-0.5">
                            {tab.subtitle}
                          </p>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#8B3A4A] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </Dropdown>
          </div>

          {/* Right side: Reporting Period Dropdown & Custom Range Pickers */}
          <div className="flex flex-wrap items-center gap-3">
            {dateFilter === "Custom" && (
              <div className="flex items-center gap-2 text-xs bg-[#FAF8F5] p-1.5 px-3 rounded-lg border border-[#E5E1DC]">
                <span className="text-[11px] text-[#737373] font-medium">From:</span>
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="px-2 py-1 text-xs border border-[#E5E1DC] rounded-md bg-white text-[#242424] focus:outline-none focus:border-[#8B3A4A]"
                />
                <span className="text-[11px] text-[#737373] font-medium">To:</span>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="px-2 py-1 text-xs border border-[#E5E1DC] rounded-md bg-white text-[#242424] focus:outline-none focus:border-[#8B3A4A]"
                />
              </div>
            )}

            <Dropdown
              align="right"
              className="w-56 p-1.5 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.08)] border-[#E5E1DC] rounded-xl"
              trigger={
                <button
                  type="button"
                  className="h-10 px-3.5 rounded-lg border text-xs font-medium flex items-center gap-2 transition-all cursor-pointer bg-white border-[#E5E1DC] text-[#242424] hover:border-[#8B3A4A]/40 hover:bg-[#FAF8F5] shadow-xs"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#8B3A4A]" />
                  <span className="text-[#737373] text-[11px] font-normal">Period:</span>
                  <span className="font-semibold text-[#1C1C1C]">
                    {periodOptions.find((opt) => opt.id === dateFilter)?.label || dateFilter}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#737373] ml-0.5" />
                </button>
              }
            >
              <div className="px-3 py-1.5 border-b border-[#E5E1DC]/60 mb-1">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#737373]">
                  Select Reporting Period
                </p>
              </div>

              {periodOptions.map((item) => {
                const isSelected = dateFilter === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDateFilter(item.id)}
                    className={`w-full px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#8B3A4A]/10 text-[#8B3A4A] font-semibold"
                        : "text-[#242424] hover:bg-[#FAF8F5] hover:text-[#1C1C1C]"
                    }`}
                  >
                    <span>{item.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#8B3A4A]" />}
                  </button>
                );
              })}
            </Dropdown>
          </div>
        </CardContent>
      </Card>

      {/* Top 3 KPI Executive Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* 1. Gross Revenue (in PKR) */}
        <Card className="group relative overflow-hidden bg-white border border-[#E5E1DC] hover:border-[#8B3A4A]/50 rounded-xl hover:shadow-[0_4px_16px_rgba(139,58,74,0.08)] hover:-translate-y-0.5 transition-all duration-200">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#8B3A4A] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <CardContent className="p-3.5 sm:p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#737373]">
                Total COD Sales Revenue
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#8B3A4A]/10 border border-[#8B3A4A]/20 flex items-center justify-center text-[#8B3A4A] shadow-xs group-hover:bg-[#8B3A4A] group-hover:text-white group-hover:border-[#8B3A4A] transition-all duration-200 shrink-0">
                <Banknote className="w-4 h-4 transition-transform duration-200 group-hover:scale-105" />
              </div>
            </div>

            <div className="mt-1.5">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#1C1C1C]">
                {formatCurrency(scaledRevenue)}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#4F7A61] bg-[#4F7A61]/10 px-1.5 py-0.5 rounded">
                  <TrendingUp className="w-2.5 h-2.5" />
                  +18.7%
                </span>
                <span className="text-[10px] text-[#737373]">100% Cash on Delivery</span>
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
                COD Parcels Delivered
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#8B3A4A]/10 border border-[#8B3A4A]/20 flex items-center justify-center text-[#8B3A4A] shadow-xs group-hover:bg-[#8B3A4A] group-hover:text-white group-hover:border-[#8B3A4A] transition-all duration-200 shrink-0">
                <ShoppingBag className="w-4 h-4 transition-transform duration-200 group-hover:scale-105" />
              </div>
            </div>

            <div className="mt-1.5">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#1C1C1C]">
                {scaledOrders} Parcels
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#4F7A61] bg-[#4F7A61]/10 px-1.5 py-0.5 rounded">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  98.6%
                </span>
                <span className="text-[10px] text-[#737373]">doorstep collection SLA</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. Average Order Value */}
        <Card className="group relative overflow-hidden bg-white border border-[#E5E1DC] hover:border-[#8B3A4A]/50 rounded-xl hover:shadow-[0_4px_16px_rgba(139,58,74,0.08)] hover:-translate-y-0.5 transition-all duration-200">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#8B3A4A] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <CardContent className="p-3.5 sm:p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#737373]">
                Average COD Basket
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#8B3A4A]/10 border border-[#8B3A4A]/20 flex items-center justify-center text-[#8B3A4A] shadow-xs group-hover:bg-[#8B3A4A] group-hover:text-white group-hover:border-[#8B3A4A] transition-all duration-200 shrink-0">
                <CreditCard className="w-4 h-4 transition-transform duration-200 group-hover:scale-105" />
              </div>
            </div>

            <div className="mt-1.5">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#1C1C1C]">
                {formatCurrency(avgOrderValue)}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#8B3A4A] bg-[#8B3A4A]/10 px-1.5 py-0.5 rounded">
                  <Star className="w-2.5 h-2.5 fill-current" />
                  Cash at Doorstep
                </span>
                <span className="text-[10px] text-[#737373]">courier cash handover</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab 1: Sales & Orders (100% Cash on Delivery) */}
      {activeTab === "sales" && (
        <div className="space-y-6">
          {/* Cash on Delivery Logistics & Courier Remittance Table */}
          <Card>
            <CardHeader className="py-4 px-5 border-b border-[#E5E1DC]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-base text-[#1C1C1C]">
                    Cash on Delivery (COD) Logistics & Courier Cash Remittance
                  </CardTitle>
                  <p className="text-xs text-[#737373] mt-0.5">
                    Physical cash collected at recipient doorsteps and remitted by Pakistan courier networks
                  </p>
                </div>
                <Badge variant="outline" size="sm" className="w-fit text-[11px] text-[#4F7A61] border-[#4F7A61]/30 bg-[#4F7A61]/5 font-semibold">
                  100% Cash on Delivery Model
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#242424]">
                  <thead className="bg-[#FAF8F5] border-b border-[#E5E1DC] text-[#737373] uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-6">Courier Logistics Partner</th>
                      <th className="py-3 px-6">Coverage Network</th>
                      <th className="py-3 px-6 text-right">Parcels</th>
                      <th className="py-3 px-6 text-right">Cash Collected (PKR)</th>
                      <th className="py-3 px-6 text-right">Share (%)</th>
                      <th className="py-3 px-6 text-right">Remittance Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E1DC]">
                    {codCourierChannels.map((c) => (
                      <tr key={c.courier} className="hover:bg-[#FAF8F5]/60 transition-colors">
                        <td className="py-3.5 px-6 font-semibold text-[#1C1C1C] flex items-center gap-2">
                          <Truck className="w-3.5 h-3.5 text-[#8B3A4A]" />
                          {c.courier}
                        </td>
                        <td className="py-3.5 px-6 text-[#737373]">{c.reach}</td>
                        <td className="py-3.5 px-6 text-right font-mono">{c.orders}</td>
                        <td className="py-3.5 px-6 text-right font-semibold text-[#1C1C1C]">
                          {formatCurrency(c.collected)}
                        </td>
                        <td className="py-3.5 px-6 text-right font-mono font-medium text-[#8B3A4A]">
                          {c.percentage}
                        </td>
                        <td className="py-3.5 px-6 text-right">
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#4F7A61] bg-[#4F7A61]/10 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            {c.remittanceStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* COD Delivery & Doorstep Collection Lifecycle */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {codLifecycleMetrics.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.label} className="p-3.5 bg-white border border-[#E5E1DC] rounded-xl shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-semibold text-[#737373] tracking-wider truncate">
                      {item.label}
                    </span>
                    <Icon className="w-3.5 h-3.5 text-[#8B3A4A]" />
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-lg font-bold text-[#1C1C1C]">
                      {item.percentage}
                    </span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${item.badgeColor}`}>
                      {item.count} pkgs
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Two Columns: Best Selling Pieces (COD) & Deliveries by Pakistani Cities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Best Selling Pieces */}
            <Card>
              <CardHeader className="py-3.5 px-5 border-b border-[#E5E1DC]">
                <CardTitle className="text-sm font-semibold text-[#1C1C1C]">
                  Top Selling Garments (COD Orders)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] border-b border-[#E5E1DC] text-[#737373] text-[10px] uppercase">
                    <tr>
                      <th className="py-2.5 px-4">Garment Title</th>
                      <th className="py-2.5 px-4">Category</th>
                      <th className="py-2.5 px-4 text-right">Units Sold</th>
                      <th className="py-2.5 px-4 text-right">COD Sales (PKR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E1DC]">
                    {bestSellers.map((item) => (
                      <tr key={item.title} className="hover:bg-[#FAF8F5]/60 transition-colors">
                        <td className="py-3 px-4 font-semibold text-[#1C1C1C]">{item.title}</td>
                        <td className="py-3 px-4 text-[#737373]">{item.category}</td>
                        <td className="py-3 px-4 text-right font-mono">{item.units} pcs</td>
                        <td className="py-3 px-4 text-right font-semibold text-[#8B3A4A]">
                          {formatCurrency(item.gmv)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {/* City Distribution */}
            <Card>
              <CardHeader className="py-3.5 px-5 border-b border-[#E5E1DC]">
                <CardTitle className="text-sm font-semibold text-[#1C1C1C]">
                  Regional COD Deliveries by Pakistani Cities
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3.5">
                {cityBreakdown.map((item) => (
                  <div key={item.city} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#1C1C1C] flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#8B3A4A]" />
                        {item.city}
                      </span>
                      <span className="font-mono text-[#737373]">
                        {item.orders} orders ({item.share}%) • <strong className="text-[#1C1C1C]">{formatCurrency(item.gmv)}</strong>
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#FAF8F5] border border-[#E5E1DC] overflow-hidden">
                      <div
                        className="h-full bg-[#8B3A4A] rounded-full transition-all duration-300"
                        style={{ width: `${item.share}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 2: Products & Stock */}
      {activeTab === "products" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Best Sellers */}
            <Card>
              <CardHeader className="py-3.5 px-5 border-b border-[#E5E1DC]">
                <CardTitle className="text-sm font-semibold text-[#1C1C1C]">
                  Top Performing Pieces by Volume & Sales
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] border-b border-[#E5E1DC] text-[#737373] text-[10px] uppercase">
                    <tr>
                      <th className="py-2.5 px-4">Garment Title</th>
                      <th className="py-2.5 px-4">Units Sold</th>
                      <th className="py-2.5 px-4 text-right">Total (PKR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E1DC]">
                    {bestSellers.map((item) => (
                      <tr key={item.title} className="hover:bg-[#FAF8F5]/60 transition-colors">
                        <td className="py-3 px-4 font-semibold text-[#1C1C1C]">{item.title}</td>
                        <td className="py-3 px-4 font-mono">{item.units} pcs</td>
                        <td className="py-3 px-4 text-right font-semibold text-[#8B3A4A]">{formatCurrency(item.gmv)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {/* Most Viewed */}
            <Card>
              <CardHeader className="py-3.5 px-5 border-b border-[#E5E1DC]">
                <CardTitle className="text-sm font-semibold text-[#1C1C1C]">
                  Digital Storefront Views & Conversion
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] border-b border-[#E5E1DC] text-[#737373] text-[10px] uppercase">
                    <tr>
                      <th className="py-2.5 px-4">Garment Title</th>
                      <th className="py-2.5 px-4">Page Views</th>
                      <th className="py-2.5 px-4 text-right">Conversion</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E1DC]">
                    {mostViewedProducts.map((item) => (
                      <tr key={item.title} className="hover:bg-[#FAF8F5]/60 transition-colors">
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
            <CardHeader className="py-3.5 px-5 border-b border-[#E5E1DC] flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold text-[#1C1C1C]">
                  Low Inventory & Workshop Replenishment Alert
                </CardTitle>
                <p className="text-xs text-[#737373]">
                  Garments with 10 units or less requiring weaver replenishment.
                </p>
              </div>
              <Badge variant="warning" size="sm">{lowStockProducts.length} Items Flagged</Badge>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] border-b border-[#E5E1DC] text-[#737373] text-[10px] uppercase">
                  <tr>
                    <th className="py-3 px-6">Product Title</th>
                    <th className="py-3 px-6">SKU</th>
                    <th className="py-3 px-6">Artisan Atelier</th>
                    <th className="py-3 px-6 text-center">Units Left</th>
                    <th className="py-3 px-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E1DC]">
                  {lowStockProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                      <td className="py-3.5 px-6 font-semibold text-[#1C1C1C]">{p.title}</td>
                      <td className="py-3.5 px-6 font-mono text-[#737373]">{p.sku}</td>
                      <td className="py-3.5 px-6 text-[#242424]">{p.supplierName || "Lahore Heritage Atelier"}</td>
                      <td className="py-3.5 px-6 font-mono font-bold text-center text-[#B84A4A]">{p.stock} pcs</td>
                      <td className="py-3.5 px-6 text-right">
                        <Badge variant={p.stock === 0 ? "error" : "warning"} size="sm">
                          {p.stock === 0 ? "Depleted" : "Low Stock"}
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

      {/* Tab 3: Suppliers & Ateliers */}
      {activeTab === "suppliers" && (
        <Card>
          <CardHeader className="py-3.5 px-5 border-b border-[#E5E1DC]">
            <CardTitle className="text-sm font-semibold text-[#1C1C1C]">
              Pakistani Artisan Ateliers & SLA Performance
            </CardTitle>
            <p className="text-xs text-[#737373] mt-0.5">
              Fulfillment accuracy, on-time courier handover, and artisan partner ratings
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] border-b border-[#E5E1DC] text-[#737373] text-[10px] uppercase">
                <tr>
                  <th className="py-3 px-6">Atelier / Workshop</th>
                  <th className="py-3 px-6">City Hub</th>
                  <th className="py-3 px-6 text-right">Gross COD Sales (PKR)</th>
                  <th className="py-3 px-6 text-right">Orders Handled</th>
                  <th className="py-3 px-6 text-right">Dispatch SLA</th>
                  <th className="py-3 px-6 text-right">Quality Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E1DC]">
                {supplierReports.map((s) => (
                  <tr key={s.name} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-[#1C1C1C]">{s.name}</td>
                    <td className="py-3.5 px-6 text-[#737373]">{s.city}</td>
                    <td className="py-3.5 px-6 text-right font-semibold text-[#8B3A4A]">{formatCurrency(s.sales)}</td>
                    <td className="py-3.5 px-6 text-right font-mono">{s.orders}</td>
                    <td className="py-3.5 px-6 text-right text-[#4F7A61] font-semibold">{s.sla}</td>
                    <td className="py-3.5 px-6 text-right font-mono font-medium text-[#1C1C1C]">{s.engagementScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Tab 4: Customers & Cities */}
      {activeTab === "customers" && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="py-3.5 px-5 border-b border-[#E5E1DC]">
              <CardTitle className="text-sm font-semibold text-[#1C1C1C]">
                Top VIP Shoppers & Patrons by Lifetime COD Spend
              </CardTitle>
              <p className="text-xs text-[#737373] mt-0.5">
                Pakistan clientele ranked by verified Cash on Delivery order value and frequency
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] border-b border-[#E5E1DC] text-[#737373] text-[10px] uppercase">
                  <tr>
                    <th className="py-3 px-6">Customer Name</th>
                    <th className="py-3 px-6">City / Region</th>
                    <th className="py-3 px-6 text-right">COD Orders Placed</th>
                    <th className="py-3 px-6 text-right">Total Lifetime Spend (PKR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E1DC]">
                  {customerMetrics.topCustomers.map((c) => (
                    <tr key={c.name} className="hover:bg-[#FAF8F5]/60 transition-colors">
                      <td className="py-3.5 px-6 font-semibold text-[#1C1C1C]">{c.name}</td>
                      <td className="py-3.5 px-6 text-[#737373] flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#8B3A4A]" />
                        {c.city}
                      </td>
                      <td className="py-3.5 px-6 text-right font-mono">{c.orders} orders</td>
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
