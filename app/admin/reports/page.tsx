"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Download, FileText } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export default function AdminReportsPage() {
  const { toast } = useToast();

  const handleExport = (reportName: string) => {
    toast({
      title: "Report Export Initiated",
      message: `${reportName} CSV export will be generated in Phase 2 via report workers.`,
      type: "info",
    });
  };

  const reports = [
    {
      title: "Monthly GMV & Take-Rate Settlements",
      period: "September 2026",
      volume: "$142,890.00",
      status: "Finalized",
      type: "Financial",
    },
    {
      title: "Supplier Net Payouts & Escrow Release",
      period: "Bi-Weekly Batch #18",
      volume: "$121,456.50",
      status: "Processing",
      type: "Settlement",
    },
    {
      title: "Global Tax, Duties & VAT Compliance",
      period: "Q3 2026 Fiscal",
      volume: "$14,289.00",
      status: "Audited",
      type: "Taxation",
    },
    {
      title: "Seller Performance & SLA Fulfillment Audit",
      period: "Past 30 Days",
      volume: "98.4% On-time",
      status: "Passed",
      type: "Compliance",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1C1C1C]">
            Financial & Compliance Reports
          </h2>
          <p className="text-xs text-[#737373] mt-0.5">
            Audit platform take rates, tax compliance ledgers, and supplier escrow disbursements.
          </p>
        </div>

        <Button
          variant="default"
          size="sm"
          leftIcon={<Download className="w-3.5 h-3.5" />}
          onClick={() => handleExport("Complete Platform Audit Pack")}
        >
          Export All Ledgers (CSV)
        </Button>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((rep) => (
          <Card key={rep.title}>
            <CardHeader className="flex flex-row items-start justify-between py-5">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8B3A4A] bg-[#8B3A4A]/10 px-2 py-0.5 rounded-full">
                  {rep.type}
                </span>
                <CardTitle className="text-base pt-1">{rep.title}</CardTitle>
                <p className="text-xs text-[#737373]">{rep.period}</p>
              </div>
              <Badge variant="success" size="sm">
                {rep.status}
              </Badge>
            </CardHeader>
            <CardContent className="pt-0 flex items-center justify-between border-t border-[#E5E1DC]/60 pt-4">
              <div>
                <p className="text-[10px] text-[#737373] uppercase tracking-wider">Reported Volume</p>
                <p className="text-lg font-bold text-[#1C1C1C]">{rep.volume}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport(rep.title)}
                leftIcon={<FileText className="w-3.5 h-3.5" />}
                className="text-xs"
              >
                Download CSV
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
