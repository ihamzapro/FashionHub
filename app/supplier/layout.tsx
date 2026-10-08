import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function SupplierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout
      role="supplier"
      title="Supplier Merchant Portal"
      description="Manage your artisanal collections, monitor inventory, and fulfill customer orders."
    >
      {children}
    </DashboardLayout>
  );
}
