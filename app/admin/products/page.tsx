"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  ExternalLink,
  Edit2,
  Trash2,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { useProducts } from "@/context/ProductContext";
import { useCategories } from "@/context/CategoryContext";
import { Product } from "@/lib/types";

export default function AdminProductsPage() {
  const { toast } = useToast();
  const { products, updateProduct, deleteProduct } = useProducts();
  const { categories } = useCategories();

  // Search & Filters state
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [supplierFilter, setSupplierFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modals state
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    title: "",
    category: "",
    price: 0,
    stock: 0,
    description: "",
    status: "active" as "active" | "draft" | "archived",
  });

  // Extract distinct suppliers
  const distinctSuppliers = useMemo(() => {
    const list = Array.from(new Set(products.map((p) => p.supplierName || "Atelier V")));
    return list;
  }, [products]);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (categoryFilter !== "all" && p.category.toLowerCase() !== categoryFilter.toLowerCase()) {
        return false;
      }
      // Supplier filter
      if (supplierFilter !== "all" && (p.supplierName || "").toLowerCase() !== supplierFilter.toLowerCase()) {
        return false;
      }
      // Stock filter
      if (stockFilter === "low" && (p.stock <= 0 || p.stock > 10)) return false;
      if (stockFilter === "out" && p.stock > 0) return false;
      if (stockFilter === "in" && p.stock <= 10) return false;

      // Status filter (fallback to active if status undefined)
      const pStatus = p.status || "active";
      if (statusFilter !== "all" && pStatus !== statusFilter) {
        return false;
      }

      // Search filter
      if (
        search &&
        !p.title.toLowerCase().includes(search.toLowerCase()) &&
        !p.sku.toLowerCase().includes(search.toLowerCase()) &&
        !(p.supplierName || "").toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [products, categoryFilter, supplierFilter, stockFilter, statusFilter, search]);

  const handleOpenEdit = (p: Product) => {
    setEditProduct(p);
    setEditFormData({
      title: p.title,
      category: p.category,
      price: p.price,
      stock: p.stock,
      description: p.description,
      status: p.status || "active",
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProduct) return;

    updateProduct(editProduct.id, {
      title: editFormData.title,
      category: editFormData.category,
      price: Number(editFormData.price),
      stock: Number(editFormData.stock),
      description: editFormData.description,
      status: editFormData.status,
    });

    toast({
      title: "Product Updated",
      message: `${editFormData.title} has been updated in the platform catalog.`,
      type: "success",
    });
    setEditProduct(null);
  };

  const handleQuickStatusChange = (p: Product, newStatus: "active" | "draft" | "archived") => {
    updateProduct(p.id, { status: newStatus });
    toast({
      title: "Listing Status Changed",
      message: `${p.title} marked as ${newStatus}.`,
      type: "info",
    });
  };

  const handleConfirmDelete = () => {
    if (!deleteProductId) return;
    deleteProduct(deleteProductId);
    toast({
      title: "Product Removed",
      message: "The piece has been permanently deleted from the marketplace.",
      type: "info",
    });
    setDeleteProductId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1C1C1C]">
          Marketplace Catalog Moderation
        </h2>
      </div>

      {/* Filters Card */}
      <Card>
        <CardHeader className="py-4 border-b border-[#E5E1DC]">
          <div className="flex flex-col gap-4">
            {/* Top row: search + category/supplier dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Search */}
              <div className="lg:col-span-2">
                <Input
                  placeholder="Search by title, SKU, or atelier..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  leftIcon={<Search className="w-4 h-4 text-[#737373]" />}
                />
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-white border border-[#E5E1DC] rounded-lg text-[#242424] focus:outline-none focus:border-[#8B3A4A]"
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Supplier Filter */}
              <div>
                <select
                  value={supplierFilter}
                  onChange={(e) => setSupplierFilter(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-white border border-[#E5E1DC] rounded-lg text-[#242424] focus:outline-none focus:border-[#8B3A4A]"
                >
                  <option value="all">All Suppliers</option>
                  {distinctSuppliers.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stock Filter */}
              <div>
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-white border border-[#E5E1DC] rounded-lg text-[#242424] focus:outline-none focus:border-[#8B3A4A]"
                >
                  <option value="all">All Stock Levels</option>
                  <option value="in">In Stock (&gt;10)</option>
                  <option value="low">Low Stock (1-10)</option>
                  <option value="out">Out of Stock (0)</option>
                </select>
              </div>
            </div>

            {/* Bottom row: Status Pills */}
            <div className="flex items-center justify-between border-t border-[#E5E1DC]/60 pt-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-[#737373] uppercase tracking-wider">
                  Publication Status:
                </span>
                {["all", "active", "draft", "archived"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer ${
                      statusFilter === st
                        ? "bg-[#8B3A4A] text-white shadow-xs"
                        : "bg-[#FAF8F5] border border-[#E5E1DC] text-[#737373] hover:text-[#1C1C1C]"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {(search || categoryFilter !== "all" || supplierFilter !== "all" || stockFilter !== "all" || statusFilter !== "all") && (
                <button
                  onClick={() => {
                    setSearch("");
                    setCategoryFilter("all");
                    setSupplierFilter("all");
                    setStockFilter("all");
                    setStatusFilter("all");
                  }}
                  className="text-xs text-[#8B3A4A] hover:underline cursor-pointer"
                >
                  Reset all filters
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
                  <th className="py-3 px-6">Product Piece</th>
                  <th className="py-3 px-6">Supplier Atelier</th>
                  <th className="py-3 px-6">Department</th>
                  <th className="py-3 px-6">Price</th>
                  <th className="py-3 px-6">Inventory</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E1DC]">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#737373]">
                      No catalog pieces found matching the applied filter configuration.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((prod) => {
                    const currentStatus = prod.status || "active";

                    return (
                      <tr key={prod.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                        {/* Product Info */}
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
                              <p className="text-[10px] font-mono text-[#737373]">{prod.sku}</p>
                            </div>
                          </div>
                        </td>

                        {/* Supplier */}
                        <td className="py-3.5 px-6 font-medium text-[#242424]">
                          {prod.supplierName || "Atelier V"}
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-6 text-[#737373]">
                          {prod.category}
                        </td>

                        {/* Price */}
                        <td className="py-3.5 px-6 font-semibold text-[#1C1C1C]">
                          {formatCurrency(prod.price)}
                        </td>

                        {/* Stock */}
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-medium text-[#1C1C1C]">{prod.stock}</span>
                            {prod.stock <= 0 ? (
                              <Badge variant="error" size="sm">Out</Badge>
                            ) : prod.stock <= 10 ? (
                              <Badge variant="warning" size="sm">Low</Badge>
                            ) : null}
                          </div>
                        </td>

                        {/* Status with Quick Dropdown */}
                        <td className="py-3.5 px-6">
                          <select
                            value={currentStatus}
                            onChange={(e) => handleQuickStatusChange(prod, e.target.value as "active" | "draft" | "archived")}
                            className={`text-[11px] font-medium px-2 py-1 rounded-md border cursor-pointer focus:outline-none ${
                              currentStatus === "active"
                                ? "bg-[#4F7A61]/10 text-[#4F7A61] border-[#4F7A61]/30"
                                : currentStatus === "draft"
                                ? "bg-[#B78628]/10 text-[#B78628] border-[#B78628]/30"
                                : "bg-[#9E9B95]/10 text-[#737373] border-[#E5E1DC]"
                            }`}
                          >
                            <option value="active">Active</option>
                            <option value="draft">Draft</option>
                            <option value="archived">Archived</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              href={`/products/${prod.id}`}
                              target="_blank"
                              className="p-1.5 text-[#737373] hover:text-[#1C1C1C] hover:bg-[#F1ECE6] rounded-md transition-colors"
                              title="View on Storefront"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>

                            <button
                              onClick={() => handleOpenEdit(prod)}
                              className="p-1.5 text-[#737373] hover:text-[#8B3A4A] hover:bg-[#8B3A4A]/10 rounded-md transition-colors"
                              title="Edit Details"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => setDeleteProductId(prod.id)}
                              className="p-1.5 text-[#B84A4A] hover:bg-[#B84A4A]/10 rounded-md transition-colors"
                              title="Delete Listing"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Product Modal */}
      {editProduct && (
        <Modal
          isOpen={Boolean(editProduct)}
          onClose={() => setEditProduct(null)}
          title={`Edit Product: ${editProduct.title}`}
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <Input
              label="Product Title"
              value={editFormData.title}
              onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#242424] block">Category</label>
                <select
                  value={editFormData.category}
                  onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E5E1DC] rounded-lg focus:outline-none focus:border-[#8B3A4A]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#242424] block">Publication Status</label>
                <select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value as "active" | "draft" | "archived" })}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E5E1DC] rounded-lg focus:outline-none focus:border-[#8B3A4A]"
                >
                  <option value="active">Active (Visible)</option>
                  <option value="draft">Draft (Hidden)</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Price ($ USD)"
                type="number"
                min="0"
                step="0.01"
                value={editFormData.price}
                onChange={(e) => setEditFormData({ ...editFormData, price: parseFloat(e.target.value) || 0 })}
                required
              />

              <Input
                label="Stock Available"
                type="number"
                min="0"
                value={editFormData.stock}
                onChange={(e) => setEditFormData({ ...editFormData, stock: parseInt(e.target.value) || 0 })}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#242424] block">Description</label>
              <textarea
                rows={3}
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#E5E1DC] rounded-lg text-[#242424] focus:outline-none focus:border-[#8B3A4A]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-[#E5E1DC]">
              <Button type="button" variant="outline" size="sm" onClick={() => setEditProduct(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="default" size="sm" className="bg-[#8B3A4A] text-white">
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteProductId && (
        <Modal
          isOpen={Boolean(deleteProductId)}
          onClose={() => setDeleteProductId(null)}
          title="Confirm Product Deletion"
        >
          <div className="space-y-4">
            <p className="text-xs text-[#737373]">
              Are you sure you want to permanently delete this product from the marketplace? It will no longer be visible to customers and active cart entries will be purged.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setDeleteProductId(null)}>
                Cancel
              </Button>
              <Button variant="default" size="sm" className="bg-[#B84A4A] hover:bg-[#9B3838] text-white" onClick={handleConfirmDelete}>
                Delete Piece
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
