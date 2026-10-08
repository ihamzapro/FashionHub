"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/context";
import { ProtectedRoute } from "@/components/auth";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Lock,
  Package,
  Store,
  ShieldCheck,
  LogOut,
  Save,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";

function ProfileContent() {
  const router = useRouter();
  const { user, role, updateProfile, updateAddress, changePassword, logout } = useAuth();
  const { orders } = useOrders();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"personal" | "address" | "security" | "orders">("personal");

  // Personal Info Form State - initialized from user
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [storeName, setStoreName] = useState(user?.storeName || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [savingPersonal, setSavingPersonal] = useState(false);

  // Address Form State - initialized from user.address
  const [street, setStreet] = useState(user?.address?.street || "");
  const [city, setCity] = useState(user?.address?.city || "");
  const [state, setState] = useState(user?.address?.state || "");
  const [postalCode, setPostalCode] = useState(user?.address?.postalCode || "");
  const [country, setCountry] = useState(user?.address?.country || "United States");
  const [savingAddress, setSavingAddress] = useState(false);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleSavePersonalInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPersonal(true);

    const res = await updateProfile({
      name,
      phone,
      storeName: role === "supplier" ? storeName : undefined,
      bio,
    });

    setSavingPersonal(false);
    if (res.success) {
      toast({
        title: "Profile Updated",
        message: "Your personal details have been saved.",
        type: "success",
      });
    } else {
      toast({
        title: "Update Failed",
        message: res.error || "Could not save profile changes.",
        type: "error",
      });
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAddress(true);

    const res = await updateAddress({
      street,
      city,
      state,
      postalCode,
      country,
    });

    setSavingAddress(false);
    if (res.success) {
      toast({
        title: "Address Saved",
        message: "Your default delivery address has been updated.",
        type: "success",
      });
    } else {
      toast({
        title: "Failed to Save Address",
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
        title: "Password Changed",
        message: "Your password has been changed securely.",
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

  const handleLogout = () => {
    logout();
    toast({
      title: "Signed Out",
      message: "You have signed out of your account.",
      type: "info",
    });
    router.push("/");
  };

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-[#737373] border-b border-[#E5E1DC] pb-4">
        <Link href="/" className="hover:text-[#1C1C1C] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#1C1C1C] font-medium">Member Profile</span>
      </nav>

      {/* User Hero Banner */}
      <div className="bg-white border border-[#E5E1DC] rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <Avatar
            src={user?.avatar}
            name={user?.name || "Member"}
            size="lg"
            className="w-16 h-16 sm:w-20 sm:h-20 ring-4 ring-[#FAF8F5] text-lg font-serif"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="font-editorial text-2xl sm:text-3xl text-[#1C1C1C] font-normal">
                {user?.name}
              </h1>
              <Badge
                variant={role === "admin" ? "accent" : role === "supplier" ? "default" : "secondary"}
                className="uppercase text-[10px] tracking-wider"
              >
                {role === "supplier" ? "Verified Supplier" : role === "admin" ? "Administrator" : "Customer VIP"}
              </Badge>
            </div>
            <p className="text-xs text-[#737373] flex items-center gap-2">
              <span>{user?.email}</span>
              <span>•</span>
              <span>Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : "2026"}</span>
            </p>
            {user?.bio && (
              <p className="text-xs text-[#242424] max-w-lg italic font-light pt-0.5">
                &ldquo;{user.bio}&rdquo;
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {role === "supplier" && (
            <Link href="/supplier/dashboard">
              <Button variant="outline" size="sm" className="gap-1.5 border-[#1C1C1C] text-[#1C1C1C]">
                <Store className="w-3.5 h-3.5" />
                <span>Supplier Portal</span>
              </Button>
            </Link>
          )}
          {role === "admin" && (
            <Link href="/admin/dashboard">
              <Button variant="outline" size="sm" className="gap-1.5 border-[#8B3A4A] text-[#8B3A4A]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Console</span>
              </Button>
            </Link>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="gap-1.5 text-rose-700 hover:bg-rose-50 hover:border-rose-300 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>

      {/* Profile Tabs & Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Side Navigation Tabs */}
        <aside className="lg:col-span-3 bg-white border border-[#E5E1DC] rounded-xl p-2.5 shadow-xs space-y-1">
          <button
            type="button"
            onClick={() => setActiveTab("personal")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
              activeTab === "personal"
                ? "bg-[#1C1C1C] text-white font-semibold"
                : "text-[#242424] hover:bg-[#F1ECE6]"
            }`}
          >
            <UserIcon className="w-4 h-4 text-[#737373]" />
            <span>Personal Information</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("address")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
              activeTab === "address"
                ? "bg-[#1C1C1C] text-white font-semibold"
                : "text-[#242424] hover:bg-[#F1ECE6]"
            }`}
          >
            <MapPin className="w-4 h-4 text-[#737373]" />
            <span>Delivery Address</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("security")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
              activeTab === "security"
                ? "bg-[#1C1C1C] text-white font-semibold"
                : "text-[#242424] hover:bg-[#F1ECE6]"
            }`}
          >
            <Lock className="w-4 h-4 text-[#737373]" />
            <span>Security & Password</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
              activeTab === "orders"
                ? "bg-[#1C1C1C] text-white font-semibold"
                : "text-[#242424] hover:bg-[#F1ECE6]"
            }`}
          >
            <span className="flex items-center gap-3">
              <Package className="w-4 h-4 text-[#737373]" />
              <span>Order History</span>
            </span>
            <span className="text-[10px] font-mono opacity-70">({orders.length})</span>
          </button>
        </aside>

        {/* Main Content Area */}
        <main className="lg:col-span-9 space-y-6">
          {/* TAB 1: Personal Information */}
          {activeTab === "personal" && (
            <Card className="border-[#E5E1DC]">
              <form onSubmit={handleSavePersonalInfo}>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your public name, contact telephone, and biography.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Elena Rostova"
                      leftIcon={<UserIcon className="w-4 h-4 text-[#737373]" />}
                    />

                    <div>
                      <label className="block text-xs font-medium text-[#242424] mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          disabled
                          value={user?.email || ""}
                          className="w-full h-10 pl-9 pr-24 rounded-lg bg-[#FAF8F5] border border-[#E5E1DC] text-xs text-[#737373] cursor-not-allowed"
                        />
                        <Mail className="w-4 h-4 text-[#737373] absolute left-3 top-3" />
                        <span className="absolute right-3 top-2.5 text-[10px] uppercase font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified
                        </span>
                      </div>
                      <p className="text-[11px] text-[#737373] mt-1">
                        Primary login identifier. Contact support to transfer accounts.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Phone Number"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 234-5678"
                      leftIcon={<Phone className="w-4 h-4 text-[#737373]" />}
                      helperText="Used for courier Cash on Delivery arrival confirmations."
                    />

                    {role === "supplier" ? (
                      <Input
                        label="Atelier / Brand Name"
                        required
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        placeholder="Maison Nordics"
                        leftIcon={<Store className="w-4 h-4 text-[#737373]" />}
                      />
                    ) : (
                      <div>
                        <label className="block text-xs font-medium text-[#242424] mb-1.5">
                          Account Tier
                        </label>
                        <div className="h-10 px-3 rounded-lg border border-[#E5E1DC] bg-[#FAF8F5] flex items-center justify-between text-xs text-[#242424]">
                          <span>Curated Customer Membership</span>
                          <Sparkles className="w-4 h-4 text-[#8B3A4A]" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#242424] mb-1.5">
                      Biography / Editorial Note
                    </label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Share a short note regarding your wardrobe style or design ethos..."
                      className="w-full p-3 rounded-lg border border-[#E5E1DC] bg-white text-xs text-[#242424] placeholder:text-[#737373] focus:outline-none focus:border-[#8B3A4A] focus:ring-1 focus:ring-[#8B3A4A]"
                    />
                  </div>
                </CardContent>

                <CardFooter className="flex justify-end gap-3 pt-2">
                  <Button
                    type="submit"
                    variant="default"
                    size="md"
                    disabled={savingPersonal}
                    className="gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savingPersonal ? "Saving..." : "Save Changes"}</span>
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}

          {/* TAB 2: Delivery Address */}
          {activeTab === "address" && (
            <Card className="border-[#E5E1DC]">
              <form onSubmit={handleSaveAddress}>
                <CardHeader>
                  <CardTitle>Delivery Address</CardTitle>
                  <CardDescription>
                    This address will be pre-filled during Cash on Delivery checkout.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <Input
                    label="Street Address & Apartment / Suite"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="e.g. 742 Evergreen Terrace, Suite 4B"
                    leftIcon={<MapPin className="w-4 h-4 text-[#737373]" />}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="City"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="New York"
                    />

                    <Input
                      label="State / Province"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="NY"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Postal / ZIP Code"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="10001"
                    />

                    <Input
                      label="Country"
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="United States"
                    />
                  </div>
                </CardContent>

                <CardFooter className="flex justify-end gap-3 pt-2">
                  <Button
                    type="submit"
                    variant="default"
                    size="md"
                    disabled={savingAddress}
                    className="gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savingAddress ? "Saving..." : "Save Address"}</span>
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}

          {/* TAB 3: Security & Password */}
          {activeTab === "security" && (
            <Card className="border-[#E5E1DC]">
              <form onSubmit={handleChangePassword}>
                <CardHeader>
                  <CardTitle>Security & Password</CardTitle>
                  <CardDescription>
                    Ensure your account remains secure by using a strong password.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {passwordError && (
                    <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                      {passwordError}
                    </div>
                  )}

                  <Input
                    label="Current Password"
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    leftIcon={<Lock className="w-4 h-4 text-[#737373]" />}
                    helperText="Default demo account password is: password123"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="New Password"
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min 8 characters"
                      leftIcon={<Lock className="w-4 h-4 text-[#737373]" />}
                    />

                    <Input
                      label="Confirm New Password"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      leftIcon={<Lock className="w-4 h-4 text-[#737373]" />}
                    />
                  </div>
                </CardContent>

                <CardFooter className="flex justify-end gap-3 pt-2">
                  <Button
                    type="submit"
                    variant="default"
                    size="md"
                    disabled={savingPassword}
                    className="gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savingPassword ? "Updating..." : "Update Password"}</span>
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}

          {/* TAB 4: Order History */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-editorial text-2xl text-[#1C1C1C]">
                    Order History ({orders.length})
                  </h3>
                  <p className="text-xs text-[#737373] mt-0.5">
                    All Cash on Delivery orders placed on your account.
                  </p>
                </div>
                <Link href="/orders">
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <span>View Full Order History</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <Card className="border-[#E5E1DC] p-8 text-center space-y-3">
                  <Package className="w-10 h-10 text-[#737373] mx-auto opacity-40" />
                  <p className="text-sm font-medium text-[#242424]">No orders placed yet</p>
                  <p className="text-xs text-[#737373]">
                    When you check out using Cash on Delivery, your orders will appear here.
                  </p>
                  <Link href="/products">
                    <Button variant="default" size="sm" className="mt-2">
                      Explore Collections
                    </Button>
                  </Link>
                </Card>
              ) : (
                <div className="space-y-3">
                  {recentOrders.map((ord) => (
                    <Card key={ord.id} className="border-[#E5E1DC] hover:border-[#1C1C1C] transition-colors">
                      <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-[#1C1C1C]">
                              #{ord.orderNumber}
                            </span>
                            <Badge
                              variant={ord.status === "Delivered" ? "success" : "secondary"}
                              size="sm"
                            >
                              {ord.status || ord.orderStatus || "Pending"}
                            </Badge>
                          </div>
                          <p className="text-xs text-[#737373]">
                            Placed {formatDate(ord.createdAt)} • {ord.items.length} item{ord.items.length !== 1 ? "s" : ""}
                          </p>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0">
                          <div className="text-right">
                            <span className="text-[10px] text-[#737373] uppercase font-mono block">
                              Payment: COD
                            </span>
                            <span className="font-mono text-sm font-semibold text-[#1C1C1C]">
                              {formatCurrency(ord.totalAmount || ord.total || 0)}
                            </span>
                          </div>
                          <Link href={`/orders/${ord.id}`}>
                            <Button variant="outline" size="sm" className="gap-1 text-xs">
                              <span>Details</span>
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute allowedRoles={["customer", "supplier", "admin"]}>
      <ProfileContent key={user?.id || "unauthenticated"} />
    </ProtectedRoute>
  );
}
