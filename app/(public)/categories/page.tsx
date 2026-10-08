import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { mockCategories } from "@/lib/mock-data";

export default function CategoriesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Intro */}
      <div className="border-b border-[#E5E1DC] pb-8">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-[#8B3A4A]">
          Fashion Universes
        </span>
        <h1 className="font-editorial text-3xl sm:text-5xl text-[#1C1C1C] mt-1 font-normal">
          Browse by Category
        </h1>
        <p className="text-xs sm:text-sm text-[#737373] mt-2 max-w-2xl font-light leading-relaxed">
          Explore curated departments from contemporary tailoring and rare Japanese denim to fine timepieces and restorative botanical skincare.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockCategories.map((category) => (
          <Link
            key={category.id}
            href={`/products?category=${category.slug}`}
            className="group block bg-white border border-[#E5E1DC] rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:border-[#D6D2CC] transition-all duration-300"
          >
            {/* Image */}
            <div className="relative aspect-[4/3] w-full bg-[#F1ECE6] overflow-hidden">
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] font-mono font-medium text-[#242424] shadow-xs">
                {category.productCount} Items
              </div>
            </div>

            {/* Info */}
            <div className="p-6 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-editorial text-2xl text-[#1C1C1C] group-hover:text-[#8B3A4A] transition-colors">
                  {category.name}
                </h3>
                <span className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#E5E1DC] flex items-center justify-center text-[#242424] group-hover:bg-[#8B3A4A] group-hover:text-white transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
              <p className="text-xs text-[#737373] leading-relaxed line-clamp-2">
                {category.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
