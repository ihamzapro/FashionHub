import React from "react";
import { notFound } from "next/navigation";
import {
  getProductById,
  mockProducts,
  getReviewsByProductId,
} from "@/lib/mock-data";
import { ProductDetailsClient } from "./ProductDetailsClient";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return mockProducts.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    return notFound();
  }

  const reviews = getReviewsByProductId(product.id);
  const relatedProducts = mockProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <ProductDetailsClient
      product={product}
      reviews={reviews}
      relatedProducts={relatedProducts}
    />
  );
}
