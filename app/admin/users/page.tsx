"use client";

import React, { useState, useMemo } from "react";
import { formatDate } from "@/lib/utils";
import { User, UserRole } from "@/lib/types";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Dropdown } from "@/components/ui/Dropdown";
import {
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Power,
  CheckCircle,
  XCircle,
  Shield,
  Store,
  User as UserIcon,
  Users,
  ChevronDown,
  Check,
  RotateCcw,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";

export default function AdminUsersPage() {
  const { toast } = useToast();
  const { users, updateUser, deleteUser, createUser, user: currentUser } = useAuth();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Modals state
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "customer" as UserRole,
    status: "active" as "active" | "inactive" | "suspended",
    storeName: "",
  });

  // Add form state
  const [addFormData, setAddFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "customer" as UserRole,
    status: "active" as "active" | "inactive" | "suspended",
    storeName: "",
    password: "password123",
  });

  // Counts for dropdown badges
  const roleCounts = useMemo(() => {
    return {
      all: users.length,
      customer: users.filter((u) => u.role === "customer").length,
      supplier: users.filter((u) => u.role === "supplier").length,
      admin: users.filter((u) => u.role === "admin").length,
    };
  }, [users]);

  const statusCounts = useMemo(() => {
    return {
      all: users.length,
      active: users.filter((u) => u.status === "active").length,
      inactive: users.filter((u) => u.status === "inactive").length,
      suspended: users.filter((u) => u.status === "suspended").length,
    };
  }, [users]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Role filter
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      // Status filter
      if (statusFilter !== "all") {
        if (statusFilter === "active" && u.status !== "active") return false;
        if (statusFilter === "inactive" && u.status !== "inactive") return false;
        if (statusFilter === "suspended" && u.status !== "suspended") return false;
      }
      // Search
      if (
        search &&
        !u.name.toLowerCase().includes(search.toLowerCase()) &&
        !u.email.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [users, roleFilter, statusFilter, search]);

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "admin":
        return (
          <Badge variant="accent" size="sm" className="gap-1 bg-[#1C1C1C] text-white">
            <Shield className="w-3 h-3" />
            Admin
          </Badge>
        );
      case "supplier":
        return (
          <Badge variant="outline" size="sm" className="gap-1 border-[#8B3A4A] text-[#8B3A4A] bg-[#8B3A4A]/5">
            <Store className="w-3 h-3" />
            Supplier
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" size="sm" className="gap-1">
            <UserIcon className="w-3 h-3" />
            Customer
          </Badge>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="success" size="sm" className="gap-1">
            <CheckCircle className="w-3 h-3" />
            Active
          </Badge>
        );
      case "suspended":
        return (
          <Badge variant="error" size="sm" className="gap-1">
            <XCircle className="w-3 h-3" />
            Suspended
          </Badge>
        );
      default:
        return (
          <Badge variant="warning" size="sm" className="gap-1">
            <XCircle className="w-3 h-3" />
            Inactive
          </Badge>
        );
    }
  };

  const handleToggleStatus = (targetUser: User) => {
    if (targetUser.id === currentUser?.id) {
      toast({
        title: "Action Not Permitted",
        message: "You cannot deactivate your own active administrative session.",
        type: "error",
      });
      return;
    }

    const nextStatus = targetUser.status === "active" ? "inactive" : "active";
    updateUser(targetUser.id, { status: nextStatus });
    toast({
      title: "Account Status Updated",
      message: `${targetUser.name}'s account is now ${nextStatus}.`,
      type: "success",
    });
  };

  const openEditModal = (targetUser: User) => {
    setEditUser(targetUser);
    setEditFormData({
      name: targetUser.name,
      email: targetUser.email,
      phone: targetUser.phone || "",
      role: targetUser.role,
      status: targetUser.status,
      storeName: targetUser.storeName || "",
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;

    updateUser(editUser.id, {
      name: editFormData.name,
      email: editFormData.email,
      phone: editFormData.phone,
      role: editFormData.role,
      status: editFormData.status,
      storeName: editFormData.role === "supplier" ? editFormData.storeName : undefined,
    });

    toast({
      title: "User Updated",
      message: `Account details for ${editFormData.name} have been saved.`,
      type: "success",
    });
    setEditUser(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteUserId) return;
    if (deleteUserId === currentUser?.id) {
      toast({
        title: "Action Restricted",
        message: "You cannot delete your own active administrator account.",
        type: "error",
      });
      setDeleteUserId(null);
      return;
    }

    deleteUser(deleteUserId);
    toast({
      title: "User Deleted",
      message: "The account and its credentials have been removed.",
      type: "info",
    });
    setDeleteUserId(null);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addFormData.name || !addFormData.email) {
      toast({
        title: "Required Fields",
        message: "Please specify user name and email address.",
        type: "error",
      });
      return;
    }

    createUser({
      name: addFormData.name,
      email: addFormData.email,
      phone: addFormData.phone,
      role: addFormData.role,
      status: addFormData.status,
      storeName: addFormData.role === "supplier" ? addFormData.storeName : undefined,
      password: addFormData.password,
    });

    toast({
      title: "Account Created",
      message: `New ${addFormData.role} account created for ${addFormData.name}.`,
      type: "success",
    });

    setIsAddModalOpen(false);
    setAddFormData({
      name: "",
      email: "",
      phone: "",
      role: "customer",
      status: "active",
      storeName: "",
      password: "password123",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1C1C1C]">
            User Management & Access Control
          </h2>
          <p className="text-xs text-[#737373] mt-0.5">
            Audit identities, manage role authorizations, and regulate account states across the marketplace.
          </p>
        </div>

        <Button
          variant="default"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#8B3A4A] hover:bg-[#722F3D] text-white shrink-0"
        >
          Add New User
        </Button>
      </div>

      {/* Filter and Table Card */}
      <Card>
        <CardHeader className="py-4 border-b border-[#E5E1DC]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="w-full lg:max-w-xs">
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-[#737373]" />}
              />
            </div>

            {/* Role & Status Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Role Dropdown */}
              <Dropdown
                align="right"
                className="w-56 p-1.5 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.08)] border-[#E5E1DC] rounded-xl"
                trigger={
                  <button
                    type="button"
                    className={`h-10 px-3.5 rounded-lg border text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                      roleFilter !== "all"
                        ? "bg-[#8B3A4A]/10 border-[#8B3A4A] text-[#8B3A4A] shadow-xs"
                        : "bg-white border-[#E5E1DC] text-[#242424] hover:border-[#8B3A4A]/40 hover:bg-[#FAF8F5]"
                    }`}
                  >
                    <Shield className={`w-3.5 h-3.5 ${roleFilter !== "all" ? "text-[#8B3A4A]" : "text-[#737373]"}`} />
                    <span className="text-[#737373] text-[11px] font-normal">Role:</span>
                    <span className="font-semibold capitalize text-[#1C1C1C]">
                      {roleFilter === "all" ? "All Roles" : roleFilter}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#737373] ml-0.5" />
                  </button>
                }
              >
                <div className="px-3 py-1.5 border-b border-[#E5E1DC]/60 mb-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#737373]">
                    Filter by Role
                  </p>
                </div>

                {[
                  { id: "all", label: "All Roles", icon: Users, count: roleCounts.all },
                  { id: "customer", label: "Customer", icon: UserIcon, count: roleCounts.customer },
                  { id: "supplier", label: "Supplier", icon: Store, count: roleCounts.supplier },
                  { id: "admin", label: "Administrator", icon: Shield, count: roleCounts.admin },
                ].map((item) => {
                  const isSelected = roleFilter === item.id;
                  const IconComp = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setRoleFilter(item.id)}
                      className={`w-full px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-[#8B3A4A]/10 text-[#8B3A4A] font-semibold"
                          : "text-[#242424] hover:bg-[#FAF8F5] hover:text-[#1C1C1C]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <IconComp className={`w-3.5 h-3.5 ${isSelected ? "text-[#8B3A4A]" : "text-[#737373]"}`} />
                        <span>{item.label}</span>
                      </div>
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

              {/* Status Dropdown */}
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
                    <CheckCircle className={`w-3.5 h-3.5 ${statusFilter !== "all" ? "text-[#8B3A4A]" : "text-[#737373]"}`} />
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
                  { id: "all", label: "All Statuses", dot: "bg-[#737373]", count: statusCounts.all },
                  { id: "active", label: "Active", dot: "bg-[#4F7A61]", count: statusCounts.active },
                  { id: "inactive", label: "Inactive", dot: "bg-[#B78628]", count: statusCounts.inactive },
                  { id: "suspended", label: "Suspended", dot: "bg-[#B84A4A]", count: statusCounts.suspended },
                ].map((item) => {
                  const isSelected = statusFilter === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setStatusFilter(item.id)}
                      className={`w-full px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-[#8B3A4A]/10 text-[#8B3A4A] font-semibold"
                          : "text-[#242424] hover:bg-[#FAF8F5] hover:text-[#1C1C1C]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${item.dot}`} />
                        <span>{item.label}</span>
                      </div>
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
              {(roleFilter !== "all" || statusFilter !== "all" || search) && (
                <button
                  type="button"
                  onClick={() => {
                    setRoleFilter("all");
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
                  <th className="py-3 px-6">User</th>
                  <th className="py-3 px-6">Email</th>
                  <th className="py-3 px-6">Role</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Joined Date</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E1DC]">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[#737373]">
                      No accounts found matching your active filters.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                      {/* User Column */}
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={user.avatar}
                            name={user.name}
                            size="sm"
                            className="shrink-0"
                          />
                          <div>
                            <p className="font-semibold text-[#1C1C1C]">{user.name}</p>
                            {user.storeName && (
                              <p className="text-[10px] text-[#8B3A4A] font-medium">
                                {user.storeName}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-6 text-[#737373] font-mono">
                        {user.email}
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-6">
                        {getRoleBadge(user.role)}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-6">
                        {getStatusBadge(user.status)}
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 px-6 text-[#737373]">
                        {formatDate(user.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View */}
                          <button
                            onClick={() => setViewUser(user)}
                            className="p-1.5 text-[#737373] hover:text-[#1C1C1C] hover:bg-[#F1ECE6] rounded-md transition-colors"
                            title="View Account Profile"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => openEditModal(user)}
                            className="p-1.5 text-[#737373] hover:text-[#8B3A4A] hover:bg-[#8B3A4A]/10 rounded-md transition-colors"
                            title="Edit User"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Activate / Deactivate */}
                          <button
                            onClick={() => handleToggleStatus(user)}
                            className={`p-1.5 rounded-md transition-colors ${
                              user.status === "active"
                                ? "text-[#4F7A61] hover:bg-[#4F7A61]/10"
                                : "text-[#B78628] hover:bg-[#B78628]/10"
                            }`}
                            title={user.status === "active" ? "Deactivate Account" : "Activate Account"}
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setDeleteUserId(user.id)}
                            className="p-1.5 text-[#B84A4A] hover:bg-[#B84A4A]/10 rounded-md transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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

      {/* View User Modal */}
      {viewUser && (
        <Modal
          isOpen={Boolean(viewUser)}
          onClose={() => setViewUser(null)}
          title="Account Profile Inspection"
        >
          <div className="space-y-5">
            <div className="flex items-center gap-4 p-4 bg-[#FAF8F5] rounded-xl border border-[#E5E1DC]">
              <Avatar
                src={viewUser.avatar}
                name={viewUser.name}
                size="lg"
                className="shrink-0"
              />
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-[#1C1C1C]">{viewUser.name}</h3>
                <p className="text-xs font-mono text-[#737373]">{viewUser.email}</p>
                <div className="flex items-center gap-2 pt-1">
                  {getRoleBadge(viewUser.role)}
                  {getStatusBadge(viewUser.status)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-white border border-[#E5E1DC] rounded-lg">
                <span className="text-[#737373] block text-[10px] uppercase tracking-wider">Account ID</span>
                <span className="font-mono font-medium text-[#1C1C1C]">{viewUser.id}</span>
              </div>
              <div className="p-3 bg-white border border-[#E5E1DC] rounded-lg">
                <span className="text-[#737373] block text-[10px] uppercase tracking-wider">Contact Phone</span>
                <span className="font-medium text-[#1C1C1C]">{viewUser.phone || "Not specified"}</span>
              </div>
              {viewUser.storeName && (
                <div className="col-span-2 p-3 bg-white border border-[#E5E1DC] rounded-lg">
                  <span className="text-[#737373] block text-[10px] uppercase tracking-wider">Atelier / Store Name</span>
                  <span className="font-semibold text-[#8B3A4A]">{viewUser.storeName}</span>
                </div>
              )}
              <div className="col-span-2 p-3 bg-white border border-[#E5E1DC] rounded-lg">
                <span className="text-[#737373] block text-[10px] uppercase tracking-wider">Address</span>
                <span className="text-[#242424]">
                  {viewUser.address?.street
                    ? `${viewUser.address.street}, ${viewUser.address.city}, ${viewUser.address.country}`
                    : "No physical address registered"}
                </span>
              </div>
              <div className="p-3 bg-white border border-[#E5E1DC] rounded-lg">
                <span className="text-[#737373] block text-[10px] uppercase tracking-wider">Joined Platform</span>
                <span className="text-[#1C1C1C]">{formatDate(viewUser.createdAt)}</span>
              </div>
              <div className="p-3 bg-white border border-[#E5E1DC] rounded-lg">
                <span className="text-[#737373] block text-[10px] uppercase tracking-wider">Last Modified</span>
                <span className="text-[#1C1C1C]">
                  {viewUser.updatedAt ? formatDate(viewUser.updatedAt) : "Initial Registration"}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="outline" size="sm" onClick={() => setViewUser(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit User Modal */}
      {editUser && (
        <Modal
          isOpen={Boolean(editUser)}
          onClose={() => setEditUser(null)}
          title={`Edit Account: ${editUser.name}`}
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <Input
              label="Full Name"
              value={editFormData.name}
              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              required
            />
            <Input
              label="Email Address"
              type="email"
              value={editFormData.email}
              onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
              required
            />
            <Input
              label="Contact Phone"
              value={editFormData.phone}
              onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
            />

            {editFormData.role === "supplier" && (
              <Input
                label="Store / Atelier Name"
                value={editFormData.storeName}
                onChange={(e) => setEditFormData({ ...editFormData, storeName: e.target.value })}
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#242424] block">Role</label>
                <select
                  value={editFormData.role}
                  onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value as UserRole })}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E5E1DC] rounded-lg focus:outline-none focus:border-[#8B3A4A]"
                >
                  <option value="customer">Customer</option>
                  <option value="supplier">Supplier</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#242424] block">Account Status</label>
                <select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value as "active" | "inactive" | "suspended" })}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E5E1DC] rounded-lg focus:outline-none focus:border-[#8B3A4A]"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-[#E5E1DC]">
              <Button type="button" variant="outline" size="sm" onClick={() => setEditUser(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="default" size="sm" className="bg-[#8B3A4A] text-white">
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add User Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Create New Platform Account"
        >
          <form onSubmit={handleCreateUser} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="e.g. Marc Jacobs"
              value={addFormData.name}
              onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
              required
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. m.jacobs@example.com"
              value={addFormData.email}
              onChange={(e) => setAddFormData({ ...addFormData, email: e.target.value })}
              required
            />
            <Input
              label="Initial Password"
              type="password"
              value={addFormData.password}
              onChange={(e) => setAddFormData({ ...addFormData, password: e.target.value })}
              required
            />
            <Input
              label="Contact Phone (Optional)"
              placeholder="+1 (555) 000-0000"
              value={addFormData.phone}
              onChange={(e) => setAddFormData({ ...addFormData, phone: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#242424] block">Role</label>
                <select
                  value={addFormData.role}
                  onChange={(e) => setAddFormData({ ...addFormData, role: e.target.value as UserRole })}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E5E1DC] rounded-lg focus:outline-none focus:border-[#8B3A4A]"
                >
                  <option value="customer">Customer</option>
                  <option value="supplier">Supplier</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#242424] block">Status</label>
                <select
                  value={addFormData.status}
                  onChange={(e) => setAddFormData({ ...addFormData, status: e.target.value as "active" | "inactive" | "suspended" })}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E5E1DC] rounded-lg focus:outline-none focus:border-[#8B3A4A]"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            {addFormData.role === "supplier" && (
              <Input
                label="Store / Atelier Name"
                placeholder="e.g. Mercer & Co. Garments"
                value={addFormData.storeName}
                onChange={(e) => setAddFormData({ ...addFormData, storeName: e.target.value })}
              />
            )}

            <div className="flex justify-end gap-2 pt-4 border-t border-[#E5E1DC]">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="default" size="sm" className="bg-[#8B3A4A] text-white">
                Create User
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteUserId && (
        <Modal
          isOpen={Boolean(deleteUserId)}
          onClose={() => setDeleteUserId(null)}
          title="Confirm User Deletion"
        >
          <div className="space-y-4">
            <p className="text-xs text-[#737373]">
              Are you sure you want to permanently delete this user account? All access permissions and account sessions will be revoked immediately.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setDeleteUserId(null)}>
                Cancel
              </Button>
              <Button variant="default" size="sm" className="bg-[#B84A4A] hover:bg-[#9B3838] text-white" onClick={handleConfirmDelete}>
                Delete Account
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
