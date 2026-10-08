"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { mockProducts } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Plus, Search, ExternalLink, Edit } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export default function SupplierProductsPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");

  const products = mockProducts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1C1C1C]">
            Inventory & Catalog Management
          </h2>
          <p className="text-xs text-[#737373] mt-0.5">
            Monitor workshop stock, wholesale cost margins, and active marketplace listings.
          </p>
        </div>

        <Button
          variant="default"
          size="sm"
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          onClick={() =>
            toast({
              title: "Product Form",
              message: "Product creation and upload modal will connect with database in Phase 2.",
              type: "info",
            })
          }
        >
          Add New Garment
        </Button>
      </div>

      {/* Filter and Table Card */}
      <Card>
        <CardHeader className="py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full sm:max-w-sm">
              <Input
                placeholder="Search products by SKU or title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-[#737373]" />}
              />
            </div>
            <span className="text-xs text-[#737373]">
              Showing {products.length} catalog items
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#242424]">
              <thead className="bg-[#FAF8F5] border-b border-[#E5E1DC] text-[#737373] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-6">Garment</th>
                  <th className="py-3 px-6">SKU</th>
                  <th className="py-3 px-6">Category</th>
                  <th className="py-3 px-6">Stock</th>
                  <th className="py-3 px-6">Retail Price</th>
                  <th className="py-3 px-6">Margin Est.</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E1DC]">
                {products.map((prod) => (
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
                        <span className="font-medium text-[#1C1C1C] line-clamp-1 max-w-[180px]">
                          {prod.title}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-6 font-mono text-[#737373]">{prod.sku}</td>
                    <td className="py-3.5 px-6 text-[#737373]">{prod.category}</td>
                    <td className="py-3.5 px-6">
                      <span
                        className={`font-mono font-medium ${
                          prod.stock < 15 ? "text-[#B84A4A]" : "text-[#242424]"
                        }`}
                      >
                        {prod.stock} units
                      </span>
                    </td>
                    <td className="py-3.5 px-6 font-semibold text-[#1C1C1C]">
                      {formatCurrency(prod.price)}
                    </td>
                    <td className="py-3.5 px-6 text-[#4F7A61] font-medium">
                      {prod.costPrice
                        ? `${Math.round(((prod.price - prod.costPrice) / prod.price) * 100)}%`
                        : "N/A"}
                    </td>
                    <td className="py-3.5 px-6">
                      <Badge
                        variant={prod.stock > 0 ? "success" : "error"}
                        size="sm"
                      >
                        {prod.stock > 0 ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/products/${prod.id}`}
                          target="_blank"
                          className="p-1.5 text-[#737373] hover:text-[#1C1C1C] rounded hover:bg-[#F1ECE6]"
                          title="View on Storefront"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() =>
                            toast({
                              title: "Edit Garment",
                              message: `Editor for SKU ${prod.sku} prepared for Phase 2.`,
                              type: "info",
                            })
                          }
                          className="p-1.5 text-[#737373] hover:text-[#8B3A4A] rounded hover:bg-[#F1ECE6]"
                          title="Edit Garment"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
