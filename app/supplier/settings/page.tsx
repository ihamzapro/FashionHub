"use client";

import React, { useState } from "react";
import {
  Store,
  MapPin,
  Truck,
  Bell,
  ShieldCheck,
  Save,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";

export default function SupplierSettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [storeName, setStoreName] = useState(user?.storeName || "Atelier V Studios");
  const [email, setEmail] = useState(user?.email || "supplier@atelierv.com");
  const [phone, setPhone] = useState(user?.phone || "+92 300 8472910");
  const [address, setAddress] = useState(user?.address?.street || "Suite 402, Heritage Craft Center, Gulberg III");
  const [city, setCity] = useState(user?.address?.city || "Lahore");
  const [country, setCountry] = useState("Pakistan");
  const [postalCode, setPostalCode] = useState(user?.address?.postalCode || "54000");
  const [leadTimeDays, setLeadTimeDays] = useState("1-2 business days");
  const [lowStockThreshold, setLowStockThreshold] = useState("10");

  const [notifyNewOrder, setNotifyNewOrder] = useState(true);
  const [notifyLowStock, setNotifyLowStock] = useState(true);
  const [notifyCourierHandover, setNotifyCourierHandover] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Settings Saved",
        message: "Your atelier preferences and dispatch parameters have been updated.",
        type: "success",
      });
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1C1C1C]">
          Atelier Settings & Preferences
        </h2>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Workshop Profile */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-[#8B3A4A]" />
              <CardTitle>Artisan Brand Profile</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373] mb-1.5">
                  Workshop Brand Name
                </label>
                <Input
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373] mb-1.5">
                  Business Inquiries Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373] mb-1.5">
                  Direct Atelier Phone
                </label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373] mb-1.5">
                  Verification Status
                </label>
                <div className="flex items-center gap-2 px-3 py-2 bg-[#FAF8F5] border border-[#E5E1DC] rounded-xl text-xs">
                  <ShieldCheck className="w-4 h-4 text-[#4F7A61]" />
                  <span className="font-semibold text-[#1C1C1C]">Verified Atelier Partner</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fulfillment & Dispatch Location */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#8B3A4A]" />
              <CardTitle>Dispatch & Warehouse Address</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373] mb-1.5">
                Street Address (Courier Pickup Location)
              </label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373] mb-1.5">
                  City
                </label>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373] mb-1.5">
                  Postal Code
                </label>
                <Input
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373] mb-1.5">
                  Country
                </label>
                <Input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fulfillment & Dispatch Controls */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#8B3A4A]" />
              <CardTitle>Fulfillment & Dispatch Controls</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373] mb-1.5">
                  Standard Dispatch SLA
                </label>
                <select
                  value={leadTimeDays}
                  onChange={(e) => setLeadTimeDays(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E5E1DC] text-xs rounded-xl px-3.5 py-2.5 text-[#242424] focus:outline-hidden focus:border-[#8B3A4A] cursor-pointer font-medium"
                >
                  <option value="Same day">Same Day Dispatch (&lt;12h)</option>
                  <option value="1-2 business days">1-2 Business Days (Standard)</option>
                  <option value="3-5 business days">3-5 Business Days (Made-to-Order)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373] mb-1.5">
                  Low-Stock Warning Threshold
                </label>
                <Input
                  type="number"
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Alerts */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#8B3A4A]" />
              <CardTitle>Notification Triggers</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl border border-[#E5E1DC] bg-[#FAF8F5] cursor-pointer">
              <div>
                <p className="text-xs font-semibold text-[#1C1C1C]">New Customer Orders</p>
                <p className="text-[11px] text-[#737373]">Receive immediate alert when a buyer places a COD order.</p>
              </div>
              <input
                type="checkbox"
                checked={notifyNewOrder}
                onChange={(e) => setNotifyNewOrder(e.target.checked)}
                className="w-4 h-4 accent-[#8B3A4A] rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-[#E5E1DC] bg-[#FAF8F5] cursor-pointer">
              <div>
                <p className="text-xs font-semibold text-[#1C1C1C]">Low Inventory Alerts</p>
                <p className="text-[11px] text-[#737373]">Notify me when any garment drops below {lowStockThreshold} units.</p>
              </div>
              <input
                type="checkbox"
                checked={notifyLowStock}
                onChange={(e) => setNotifyLowStock(e.target.checked)}
                className="w-4 h-4 accent-[#8B3A4A] rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-[#E5E1DC] bg-[#FAF8F5] cursor-pointer">
              <div>
                <p className="text-xs font-semibold text-[#1C1C1C]">Courier Delivery & Payment Confirmed</p>
                <p className="text-[11px] text-[#737373]">Receive confirmation when courier collects cash from customer.</p>
              </div>
              <input
                type="checkbox"
                checked={notifyCourierHandover}
                onChange={(e) => setNotifyCourierHandover(e.target.checked)}
                className="w-4 h-4 accent-[#8B3A4A] rounded"
              />
            </label>
          </CardContent>
        </Card>

        {/* Save button */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="submit"
            variant="accent"
            size="md"
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
}
