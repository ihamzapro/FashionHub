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
    >
      {children}
    </DashboardLayout>
  );
}
