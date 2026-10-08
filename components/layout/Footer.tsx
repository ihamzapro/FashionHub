"use client";

import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#1C1C1C] text-white border-t border-neutral-800">
      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-editorial text-2xl tracking-[0.2em] text-white">
                FASHIONHUB
              </span>
            </Link>
            <p className="text-xs text-[#D6D2CC] leading-relaxed max-w-sm">
              FashionHub is a contemporary multi-role fashion marketplace connecting discerning customers with independent ateliers, boutique fashion suppliers, and global design houses.
            </p>
            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#D6D2CC] hover:text-white hover:border-[#8B3A4A] transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.13-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X / Twitter"
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#D6D2CC] hover:text-white hover:border-[#8B3A4A] transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#D6D2CC] hover:text-white hover:border-[#8B3A4A] transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Shop
            </h4>
            <ul className="space-y-2 text-xs text-[#D6D2CC]">
              <li>
                <Link href="/products?category=clothing" className="hover:text-white transition-colors">
                  Clothing & Tailoring
                </Link>
              </li>
              <li>
                <Link href="/products?category=shoes" className="hover:text-white transition-colors">
                  Artisanal Shoes & Boots
                </Link>
              </li>
              <li>
                <Link href="/products?category=accessories" className="hover:text-white transition-colors">
                  Handbags & Accessories
                </Link>
              </li>
              <li>
                <Link href="/products?category=beauty" className="hover:text-white transition-colors">
                  Botanical Beauty & Grooming
                </Link>
              </li>
              <li>
                <Link href="/products?category=lifestyle" className="hover:text-white transition-colors">
                  Watches & Lifestyle Objects
                </Link>
              </li>
              <li>
                <Link href="/new-arrivals" className="text-[#8B3A4A] hover:underline transition-colors font-medium">
                  New Season Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Customer Service
            </h4>
            <ul className="space-y-2 text-xs text-[#D6D2CC]">
              <li>
                <Link href="/account#orders" className="hover:text-white transition-colors">
                  Order Status & Tracking
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Shipping & Customs
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Size & Fitting Guide
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Product Authenticity
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Contact Concierge
                </Link>
              </li>
            </ul>
          </div>

          {/* Suppliers & Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Portals & Suppliers
            </h4>
            <ul className="space-y-2 text-xs text-[#D6D2CC]">
              <li>
                <Link href="/supplier/dashboard" className="hover:text-white transition-colors">
                  Supplier Dashboard
                </Link>
              </li>
              <li>
                <Link href="/supplier/products" className="hover:text-white transition-colors">
                  Inventory Management
                </Link>
              </li>
              <li>
                <Link href="/admin/dashboard" className="hover:text-white transition-colors">
                  Platform Administration
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  Become a Supplier
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Sign In to Account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Legal & Copyright */}
        <div className="pt-12 mt-12 border-t border-neutral-800 flex flex-col md:flex-row items-center justify-between text-xs text-neutral-400 gap-4">
          <p>© {new Date().getFullYear()} FashionHub Inc. All rights reserved. Final Year Project.</p>
          <div className="flex items-center space-x-6">
            <Link href="/" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/" className="hover:text-white transition-colors">
              Cookie Preferences
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
