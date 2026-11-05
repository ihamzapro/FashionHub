"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  CreditCard,
  DollarSign,
  Save,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";

export default function AdminSettingsPage() {
  const { toast } = useToast();

  const [settings, setSettings] = useState({
    marketplaceCommission: "12.5",
    codEnabled: true,
    codMaxLimit: "50000",
    freeShippingThreshold: "5000",
    requireReviewApproval: true,
    maintenanceMode: false,
    supplierAutoApproval: false,
    platformSupportEmail: "concierge@fashionhub.com",
    currency: "PKR (Rs.)",
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Platform Settings Saved",
        message: "Marketplace parameters and policies have been updated successfully.",
        type: "success",
      });
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1C1C1C]">
          Platform Governance & Global Settings
        </h2>

        <Badge variant="outline" size="sm" className="border-[#4F7A61] text-[#4F7A61] bg-[#4F7A61]/10">
          Governance Active
        </Badge>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Marketplace Financials & Commission */}
        <Card>
          <CardHeader className="py-3.5 sm:py-4 px-4 sm:px-6 border-b border-[#E5E1DC]">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#8B3A4A]" />
              <CardTitle className="text-base text-[#1C1C1C]">Commission & Monetization</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <Input
              label="Standard Commission Take-Rate (%)"
              type="number"
              step="0.1"
              value={settings.marketplaceCommission}
              onChange={(e) => setSettings({ ...settings, marketplaceCommission: e.target.value })}
              helperText="Charged automatically upon order completion"
              required
            />

            <Input
              label="Complimentary Shipping Threshold (PKR)"
              type="number"
              value={settings.freeShippingThreshold}
              onChange={(e) => setSettings({ ...settings, freeShippingThreshold: e.target.value })}
              helperText="Orders exceeding this sum qualify for free delivery across Pakistan"
              required
            />

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#242424] block">Default Base Currency</label>
              <select
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white border border-[#E5E1DC] rounded-lg focus:outline-none focus:border-[#8B3A4A]"
              >
                <option value="PKR (Rs.)">PKR (Rs.) - Pakistani Rupee</option>
                <option value="USD ($)">USD ($) - United States Dollar</option>
                <option value="EUR (€)">EUR (€) - Euro</option>
                <option value="GBP (£)">GBP (£) - British Pound</option>
              </select>
              <p className="text-[11px] text-[#737373]">Primary ledger reporting currency</p>
            </div>
          </CardContent>
        </Card>

        {/* Payment & COD Rules */}
        <Card>
          <CardHeader className="py-3.5 sm:py-4 px-4 sm:px-6 border-b border-[#E5E1DC]">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#8B3A4A]" />
              <CardTitle className="text-base text-[#1C1C1C]">Payment & Settlement Rules</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-[#FAF8F5] rounded-lg border border-[#E5E1DC]">
              <div>
                <h4 className="text-xs font-semibold text-[#1C1C1C]">Enable Cash on Delivery (COD)</h4>
                <p className="text-[11px] text-[#737373]">
                  Allow customers to pay physical cash upon courier parcel handover (Trax, TCS, Leopards).
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.codEnabled}
                onChange={(e) => setSettings({ ...settings, codEnabled: e.target.checked })}
                className="w-4 h-4 rounded text-[#8B3A4A] focus:ring-[#8B3A4A]"
              />
            </div>

            {settings.codEnabled && (
              <div className="max-w-xs">
                <Input
                  label="Maximum COD Order Amount (PKR)"
                  type="number"
                  value={settings.codMaxLimit}
                  onChange={(e) => setSettings({ ...settings, codMaxLimit: e.target.value })}
                  helperText="Maximum allowed order value for courier doorstep cash collection"
                  required
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Moderation & Governance Switches */}
        <Card>
          <CardHeader className="py-3.5 sm:py-4 px-4 sm:px-6 border-b border-[#E5E1DC]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#8B3A4A]" />
              <CardTitle className="text-base text-[#1C1C1C]">Moderation & Platform Safety</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-3">
            <div className="flex items-center justify-between p-3.5 bg-[#FAF8F5] rounded-lg border border-[#E5E1DC]">
              <div>
                <h4 className="text-xs font-semibold text-[#1C1C1C]">Require Review Approval</h4>
                <p className="text-[11px] text-[#737373]">
                  All customer reviews must be explicitly approved by an administrator before appearing publicly.
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.requireReviewApproval}
                onChange={(e) => setSettings({ ...settings, requireReviewApproval: e.target.checked })}
                className="w-4 h-4 rounded text-[#8B3A4A] focus:ring-[#8B3A4A]"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-[#FAF8F5] rounded-lg border border-[#E5E1DC]">
              <div>
                <h4 className="text-xs font-semibold text-[#1C1C1C]">Supplier Auto-Approval</h4>
                <p className="text-[11px] text-[#737373]">
                  Automatically activate supplier workshops without administrative identity audit. (Disabled by default)
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.supplierAutoApproval}
                onChange={(e) => setSettings({ ...settings, supplierAutoApproval: e.target.checked })}
                className="w-4 h-4 rounded text-[#8B3A4A] focus:ring-[#8B3A4A]"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-[#FAF8F5] rounded-lg border border-[#E5E1DC]">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-semibold text-[#1C1C1C]">Maintenance Mode</h4>
                  <Badge variant="warning" size="sm">Sensitive</Badge>
                </div>
                <p className="text-[11px] text-[#737373]">
                  Temporarily lock storefront checkout while platform database migrations are running.
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                className="w-4 h-4 rounded text-[#8B3A4A] focus:ring-[#8B3A4A]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E1DC]">
          <Button
            type="submit"
            variant="default"
            size="md"
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
            className="bg-[#8B3A4A] hover:bg-[#722F3D] text-white"
          >
            Save Platform Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
