"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  Image as ImageIcon,
  Check,
  AlertCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { useProducts } from "@/context/ProductContext";

const CATEGORIES = [
  "Clothing",
  "Footwear",
  "Handbags",
  "Accessories",
  "Outerwear",
  "Knitwear",
];

export default function AddProductPage() {
  const router = useRouter();
  const { addProduct } = useProducts();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Clothing");
  const [price, setPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [stock, setStock] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop",
  ]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    if (!newImageUrl.startsWith("http://") && !newImageUrl.startsWith("https://")) {
      toast({
        title: "Invalid URL",
        message: "Please enter a valid HTTP or HTTPS image URL.",
        type: "error",
      });
      return;
    }
    setImages([...images, newImageUrl.trim()]);
    setNewImageUrl("");
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleFileUploadMock = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Mock file upload preview
      const objectUrl = URL.createObjectURL(file);
      setImages([...images, objectUrl]);
      toast({
        title: "Image Selected",
        message: `${file.name} ready for product gallery.`,
        type: "success",
      });
    }
  };

  const validate = () => {
    const err: Record<string, string> = {};
    if (!title.trim()) err.title = "Product name is required";
    if (!category.trim()) err.category = "Category is required";
    if (!price || Number(price) <= 0) err.price = "Price must be greater than 0";
    if (!stock || Number(stock) < 0) err.stock = "Valid stock count is required";
    if (!description.trim() || description.length < 15) {
      err.description = "Description must be at least 15 characters long";
    }
    if (images.length === 0) err.images = "At least one product image is required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast({
        title: "Validation Error",
        message: "Please correct the required fields before submitting.",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const created = addProduct({
        title: title.trim(),
        category,
        price: Number(price),
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
        stock: Number(stock),
        sku: sku.trim() || undefined,
        description: description.trim(),
        images,
        brand: "Atelier V",
        supplierId: "sup-1",
        supplierName: "Atelier V Studios",
      });

      toast({
        title: "Product Published",
        message: `"${created.title}" is now active in your workshop catalog!`,
        type: "success",
      });

      router.push("/supplier/products");
    } catch {
      toast({
        title: "Error",
        message: "Failed to publish product. Please try again.",
        type: "error",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back button and Title */}
      <div className="flex items-center gap-4">
        <Link
          href="/supplier/products"
          className="p-2 rounded-lg bg-white border border-[#E5E1DC] text-[#737373] hover:text-[#1C1C1C] hover:bg-[#FAF8F5] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1C1C1C]">
            Add New Product
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373] mb-1.5">
                Product Name <span className="text-[#8B3A4A]">*</span>
              </label>
              <Input
                placeholder="e.g. Sculptural Tailored Wool Coat"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors({ ...errors, title: "" });
                }}
                className={errors.title ? "border-[#B84A4A]" : ""}
              />
              {errors.title && (
                <p className="text-xs text-[#B84A4A] mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.title}
                </p>
              )}
            </div>

            {/* Category & SKU */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373] mb-1.5">
                  Category <span className="text-[#8B3A4A]">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E5E1DC] text-xs rounded-xl px-3.5 py-2.5 text-[#242424] focus:outline-hidden focus:border-[#8B3A4A]"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373] mb-1.5">
                  SKU Identifier <span className="text-[#737373] font-normal">(Optional)</span>
                </label>
                <Input
                  placeholder="e.g. ATV-COAT-09"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373] mb-1.5">
                Description <span className="text-[#8B3A4A]">*</span>
              </label>
              <textarea
                rows={4}
                placeholder="Describe material composition, silhouette cut, artisan detailing, and care instructions..."
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors({ ...errors, description: "" });
                }}
                className={`w-full bg-[#FAF8F5] border ${
                  errors.description ? "border-[#B84A4A]" : "border-[#E5E1DC]"
                } text-xs rounded-xl p-3 text-[#242424] focus:outline-hidden focus:border-[#8B3A4A]`}
              />
              {errors.description && (
                <p className="text-xs text-[#B84A4A] mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.description}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Inventory */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing & Workshop Inventory</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373] mb-1.5">
                  Retail Price (PKR) <span className="text-[#8B3A4A]">*</span>
                </label>
                <Input
                  type="number"
                  placeholder="240.00"
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value);
                    if (errors.price) setErrors({ ...errors, price: "" });
                  }}
                  className={errors.price ? "border-[#B84A4A]" : ""}
                />
                {errors.price && (
                  <p className="text-xs text-[#B84A4A] mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.price}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373] mb-1.5">
                  Compare At Price (PKR) <span className="text-[#737373] font-normal">(Optional)</span>
                </label>
                <Input
                  type="number"
                  placeholder="310.00"
                  value={compareAtPrice}
                  onChange={(e) => setCompareAtPrice(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373] mb-1.5">
                  Initial Stock Units <span className="text-[#8B3A4A]">*</span>
                </label>
                <Input
                  type="number"
                  placeholder="25"
                  value={stock}
                  onChange={(e) => {
                    setStock(e.target.value);
                    if (errors.stock) setErrors({ ...errors, stock: "" });
                  }}
                  className={errors.stock ? "border-[#B84A4A]" : ""}
                />
                {errors.stock && (
                  <p className="text-xs text-[#B84A4A] mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.stock}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Images & Gallery */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Product Images</CardTitle>
                <p className="text-xs text-[#737373] mt-0.5">
                  Upload high-resolution photography showcasing materials and tailoring.
                </p>
              </div>
              <span className="text-xs text-[#737373]">
                {images.length} added
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Image Preview Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {images.map((img, index) => (
                <div
                  key={index}
                  className="group relative rounded-xl border border-[#E5E1DC] overflow-hidden aspect-3/4 bg-[#FAF8F5]"
                >
                  <Image
                    src={img}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  {index === 0 && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#1C1C1C] text-white text-[9px] font-semibold tracking-wider uppercase">
                      Cover
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 hover:bg-[#8B3A4A] transition-all cursor-pointer"
                    title="Remove Image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {/* Upload Dropzone / Button */}
              <label className="border-2 border-dashed border-[#E5E1DC] hover:border-[#8B3A4A] rounded-xl flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-colors bg-[#FAF8F5]/50 aspect-3/4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUploadMock}
                  className="hidden"
                />
                <Upload className="w-6 h-6 text-[#737373] mb-2" />
                <span className="text-xs font-medium text-[#1C1C1C]">Upload File</span>
                <span className="text-[10px] text-[#737373] mt-0.5">JPG, PNG, WebP</span>
              </label>
            </div>

            {errors.images && (
              <p className="text-xs text-[#B84A4A] flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.images}
              </p>
            )}

            {/* Add via URL */}
            <div className="pt-2 border-t border-[#E5E1DC] flex gap-2">
              <Input
                placeholder="Paste public image URL (https://...)"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                leftIcon={<ImageIcon className="w-4 h-4 text-[#737373]" />}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddImage}
                disabled={!newImageUrl.trim()}
              >
                Add URL
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link href="/supplier/products">
            <Button variant="outline" size="md">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            variant="accent"
            size="md"
            isLoading={isSubmitting}
            leftIcon={<Check className="w-4 h-4" />}
          >
            Publish Product
          </Button>
        </div>
      </form>
    </div>
  );
}
