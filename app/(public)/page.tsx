import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { ProductGrid } from "@/components/product";
import { mockCategories, getNewArrivals, getTrendingProducts } from "@/lib/mock-data";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  const newArrivals = getNewArrivals().slice(0, 4);
  const trendingProducts = getTrendingProducts().slice(0, 4);

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* 1. Hero Section */}
      <section className="relative bg-[#FAF8F5] overflow-hidden border-b border-[#E5E1DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 lg:pt-10 pb-8 sm:pb-10 lg:pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Hero Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B3A4A]/10 text-[#8B3A4A] text-xs uppercase tracking-widest font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Autumn / Winter 2026 Editorial</span>
              </div>

              <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-[#1C1C1C] leading-[1.08]">
                Discover Your Style
              </h1>

              <p className="text-sm sm:text-base text-[#737373] max-w-xl leading-relaxed font-light">
                Explore an ecosystem connecting independent fashion suppliers, master craftspeople, and discerning collectors. Timeless silhouettes cut from uncompromised textiles.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link href="/products">
                  <Button variant="default" size="lg" className="w-full sm:w-auto gap-2">
                    <span>Shop Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/categories">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Explore Collections
                  </Button>
                </Link>
              </div>

              {/* Quick metrics */}
              <div className="pt-6 border-t border-[#E5E1DC] grid grid-cols-3 gap-6 max-w-lg">
                <div>
                  <p className="font-editorial text-2xl font-normal text-[#1C1C1C]">150+</p>
                  <p className="text-[11px] text-[#737373] uppercase tracking-wider mt-0.5">Verified Ateliers</p>
                </div>
                <div>
                  <p className="font-editorial text-2xl font-normal text-[#1C1C1C]">100%</p>
                  <p className="text-[11px] text-[#737373] uppercase tracking-wider mt-0.5">Traceable Origin</p>
                </div>
                <div>
                  <p className="font-editorial text-2xl font-normal text-[#1C1C1C]">4.9 / 5</p>
                  <p className="text-[11px] text-[#737373] uppercase tracking-wider mt-0.5">Buyer Rating</p>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.08)] border border-[#E5E1DC]">
                <Image
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop"
                  alt="FashionHub Editorial Lifestyle"
                  fill
                  priority
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
                  <span className="text-[10px] uppercase tracking-widest font-mono text-neutral-300">
                    Featured Lookbook
                  </span>
                  <h3 className="font-editorial text-xl sm:text-2xl font-light">
                    Maison Nord: Raw Silk & Cashmere
                  </h3>
                  <Link
                    href="/products?category=clothing"
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#FAF8F5] hover:text-[#8B3A4A] mt-2 font-medium"
                  >
                    <span>View Lookbook</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Categories (Clothing, Shoes, Accessories, Beauty, Lifestyle, Seasonal Collections) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#8B3A4A]">
              Curated Universes
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#1C1C1C] mt-1 font-normal">
              Featured Categories
            </h2>
          </div>
          <Link
            href="/categories"
            className="text-xs font-semibold uppercase tracking-wider text-[#242424] hover:text-[#8B3A4A] inline-flex items-center gap-1.5 transition-colors"
          >
            <span>All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#E5E1DC] shadow-xs hover:shadow-xl transition-all duration-300"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-[10px] uppercase tracking-widest text-neutral-300 font-mono">
                  {cat.productCount} Pieces
                </span>
                <h3 className="font-editorial text-2xl font-normal group-hover:text-[#FAF8F5] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-neutral-300 line-clamp-1 mt-1 font-light">
                  {cat.description}
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs text-white group-hover:text-[#8B3A4A] mt-2 font-medium transition-colors">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#8B3A4A]">
              Freshly Dropped
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#1C1C1C] mt-1 font-normal">
              New Arrivals
            </h2>
          </div>
          <Link
            href="/new-arrivals"
            className="text-xs font-semibold uppercase tracking-wider text-[#242424] hover:text-[#8B3A4A] inline-flex items-center gap-1.5 transition-colors"
          >
            <span>View All New Arrivals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <ProductGrid products={newArrivals} columns={4} />
      </section>

      {/* 4. Trending Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#8B3A4A]">
              Community Favorites
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#1C1C1C] mt-1 font-normal">
              Trending Products
            </h2>
          </div>
          <Link
            href="/products?filter=trending"
            className="text-xs font-semibold uppercase tracking-wider text-[#242424] hover:text-[#8B3A4A] inline-flex items-center gap-1.5 transition-colors"
          >
            <span>Explore All Trending</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <ProductGrid products={trendingProducts} columns={4} />
      </section>
    </div>
  );
}
