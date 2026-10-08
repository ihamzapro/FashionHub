"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Lock, Mail, User, Store, ArrowRight, Eye, EyeOff, Check } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { toast } = useToast();

  const [role, setRole] = useState<"customer" | "supplier">("customer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [storeName, setStoreName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please provide a valid email address.");
      return;
    }
    if (role === "supplier" && !storeName.trim()) {
      setError("Please provide your atelier or brand name.");
      return;
    }
    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }
    if (!acceptTerms) {
      setError("You must accept the FashionHub Terms of Service.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await register({
        name,
        email,
        password,
        role,
        storeName: role === "supplier" ? storeName : undefined,
        phone,
      });

      if (!res.success) {
        setError(res.error || "Registration failed.");
        toast({
          title: "Registration Failed",
          message: res.error || "Could not complete account creation.",
          type: "error",
        });
        setIsSubmitting(false);
        return;
      }

      toast({
        title: "Account Created",
        message: `Welcome to FashionHub, ${name}! Your account is active.`,
        type: "success",
      });

      if (role === "supplier") {
        router.push("/supplier/dashboard");
      } else {
        router.push("/profile");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred during registration.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block group">
            <span className="font-editorial text-3xl font-normal tracking-[0.2em] text-[#1C1C1C] group-hover:text-[#8B3A4A] transition-colors">
              FASHIONHUB
            </span>
          </Link>
          <p className="text-xs text-[#737373] tracking-wider uppercase font-light">
            Join the FashionHub Ecosystem
          </p>
        </div>

        {/* Register Card */}
        <Card className="border-[#E5E1DC] shadow-sm">
          <form onSubmit={handleSubmit}>
            <CardHeader className="space-y-3">
              <CardTitle className="font-editorial text-2xl font-normal text-[#1C1C1C]">
                Create Your Account
              </CardTitle>
              <CardDescription className="text-xs text-[#737373]">
                Select your role to start shopping or showcasing artisanal pieces.
              </CardDescription>

              {/* Role Selection Tabs - strictly Customer and Supplier */}
              <div className="pt-2">
                <label className="block text-xs font-medium text-[#242424] mb-2">
                  Select Account Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Customer Option */}
                  <button
                    type="button"
                    onClick={() => setRole("customer")}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                      role === "customer"
                        ? "bg-[#1C1C1C] text-white border-[#1C1C1C] shadow-xs"
                        : "bg-white text-[#242424] border-[#E5E1DC] hover:border-[#737373]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        role === "customer" ? "bg-white/10 text-white" : "bg-[#FAF8F5] text-[#1C1C1C]"
                      }`}>
                        <User className="w-4 h-4" />
                      </div>
                      {role === "customer" && (
                        <div className="w-4 h-4 rounded-full bg-[#8B3A4A] text-white flex items-center justify-center text-[10px]">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-semibold">Customer</p>
                    <p className={`text-[10px] mt-0.5 leading-tight ${
                      role === "customer" ? "text-neutral-300" : "text-[#737373]"
                    }`}>
                      Shop collections, wishlist pieces & place COD orders.
                    </p>
                  </button>

                  {/* Supplier Option */}
                  <button
                    type="button"
                    onClick={() => setRole("supplier")}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                      role === "supplier"
                        ? "bg-[#1C1C1C] text-white border-[#1C1C1C] shadow-xs"
                        : "bg-white text-[#242424] border-[#E5E1DC] hover:border-[#737373]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        role === "supplier" ? "bg-white/10 text-white" : "bg-[#FAF8F5] text-[#1C1C1C]"
                      }`}>
                        <Store className="w-4 h-4" />
                      </div>
                      {role === "supplier" && (
                        <div className="w-4 h-4 rounded-full bg-[#8B3A4A] text-white flex items-center justify-center text-[10px]">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-semibold">Supplier</p>
                    <p className={`text-[10px] mt-0.5 leading-tight ${
                      role === "supplier" ? "text-neutral-300" : "text-[#737373]"
                    }`}>
                      Manage inventory, fulfill orders & view sales metrics.
                    </p>
                  </button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {error}
                </div>
              )}

              <Input
                label="Full Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Elena Rostova"
                leftIcon={<User className="w-4 h-4 text-[#737373]" />}
              />

              <Input
                label="Email Address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. elena@example.com"
                leftIcon={<Mail className="w-4 h-4 text-[#737373]" />}
              />

              {role === "supplier" && (
                <Input
                  label="Atelier / Brand Name"
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="e.g. Atelier Nord Studios"
                  leftIcon={<Store className="w-4 h-4 text-[#737373]" />}
                  helperText="Your brand will be credited across your product listings."
                />
              )}

              <Input
                label="Phone Number (Optional)"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    leftIcon={<Lock className="w-4 h-4 text-[#737373]" />}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[34px] text-[#737373] hover:text-[#242424] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <Input
                  label="Confirm Password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  leftIcon={<Lock className="w-4 h-4 text-[#737373]" />}
                />
              </div>

              {/* Terms & Privacy */}
              <label className="flex items-start gap-2.5 pt-1 text-xs text-[#737373] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-[#D6D2CC] text-[#8B3A4A] focus:ring-[#8B3A4A]"
                />
                <span>
                  I agree to the{" "}
                  <span className="text-[#1C1C1C] underline">Terms of Service</span> and{" "}
                  <span className="text-[#1C1C1C] underline">Privacy Policy</span>. Cash on Delivery terms apply.
                </span>
              </label>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 pt-2">
              <Button
                type="submit"
                variant="default"
                size="lg"
                className="w-full gap-2"
                disabled={isSubmitting}
              >
                <span>{isSubmitting ? "Creating Account..." : `Register as ${role === "customer" ? "Customer" : "Supplier"}`}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              <p className="text-center text-xs text-[#737373] pt-2">
                Already registered with FashionHub?{" "}
                <Link
                  href="/login"
                  className="text-[#8B3A4A] font-semibold hover:underline"
                >
                  Sign In Here
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
