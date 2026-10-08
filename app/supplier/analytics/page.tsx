import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { BarChart3 } from "lucide-react";

export default function SupplierAnalyticsPage() {
  const categorySales = [
    { name: "Handbags & Totes", percentage: 42, amount: "$7,749", color: "bg-[#8B3A4A]" },
    { name: "Selvedge Denim", percentage: 28, amount: "$5,166", color: "bg-[#1C1C1C]" },
    { name: "Heavyweight Tees", percentage: 18, amount: "$3,321", color: "bg-[#737373]" },
    { name: "Accessories", percentage: 12, amount: "$2,214", color: "bg-[#4F7A61]" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1C1C1C]">
          Atelier Performance & Analytics
        </h2>
        <p className="text-xs text-[#737373] mt-0.5">
          Review sales volume, audience demand, and garment reorder rates.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card>
          <CardContent className="p-5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#737373]">
              Avg. Order Value (AOV)
            </span>
            <h3 className="text-2xl font-bold tracking-tight text-[#1C1C1C] mt-1">$284.50</h3>
            <p className="text-[11px] text-[#4F7A61] font-medium mt-1">+8.4% vs last period</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#737373]">
              Storefront Views
            </span>
            <h3 className="text-2xl font-bold tracking-tight text-[#1C1C1C] mt-1">12,840</h3>
            <p className="text-[11px] text-[#4F7A61] font-medium mt-1">+22% visitor growth</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#737373]">
              Cart Conversion Rate
            </span>
            <h3 className="text-2xl font-bold tracking-tight text-[#1C1C1C] mt-1">3.4%</h3>
            <p className="text-[11px] text-[#737373] mt-1">Top tier marketplace benchmark</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#737373]">
              Return Rate
            </span>
            <h3 className="text-2xl font-bold tracking-tight text-[#1C1C1C] mt-1">1.8%</h3>
            <p className="text-[11px] text-[#4F7A61] font-medium mt-1">Well below industry average (8%)</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown & Monthly Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sales by Category */}
        <div className="lg:col-span-6">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Sales Distribution by Category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {categorySales.map((item) => (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-[#242424]">{item.name}</span>
                    <span className="text-[#1C1C1C] font-semibold">
                      {item.amount} ({item.percentage}%)
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-2 w-full bg-[#F1ECE6] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Monthly Trend Snapshot */}
        <div className="lg:col-span-6">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Quarterly Revenue Growth</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-[#737373] leading-relaxed">
                Consistent demand driven by the Autumn / Winter capsule release. Full interactive SVG time-series charts will connect to the analytics microservice in Phase 2.
              </p>
              <div className="p-6 bg-[#FAF8F5] border border-[#E5E1DC] rounded-xl flex items-center justify-center min-h-[160px] text-center">
                <div className="space-y-2">
                  <BarChart3 className="w-8 h-8 text-[#8B3A4A] mx-auto stroke-[1.5]" />
                  <p className="text-xs font-semibold text-[#1C1C1C]">
                    Data Engine Prepared
                  </p>
                  <p className="text-[11px] text-[#737373] max-w-xs">
                    Live telemetry pipelines structured for MongoDB aggregation queries in future phases.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
