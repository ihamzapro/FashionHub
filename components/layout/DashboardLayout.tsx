"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  BarChart3,
  Users,
  MessageSquare,
  FileText,
  LogOut,
  Menu,
  X,
  Bell,
  ArrowUpRight,
  Store,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";

import { useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/auth";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export interface DashboardLayoutProps {
  role: "supplier" | "admin";
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export function DashboardLayout({
  role,
  title,
  description,
  children,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, switchAccount } = useAuth();

  const supplierNavItems: NavItem[] = [
    { label: "Overview", href: "/supplier/dashboard", icon: LayoutDashboard },
    { label: "My Products", href: "/supplier/products", icon: Package, badge: "14" },
    { label: "Orders & Shipping", href: "/supplier/orders", icon: ShoppingBag, badge: "2 New" },
    { label: "Analytics & Sales", href: "/supplier/analytics", icon: BarChart3 },
  ];

  const adminNavItems: NavItem[] = [
    { label: "Platform Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "User Management", href: "/admin/users", icon: Users, badge: "3 Pending" },
    { label: "Product Catalog", href: "/admin/products", icon: Package },
    { label: "Marketplace Orders", href: "/admin/orders", icon: ShoppingBag },
    { label: "Review Moderation", href: "/admin/reviews", icon: MessageSquare },
    { label: "Financial Reports", href: "/admin/reports", icon: FileText },
  ];

  const navItems = role === "supplier" ? supplierNavItems : adminNavItems;
  const roleName = role === "supplier" ? "Supplier Portal" : "Admin Console";
  const userDisplayName = user?.name || (role === "supplier" ? "Julien Mercer" : "Sophia Sterling");
  const userEmail = user?.email || (role === "supplier" ? "supplier@atelierv.com" : "admin@fashionhub.com");

  // Allowed roles: Admin can access both portals, Supplier can only access supplier portal
  const allowedRoles = role === "admin" ? (["admin"] as const) : (["supplier", "admin"] as const);

  return (
    <ProtectedRoute allowedRoles={allowedRoles as unknown as ("supplier" | "admin")[]}>
      <div className="min-h-screen bg-[#FAF8F5] flex">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-[#1C1C1C] text-white flex flex-col transition-transform duration-200 lg:translate-x-0 lg:static shrink-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="h-18 px-6 border-b border-neutral-800 flex items-center justify-between">
          <Link href="/" className="flex flex-col">
            <span className="font-editorial text-xl font-normal tracking-[0.18em] text-white">
              FASHIONHUB
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#8B3A4A] font-semibold">
              {roleName}
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-neutral-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] uppercase tracking-widest text-neutral-400 font-semibold">
            Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all group",
                  isActive
                    ? "bg-[#8B3A4A] text-white shadow-xs font-semibold"
                    : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "w-4 h-4 transition-colors",
                      isActive ? "text-white" : "text-neutral-400 group-hover:text-white"
                    )}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded font-mono",
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-neutral-800 text-neutral-300 group-hover:bg-neutral-700"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Quick link back to Marketplace */}
          <div className="pt-6 px-3 pb-2 text-[10px] uppercase tracking-widest text-neutral-400 font-semibold">
            Marketplace
          </div>
          <Link
            href="/"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-3">
              <ArrowUpRight className="w-4 h-4 text-neutral-400" />
              <span>Customer Storefront</span>
            </div>
            <Badge variant="outline" size="sm" className="border-neutral-700 text-neutral-400 text-[9px]">
              Live
            </Badge>
          </Link>
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-900/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar
                name={userDisplayName}
                size="sm"
                status="online"
                className="bg-neutral-800 text-white border-neutral-700"
              />
              <div className="min-w-0">
                <p className="text-xs font-medium text-white truncate">{userDisplayName}</p>
                <p className="text-[11px] text-neutral-400 truncate">{userEmail}</p>
              </div>
            </div>
            <button
              onClick={() => logout()}
              title="Sign out"
              className="text-neutral-400 hover:text-white p-1.5 rounded-md hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-18 bg-white border-b border-[#E5E1DC] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-[#242424] hover:text-[#8B3A4A] rounded-lg hover:bg-[#F1ECE6]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              {title && (
                <h1 className="text-base sm:text-lg font-semibold tracking-tight text-[#242424]">
                  {title}
                </h1>
              )}
              {description && (
                <p className="text-xs text-[#737373] hidden sm:block">
                  {description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Quick Role Switcher demo pills */}
            <div className="hidden md:flex items-center bg-[#FAF8F5] border border-[#E5E1DC] rounded-lg p-0.5 text-xs">
              <button
                type="button"
                onClick={() => switchAccount("supplier")}
                className={cn(
                  "px-2.5 py-1 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer",
                  role === "supplier"
                    ? "bg-[#1C1C1C] text-white font-medium"
                    : "text-[#737373] hover:text-[#242424]"
                )}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Supplier</span>
              </button>
              <button
                type="button"
                onClick={() => switchAccount("admin")}
                className={cn(
                  "px-2.5 py-1 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer",
                  role === "admin"
                    ? "bg-[#1C1C1C] text-white font-medium"
                    : "text-[#737373] hover:text-[#242424]"
                )}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </div>

            {/* Notification Bell */}
            <button
              className="relative p-2 text-[#242424] hover:text-[#8B3A4A] rounded-full hover:bg-[#F1ECE6] transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#8B3A4A]" />
            </button>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  </ProtectedRoute>
  );
}
