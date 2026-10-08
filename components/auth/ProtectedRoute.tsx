"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/lib/types";
import { ShieldAlert, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo,
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, role, isAuthenticated, isHydrated } = useAuth();

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated) {
      const destination = redirectTo || `/login?redirect=${encodeURIComponent(pathname)}`;
      router.replace(destination);
    } else if (allowedRoles && role && !allowedRoles.includes(role)) {
      // Role mismatch redirection
      if (role === "customer") {
        router.replace("/profile");
      } else if (role === "supplier") {
        router.replace("/supplier/dashboard");
      } else {
        router.replace("/");
      }
    }
  }, [isHydrated, isAuthenticated, role, allowedRoles, pathname, redirectTo, router]);

  // Loading / hydration state
  if (!isHydrated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-4">
        <div className="w-10 h-10 border-2 border-[#8B3A4A] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs uppercase tracking-widest text-[#737373]">
          Authenticating FashionHub Session...
        </p>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-[#E5E1DC] rounded-2xl p-8 text-center space-y-5 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-[#8B3A4A]/10 text-[#8B3A4A] flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6 stroke-[1.5]" />
          </div>
          <div className="space-y-1.5">
            <h2 className="font-editorial text-2xl text-[#1C1C1C]">Authentication Required</h2>
            <p className="text-xs text-[#737373] leading-relaxed">
              Please sign in to your FashionHub account to view this destination.
            </p>
          </div>
          <div className="pt-2">
            <Link href={`/login?redirect=${encodeURIComponent(pathname)}`}>
              <Button variant="default" className="w-full gap-2">
                <span>Sign In to Continue</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated but unauthorized role
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-[#E5E1DC] rounded-2xl p-8 text-center space-y-5 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6 stroke-[1.5]" />
          </div>
          <div className="space-y-1.5">
            <h2 className="font-editorial text-2xl text-[#1C1C1C]">Access Restricted</h2>
            <p className="text-xs text-[#737373] leading-relaxed">
              Your account ({user?.email}) is registered as a{" "}
              <strong className="text-[#1C1C1C] uppercase font-mono">{role}</strong>. You do
              not have authorization for this portal.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2.5">
            {role === "supplier" ? (
              <Link href="/supplier/dashboard">
                <Button variant="default" className="w-full">
                  Return to Supplier Portal
                </Button>
              </Link>
            ) : (
              <Link href="/profile">
                <Button variant="default" className="w-full">
                  Return to Member Profile
                </Button>
              </Link>
            )}
            <Link href="/">
              <Button variant="outline" className="w-full">
                Back to Storefront
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
