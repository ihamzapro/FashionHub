import React from "react";
import { mockOrders } from "@/lib/mock-data";
import { OrderDetailsClient } from "./OrderDetailsClient";

interface OrderPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return mockOrders.map((order) => ({
    id: order.id,
  }));
}

export default async function OrderDetailPage({ params }: OrderPageProps) {
  const { id } = await params;

  return <OrderDetailsClient orderId={id} />;
}
