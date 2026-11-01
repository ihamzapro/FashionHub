import React from "react";
import { mockProducts } from "@/lib/mock-data";
import { EditProductClient } from "./EditProductClient";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return mockProducts.map((p) => ({
    id: p.id,
  }));
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  return <EditProductClient id={id} />;
}
