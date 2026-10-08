"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PublicLayout } from "./PublicLayout";
import { Avatar } from "@/components/ui/Avatar";
import { User, Package, Heart, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/auth";
import { mockUsers } from "@/lib/mock-data/users";

export interface CustomerLayoutProps {
  children: React.ReactNode;
}

export function CustomerLayout({ children }: CustomerLayoutProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const customer = user || mockUsers[0];

  const customerNavItems = [
    { label: "Account Overview", href: "/account", icon: User },
    { label: "My Profile", href: "/profile", icon: User },
    { label: "My Orders", href: "/orders", icon: Package },
    { label: "Wishlist", href: "/wishlist", icon: Heart },
    { label: "Notifications", href: "/account#notifications", icon: Bell },
  ];

  return (
    <ProtectedRoute allowedRoles={["customer", "supplier", "admin"]}>
      <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Customer Header Card */}
        <div className="bg-white border border-[#E5E1DC] rounded-2xl p-6 sm:p-8 mb-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar
              src={customer.avatar}
              name={customer.name}
              size="lg"
              className="ring-4 ring-[#FAF8F5]"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold tracking-tight text-[#242424]">
                  {customer.name}
                </h1>
                <span className="text-[10px] uppercase font-semibold tracking-widest px-2 py-0.5 rounded-full bg-[#8B3A4A]/10 text-[#8B3A4A]">
                  VIP Member
                </span>
              </div>
              <p className="text-xs text-[#737373] mt-0.5">{customer.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-[#242424]">Reward Points</p>
              <p className="text-lg font-semibold text-[#8B3A4A]">1,450 pts</p>
            </div>
          </div>
        </div>

        {/* Customer Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Customer Navigation Sidebar */}
          <aside className="lg:col-span-3 bg-white border border-[#E5E1DC] rounded-xl p-3 shadow-xs">
            <nav className="space-y-1">
              {customerNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors",
                      isActive
                        ? "bg-[#1C1C1C] text-white font-semibold"
                        : "text-[#242424] hover:bg-[#F1ECE6] hover:text-[#8B3A4A]"
                    )}
                  >
                    <Icon className="w-4 h-4 text-[#737373]" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Customer Page Content */}
          <main className="lg:col-span-9">{children}</main>
        </div>
      </div>
    </PublicLayout>
    </ProtectedRoute>
  );
}
