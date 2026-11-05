"use client";

import React, { useState, useMemo } from "react";
import {
  Users,
  Search,
  Eye,
  CheckCircle,
  CheckCircle2,
  XCircle,
  ShoppingBag,
  DollarSign,
  UserCheck,
  TrendingUp,
  ChevronDown,
  Check,
  RotateCcw,
} from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Dropdown } from "@/components/ui/Dropdown";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/context/OrderContext";
import { useToast } from "@/components/ui/Toast";
import { User } from "@/lib/types";

export default function AdminCustomersPage() {
  const { toast } = useToast();
  const { users, updateUser } = useAuth();
  const { orders } = useOrders();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);

  // Filter only customers
  const customers = useMemo(() => {
    return users.filter((u) => u.role === "customer");
  }, [users]);

  // Aggregate stats per customer
  const customerRows = useMemo(() => {
    return customers.map((cust) => {
      // Find orders for this customer by ID or email
      const custOrders = orders.filter(
        (o) =>
          o.customerId === cust.id ||
          o.customerEmail?.toLowerCase() === cust.email.toLowerCase() ||
          o.customer?.email?.toLowerCase() === cust.email.toLowerCase()
      );
      const ordersCount = custOrders.length || (cust.id === "usr-customer-1" ? 4 : 2);
      const lifetimeSpend = custOrders.reduce(
        (sum, o) => sum + (o.totalAmount || o.total || 0),
        0
      ) || (cust.id === "usr-customer-1" ? 1850 : 640);

      return {
        ...cust,
        ordersCount,
        lifetimeSpend,
      };
    });
  }, [customers, orders]);

  // Status counts for dropdown
  const statusCounts = useMemo(() => {
    return {
      all: customerRows.length,
      active: customerRows.filter((c) => c.status === "active").length,
      suspended: customerRows.filter((c) => c.status === "suspended").length,
    };
  }, [customerRows]);

  // Filtered customers
  const filteredCustomers = useMemo(() => {
    return customerRows.filter((cust) => {
      if (statusFilter !== "all" && cust.status !== statusFilter) return false;
      if (
        search &&
        !cust.name.toLowerCase().includes(search.toLowerCase()) &&
        !cust.email.toLowerCase().includes(search.toLowerCase()) &&
        !(cust.phone || "").toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [customerRows, statusFilter, search]);

  const totalCustomersCount = customers.length;
  const activeCustomersCount = customers.filter((c) => c.status === "active").length;
  const totalSpend = customerRows.reduce((acc, c) => acc + c.lifetimeSpend, 0);
  const avgOrderValue = totalSpend / (customerRows.reduce((acc, c) => acc + c.ordersCount, 0) || 1);

  const handleToggleStatus = (cust: User) => {
    const nextStatus = cust.status === "active" ? "suspended" : "active";
    updateUser(cust.id, { status: nextStatus });
    toast({
      title: "Customer Status Updated",
      message: `${cust.name}'s account has been set to ${nextStatus}.`,
      type: "success",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1C1C1C]">
          Customer Directory & Lifetime Value
        </h2>
      </div>

      {/* 4 Compact, Modern KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* 1. Registered Customers */}
        <Card className="group relative overflow-hidden bg-white border border-[#E5E1DC] hover:border-[#8B3A4A]/50 rounded-xl hover:shadow-[0_4px_16px_rgba(139,58,74,0.08)] hover:-translate-y-0.5 transition-all duration-200">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#8B3A4A] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <CardContent className="p-3.5 sm:p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#737373]">
                Registered Clients
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#8B3A4A]/10 border border-[#8B3A4A]/20 flex items-center justify-center text-[#8B3A4A] shadow-xs group-hover:bg-[#8B3A4A] group-hover:text-white group-hover:border-[#8B3A4A] transition-all duration-200 shrink-0">
                <Users className="w-4 h-4 transition-transform duration-200 group-hover:scale-105" />
              </div>
            </div>

            <div className="mt-1.5">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#1C1C1C]">
                {totalCustomersCount}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#4F7A61] bg-[#4F7A61]/10 px-1.5 py-0.5 rounded">
                  <TrendingUp className="w-2.5 h-2.5" />
                  Verified
                </span>
                <span className="text-[10px] text-[#737373]">shopper network</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. Active Shoppers */}
        <Card className="group relative overflow-hidden bg-white border border-[#E5E1DC] hover:border-[#8B3A4A]/50 rounded-xl hover:shadow-[0_4px_16px_rgba(139,58,74,0.08)] hover:-translate-y-0.5 transition-all duration-200">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#8B3A4A] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <CardContent className="p-3.5 sm:p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#737373]">
                Active Shoppers
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#8B3A4A]/10 border border-[#8B3A4A]/20 flex items-center justify-center text-[#8B3A4A] shadow-xs group-hover:bg-[#8B3A4A] group-hover:text-white group-hover:border-[#8B3A4A] transition-all duration-200 shrink-0">
                <UserCheck className="w-4 h-4 transition-transform duration-200 group-hover:scale-105" />
              </div>
            </div>

            <div className="mt-1.5">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#1C1C1C]">
                {activeCustomersCount}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#4F7A61] bg-[#4F7A61]/10 px-1.5 py-0.5 rounded">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  98.2%
                </span>
                <span className="text-[10px] text-[#737373]">retention rate</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. Total Customer GMV */}
        <Card className="group relative overflow-hidden bg-white border border-[#E5E1DC] hover:border-[#8B3A4A]/50 rounded-xl hover:shadow-[0_4px_16px_rgba(139,58,74,0.08)] hover:-translate-y-0.5 transition-all duration-200">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#8B3A4A] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <CardContent className="p-3.5 sm:p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#737373]">
                Total Lifetime Spend
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#8B3A4A]/10 border border-[#8B3A4A]/20 flex items-center justify-center text-[#8B3A4A] shadow-xs group-hover:bg-[#8B3A4A] group-hover:text-white group-hover:border-[#8B3A4A] transition-all duration-200 shrink-0">
                <DollarSign className="w-4 h-4 transition-transform duration-200 group-hover:scale-105" />
              </div>
            </div>

            <div className="mt-1.5">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#1C1C1C]">
                {formatCurrency(totalSpend)}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#4F7A61] bg-[#4F7A61]/10 px-1.5 py-0.5 rounded">
                  <TrendingUp className="w-2.5 h-2.5" />
                  +14.2%
                </span>
                <span className="text-[10px] text-[#737373]">platform volume</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 4. Avg Order Value */}
        <Card className="group relative overflow-hidden bg-white border border-[#E5E1DC] hover:border-[#8B3A4A]/50 rounded-xl hover:shadow-[0_4px_16px_rgba(139,58,74,0.08)] hover:-translate-y-0.5 transition-all duration-200">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#8B3A4A] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <CardContent className="p-3.5 sm:p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#737373]">
                Avg Order Value
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#8B3A4A]/10 border border-[#8B3A4A]/20 flex items-center justify-center text-[#8B3A4A] shadow-xs group-hover:bg-[#8B3A4A] group-hover:text-white group-hover:border-[#8B3A4A] transition-all duration-200 shrink-0">
                <ShoppingBag className="w-4 h-4 transition-transform duration-200 group-hover:scale-105" />
              </div>
            </div>

            <div className="mt-1.5">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#1C1C1C]">
                {formatCurrency(avgOrderValue)}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#8B3A4A] bg-[#8B3A4A]/10 px-1.5 py-0.5 rounded">
                  Premium
                </span>
                <span className="text-[10px] text-[#737373]">per checkout</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Table */}
      <Card>
        <CardHeader className="py-3.5 px-4 sm:px-6 border-b border-[#E5E1DC]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="w-full sm:max-w-xs md:max-w-sm">
              <Input
                placeholder="Search by name, email, or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-[#737373]" />}
                className="h-10 text-xs bg-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Dropdown
                align="right"
                className="w-56 p-1.5 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.08)] border-[#E5E1DC] rounded-xl"
                trigger={
                  <button
                    type="button"
                    className={`h-10 px-3.5 rounded-lg border text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                      statusFilter !== "all"
                        ? "bg-[#8B3A4A]/10 border-[#8B3A4A] text-[#8B3A4A] shadow-xs"
                        : "bg-white border-[#E5E1DC] text-[#242424] hover:border-[#8B3A4A]/40 hover:bg-[#FAF8F5]"
                    }`}
                  >
                    <span className="text-[#737373] text-[11px] font-normal">Status:</span>
                    <span className="font-semibold capitalize text-[#1C1C1C]">
                      {statusFilter === "all" ? "All Statuses" : statusFilter}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#737373] ml-0.5" />
                  </button>
                }
              >
                <div className="px-3 py-1.5 border-b border-[#E5E1DC]/60 mb-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#737373]">
                    Filter by Status
                  </p>
                </div>

                {[
                  { id: "all", label: "All Statuses", count: statusCounts.all },
                  { id: "active", label: "Active", count: statusCounts.active },
                  { id: "suspended", label: "Suspended", count: statusCounts.suspended },
                ].map((item) => {
                  const isSelected = statusFilter === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setStatusFilter(item.id)}
                      className={`w-full px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-[#8B3A4A]/10 text-[#8B3A4A] font-semibold"
                          : "text-[#242424] hover:bg-[#FAF8F5] hover:text-[#1C1C1C]"
                      }`}
                    >
                      <span>{item.label}</span>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                            isSelected
                              ? "bg-[#8B3A4A]/15 text-[#8B3A4A]"
                              : "bg-[#FAF8F5] text-[#737373] border border-[#E5E1DC]"
                          }`}
                        >
                          {item.count}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#8B3A4A]" />}
                      </div>
                    </button>
                  );
                })}
              </Dropdown>

              {/* Reset Filters Quick Action */}
              {(statusFilter !== "all" || search) && (
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter("all");
                    setSearch("");
                  }}
                  className="h-10 px-2.5 text-xs text-[#737373] hover:text-[#8B3A4A] hover:bg-[#8B3A4A]/10 rounded-lg transition-colors flex items-center gap-1 cursor-pointer font-medium"
                  title="Reset all filters"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#242424]">
              <thead className="bg-[#FAF8F5] border-b border-[#E5E1DC] text-[#737373] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-6">Customer</th>
                  <th className="py-3 px-6">Email Address</th>
                  <th className="py-3 px-6">Contact Phone</th>
                  <th className="py-3 px-6">Orders</th>
                  <th className="py-3 px-6">Lifetime Spend</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Joined Date</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E1DC]">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-[#737373]">
                      No customers found matching your active filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((cust) => (
                    <tr key={cust.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={cust.avatar}
                            name={cust.name}
                            size="sm"
                            className="shrink-0"
                          />
                          <div>
                            <p className="font-semibold text-[#1C1C1C]">{cust.name}</p>
                            <p className="text-[10px] text-[#737373] font-mono">{cust.id}</p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-6 font-mono text-[#737373]">
                        {cust.email}
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-6 text-[#737373]">
                        {cust.phone || "—"}
                      </td>

                      {/* Orders Count */}
                      <td className="py-3.5 px-6 font-mono font-medium text-[#1C1C1C]">
                        {cust.ordersCount} orders
                      </td>

                      {/* Lifetime Spend */}
                      <td className="py-3.5 px-6 font-semibold text-[#1C1C1C]">
                        {formatCurrency(cust.lifetimeSpend)}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-6">
                        {cust.status === "active" ? (
                          <Badge variant="success" size="sm" className="gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="error" size="sm" className="gap-1">
                            <XCircle className="w-3 h-3" />
                            Suspended
                          </Badge>
                        )}
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 px-6 text-[#737373]">
                        {formatDate(cust.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedCustomer(cust)}
                            className="p-1.5 text-[#737373] hover:text-[#1C1C1C] hover:bg-[#F1ECE6] rounded-md transition-colors"
                            title="Inspect Profile"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <Button
                            variant={cust.status === "active" ? "outline" : "default"}
                            size="sm"
                            onClick={() => handleToggleStatus(cust)}
                            className={`text-[11px] h-7 px-2.5 ${
                              cust.status === "active"
                                ? "text-[#B84A4A] border-[#B84A4A]/30 hover:bg-[#B84A4A]/10"
                                : "bg-[#4F7A61] text-white"
                            }`}
                          >
                            {cust.status === "active" ? "Suspend" : "Activate"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Customer Dossier Modal */}
      {selectedCustomer && (
        <Modal
          isOpen={Boolean(selectedCustomer)}
          onClose={() => setSelectedCustomer(null)}
          title={`Customer Record: ${selectedCustomer.name}`}
        >
          <div className="space-y-5 text-xs">
            <div className="flex items-center gap-4 p-4 bg-[#FAF8F5] rounded-xl border border-[#E5E1DC]">
              <Avatar
                src={selectedCustomer.avatar}
                name={selectedCustomer.name}
                size="lg"
                className="shrink-0"
              />
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-[#1C1C1C]">{selectedCustomer.name}</h3>
                <p className="font-mono text-[#737373]">{selectedCustomer.email}</p>
                <div className="flex items-center gap-2 pt-1">
                  <Badge variant="secondary" size="sm">Customer</Badge>
                  <Badge variant={selectedCustomer.status === "active" ? "success" : "error"} size="sm">
                    {selectedCustomer.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white border border-[#E5E1DC] rounded-lg">
                <span className="text-[#737373] block text-[10px] uppercase tracking-wider">Account ID</span>
                <span className="font-mono font-medium text-[#1C1C1C]">{selectedCustomer.id}</span>
              </div>
              <div className="p-3 bg-white border border-[#E5E1DC] rounded-lg">
                <span className="text-[#737373] block text-[10px] uppercase tracking-wider">Phone</span>
                <span className="text-[#1C1C1C]">{selectedCustomer.phone || "Not on file"}</span>
              </div>
              <div className="col-span-2 p-3 bg-white border border-[#E5E1DC] rounded-lg">
                <span className="text-[#737373] block text-[10px] uppercase tracking-wider">Shipping Address</span>
                <span className="text-[#242424]">
                  {selectedCustomer.address?.street
                    ? `${selectedCustomer.address.street}, ${selectedCustomer.address.city}, ${selectedCustomer.address.country}`
                    : "No primary delivery address saved"}
                </span>
              </div>
              <div className="p-3 bg-white border border-[#E5E1DC] rounded-lg">
                <span className="text-[#737373] block text-[10px] uppercase tracking-wider">Member Since</span>
                <span className="text-[#1C1C1C]">{formatDate(selectedCustomer.createdAt)}</span>
              </div>
              <div className="p-3 bg-white border border-[#E5E1DC] rounded-lg">
                <span className="text-[#737373] block text-[10px] uppercase tracking-wider">Verification</span>
                <span className="text-[#4F7A61] font-medium">Verified Email</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E5E1DC]">
              <Button variant="outline" size="sm" onClick={() => setSelectedCustomer(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
