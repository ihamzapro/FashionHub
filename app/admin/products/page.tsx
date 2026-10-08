"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { mockProducts } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Search, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export default function AdminProductsPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");

  const products = mockProducts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.supplierName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1C1C1C]">
          Marketplace Catalog Moderation
        </h2>
        <p className="text-xs text-[#737373] mt-0.5">
          Audit garment compliance, verify copyright standards, and manage platform listings.
        </p>
      </div>

      <Card>
        <CardHeader className="py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full sm:max-w-sm">
              <Input
                placeholder="Search by title or supplier..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-[#737373]" />}
              />
            </div>
            <span className="text-xs text-[#737373]">
              {products.length} products listed
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#242424]">
              <thead className="bg-[#FAF8F5] border-b border-[#E5E1DC] text-[#737373] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-6">Product</th>
                  <th className="py-3 px-6">Supplier Atelier</th>
                  <th className="py-3 px-6">Category</th>
                  <th className="py-3 px-6">Price</th>
                  <th className="py-3 px-6">Stock</th>
                  <th className="py-3 px-6">Moderation</th>
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
                        <div>
                          <p className="font-semibold text-[#1C1C1C] line-clamp-1 max-w-[200px]">
                            {prod.title}
                          </p>
                          <p className="text-[11px] font-mono text-[#737373]">{prod.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-6 text-[#242424] font-medium">{prod.supplierName}</td>
                    <td className="py-3.5 px-6 text-[#737373]">{prod.category}</td>
                    <td className="py-3.5 px-6 font-semibold text-[#1C1C1C]">
                      {formatCurrency(prod.price)}
                    </td>
                    <td className="py-3.5 px-6 font-mono text-[#737373]">{prod.stock}</td>
                    <td className="py-3.5 px-6">
                      <Badge variant="success" size="sm">
                        Approved
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            toast({
                              title: "Moderation Audit",
                              message: `${prod.title} verified according to quality standards.`,
                              type: "success",
                            })
                          }
                          className="text-[11px] h-7 px-2.5"
                        >
                          Audit
                        </Button>
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
