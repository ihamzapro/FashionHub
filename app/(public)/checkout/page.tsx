"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCart, useOrders } from "@/context";
import { useToast } from "@/components/ui/Toast";
import { CheckoutForm, CheckoutFormData, OrderSummary } from "@/components/checkout";
import { Button } from "@/components/ui/Button";
import { OrderItem } from "@/lib/types";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, shippingFee, total, clearCart, isHydrated: cartHydrated } = useCart();
  const { createOrder } = useOrders();
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePlaceOrder = async (formData: CheckoutFormData) => {
    if (items.length === 0) {
      toast({
        title: "Cart Empty",
        message: "Your bag is empty. Please add items to checkout.",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Format items to OrderItem
      const orderItems: OrderItem[] = items.map((cartItem) => ({
        id: cartItem.id,
        productId: cartItem.productId,
        title: cartItem.product.title,
        price: cartItem.product.price,
        quantity: cartItem.quantity,
        image: cartItem.product.images[0] || "",
        selectedSize: cartItem.selectedSize,
        selectedColor: cartItem.selectedColor,
        sku: cartItem.product.sku,
      }));

      // Create order
      const newOrder = createOrder({
        customer: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
        },
        shippingAddress: {
          fullName: formData.fullName,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
          phone: formData.phone,
        },
        items: orderItems,
        subtotal,
        shippingFee,
        total,
      });

      // Clear cart
      clearCart();

      toast({
        title: "Order Placed (COD)",
        message: `Order #${newOrder.orderNumber} confirmed. Cash payment upon delivery.`,
        type: "success",
      });

      // Redirect to confirmation page
      router.push(`/orders/success?orderId=${newOrder.id}`);
    } catch (err) {
      console.error("Order creation failed", err);
      toast({
        title: "Error Placing Order",
        message: "An unexpected error occurred. Please try again.",
        type: "error",
      });
      setIsSubmitting(false);
    }
  };

  // Hydration guard
  if (!cartHydrated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-8 h-8 border-2 border-[#1C1C1C] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-[#737373]">Preparing checkout...</p>
      </div>
    );
  }

  // Empty cart guard
  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center py-16 bg-white border border-[#E5E1DC] rounded-2xl max-w-lg mx-auto p-8 space-y-5 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#E5E1DC] flex items-center justify-center mx-auto text-[#737373]">
            <ShoppingBag className="w-8 h-8 text-[#8B3A4A]" />
          </div>
          <div>
            <h2 className="text-xl font-editorial text-[#1C1C1C]">Your Shopping Bag is Empty</h2>
            <p className="text-xs text-[#737373] mt-1.5 max-w-sm mx-auto leading-relaxed">
              You must have at least one curated item in your shopping bag to proceed to checkout.
            </p>
          </div>
          <div className="pt-2">
            <Link href="/products">
              <Button variant="accent" size="md">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between border-b border-[#E5E1DC] pb-5">
        <nav className="flex items-center space-x-2 text-xs text-[#737373]">
          <Link href="/" className="hover:text-[#1C1C1C] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/cart" className="hover:text-[#1C1C1C] transition-colors">
            Shopping Bag
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#1C1C1C] font-medium">Checkout (COD)</span>
        </nav>

        <Link
          href="/cart"
          className="text-xs text-[#737373] hover:text-[#8B3A4A] flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Bag</span>
        </Link>
      </div>

      {/* Main Grid: Checkout Form on Left, Order Summary on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-7">
          <CheckoutForm
            onSubmit={handlePlaceOrder}
            isSubmitting={isSubmitting}
            total={total}
          />
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 sticky top-24">
          <OrderSummary
            items={items}
            subtotal={subtotal}
            shippingFee={shippingFee}
            total={total}
          />
        </div>
      </div>
    </div>
  );
}
