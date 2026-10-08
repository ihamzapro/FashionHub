import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout
      role="admin"
      title="Platform Governance & Operations"
      description="Supervise marketplace activities, verify fashion suppliers, audit product listings, and generate system reports."
    >
      {children}
    </DashboardLayout>
  );
}
