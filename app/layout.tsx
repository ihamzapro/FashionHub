import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";
import {
  AuthProvider,
  CartProvider,
  WishlistProvider,
  OrderProvider,
  ProductProvider,
  CategoryProvider,
  ReviewProvider,
} from "@/context";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FashionHub | Premium Multi-Role Fashion Marketplace",
    template: "%s | FashionHub",
  },
  description:
    "Discover curated luxury apparel, designer footwear, artisanal handbags, and timeless accessories across our premium multi-role marketplace.",
  keywords: ["fashion marketplace", "luxury fashion", "artisanal apparel", "designer accessories"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAF8F5] text-[#242424] font-sans selection:bg-[#8B3A4A]/20 selection:text-[#1C1C1C]">
        <ToastProvider>
          <AuthProvider>
            <ProductProvider>
              <CategoryProvider>
                <ReviewProvider>
                  <CartProvider>
                    <WishlistProvider>
                      <OrderProvider>
                        {children}
                      </OrderProvider>
                    </WishlistProvider>
                  </CartProvider>
                </ReviewProvider>
              </CategoryProvider>
            </ProductProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
