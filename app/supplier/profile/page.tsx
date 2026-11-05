"use client";

import React, { useState, useRef } from "react";
import {
  Store,
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Lock,
  ShieldCheck,
  CheckCircle2,
  Save,
  Package,
  Truck,
  Star,
  Banknote,
  Upload,
  Camera,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/context/AuthContext";
import { useProducts } from "@/context/ProductContext";
import { useOrders } from "@/context/OrderContext";
import { useToast } from "@/components/ui/Toast";

type ProfileTab = "identity" | "dispatch" | "security";

export default function SupplierProfilePage() {
  const { user, updateProfile, updateAddress, changePassword } = useAuth();
  const { products } = useProducts();
  const { orders } = useOrders();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<ProfileTab>("identity");

  // Workshop & Personal Identity State
  const [storeName, setStoreName] = useState(user?.storeName || "Atelier V Studios");
  const [artisanName, setArtisanName] = useState(user?.name || "Julien Mercer");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [phone, setPhone] = useState(user?.phone || "+92 300 8472910");
  const [bio, setBio] = useState(
    user?.bio ||
      "Master artisans specializing in handcrafted luxury outerwear, heritage selvedge textiles, and bespoke tailoring."
  );
  const [specialty, setSpecialty] = useState("Fine Tailoring & Selvedge Outerwear");
  const [savingIdentity, setSavingIdentity] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File Type",
        message: "Please choose an image file (PNG, JPG, WebP).",
        type: "error",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        message: "Image must be under 5MB.",
        type: "error",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatar(reader.result);
        toast({
          title: "Photo Loaded",
          message: `${file.name} ready. Click "Save Workshop Profile" to apply.`,
          type: "success",
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Workshop Dispatch & Courier Pickup Address State (Pakistan defaults)
  const [street, setStreet] = useState(user?.address?.street || "Suite 402, Heritage Craft Center, Gulberg III");
  const [city, setCity] = useState(user?.address?.city || "Lahore");
  const [state, setState] = useState(user?.address?.state || "Punjab");
  const [postalCode, setPostalCode] = useState(user?.address?.postalCode || "54000");
  const [courierPartner, setCourierPartner] = useState("TCS Express (COD Priority)");
  const [savingDispatch, setSavingDispatch] = useState(false);

  // Security & Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Supplier Metrics
  const supplierProductsCount = products.filter(
    (p) => p.supplierId === "sup-1" || !p.supplierId || p.supplierId === "all"
  ).length;

  const handleSaveIdentity = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingIdentity(true);

    const res = await updateProfile({
      name: artisanName,
      avatar,
      storeName,
      phone,
      bio,
    });

    setSavingIdentity(false);
    if (res.success) {
      toast({
        title: "Atelier Profile Saved",
        message: "Your workshop details and contact info have been updated.",
        type: "success",
      });
    } else {
      toast({
        title: "Update Failed",
        message: res.error || "Could not save atelier profile.",
        type: "error",
      });
    }
  };

  const handleSaveDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingDispatch(true);

    const res = await updateAddress({
      street,
      city,
      state,
      postalCode,
      country: "Pakistan",
    });

    setSavingDispatch(false);
    if (res.success) {
      toast({
        title: "Dispatch Hub Updated",
        message: "Your courier pickup and return origin have been saved.",
        type: "success",
      });
    } else {
      toast({
        title: "Failed to Save Hub",
        message: res.error || "Please verify address fields.",
        type: "error",
      });
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (!currentPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setSavingPassword(true);
    const res = await changePassword(currentPassword, newPassword);
    setSavingPassword(false);

    if (res.success) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast({
        title: "Credentials Updated",
        message: "Your workshop login password has been changed securely.",
        type: "success",
      });
    } else {
      setPasswordError(res.error || "Failed to update password.");
      toast({
        title: "Password Update Failed",
        message: res.error || "Current password may be incorrect.",
        type: "error",
      });
    }
  };

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Clean Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E5E1DC]/60">
        <div className="flex items-center gap-2.5">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#1C1C1C]">
            Artisan Workshop Profile
          </h2>
          <Badge
            variant="outline"
            size="sm"
            className="border-[#8B3A4A]/30 text-[#8B3A4A] bg-[#8B3A4A]/5 text-[10px] px-2 py-0.5 font-medium"
          >
            Verified Atelier
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#737373] bg-white border border-[#E5E1DC] px-2.5 py-1 rounded-lg shadow-2xs">
            ID: <strong className="text-[#1C1C1C]">{user?.id || "sup-1"}</strong>
          </span>
          <Badge variant="success" size="sm" className="gap-1 py-1 px-2.5 text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4F7A61] animate-pulse" />
            Active Merchant
          </Badge>
        </div>
      </div>

      {/* Atelier Hero Showcase Card */}
      <Card className="overflow-hidden border border-[#E5E1DC] bg-white shadow-xs">
        <div className="p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4">
            <Avatar
              src={avatar || user?.avatar}
              name={storeName || artisanName}
              size="2xl"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-white shadow-xs shrink-0"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1C1C1C]">
                  {storeName}
                </h3>
                <span className="text-xs text-[#737373] hidden sm:inline">•</span>
                <span className="text-xs font-medium text-[#737373]">
                  Lead Artisan: <strong className="text-[#1C1C1C]">{artisanName}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#737373] flex-wrap">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-[#8B3A4A]" />
                  <span>{user?.email || "supplier@atelierv.com"}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#8B3A4A]" />
                  <span>{city}, Pakistan</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-[#4F7A61] font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>100% Cash on Delivery Verified</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Badges */}
          <div className="grid grid-cols-3 gap-2 w-full md:w-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#E5E1DC]">
            <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E1DC] text-center">
              <div className="flex items-center justify-center gap-1 text-[#737373] mb-0.5">
                <Package className="w-3 h-3 text-[#8B3A4A]" />
                <span className="text-[10px] uppercase tracking-wider font-semibold">Catalog</span>
              </div>
              <p className="text-base font-bold text-[#1C1C1C]">{supplierProductsCount || 18}</p>
            </div>

            <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E1DC] text-center">
              <div className="flex items-center justify-center gap-1 text-[#737373] mb-0.5">
                <Banknote className="w-3 h-3 text-[#4F7A61]" />
                <span className="text-[10px] uppercase tracking-wider font-semibold">Orders</span>
              </div>
              <p className="text-base font-bold text-[#1C1C1C]">{orders.length || 386}</p>
            </div>

            <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E1DC] text-center">
              <div className="flex items-center justify-center gap-1 text-[#737373] mb-0.5">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span className="text-[10px] uppercase tracking-wider font-semibold">Rating</span>
              </div>
              <p className="text-base font-bold text-[#1C1C1C]">4.9</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Layout: Tab Buttons & Form Panes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Side Tab Navigation */}
        <aside className="lg:col-span-4 bg-white border border-[#E5E1DC] rounded-xl p-2 shadow-xs space-y-1">
          <button
            type="button"
            onClick={() => setActiveTab("identity")}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-xs font-medium transition-all cursor-pointer text-left ${
              activeTab === "identity"
                ? "bg-[#8B3A4A] text-white shadow-xs font-semibold"
                : "text-[#242424] hover:bg-[#FAF8F5] hover:text-[#1C1C1C]"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Store className="w-4 h-4 shrink-0" />
              <span>Workshop & Identity</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("dispatch")}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-xs font-medium transition-all cursor-pointer text-left ${
              activeTab === "dispatch"
                ? "bg-[#8B3A4A] text-white shadow-xs font-semibold"
                : "text-[#242424] hover:bg-[#FAF8F5] hover:text-[#1C1C1C]"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 shrink-0" />
              <span>Courier Pickup & Dispatch</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("security")}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-xs font-medium transition-all cursor-pointer text-left ${
              activeTab === "security"
                ? "bg-[#8B3A4A] text-white shadow-xs font-semibold"
                : "text-[#242424] hover:bg-[#FAF8F5] hover:text-[#1C1C1C]"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 shrink-0" />
              <span>Security & Credentials</span>
            </div>
          </button>
        </aside>

        {/* Right Form Panes */}
        <main className="lg:col-span-8 space-y-5">
          {/* TAB 1: Workshop & Identity */}
          {activeTab === "identity" && (
            <Card className="border-[#E5E1DC]">
              <form onSubmit={handleSaveIdentity}>
                <CardHeader className="py-4 border-b border-[#E5E1DC]/60 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm sm:text-base font-semibold text-[#1C1C1C]">
                    Workshop & Brand Identity
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-4 sm:p-5 space-y-4">
                  {/* Workshop Profile Photo Display & Upload from Device / URL */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border border-[#E5E1DC] flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    <div className="relative group shrink-0">
                      <Avatar
                        src={avatar || user?.avatar}
                        name={storeName || artisanName}
                        size="2xl"
                        className="w-20 h-20 rounded-full border-2 border-white shadow-xs"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 rounded-full bg-black/45 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity cursor-pointer text-[10px] font-medium"
                        title="Upload logo from device"
                      >
                        <Camera className="w-5 h-5 mb-0.5" />
                        <span>Change</span>
                      </button>
                    </div>

                    <div className="space-y-3 flex-1 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <p className="text-xs font-semibold text-[#1C1C1C]">
                            Atelier Emblem & Portrait
                          </p>
                          <p className="text-[11px] text-[#737373]">
                            Upload from device (PNG, JPG) or enter an image link.
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            leftIcon={<Upload className="w-3.5 h-3.5" />}
                            className="text-xs h-8 px-3 cursor-pointer bg-white border-[#E5E1DC] hover:border-[#8B3A4A] hover:text-[#8B3A4A]"
                          >
                            Upload from Device
                          </Button>
                          {avatar && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setAvatar("")}
                              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                              className="text-xs h-8 px-2.5 text-[#B84A4A] hover:bg-[#B84A4A]/10 hover:text-[#B84A4A] cursor-pointer"
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Input
                          value={avatar.startsWith("data:") ? "Image loaded from device" : avatar}
                          disabled={avatar.startsWith("data:")}
                          onChange={(e) => setAvatar(e.target.value)}
                          placeholder="Or paste public image link (https://...)"
                          leftIcon={<ImageIcon className="w-3.5 h-3.5 text-[#737373]" />}
                          className="bg-white text-xs h-9"
                        />
                        {avatar.startsWith("data:") && (
                          <span className="text-[10px] text-[#4F7A61] font-semibold bg-[#4F7A61]/10 px-2.5 py-1.5 rounded-lg whitespace-nowrap shrink-0">
                            Device Image Ready
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373] mb-1.5">
                        Atelier / Brand Name
                      </label>
                      <Input
                        required
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        placeholder="Atelier V Studios"
                        leftIcon={<Store className="w-4 h-4 text-[#737373]" />}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373] mb-1.5">
                        Lead Artisan / Owner Name
                      </label>
                      <Input
                        required
                        value={artisanName}
                        onChange={(e) => setArtisanName(e.target.value)}
                        placeholder="Julien Mercer"
                        leftIcon={<UserIcon className="w-4 h-4 text-[#737373]" />}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373] mb-1.5">
                        Registered Email
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          disabled
                          value={user?.email || "supplier@atelierv.com"}
                          className="w-full h-10 pl-9 pr-24 rounded-lg bg-[#FAF8F5] border border-[#E5E1DC] text-xs text-[#737373] cursor-not-allowed font-medium"
                        />
                        <Mail className="w-4 h-4 text-[#737373] absolute left-3 top-3" />
                        <span className="absolute right-3 top-2.5 text-[10px] font-semibold text-[#4F7A61] bg-[#4F7A61]/10 px-2 py-0.5 rounded flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373] mb-1.5">
                        Workshop Telephone (SMS Alerts)
                      </label>
                      <Input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+92 300 8472910"
                        leftIcon={<Phone className="w-4 h-4 text-[#737373]" />}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373] mb-1.5">
                      Craft Specialization
                    </label>
                    <Input
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      placeholder="e.g. Handcrafted Pret, Silk Brocade, Tailored Outerwear"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373] mb-1.5">
                      Atelier Craft Bio & Heritage Note
                    </label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Describe your design heritage, weaving traditions, and workshop quality standard..."
                      className="w-full p-3 rounded-lg border border-[#E5E1DC] bg-white text-xs text-[#242424] placeholder:text-[#737373] focus:outline-hidden focus:border-[#8B3A4A] transition-colors"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Button
                      type="submit"
                      variant="default"
                      size="sm"
                      disabled={savingIdentity}
                      className="bg-[#8B3A4A] hover:bg-[#722F3D] text-white text-xs h-9 px-4 cursor-pointer gap-2"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{savingIdentity ? "Saving..." : "Save Workshop Profile"}</span>
                    </Button>
                  </div>
                </CardContent>
              </form>
            </Card>
          )}

          {/* TAB 2: Courier Pickup & Dispatch Hub */}
          {activeTab === "dispatch" && (
            <Card className="border-[#E5E1DC]">
              <form onSubmit={handleSaveDispatch}>
                <CardHeader className="py-4 border-b border-[#E5E1DC]/60 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm sm:text-base font-semibold text-[#1C1C1C]">
                    Courier Pickup & Dispatch Origin
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-4 sm:p-5 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373] mb-1.5">
                      Workshop Address & Building Suite
                    </label>
                    <Input
                      required
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Suite 402, Heritage Craft Center, Gulberg III"
                      leftIcon={<MapPin className="w-4 h-4 text-[#737373]" />}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373] mb-1.5">
                        City (Pakistan)
                      </label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg border border-[#E5E1DC] bg-white text-xs text-[#242424] focus:outline-hidden focus:border-[#8B3A4A] cursor-pointer font-medium"
                      >
                        <option value="Lahore">Lahore</option>
                        <option value="Karachi">Karachi</option>
                        <option value="Islamabad">Islamabad</option>
                        <option value="Rawalpindi">Rawalpindi</option>
                        <option value="Faisalabad">Faisalabad</option>
                        <option value="Sialkot">Sialkot</option>
                        <option value="Multan">Multan</option>
                        <option value="Peshawar">Peshawar</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373] mb-1.5">
                        Province / Territory
                      </label>
                      <Input
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="Punjab"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373] mb-1.5">
                        Postal Code
                      </label>
                      <Input
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="54000"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373] mb-1.5">
                        Primary Logistics Carrier
                      </label>
                      <select
                        value={courierPartner}
                        onChange={(e) => setCourierPartner(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg border border-[#E5E1DC] bg-white text-xs text-[#242424] focus:outline-hidden focus:border-[#8B3A4A] cursor-pointer font-medium"
                      >
                        <option value="TCS Express (COD Priority)">TCS Express (COD Priority)</option>
                        <option value="Trax Logistics">Trax Logistics</option>
                        <option value="Leopards Courier">Leopards Courier</option>
                        <option value="PostEx Delivery">PostEx Delivery</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-3 bg-[#FAF8F5] border border-[#E5E1DC] rounded-xl flex items-center justify-between text-xs text-[#737373]">
                    <span>Country Origin: <strong className="text-[#1C1C1C]">Pakistan (PK)</strong></span>
                    <span className="text-[#4F7A61] font-semibold">100% Doorstep COD Remittance</span>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Button
                      type="submit"
                      variant="default"
                      size="sm"
                      disabled={savingDispatch}
                      className="bg-[#8B3A4A] hover:bg-[#722F3D] text-white text-xs h-9 px-4 cursor-pointer gap-2"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{savingDispatch ? "Saving..." : "Save Pickup Hub"}</span>
                    </Button>
                  </div>
                </CardContent>
              </form>
            </Card>
          )}

          {/* TAB 3: Security & Credentials */}
          {activeTab === "security" && (
            <Card className="border-[#E5E1DC]">
              <form onSubmit={handleChangePassword}>
                <CardHeader className="py-4 border-b border-[#E5E1DC]/60 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm sm:text-base font-semibold text-[#1C1C1C]">
                    Workshop Login & Security
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-4 sm:p-5 space-y-4">
                  {passwordError && (
                    <div className="p-3 rounded-lg bg-[#B84A4A]/10 border border-[#B84A4A]/20 text-xs text-[#B84A4A] font-medium">
                      {passwordError}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373] mb-1.5">
                      Current Password
                    </label>
                    <Input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••••••"
                      leftIcon={<Lock className="w-4 h-4 text-[#737373]" />}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373] mb-1.5">
                        New Password
                      </label>
                      <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••••••"
                        leftIcon={<Lock className="w-4 h-4 text-[#737373]" />}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373] mb-1.5">
                        Confirm New Password
                      </label>
                      <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••••••"
                        leftIcon={<Lock className="w-4 h-4 text-[#737373]" />}
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-[#737373]">
                    Passwords must contain at least 8 characters. Two-factor authentication (SMS) is active for Cash on Delivery fund releases.
                  </p>

                  <div className="pt-2 flex justify-end">
                    <Button
                      type="submit"
                      variant="default"
                      size="sm"
                      disabled={savingPassword}
                      className="bg-[#8B3A4A] hover:bg-[#722F3D] text-white text-xs h-9 px-4 cursor-pointer gap-2"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{savingPassword ? "Updating..." : "Update Password"}</span>
                    </Button>
                  </div>
                </CardContent>
              </form>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
