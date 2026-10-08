"use client";

import React, { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";

export interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  size?: "sm" | "md" | "lg";
  variant?: "accent" | "outline" | "icon";
  selectedSize?: string;
  selectedColor?: string;
  className?: string;
  onAdded?: () => void;
}

export function AddToCartButton({
  product,
  quantity = 1,
  size = "md",
  variant = "accent",
  selectedSize,
  selectedColor,
  className,
  onAdded,
}: AddToCartButtonProps) {
  const [isAdded, setIsAdded] = useState(false);
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock <= 0) return;

    addItem(product, quantity, selectedSize, selectedColor);
    setIsAdded(true);

    const variantDesc = [selectedSize && `Size: ${selectedSize}`, selectedColor && `Color: ${selectedColor}`]
      .filter(Boolean)
      .join(", ");

    toast({
      title: "Added to Bag",
      message: `${quantity > 1 ? `${quantity}x ` : ""}${product.title} ${variantDesc ? `(${variantDesc})` : ""} has been added to your bag.`,
      type: "success",
    });

    onAdded?.();

    setTimeout(() => {
      setIsAdded(false);
    }, 1800);
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleAddToCart}
        aria-label="Add to cart"
        disabled={product.stock <= 0}
        className={cn(
          "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed",
          isAdded
            ? "bg-[#4F7A61] text-white"
            : "bg-[#1C1C1C] text-white hover:bg-[#8B3A4A]",
          className
        )}
      >
        {isAdded ? (
          <Check className="w-4 h-4" />
        ) : (
          <ShoppingBag className="w-4 h-4" />
        )}
      </button>
    );
  }

  const sizes = {
    sm: "h-8 px-3 text-xs gap-1.5 rounded-md",
    md: "h-10 px-4 text-sm gap-2 rounded-lg",
    lg: "h-12 px-6 text-base gap-2.5 rounded-lg",
  };

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={product.stock <= 0}
      className={cn(
        "inline-flex items-center justify-center font-medium transition-all duration-200 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
        isAdded
          ? "bg-[#4F7A61] text-white"
          : variant === "accent"
          ? "bg-[#8B3A4A] text-white hover:bg-[#722F3D] shadow-xs"
          : "border border-[#E5E1DC] bg-white text-[#242424] hover:bg-[#F1ECE6]",
        sizes[size],
        className
      )}
    >
      {isAdded ? (
        <>
          <Check className="w-4 h-4 shrink-0" />
          <span>Added to Bag</span>
        </>
      ) : (
        <>
          <ShoppingBag className="w-4 h-4 shrink-0" />
          <span>{product.stock <= 0 ? "Out of Stock" : "Add to Bag"}</span>
        </>
      )}
    </button>
  );
}
