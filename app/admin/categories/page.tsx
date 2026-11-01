"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Plus,
  Edit2,
  Trash2,
  Package,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { useCategories } from "@/context/CategoryContext";
import { useProducts } from "@/context/ProductContext";
import { Category } from "@/lib/types";

export default function AdminCategoriesPage() {
  const { toast } = useToast();
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const { products } = useProducts();

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editCategoryData, setEditCategoryData] = useState<Category | null>(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);

  // Add form state
  const [addForm, setAddForm] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    featured: true,
  });

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    featured: true,
  });

  // Compute live product counts per category
  const getProductCount = (categoryName: string, categorySlug: string, fallbackCount: number) => {
    const liveMatches = products.filter(
      (p) =>
        p.category.toLowerCase() === categoryName.toLowerCase() ||
        p.category.toLowerCase() === categorySlug.toLowerCase()
    );
    return liveMatches.length > 0 ? liveMatches.length : fallbackCount;
  };

  const handleOpenEdit = (cat: Category) => {
    setEditCategoryData(cat);
    setEditForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image: cat.image,
      featured: Boolean(cat.featured),
    });
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.name.trim()) {
      toast({
        title: "Name Required",
        message: "Please enter a valid department/category name.",
        type: "error",
      });
      return;
    }

    const slug = addForm.slug.trim() || addForm.name.trim().toLowerCase().replace(/\s+/g, "-");
    const image =
      addForm.image.trim() ||
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop";

    addCategory({
      name: addForm.name.trim(),
      slug,
      description: addForm.description.trim() || "Curated artisan collection.",
      image,
      productCount: 0,
      featured: addForm.featured,
    });

    toast({
      title: "Category Added",
      message: `${addForm.name} department created successfully.`,
      type: "success",
    });

    setIsAddModalOpen(false);
    setAddForm({
      name: "",
      slug: "",
      description: "",
      image: "",
      featured: true,
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCategoryData) return;

    updateCategory(editCategoryData.id, {
      name: editForm.name,
      slug: editForm.slug,
      description: editForm.description,
      image: editForm.image,
      featured: editForm.featured,
    });

    toast({
      title: "Category Updated",
      message: `${editForm.name} details saved successfully.`,
      type: "success",
    });

    setEditCategoryData(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteCategoryId) return;

    // Check if default categories
    const isCore = ["cat-clothing", "cat-shoes", "cat-accessories"].includes(deleteCategoryId);
    if (isCore) {
      toast({
        title: "Core Department Protected",
        message: "Core platform taxonomy departments cannot be removed.",
        type: "error",
      });
      setDeleteCategoryId(null);
      return;
    }

    deleteCategory(deleteCategoryId);
    toast({
      title: "Category Deleted",
      message: "The department was removed from navigation.",
      type: "info",
    });
    setDeleteCategoryId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1C1C1C]">
            Department & Category Taxonomy
          </h2>
          <p className="text-xs text-[#737373] mt-0.5">
            Organize catalog hierarchy, manage department banners, and audit product distributions.
          </p>
        </div>

        <Button
          variant="default"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#8B3A4A] hover:bg-[#722F3D] text-white shrink-0"
        >
          Add Category
        </Button>
      </div>

      {/* Categories Grid Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const liveCount = getProductCount(cat.name, cat.slug, cat.productCount);

          return (
            <Card key={cat.id} className="overflow-hidden group hover:border-[#8B3A4A]/50 transition-colors">
              <div className="relative h-44 w-full bg-[#FAF8F5] overflow-hidden">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <Badge variant="outline" size="sm" className="bg-black/40 backdrop-blur-xs text-white border-white/20 text-[10px]">
                    {cat.slug}
                  </Badge>
                  {cat.featured && (
                    <Badge variant="accent" size="sm" className="bg-[#8B3A4A] text-white text-[10px] gap-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      Featured
                    </Badge>
                  )}
                </div>

                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
                  <div>
                    <h3 className="font-editorial text-xl font-normal tracking-wide text-white">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-white/80 line-clamp-1 mt-0.5">
                      {cat.description}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono text-sm font-bold text-white bg-black/40 px-2.5 py-1 rounded-md backdrop-blur-xs">
                      {liveCount} pcs
                    </span>
                  </div>
                </div>
              </div>

              <CardContent className="p-4 flex items-center justify-between bg-white border-t border-[#E5E1DC]">
                <div className="flex items-center gap-2 text-xs text-[#737373]">
                  <Package className="w-4 h-4 text-[#8B3A4A]" />
                  <span>Catalog Depth: <strong className="text-[#1C1C1C]">{liveCount} active listings</strong></span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 text-[#737373] hover:text-[#8B3A4A] hover:bg-[#8B3A4A]/10 rounded-md transition-colors"
                    title="Edit Category"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteCategoryId(cat.id)}
                    className="p-1.5 text-[#B84A4A] hover:bg-[#B84A4A]/10 rounded-md transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Category Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Create New Department"
        >
          <form onSubmit={handleCreateCategory} className="space-y-4">
            <Input
              label="Department / Category Name"
              placeholder="e.g. Fine Jewelry"
              value={addForm.name}
              onChange={(e) => {
                const name = e.target.value;
                setAddForm({
                  ...addForm,
                  name,
                  slug: name.toLowerCase().replace(/\s+/g, "-"),
                });
              }}
              required
            />

            <Input
              label="URL Slug"
              placeholder="e.g. fine-jewelry"
              value={addForm.slug}
              onChange={(e) => setAddForm({ ...addForm, slug: e.target.value })}
              required
            />

            <Input
              label="Cover Image URL"
              placeholder="https://images.unsplash.com/..."
              value={addForm.image}
              onChange={(e) => setAddForm({ ...addForm, image: e.target.value })}
            />

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#242424] block">Description</label>
              <textarea
                rows={3}
                placeholder="Brief editorial curation note..."
                value={addForm.description}
                onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#E5E1DC] rounded-lg text-[#242424] focus:outline-none focus:border-[#8B3A4A]"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#242424]">
              <input
                type="checkbox"
                checked={addForm.featured}
                onChange={(e) => setAddForm({ ...addForm, featured: e.target.checked })}
                className="rounded text-[#8B3A4A] focus:ring-[#8B3A4A]"
              />
              <span>Feature prominently on marketplace navigation</span>
            </label>

            <div className="flex justify-end gap-2 pt-4 border-t border-[#E5E1DC]">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="default" size="sm" className="bg-[#8B3A4A] text-white">
                Create Category
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Category Modal */}
      {editCategoryData && (
        <Modal
          isOpen={Boolean(editCategoryData)}
          onClose={() => setEditCategoryData(null)}
          title={`Edit Department: ${editCategoryData.name}`}
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <Input
              label="Category Name"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              required
            />

            <Input
              label="URL Slug"
              value={editForm.slug}
              onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
              required
            />

            <Input
              label="Cover Image URL"
              value={editForm.image}
              onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
              required
            />

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#242424] block">Description</label>
              <textarea
                rows={3}
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#E5E1DC] rounded-lg text-[#242424] focus:outline-none focus:border-[#8B3A4A]"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#242424]">
              <input
                type="checkbox"
                checked={editForm.featured}
                onChange={(e) => setEditForm({ ...editForm, featured: e.target.checked })}
                className="rounded text-[#8B3A4A] focus:ring-[#8B3A4A]"
              />
              <span>Feature prominently on marketplace navigation</span>
            </label>

            <div className="flex justify-end gap-2 pt-4 border-t border-[#E5E1DC]">
              <Button type="button" variant="outline" size="sm" onClick={() => setEditCategoryData(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="default" size="sm" className="bg-[#8B3A4A] text-white">
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Category Modal */}
      {deleteCategoryId && (
        <Modal
          isOpen={Boolean(deleteCategoryId)}
          onClose={() => setDeleteCategoryId(null)}
          title="Confirm Category Deletion"
        >
          <div className="space-y-4">
            <p className="text-xs text-[#737373]">
              Are you sure you want to remove this department? Any associated pieces will be unassigned to general catalog.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setDeleteCategoryId(null)}>
                Cancel
              </Button>
              <Button variant="default" size="sm" className="bg-[#B84A4A] hover:bg-[#9B3838] text-white" onClick={handleConfirmDelete}>
                Delete Category
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
