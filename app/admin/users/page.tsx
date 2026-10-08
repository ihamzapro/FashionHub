"use client";

import React, { useState } from "react";
import { mockUsers } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Search } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export default function AdminUsersPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const filteredUsers = mockUsers.filter((u) => {
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    if (
      search &&
      !u.name.toLowerCase().includes(search.toLowerCase()) &&
      !u.email.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge variant="accent">Administrator</Badge>;
      case "supplier":
        return <Badge variant="default">Supplier</Badge>;
      default:
        return <Badge variant="secondary">Customer</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1C1C1C]">
          Platform User Accounts
        </h2>
        <p className="text-xs text-[#737373] mt-0.5">
          Audit customer identities, manage supplier credentials, and assign permissions.
        </p>
      </div>

      {/* Filter and Table Card */}
      <Card>
        <CardHeader className="py-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="w-full sm:max-w-sm">
              <Input
                placeholder="Search user by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-[#737373]" />}
              />
            </div>

            <div className="flex items-center gap-2">
              {["all", "customer", "supplier", "admin"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-colors ${
                    roleFilter === r
                      ? "bg-[#1C1C1C] text-white"
                      : "bg-[#FAF8F5] border border-[#E5E1DC] text-[#737373] hover:text-[#1C1C1C]"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#242424]">
              <thead className="bg-[#FAF8F5] border-b border-[#E5E1DC] text-[#737373] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-6">User</th>
                  <th className="py-3 px-6">Role</th>
                  <th className="py-3 px-6">Store / Details</th>
                  <th className="py-3 px-6">Registration Date</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E1DC]">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <Avatar src={user.avatar} name={user.name} size="sm" />
                        <div>
                          <p className="font-semibold text-[#1C1C1C]">{user.name}</p>
                          <p className="text-[11px] text-[#737373]">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-6">{getRoleBadge(user.role)}</td>
                    <td className="py-3.5 px-6 text-[#737373]">
                      {user.storeName || user.bio || "Standard Member"}
                    </td>
                    <td className="py-3.5 px-6 text-[#737373]">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="py-3.5 px-6">
                      <Badge variant="success" size="sm">
                        Active
                      </Badge>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          toast({
                            title: "User Management",
                            message: `User permissions for ${user.name} will be editable in Phase 2.`,
                            type: "info",
                          })
                        }
                        className="text-[11px] h-7 px-2.5"
                      >
                        Manage
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
