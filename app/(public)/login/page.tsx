"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Lock, Mail, ArrowRight, Eye, EyeOff, Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  const { login } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already authenticated and not trying to switch, give quick redirect option
  const handleQuickFill = (role: "customer" | "supplier" | "admin") => {
    setError(null);
    if (role === "customer") {
      setEmail("elena.rostova@example.com");
      setPassword("password123");
    } else if (role === "supplier") {
      setEmail("supplier@atelierv.com");
      setPassword("password123");
    } else if (role === "admin") {
      setEmail("admin@fashionhub.com");
      setPassword("password123");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!password) {
      setError("Please enter your account password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await login(email, password, rememberMe);

      if (!res.success) {
        setError(res.error || "Authentication failed. Please verify credentials.");
        toast({
          title: "Sign-In Failed",
          message: res.error || "Invalid email or password.",
          type: "error",
        });
        setIsSubmitting(false);
        return;
      }

      toast({
        title: "Welcome Back",
        message: "You have signed in to FashionHub successfully.",
        type: "success",
      });

      // Redirect target logic
      if (redirectUrl) {
        router.push(redirectUrl);
      } else {
        // Fallback based on email
        if (email.toLowerCase().includes("admin")) {
          router.push("/admin/dashboard");
        } else if (email.toLowerCase().includes("supplier") || email.toLowerCase().includes("atelier") || email.toLowerCase().includes("maison")) {
          router.push("/supplier/dashboard");
        } else {
          router.push("/profile");
        }
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <Link href="/" className="inline-block group">
          <span className="font-editorial text-3xl font-normal tracking-[0.2em] text-[#1C1C1C] group-hover:text-[#8B3A4A] transition-colors">
            FASHIONHUB
          </span>
        </Link>
        <p className="text-xs text-[#737373] tracking-wider uppercase font-light">
          Sign In to Your Member Account
        </p>
      </div>

      {/* Demo Fast-Login Selector */}
      <div className="p-3.5 bg-white border border-[#E5E1DC] rounded-xl text-xs space-y-2.5 shadow-xs">
        <div className="flex items-center justify-between text-[11px] font-semibold text-[#8B3A4A] uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Quick Demo Credentials
          </span>
          <span className="text-[10px] text-[#737373] font-normal lowercase tracking-normal">
            pw: password123
          </span>
        </div>
        <p className="text-[11px] text-[#737373] leading-relaxed">
          Select any pre-configured role to fill credentials and test role permissions:
        </p>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleQuickFill("customer")}
            className="py-1.5 px-2 rounded-lg text-xs font-medium border border-[#E5E1DC] bg-[#FAF8F5] hover:bg-[#F1ECE6] text-[#242424] hover:border-[#8B3A4A] transition-colors cursor-pointer"
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill("supplier")}
            className="py-1.5 px-2 rounded-lg text-xs font-medium border border-[#E5E1DC] bg-[#FAF8F5] hover:bg-[#F1ECE6] text-[#242424] hover:border-[#8B3A4A] transition-colors cursor-pointer"
          >
            Supplier
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill("admin")}
            className="py-1.5 px-2 rounded-lg text-xs font-medium border border-[#E5E1DC] bg-[#FAF8F5] hover:bg-[#F1ECE6] text-[#242424] hover:border-[#8B3A4A] transition-colors cursor-pointer"
          >
            Admin
          </button>
        </div>
      </div>

      {/* Sign-In Card */}
      <Card className="border-[#E5E1DC] shadow-sm">
        <form onSubmit={handleSubmit}>
          <CardHeader className="space-y-1">
            <CardTitle className="font-editorial text-2xl font-normal text-[#1C1C1C]">
              Account Sign In
            </CardTitle>
            <CardDescription className="text-xs text-[#737373]">
              Enter your verified email and password to access your dashboard.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {error}
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. elena.rostova@example.com"
              leftIcon={<Mail className="w-4 h-4 text-[#737373]" />}
            />

            <div>
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  leftIcon={<Lock className="w-4 h-4 text-[#737373]" />}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[34px] text-[#737373] hover:text-[#242424] transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-[#242424]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#D6D2CC] text-[#8B3A4A] focus:ring-[#8B3A4A]"
                />
                <span>Remember me</span>
              </label>

              <Link
                href="/forgot-password"
                className="text-[#8B3A4A] hover:underline font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-2">
            <Button
              type="submit"
              variant="default"
              size="lg"
              className="w-full gap-2"
              disabled={isSubmitting}
            >
              <span>{isSubmitting ? "Signing In..." : "Sign In to FashionHub"}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>

            <p className="text-center text-xs text-[#737373] pt-2">
              Don&apos;t have an account yet?{" "}
              <Link
                href="/register"
                className="text-[#8B3A4A] font-semibold hover:underline"
              >
                Register Here
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <Suspense
        fallback={
          <div className="text-center p-8">
            <div className="w-8 h-8 border-2 border-[#8B3A4A] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-[#737373]">Loading sign in...</p>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
