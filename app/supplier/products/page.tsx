"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Filter,
  AlertTriangle,
} from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { useProducts } from "@/context/ProductContext";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import { Product } from "@/lib/types";

export default function SupplierProductsPage() {
  const { products, deleteProduct } = useProducts();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter supplier products (sup-1 or created by supplier)
  const supplierProducts = useMemo(() => {
    return products.filter((p) => p.supplierId === "sup-1" || !p.supplierId || p.supplierId === "all");
  }, [products]);

  // Unique categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    supplierProducts.forEach((p) => set.add(p.category));
    return Array.from(set);
  }, [supplierProducts]);

  // Filtered and searched products
  const filteredProducts = useMemo(() => {
    return supplierProducts.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase());

      const matchesCat =
        selectedCategory === "all" ||
        p.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesStatus =
        selectedStatus === "all" ||
        (selectedStatus === "in-stock" && p.stock > 10) ||
        (selectedStatus === "low-stock" && p.stock > 0 && p.stock <= 10) ||
        (selectedStatus === "out-of-stock" && p.stock === 0);

      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [supplierProducts, search, selectedCategory, selectedStatus]);

  const handleDeleteConfirm = () => {
    if (!productToDelete) return;
    setIsDeleting(true);

    setTimeout(() => {
      deleteProduct(productToDelete.id);
      toast({
        title: "Product Deleted",
        message: `"${productToDelete.title}" was removed from your atelier catalog.`,
        type: "success",
      });
      setIsDeleting(false);
      setProductToDelete(null);
    }, 200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1C1C1C]">
            Product Management
          </h2>
          <p className="text-xs text-[#737373] mt-0.5">
            Manage your workshop garments, monitor inventory levels, and update listings.
          </p>
        </div>

        <Link href="/supplier/products/add">
          <Button
            variant="accent"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Product
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardHeader className="py-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="w-full md:max-w-xs">
              <Input
                placeholder="Search by title, SKU, or tag..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-[#737373]" />}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-[#737373]" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-[#FAF8F5] border border-[#E5E1DC] text-xs rounded-lg px-3 py-2 text-[#242424] focus:outline-hidden focus:border-[#8B3A4A]"
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-[#FAF8F5] border border-[#E5E1DC] text-xs rounded-lg px-3 py-2 text-[#242424] focus:outline-hidden focus:border-[#8B3A4A]"
              >
                <option value="all">All Inventory Statuses</option>
                <option value="in-stock">In Stock (&gt;10)</option>
                <option value="low-stock">Low Stock (1-10)</option>
                <option value="out-of-stock">Out of Stock (0)</option>
              </select>

              <span className="text-xs text-[#737373] ml-auto md:ml-0">
                {filteredProducts.length} items
              </span>
            </div>
          </div>
        </CardHeader>

        {/* Product Table */}
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#242424]">
              <thead className="bg-[#FAF8F5] border-b border-[#E5E1DC] text-[#737373] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-6">Product</th>
                  <th className="py-3 px-6">Category</th>
                  <th className="py-3 px-6">Price</th>
                  <th className="py-3 px-6">Stock</th>
                  <th className="py-3 px-6">Sales</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E1DC]">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#737373]">
                      <div className="max-w-xs mx-auto space-y-2">
                        <AlertTriangle className="w-6 h-6 text-[#737373] mx-auto" />
                        <p className="font-medium text-sm text-[#1C1C1C]">No products found</p>
                        <p className="text-xs text-[#737373]">
                          Try adjusting your search criteria or add a new garment to your catalog.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((prod, idx) => {
                    const salesCount = 48 + (idx * 7) % 65;
                    const isOutOfStock = prod.stock === 0;
                    const isLowStock = prod.stock > 0 && prod.stock <= 10;

                    return (
                      <tr
                        key={prod.id}
                        className="hover:bg-[#FAF8F5]/60 transition-colors group"
                      >
                        {/* Product */}
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-14 rounded-lg bg-[#F1ECE6] overflow-hidden shrink-0 border border-[#E5E1DC]">
                              <Image
                                src={prod.images?.[0] || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop"}
                                alt={prod.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0 max-w-[220px]">
                              <p className="font-semibold text-[#1C1C1C] truncate hover:text-[#8B3A4A] transition-colors">
                                {prod.title}
                              </p>
                              <p className="font-mono text-[10px] text-[#737373] truncate">
                                SKU: {prod.sku}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-6">
                          <span className="inline-block px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E5E1DC] text-[#737373] text-[11px]">
                            {prod.category}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="py-3.5 px-6 font-semibold text-[#1C1C1C]">
                          <div>
                            {formatCurrency(prod.price)}
                            {prod.compareAtPrice && (
                              <span className="block text-[10px] text-[#737373] line-through font-normal">
                                {formatCurrency(prod.compareAtPrice)}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Stock */}
                        <td className="py-3.5 px-6">
                          <span
                            className={`font-mono font-medium ${
                              isOutOfStock
                                ? "text-[#B84A4A]"
                                : isLowStock
                                ? "text-[#B78628]"
                                : "text-[#242424]"
                            }`}
                          >
                            {prod.stock} units
                          </span>
                        </td>

                        {/* Sales */}
                        <td className="py-3.5 px-6 text-[#1C1C1C] font-medium">
                          {salesCount} sold
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-6">
                          <Badge
                            variant={
                              isOutOfStock
                                ? "error"
                                : isLowStock
                                ? "warning"
                                : "success"
                            }
                            size="sm"
                          >
                            {isOutOfStock
                              ? "Out of Stock"
                              : isLowStock
                              ? "Low Stock"
                              : "In Stock"}
                          </Badge>
                        </td>

                        {/* Actions: View, Edit, Delete */}
                        <td className="py-3.5 px-6 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {/* View */}
                            <Link
                              href={`/products/${prod.id}`}
                              target="_blank"
                              className="p-1.5 text-[#737373] hover:text-[#1C1C1C] rounded-lg hover:bg-[#F1ECE6] transition-colors"
                              title="View on Storefront"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>

                            {/* Edit */}
                            <Link
                              href={`/supplier/products/${prod.id}/edit`}
                              className="p-1.5 text-[#737373] hover:text-[#8B3A4A] rounded-lg hover:bg-[#F1ECE6] transition-colors"
                              title="Edit Garment"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => setProductToDelete(prod)}
                              className="p-1.5 text-[#737373] hover:text-[#B84A4A] rounded-lg hover:bg-[#B84A4A]/10 transition-colors cursor-pointer"
                              title="Delete Garment"
                            >
                              <Trash2 className="w-4 h-4" />
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(productToDelete)}
        onClose={() => setProductToDelete(null)}
        title="Confirm Product Deletion"
        description="Are you sure you want to remove this garment from your workshop catalog?"
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setProductToDelete(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleDeleteConfirm}
              isLoading={isDeleting}
              className="bg-[#B84A4A] hover:bg-[#A33838] text-white border-transparent"
            >
              Delete Product
            </Button>
          </>
        }
      >
        {productToDelete && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-[#FAF8F5] rounded-xl border border-[#E5E1DC]">
              <div className="relative w-12 h-14 rounded-lg bg-neutral-200 overflow-hidden shrink-0">
                <Image
                  src={productToDelete.images[0] || ""}
                  alt={productToDelete.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-semibold text-sm text-[#1C1C1C]">
                  {productToDelete.title}
                </p>
                <p className="text-xs text-[#737373]">
                  SKU: {productToDelete.sku} • {formatCurrency(productToDelete.price)}
                </p>
              </div>
            </div>
            <p className="text-xs text-[#737373] leading-relaxed">
              This will unlist the item from the marketplace. Any customer orders currently in transit containing this product will not be affected.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
