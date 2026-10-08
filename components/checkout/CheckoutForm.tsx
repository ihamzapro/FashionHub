"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Banknote, ShieldCheck, Truck, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => Promise<void> | void;
  isSubmitting: boolean;
  total: number;
}

export function CheckoutForm({ onSubmit, isSubmitting }: CheckoutFormProps) {
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof CheckoutFormData, boolean>>>({});

  const validateField = (field: keyof CheckoutFormData, value: string): string => {
    const trimmed = value.trim();
    switch (field) {
      case "fullName":
        if (!trimmed) return "Full Name is required";
        if (trimmed.length < 2) return "Name must be at least 2 characters";
        return "";
      case "email":
        if (!trimmed) return "Email address is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
          return "Please enter a valid email address (e.g. name@example.com)";
        }
        return "";
      case "phone":
        if (!trimmed) return "Phone number is required";
        if (!/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/.test(trimmed.replace(/\s+/g, ""))) {
          return "Please enter a valid phone number (at least 7 digits)";
        }
        return "";
      case "street":
        if (!trimmed) return "Street address is required";
        if (trimmed.length < 4) return "Please provide a complete address";
        return "";
      case "city":
        if (!trimmed) return "City is required";
        return "";
      case "state":
        if (!trimmed) return "State or Province is required";
        return "";
      case "postalCode":
        if (!trimmed) return "Postal code is required";
        if (trimmed.length < 3) return "Please enter a valid postal code";
        return "";
      case "country":
        if (!trimmed) return "Country is required";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const errorMsg = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: errorMsg }));
    }
  };

  const handleBlur = (field: keyof CheckoutFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errorMsg = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: errorMsg }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: Partial<Record<keyof CheckoutFormData, string>> = {};
    const newTouched: Partial<Record<keyof CheckoutFormData, boolean>> = {};

    let hasErrors = false;
    (Object.keys(formData) as Array<keyof CheckoutFormData>).forEach((key) => {
      newTouched[key] = true;
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        hasErrors = true;
      }
    });

    setTouched(newTouched);
    setErrors(newErrors);

    if (hasErrors) {
      // Find first error field and focus
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      {/* 1. Customer Information Section */}
      <div className="bg-white border border-[#E5E1DC] rounded-xl p-6 sm:p-7 space-y-5 shadow-xs">
        <div className="border-b border-[#E5E1DC]/80 pb-3">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#8B3A4A]">
            Step 1 of 2
          </span>
          <h2 className="font-editorial text-xl sm:text-2xl text-[#1C1C1C] font-normal mt-0.5">
            Customer Information
          </h2>
          <p className="text-xs text-[#737373] mt-1">
            We will use these details to dispatch courier updates and order verification.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2 space-y-1">
            <Input
              label="Full Name *"
              placeholder="e.g. Elena Rostova"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              onBlur={() => handleBlur("fullName")}
              error={touched.fullName ? errors.fullName : undefined}
              required
            />
          </div>

          <div className="space-y-1">
            <Input
              label="Email Address *"
              type="email"
              placeholder="elena.rostova@example.com"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              error={touched.email ? errors.email : undefined}
              required
            />
          </div>

          <div className="space-y-1">
            <Input
              label="Phone Number *"
              type="tel"
              placeholder="+1 (555) 234-5678"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              onBlur={() => handleBlur("phone")}
              error={touched.phone ? errors.phone : undefined}
              required
            />
          </div>
        </div>
      </div>

      {/* 2. Delivery Address Section */}
      <div className="bg-white border border-[#E5E1DC] rounded-xl p-6 sm:p-7 space-y-5 shadow-xs">
        <div className="border-b border-[#E5E1DC]/80 pb-3">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#8B3A4A]">
            Step 2 of 2
          </span>
          <h2 className="font-editorial text-xl sm:text-2xl text-[#1C1C1C] font-normal mt-0.5">
            Delivery Address
          </h2>
          <p className="text-xs text-[#737373] mt-1">
            Please provide your physical street destination for doorstep courier delivery.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <Input
              label="Street Address *"
              placeholder="e.g. 742 Evergreen Terrace, Apt 4B"
              value={formData.street}
              onChange={(e) => handleChange("street", e.target.value)}
              onBlur={() => handleBlur("street")}
              error={touched.street ? errors.street : undefined}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Input
                label="City *"
                placeholder="New York"
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
                onBlur={() => handleBlur("city")}
                error={touched.city ? errors.city : undefined}
                required
              />
            </div>

            <div className="space-y-1">
              <Input
                label="State / Province *"
                placeholder="NY"
                value={formData.state}
                onChange={(e) => handleChange("state", e.target.value)}
                onBlur={() => handleBlur("state")}
                error={touched.state ? errors.state : undefined}
                required
              />
            </div>

            <div className="space-y-1">
              <Input
                label="Postal Code *"
                placeholder="10001"
                value={formData.postalCode}
                onChange={(e) => handleChange("postalCode", e.target.value)}
                onBlur={() => handleBlur("postalCode")}
                error={touched.postalCode ? errors.postalCode : undefined}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-[#242424] block">
              Country *
            </label>
            <select
              value={formData.country}
              onChange={(e) => handleChange("country", e.target.value)}
              onBlur={() => handleBlur("country")}
              className={cn(
                "w-full h-10 px-3 text-xs bg-white border border-[#E5E1DC] rounded-lg text-[#242424] focus:outline-none focus:border-[#8B3A4A] focus:ring-1 focus:ring-[#8B3A4A]",
                touched.country && errors.country && "border-[#B84A4A] focus:border-[#B84A4A]"
              )}
            >
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="France">France</option>
              <option value="Germany">Germany</option>
              <option value="Japan">Japan</option>
              <option value="Australia">Australia</option>
              <option value="Pakistan">Pakistan</option>
              <option value="United Arab Emirates">United Arab Emirates</option>
            </select>
            {touched.country && errors.country && (
              <p className="text-[11px] text-[#B84A4A] flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.country}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 3. Payment Method Section (Cash on Delivery ONLY) */}
      <div className="bg-white border border-[#E5E1DC] rounded-xl p-6 sm:p-7 space-y-4 shadow-xs">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#4F7A61]">
            Payment Method
          </span>
          <h2 className="font-editorial text-xl sm:text-2xl text-[#1C1C1C] font-normal mt-0.5">
            Cash on Delivery (COD)
          </h2>
        </div>

        <div className="p-4 bg-[#FAF8F5] border-2 border-[#1C1C1C] rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-[#1C1C1C] text-white flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-white" />
              </div>
              <span className="text-sm font-semibold text-[#1C1C1C] flex items-center gap-2">
                <Banknote className="w-4 h-4 text-[#4F7A61]" />
                Cash on Delivery (COD)
              </span>
            </div>
            <span className="text-[10px] font-medium bg-[#4F7A61]/10 text-[#4F7A61] px-2 py-0.5 rounded-full border border-[#4F7A61]/20">
              Only Option
            </span>
          </div>
          <p className="text-xs text-[#737373] pl-7.5 leading-relaxed font-light">
            Pay in cash when your order is delivered. Please keep the exact cash amount ready for the delivery courier upon doorstep arrival.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#737373] border-t border-[#E5E1DC]/80">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#4F7A61]" />
            <span>Multi-role atelier inspection & verified dispatch</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-[#8B3A4A]" />
            <span>Doorstep package delivery</span>
          </span>
        </div>
      </div>

      {/* Place Order Button */}
      <Button
        type="submit"
        variant="accent"
        size="lg"
        disabled={isSubmitting}
        className="w-full text-base py-6 shadow-md hover:shadow-lg cursor-pointer transition-all"
      >
        {isSubmitting ? "Generating Order..." : "Place Order — COD"}
      </Button>
    </form>
  );
}
