"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Trash2,
  ArrowRight,
  ShieldCheck,
  Plus,
  Minus,
  Heart,
  Truck,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  Tag,
} from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { useCart, useWishlist } from "@/context";

import { ProtectedRoute } from "@/components/auth";

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    shippingFee,
    freeShippingThreshold,
    total,
  } = useCart();

  const { addToWishlist } = useWishlist();
  const { toast } = useToast();

  // Promo code simulator
  const [promoCode, setPromoCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    setPromoSuccess("");

    const code = promoCode.trim().toUpperCase();
    if (!code) return;

    if (code === "ATELIER10" || code === "FASHIONHUB") {
      const discount = Math.round(subtotal * 0.1);
      setAppliedDiscount(discount);
      setPromoSuccess(`10% Atelier Privé discount applied (-${formatCurrency(discount)})`);
      toast({
        title: "Promo Applied",
        message: "10% privilege discount applied to your order.",
        type: "success",
      });
    } else {
      setPromoError("Invalid promotional voucher code. Try ATELIER10");
    }
  };

  const handleMoveToWishlist = (item: (typeof items)[0]) => {
    addToWishlist(item.product);
    removeItem(item.id);
    toast({
      title: "Saved to Personal Collection",
      message: `${item.product.title} has been moved to your wishlist.`,
      type: "success",
    });
  };

  const finalTotal = Math.max(0, total - appliedDiscount);
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <ProtectedRoute allowedRoles={["customer", "supplier", "admin"]}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E5E1DC] pb-6">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[#8B3A4A]">
            Curated Selection
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl text-[#1C1C1C] mt-1 font-normal">
            Shopping Bag ({items.reduce((s, i) => s + i.quantity, 0)})
          </h1>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="text-xs text-[#737373] hover:text-[#B84A4A] underline self-start sm:self-auto cursor-pointer transition-colors"
          >
            Clear Entire Bag
          </button>
        )}
      </div>

      {/* Free Delivery Incentive Bar */}
      {items.length > 0 && (
        <div className="bg-[#FAF8F5] border border-[#E5E1DC] rounded-xl p-4 sm:p-5 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-[#1C1C1C] flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#8B3A4A]" />
              {amountNeededForFreeShipping === 0 ? (
                <span className="text-[#4F7A61] font-semibold">
                  You have unlocked complimentary express delivery!
                </span>
              ) : (
                <span>
                  Add{" "}
                  <strong className="text-[#8B3A4A]">
                    {formatCurrency(amountNeededForFreeShipping)}
                  </strong>{" "}
                  more to unlock complimentary express delivery
                </span>
              )}
            </span>
            <span className="font-mono text-[11px] text-[#737373]">
              Threshold: {formatCurrency(freeShippingThreshold)}
            </span>
          </div>

          <div className="h-2 w-full bg-[#E5E1DC] rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-500 rounded-full",
                amountNeededForFreeShipping === 0 ? "bg-[#4F7A61]" : "bg-[#8B3A4A]"
              )}
              style={{ width: `${progressToFreeShipping}%` }}
            />
          </div>
        </div>
      )}

      {/* Empty Bag State */}
      {items.length === 0 ? (
        <div className="text-center py-20 bg-white border border-[#E5E1DC] rounded-2xl max-w-lg mx-auto p-8 space-y-5 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#E5E1DC] flex items-center justify-center mx-auto text-[#737373]">
            <ShoppingBag className="w-8 h-8 text-[#8B3A4A]" />
          </div>
          <div>
            <h3 className="text-lg font-editorial text-[#1C1C1C]">Your shopping bag is empty</h3>
            <p className="text-xs text-[#737373] mt-1 max-w-xs mx-auto leading-relaxed">
              Discover curated luxury apparel, tailored denim, artisanal leather goods, and refined accessories.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/products">
              <Button variant="accent" size="md">
                Explore The Collection
              </Button>
            </Link>
            <Link href="/wishlist">
              <Button variant="outline" size="md" className="border-[#1C1C1C]">
                View Wishlist
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        /* Cart Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#E5E1DC] rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-xs transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.03)]"
              >
                {/* Item Details */}
                <div className="flex items-center gap-4">
                  <Link
                    href={`/products/${item.product.id}`}
                    className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-lg overflow-hidden bg-[#F1ECE6] shrink-0 border border-[#E5E1DC]"
                  >
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.title}
                      fill
                      className="object-cover"
                    />
                  </Link>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-[#737373] font-medium">
                      {item.product.brand} • {item.product.category}
                    </span>
                    <Link
                      href={`/products/${item.product.id}`}
                      className="block text-sm font-medium text-[#242424] hover:text-[#8B3A4A] transition-colors line-clamp-1"
                    >
                      {item.product.title}
                    </Link>

                    {/* Variant specs */}
                    <div className="flex items-center gap-2 text-xs text-[#737373]">
                      {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                      {item.selectedSize && item.selectedColor && <span>•</span>}
                      {item.selectedColor && <span>Shade: {item.selectedColor}</span>}
                    </div>

                    <p className="text-xs font-semibold text-[#1C1C1C] sm:hidden pt-1">
                      {formatCurrency(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>

                {/* Modifiers & Actions */}
                <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E5E1DC]">
                  {/* Quantity controls */}
                  <div className="flex items-center border border-[#E5E1DC] rounded-lg bg-[#FAF8F5]">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 hover:text-[#8B3A4A] text-[#737373] cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-mono font-medium text-[#242424]">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 hover:text-[#8B3A4A] text-[#737373] cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <span className="hidden sm:inline text-sm font-semibold text-[#1C1C1C] min-w-[70px] text-right">
                    {formatCurrency(item.product.price * item.quantity)}
                  </span>

                  {/* Move to Wishlist */}
                  <button
                    type="button"
                    onClick={() => handleMoveToWishlist(item)}
                    className="text-[#737373] hover:text-[#8B3A4A] p-1.5 rounded-md hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                    title="Save to personal collection"
                  >
                    <Heart className="w-4 h-4" />
                  </button>

                  {/* Remove Item */}
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-[#737373] hover:text-[#B84A4A] p-1.5 rounded-md hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Bottom shopping links */}
            <div className="pt-4 flex items-center justify-between text-xs">
              <Link
                href="/products"
                className="text-[#242424] hover:text-[#8B3A4A] underline font-medium"
              >
                ← Continue Shopping
              </Link>
              <Link
                href="/wishlist"
                className="text-[#242424] hover:text-[#8B3A4A] underline font-medium"
              >
                View Saved Items →
              </Link>
            </div>
          </div>

          {/* Sticky Order Summary */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <Card className="shadow-xs">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-xs text-[#737373]">
                  <span>Subtotal</span>
                  <span className="text-[#242424] font-medium font-mono">
                    {formatCurrency(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-xs text-[#737373]">
                  <span>Estimated Express Delivery</span>
                  <span className="text-[#242424] font-medium">
                    {shippingFee === 0 ? (
                      <span className="text-[#4F7A61] font-semibold">Complimentary</span>
                    ) : (
                      formatCurrency(shippingFee)
                    )}
                  </span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-xs text-[#4F7A61] font-medium">
                    <span>Privilege Discount</span>
                    <span>-{formatCurrency(appliedDiscount)}</span>
                  </div>
                )}

                {/* Promo Code Input */}
                <div className="pt-2 border-t border-[#E5E1DC]">
                  <form onSubmit={handleApplyPromo} className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-wider text-[#737373] block">
                      Promotional Code
                    </label>
                    <div className="flex items-center gap-1.5">
                      <div className="relative flex-1">
                        <Tag className="w-3.5 h-3.5 text-[#737373] absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="e.g. ATELIER10"
                          className="w-full h-8 pl-8 pr-2 bg-[#FAF8F5] border border-[#E5E1DC] rounded-md text-xs text-[#1C1C1C] uppercase placeholder:normal-case focus:outline-none focus:border-[#8B3A4A]"
                        />
                      </div>
                      <Button type="submit" variant="outline" size="sm" className="h-8">
                        Apply
                      </Button>
                    </div>
                    {promoSuccess && (
                      <p className="text-[11px] text-[#4F7A61]">{promoSuccess}</p>
                    )}
                    {promoError && (
                      <p className="text-[11px] text-[#B84A4A]">{promoError}</p>
                    )}
                  </form>
                </div>

                <div className="pt-3 border-t border-[#E5E1DC] flex justify-between text-base font-semibold text-[#1C1C1C]">
                  <span>Total</span>
                  <span className="font-mono">{formatCurrency(finalTotal)}</span>
                </div>
              </CardContent>

              <CardFooter className="flex-col gap-3">
                <Link href="/checkout" className="w-full block">
                  <Button
                    variant="accent"
                    size="lg"
                    className="w-full gap-2 shadow-md cursor-pointer"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>

                <div className="pt-2 space-y-2 text-[11px] text-[#737373] border-t border-[#E5E1DC] w-full">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#4F7A61]" />
                    <span>Cash on Delivery (COD) payment upon doorstep arrival</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-3.5 h-3.5 text-[#8B3A4A]" />
                    <span>Complimentary 30-day doorstep return pickup</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#8B3A4A]" />
                    <span>Hand-inspected before final dispatch</span>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
    </ProtectedRoute>
  );
}
