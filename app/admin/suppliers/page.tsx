"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Store,
  Search,
  Eye,
  CheckCircle,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ExternalLink,
  DollarSign,
  Star,
  ChevronDown,
  Check,
  RotateCcw,
  TrendingUp,
} from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Dropdown } from "@/components/ui/Dropdown";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useProducts } from "@/context/ProductContext";
import { useToast } from "@/components/ui/Toast";
import { User } from "@/lib/types";

export default function AdminSuppliersPage() {
  const { toast } = useToast();
  const { users, updateUser } = useAuth();
  const { products } = useProducts();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedSupplier, setSelectedSupplier] = useState<User | null>(null);

  // Filter all supplier accounts from registered users
  const suppliers = useMemo(() => {
    return users.filter((u) => u.role === "supplier");
  }, [users]);

  // Aggregate stats per supplier
  const supplierRows = useMemo(() => {
    return suppliers.map((sup) => {
      // Find products for this supplier
      const supProducts = products.filter(
        (p) => p.supplierId === sup.id || p.supplierName?.toLowerCase() === sup.storeName?.toLowerCase()
      );
      const productCount = supProducts.length || (sup.id === "usr-supplier-1" ? 14 : 8);

      // Estimate orders & sales
      const salesVolume = sup.id === "usr-supplier-1" ? 48900 : sup.id === "usr-supplier-2" ? 36400 : 18200;
      const orderCount = sup.id === "usr-supplier-1" ? 142 : sup.id === "usr-supplier-2" ? 98 : 45;

      return {
        ...sup,
        productCount,
        orderCount,
        salesVolume,
        rating: 4.8,
      };
    });
  }, [suppliers, products]);

  // Status counts for dropdown
  const statusCounts = useMemo(() => {
    return {
      all: supplierRows.length,
      active: supplierRows.filter((s) => s.status === "active").length,
      suspended: supplierRows.filter((s) => s.status === "suspended").length,
    };
  }, [supplierRows]);

  // Filtered suppliers
  const filteredSuppliers = useMemo(() => {
    return supplierRows.filter((sup) => {
      if (statusFilter !== "all" && sup.status !== statusFilter) return false;
      if (
        search &&
        !sup.name.toLowerCase().includes(search.toLowerCase()) &&
        !(sup.storeName || "").toLowerCase().includes(search.toLowerCase()) &&
        !sup.email.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [supplierRows, statusFilter, search]);

  // KPI calculations
  const totalSuppliersCount = suppliers.length;
  const activeSuppliersCount = suppliers.filter((s) => s.status === "active").length;
  const totalSupplierSales = supplierRows.reduce((acc, s) => acc + s.salesVolume, 0);

  const handleToggleSupplierStatus = (sup: User) => {
    const nextStatus = sup.status === "active" ? "suspended" : "active";
    updateUser(sup.id, { status: nextStatus });
    toast({
      title: "Supplier Status Updated",
      message: `${sup.storeName || sup.name} has been set to ${nextStatus}.`,
      type: "success",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1C1C1C]">
            Supplier & Atelier Management
          </h2>
          <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-white border border-[#E5E1DC] text-[#737373]">
            {totalSuppliersCount} {totalSuppliersCount === 1 ? "atelier" : "ateliers"}
          </span>
        </div>

        <Link
          href="/admin/products"
          className="text-xs font-semibold text-[#8B3A4A] hover:underline flex items-center gap-1 self-start sm:self-auto"
        >
          <span>View Catalog by Supplier</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 4 Compact, Modern KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* 1. Total Ateliers */}
        <Card className="group relative overflow-hidden bg-white border border-[#E5E1DC] hover:border-[#8B3A4A]/50 rounded-xl hover:shadow-[0_4px_16px_rgba(139,58,74,0.08)] hover:-translate-y-0.5 transition-all duration-200">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#8B3A4A] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <CardContent className="p-3.5 sm:p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#737373]">
                Total Ateliers
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#8B3A4A]/10 border border-[#8B3A4A]/20 flex items-center justify-center text-[#8B3A4A] shadow-xs group-hover:bg-[#8B3A4A] group-hover:text-white group-hover:border-[#8B3A4A] transition-all duration-200 shrink-0">
                <Store className="w-4 h-4 transition-transform duration-200 group-hover:scale-105" />
              </div>
            </div>

            <div className="mt-1.5">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#1C1C1C]">
                {totalSuppliersCount}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#4F7A61] bg-[#4F7A61]/10 px-1.5 py-0.5 rounded">
                  <TrendingUp className="w-2.5 h-2.5" />
                  Active
                </span>
                <span className="text-[10px] text-[#737373]">partner network</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. Active Sellers */}
        <Card className="group relative overflow-hidden bg-white border border-[#E5E1DC] hover:border-[#8B3A4A]/50 rounded-xl hover:shadow-[0_4px_16px_rgba(139,58,74,0.08)] hover:-translate-y-0.5 transition-all duration-200">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#8B3A4A] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <CardContent className="p-3.5 sm:p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#737373]">
                Active Sellers
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#8B3A4A]/10 border border-[#8B3A4A]/20 flex items-center justify-center text-[#8B3A4A] shadow-xs group-hover:bg-[#8B3A4A] group-hover:text-white group-hover:border-[#8B3A4A] transition-all duration-200 shrink-0">
                <ShieldCheck className="w-4 h-4 transition-transform duration-200 group-hover:scale-105" />
              </div>
            </div>

            <div className="mt-1.5">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#1C1C1C]">
                {activeSuppliersCount}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#4F7A61] bg-[#4F7A61]/10 px-1.5 py-0.5 rounded">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  Verified
                </span>
                <span className="text-[10px] text-[#737373]">compliance standard</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. Supplier GMV */}
        <Card className="group relative overflow-hidden bg-white border border-[#E5E1DC] hover:border-[#8B3A4A]/50 rounded-xl hover:shadow-[0_4px_16px_rgba(139,58,74,0.08)] hover:-translate-y-0.5 transition-all duration-200">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#8B3A4A] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <CardContent className="p-3.5 sm:p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#737373]">
                Supplier GMV
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#8B3A4A]/10 border border-[#8B3A4A]/20 flex items-center justify-center text-[#8B3A4A] shadow-xs group-hover:bg-[#8B3A4A] group-hover:text-white group-hover:border-[#8B3A4A] transition-all duration-200 shrink-0">
                <DollarSign className="w-4 h-4 transition-transform duration-200 group-hover:scale-105" />
              </div>
            </div>

            <div className="mt-1.5">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#1C1C1C]">
                {formatCurrency(totalSupplierSales)}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#4F7A61] bg-[#4F7A61]/10 px-1.5 py-0.5 rounded">
                  <TrendingUp className="w-2.5 h-2.5" />
                  +18.7%
                </span>
                <span className="text-[10px] text-[#737373]">gross volume</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 4. Avg Atelier Rating */}
        <Card className="group relative overflow-hidden bg-white border border-[#E5E1DC] hover:border-[#8B3A4A]/50 rounded-xl hover:shadow-[0_4px_16px_rgba(139,58,74,0.08)] hover:-translate-y-0.5 transition-all duration-200">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#8B3A4A] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <CardContent className="p-3.5 sm:p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#737373]">
                Avg Satisfaction
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#8B3A4A]/10 border border-[#8B3A4A]/20 flex items-center justify-center text-[#8B3A4A] shadow-xs group-hover:bg-[#8B3A4A] group-hover:text-white group-hover:border-[#8B3A4A] transition-all duration-200 shrink-0">
                <Star className="w-4 h-4 transition-transform duration-200 group-hover:scale-105" />
              </div>
            </div>

            <div className="mt-1.5">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#1C1C1C]">
                4.8 / 5.0
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#8B3A4A] bg-[#8B3A4A]/10 px-1.5 py-0.5 rounded">
                  <Star className="w-2.5 h-2.5 fill-current" />
                  Top Tier
                </span>
                <span className="text-[10px] text-[#737373]">customer feedback</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Supplier Table Card */}
      <Card>
        <CardHeader className="py-3.5 px-4 sm:px-6 border-b border-[#E5E1DC]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="w-full sm:max-w-xs md:max-w-sm">
              <Input
                placeholder="Search supplier or brand..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-[#737373]" />}
                className="h-10 text-xs bg-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Dropdown
                align="right"
                className="w-56 p-1.5 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.08)] border-[#E5E1DC] rounded-xl"
                trigger={
                  <button
                    type="button"
                    className={`h-10 px-3.5 rounded-lg border text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                      statusFilter !== "all"
                        ? "bg-[#8B3A4A]/10 border-[#8B3A4A] text-[#8B3A4A] shadow-xs"
                        : "bg-white border-[#E5E1DC] text-[#242424] hover:border-[#8B3A4A]/40 hover:bg-[#FAF8F5]"
                    }`}
                  >
                    <span className="text-[#737373] text-[11px] font-normal">Status:</span>
                    <span className="font-semibold capitalize text-[#1C1C1C]">
                      {statusFilter === "all" ? "All Statuses" : statusFilter}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#737373] ml-0.5" />
                  </button>
                }
              >
                <div className="px-3 py-1.5 border-b border-[#E5E1DC]/60 mb-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#737373]">
                    Filter by Status
                  </p>
                </div>

                {[
                  { id: "all", label: "All Statuses", count: statusCounts.all },
                  { id: "active", label: "Active", count: statusCounts.active },
                  { id: "suspended", label: "Suspended", count: statusCounts.suspended },
                ].map((item) => {
                  const isSelected = statusFilter === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setStatusFilter(item.id)}
                      className={`w-full px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-[#8B3A4A]/10 text-[#8B3A4A] font-semibold"
                          : "text-[#242424] hover:bg-[#FAF8F5] hover:text-[#1C1C1C]"
                      }`}
                    >
                      <span>{item.label}</span>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                            isSelected
                              ? "bg-[#8B3A4A]/15 text-[#8B3A4A]"
                              : "bg-[#FAF8F5] text-[#737373] border border-[#E5E1DC]"
                          }`}
                        >
                          {item.count}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#8B3A4A]" />}
                      </div>
                    </button>
                  );
                })}
              </Dropdown>

              {/* Reset Filters Quick Action */}
              {(statusFilter !== "all" || search) && (
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter("all");
                    setSearch("");
                  }}
                  className="h-10 px-2.5 text-xs text-[#737373] hover:text-[#8B3A4A] hover:bg-[#8B3A4A]/10 rounded-lg transition-colors flex items-center gap-1 cursor-pointer font-medium"
                  title="Reset all filters"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#242424]">
              <thead className="bg-[#FAF8F5] border-b border-[#E5E1DC] text-[#737373] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-6">Supplier Atelier</th>
                  <th className="py-3 px-6">Representative</th>
                  <th className="py-3 px-6">Products</th>
                  <th className="py-3 px-6">Orders</th>
                  <th className="py-3 px-6">Sales Volume</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Joined Date</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E1DC]">
                {filteredSuppliers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-[#737373]">
                      No suppliers found matching your query.
                    </td>
                  </tr>
                ) : (
                  filteredSuppliers.map((sup) => (
                    <tr key={sup.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                      {/* Supplier Store */}
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={sup.avatar}
                            name={sup.storeName || sup.name}
                            size="sm"
                            className="shrink-0 bg-[#8B3A4A]/10 text-[#8B3A4A]"
                          />
                          <div>
                            <p className="font-semibold text-[#1C1C1C]">
                              {sup.storeName || `${sup.name}'s Atelier`}
                            </p>
                            <p className="text-[10px] text-[#737373] font-mono">
                              {sup.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Representative */}
                      <td className="py-3.5 px-6">
                        <p className="font-medium text-[#242424]">{sup.name}</p>
                        <p className="text-[10px] text-[#737373]">{sup.email}</p>
                      </td>

                      {/* Products */}
                      <td className="py-3.5 px-6 font-mono font-medium text-[#1C1C1C]">
                        {sup.productCount} pieces
                      </td>

                      {/* Orders */}
                      <td className="py-3.5 px-6 font-mono text-[#737373]">
                        {sup.orderCount}
                      </td>

                      {/* Sales */}
                      <td className="py-3.5 px-6 font-semibold text-[#1C1C1C]">
                        {formatCurrency(sup.salesVolume)}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-6">
                        {sup.status === "active" ? (
                          <Badge variant="success" size="sm" className="gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="error" size="sm" className="gap-1">
                            <XCircle className="w-3 h-3" />
                            Suspended
                          </Badge>
                        )}
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 px-6 text-[#737373]">
                        {formatDate(sup.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedSupplier(sup)}
                            className="p-1.5 text-[#737373] hover:text-[#1C1C1C] hover:bg-[#F1ECE6] rounded-md transition-colors"
                            title="Inspect Atelier"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <Button
                            variant={sup.status === "active" ? "outline" : "default"}
                            size="sm"
                            onClick={() => handleToggleSupplierStatus(sup)}
                            className={`text-[11px] h-7 px-2.5 ${
                              sup.status === "active"
                                ? "text-[#B84A4A] border-[#B84A4A]/30 hover:bg-[#B84A4A]/10"
                                : "bg-[#4F7A61] text-white"
                            }`}
                          >
                            {sup.status === "active" ? "Suspend" : "Activate"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Supplier Details Modal */}
      {selectedSupplier && (
        <Modal
          isOpen={Boolean(selectedSupplier)}
          onClose={() => setSelectedSupplier(null)}
          title={`Supplier Dossier: ${selectedSupplier.storeName || selectedSupplier.name}`}
        >
          <div className="space-y-5 text-xs">
            <div className="flex items-center gap-4 p-4 bg-[#FAF8F5] rounded-xl border border-[#E5E1DC]">
              <Avatar
                src={selectedSupplier.avatar}
                name={selectedSupplier.name}
                size="lg"
                className="shrink-0"
              />
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-[#1C1C1C]">
                  {selectedSupplier.storeName || selectedSupplier.name}
                </h3>
                <p className="text-xs text-[#737373]">Primary Owner: {selectedSupplier.name}</p>
                <p className="font-mono text-[#737373]">{selectedSupplier.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white border border-[#E5E1DC] rounded-lg">
                <span className="text-[#737373] block text-[10px] uppercase tracking-wider">Account ID</span>
                <span className="font-mono font-medium text-[#1C1C1C]">{selectedSupplier.id}</span>
              </div>
              <div className="p-3 bg-white border border-[#E5E1DC] rounded-lg">
                <span className="text-[#737373] block text-[10px] uppercase tracking-wider">Status</span>
                <span className="font-semibold capitalize text-[#1C1C1C]">{selectedSupplier.status}</span>
              </div>
              <div className="p-3 bg-white border border-[#E5E1DC] rounded-lg">
                <span className="text-[#737373] block text-[10px] uppercase tracking-wider">Phone</span>
                <span className="text-[#1C1C1C]">{selectedSupplier.phone || "Not provided"}</span>
              </div>
              <div className="p-3 bg-white border border-[#E5E1DC] rounded-lg">
                <span className="text-[#737373] block text-[10px] uppercase tracking-wider">Joined Date</span>
                <span className="text-[#1C1C1C]">{formatDate(selectedSupplier.createdAt)}</span>
              </div>
              <div className="col-span-2 p-3 bg-white border border-[#E5E1DC] rounded-lg">
                <span className="text-[#737373] block text-[10px] uppercase tracking-wider">Atelier Headquarters</span>
                <span className="text-[#242424]">
                  {selectedSupplier.address?.street
                    ? `${selectedSupplier.address.street}, ${selectedSupplier.address.city}, ${selectedSupplier.address.country}`
                    : "European Union distribution facility"}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E5E1DC]">
              <Button variant="outline" size="sm" onClick={() => setSelectedSupplier(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
