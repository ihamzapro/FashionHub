"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronRight,
  ShieldAlert,
  Store,
  Package,
  Bell,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart, useWishlist, useAuth } from "@/context";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { mockNotifications } from "@/lib/mock-data/notifications";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifsOpen, setNotifsOpen] = useState(false);

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const notifsRef = useRef<HTMLDivElement>(null);

  const { totalItems: cartCount, isHydrated: cartHydrated } = useCart();
  const { totalItems: wishlistCount, isHydrated: wishlistHydrated } = useWishlist();
  const { user, role, isAuthenticated, isHydrated: authHydrated, logout } = useAuth();

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (notifsRef.current && !notifsRef.current.contains(event.target as Node)) {
        setNotifsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter notifications for user or generic
  const relevantNotifs = mockNotifications.filter((n) => {
    if (!user) return false;
    if (n.userId === user.id) return true;
    if (user.role === "supplier" && n.type === "order") return true;
    if (user.role === "admin" && n.type === "info") return true;
    return n.type === "promotion";
  });
  const unreadCount = relevantNotifs.filter((n) => !n.read).length;

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/products" },
    { label: "Categories", href: "/categories" },
    { label: "New Arrivals", href: "/new-arrivals" },
  ];

  const handleSignOut = () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E5E1DC] transition-all">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Left: Mobile Hamburger & Desktop Navigation */}
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#242424] hover:text-[#8B3A4A] transition-colors rounded-lg hover:bg-[#F1ECE6]"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center space-x-7">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-xs uppercase tracking-widest font-medium transition-colors duration-150 py-1 relative",
                      isActive
                        ? "text-[#8B3A4A] font-semibold"
                        : "text-[#242424] hover:text-[#8B3A4A]"
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8B3A4A] rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Center: Brand Logo */}
          <div className="flex-1 flex justify-center lg:flex-initial">
            <Link
              href="/"
              className="group flex flex-col items-center select-none"
            >
              <span className="font-editorial text-2xl sm:text-3xl font-normal tracking-[0.2em] text-[#1C1C1C] group-hover:text-[#8B3A4A] transition-colors">
                FASHIONHUB
              </span>
              <span className="text-[9px] uppercase tracking-[0.35em] text-[#737373] -mt-1 font-sans">
                Atelier & Marketplace
              </span>
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search Trigger */}
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-[#242424] hover:text-[#8B3A4A] transition-colors rounded-full hover:bg-[#F1ECE6]"
              aria-label="Search catalog"
            >
              <Search className="w-4.5 h-4.5" />
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2 text-[#242424] hover:text-[#8B3A4A] transition-colors rounded-full hover:bg-[#F1ECE6]"
              aria-label="Wishlist"
            >
              <Heart className="w-4.5 h-4.5" />
              {wishlistHydrated && wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#8B3A4A] text-white text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-mono font-medium shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-[#242424] hover:text-[#8B3A4A] transition-colors rounded-full hover:bg-[#F1ECE6]"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              {cartHydrated && cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#1C1C1C] text-white text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-mono font-medium shadow-xs">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Notifications (Logged In Only) */}
            {authHydrated && isAuthenticated && (
              <div className="relative" ref={notifsRef}>
                <button
                  type="button"
                  onClick={() => setNotifsOpen(!notifsOpen)}
                  className="relative p-2 text-[#242424] hover:text-[#8B3A4A] transition-colors rounded-full hover:bg-[#F1ECE6] cursor-pointer"
                  aria-label="Notifications"
                >
                  <Bell className="w-4.5 h-4.5" />
                  {unreadCount > 0 && (
                    <span className="absolute 1 top-1 right-1 w-2 h-2 rounded-full bg-[#8B3A4A]" />
                  )}
                </button>

                {/* Notifications Popover */}
                {notifsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E5E1DC] rounded-xl shadow-lg p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E5E1DC]">
                      <span className="text-xs font-semibold text-[#1C1C1C] uppercase tracking-wider">
                        Notifications
                      </span>
                      <span className="text-[10px] text-[#737373]">
                        {unreadCount} unread
                      </span>
                    </div>

                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {relevantNotifs.length === 0 ? (
                        <p className="text-xs text-[#737373] text-center py-4">
                          No notifications at this time.
                        </p>
                      ) : (
                        relevantNotifs.map((n) => (
                          <div
                            key={n.id}
                            className={`p-2 rounded-lg text-xs space-y-0.5 transition-colors ${
                              n.read ? "bg-transparent text-[#737373]" : "bg-[#FAF8F5] text-[#242424]"
                            }`}
                          >
                            <p className="font-medium text-[#1C1C1C]">{n.title}</p>
                            <p className="text-[11px] leading-tight text-[#737373]">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* AUTH STATE: Logged Out vs Logged In */}
            {authHydrated && !isAuthenticated ? (
              /* LOGGED OUT: Sign In / Register buttons */
              <div className="hidden sm:flex items-center gap-2 pl-2">
                <Link href="/login">
                  <Button variant="outline" size="sm" className="h-9 px-3.5 text-xs">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="default" size="sm" className="h-9 px-3.5 text-xs">
                    Register
                  </Button>
                </Link>
              </div>
            ) : authHydrated && isAuthenticated && user ? (
              /* LOGGED IN: Profile / Role Dropdown / Logout */
              <div className="relative" ref={userDropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full border border-[#E5E1DC] hover:border-[#1C1C1C] bg-[#FAF8F5] transition-all cursor-pointer"
                  aria-label="User menu"
                >
                  <Avatar
                    src={user.avatar}
                    name={user.name}
                    size="sm"
                    className="w-7 h-7 text-xs font-serif"
                  />
                  <span className="text-xs font-medium text-[#242424] max-w-[100px] truncate hidden md:inline">
                    {user.name.split(" ")[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-[#737373]" />
                </button>

                {/* User Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-[#E5E1DC] rounded-xl shadow-lg p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* User Header */}
                    <div className="px-3 py-2.5 border-b border-[#E5E1DC]">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-[#1C1C1C] truncate">{user.name}</p>
                        <Badge
                          variant={role === "admin" ? "accent" : role === "supplier" ? "default" : "secondary"}
                          size="sm"
                          className="text-[9px] uppercase"
                        >
                          {role}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-[#737373] truncate mt-0.5">{user.email}</p>
                    </div>

                    {/* Navigation Items */}
                    <div className="py-1 space-y-0.5">
                      <Link
                        href="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#242424] hover:bg-[#FAF8F5] hover:text-[#8B3A4A] transition-colors"
                      >
                        <User className="w-4 h-4 text-[#737373]" />
                        <span>My Profile</span>
                      </Link>

                      {/* Customer shortcuts */}
                      <Link
                        href="/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#242424] hover:bg-[#FAF8F5] hover:text-[#8B3A4A] transition-colors"
                      >
                        <Package className="w-4 h-4 text-[#737373]" />
                        <span>My Orders</span>
                      </Link>

                      {/* Supplier Portal */}
                      {role === "supplier" && (
                        <Link
                          href="/supplier/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#1C1C1C] hover:bg-[#FAF8F5] hover:text-[#8B3A4A] transition-colors"
                        >
                          <Store className="w-4 h-4 text-[#8B3A4A]" />
                          <span>Supplier Portal</span>
                        </Link>
                      )}

                      {/* Admin Console */}
                      {role === "admin" && (
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#8B3A4A] hover:bg-[#FAF8F5] transition-colors"
                        >
                          <ShieldAlert className="w-4 h-4 text-[#8B3A4A]" />
                          <span>Admin Console</span>
                        </Link>
                      )}
                    </div>

                    {/* Logout Option */}
                    <div className="pt-1 border-t border-[#E5E1DC]">
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Loading fallback during hydration
              <div className="w-8 h-8 rounded-full bg-[#FAF8F5] animate-pulse" />
            )}
          </div>
        </div>

        {/* Expandable Search Bar */}
        {searchOpen && (
          <div className="py-3 px-2 border-t border-[#E5E1DC]/80 animate-in fade-in slide-in-from-top-2 duration-150">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                  setSearchOpen(false);
                }
              }}
              className="relative max-w-2xl mx-auto flex items-center"
            >
              <Search className="w-4 h-4 text-[#737373] absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cashmere, selvedge denim, leather totes, watches..."
                className="w-full h-10 pl-9 pr-20 bg-[#FAF8F5] border border-[#E5E1DC] rounded-lg text-sm text-[#242424] placeholder:text-[#737373] focus:outline-none focus:border-[#8B3A4A] focus:ring-1 focus:ring-[#8B3A4A]"
                autoFocus
              />
              <div className="absolute right-2 flex items-center gap-1.5">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-xs text-[#737373] hover:text-[#242424] px-1.5 py-1"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="submit"
                  className="bg-[#1C1C1C] text-white text-xs px-2.5 py-1 rounded-md hover:bg-[#8B3A4A] transition-colors cursor-pointer"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E5E1DC] bg-white animate-in slide-in-from-top-3 duration-200">
          <div className="px-5 py-6 space-y-5">
            {/* User status card on mobile */}
            {authHydrated && isAuthenticated && user ? (
              <div className="p-3 bg-[#FAF8F5] border border-[#E5E1DC] rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar src={user.avatar} name={user.name} size="sm" />
                  <div>
                    <p className="text-xs font-semibold text-[#1C1C1C]">{user.name}</p>
                    <p className="text-[10px] text-[#737373]">{user.email}</p>
                  </div>
                </div>
                <Badge
                  variant={role === "admin" ? "accent" : role === "supplier" ? "default" : "secondary"}
                  size="sm"
                  className="text-[9px] uppercase"
                >
                  {role}
                </Badge>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full"
                >
                  <Button variant="outline" size="sm" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full"
                >
                  <Button variant="default" size="sm" className="w-full">
                    Register
                  </Button>
                </Link>
              </div>
            )}

            {/* Navigation Links */}
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#737373] mb-2">
                Marketplace
              </p>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2 text-sm font-medium text-[#242424] hover:text-[#8B3A4A]"
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-[#737373]" />
                </Link>
              ))}
            </div>

            {/* Shopping & Wishlist Shortcuts on mobile */}
            <div className="pt-4 border-t border-[#E5E1DC] space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#737373] mb-2">
                Your Bag & Wishlist
              </p>
              <Link
                href="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2 text-sm text-[#242424] hover:text-[#8B3A4A]"
              >
                <span className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#737373]" /> Shopping Bag
                </span>
                <span className="text-xs font-mono font-medium px-2 py-0.5 bg-[#1C1C1C] text-white rounded-full">
                  {cartHydrated ? cartCount : 0}
                </span>
              </Link>
              <Link
                href="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2 text-sm text-[#242424] hover:text-[#8B3A4A]"
              >
                <span className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[#8B3A4A]" /> Wishlist
                </span>
                <span className="text-xs font-mono font-medium px-2 py-0.5 bg-[#8B3A4A] text-white rounded-full">
                  {wishlistHydrated ? wishlistCount : 0}
                </span>
              </Link>
            </div>

            {/* User Account / Portals on mobile */}
            {authHydrated && isAuthenticated && (
              <div className="pt-4 border-t border-[#E5E1DC] space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#737373] mb-2">
                  Account & Portals
                </p>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2 text-sm text-[#242424] hover:text-[#8B3A4A]"
                >
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#737373]" /> My Profile
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#737373]" />
                </Link>
                <Link
                  href="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2 text-sm text-[#242424] hover:text-[#8B3A4A]"
                >
                  <span className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#737373]" /> My Orders
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#737373]" />
                </Link>

                {role === "supplier" && (
                  <Link
                    href="/supplier/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-2 text-sm text-[#242424] hover:text-[#8B3A4A]"
                  >
                    <span className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-[#8B3A4A]" /> Supplier Portal
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#737373]" />
                  </Link>
                )}

                {role === "admin" && (
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-2 text-sm text-[#8B3A4A]"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-[#8B3A4A]" /> Admin Console
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#737373]" />
                  </Link>
                )}

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-between py-2.5 text-sm text-rose-700 hover:text-rose-800 cursor-pointer pt-3"
                >
                  <span className="flex items-center gap-2">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
