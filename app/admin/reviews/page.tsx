"use client";

import React, { useState, useMemo } from "react";
import {
  MessageSquare,
  Search,
  Check,
  X,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  Star,
  TrendingUp,
  AlertCircle,
  XCircle,
  ShieldAlert,
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Dropdown } from "@/components/ui/Dropdown";
import { RatingStars } from "@/components/product/RatingStars";
import { useToast } from "@/components/ui/Toast";
import { useReviews } from "@/context/ReviewContext";
import { useProducts } from "@/context/ProductContext";
import { Review } from "@/lib/types";

export default function AdminReviewsPage() {
  const { toast } = useToast();
  const { reviews, approveReview, rejectReview, deleteReview } = useReviews();
  const { products } = useProducts();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  // Filter reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const currentStatus = r.status || "approved";
      if (statusFilter !== "all" && currentStatus !== statusFilter) {
        return false;
      }

      if (search) {
        const prod = products.find((p) => p.id === r.productId);
        const prodTitle = prod?.title.toLowerCase() || "";
        const customer = r.customerName.toLowerCase();
        const title = r.title.toLowerCase();
        const comment = r.comment.toLowerCase();
        const q = search.toLowerCase();

        if (
          !customer.includes(q) &&
          !title.includes(q) &&
          !comment.includes(q) &&
          !prodTitle.includes(q)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [reviews, statusFilter, search, products]);

  // Statistics
  const pendingCount = reviews.filter((r) => r.status === "pending").length;
  const approvedCount = reviews.filter((r) => r.status === "approved" || !r.status).length;
  const rejectedCount = reviews.filter((r) => r.status === "rejected").length;
  const avgRating = useMemo(() => {
    if (reviews.length === 0) return "5.0";
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 5), 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  const statusOptions = [
    { id: "all", label: "All Statuses" },
    { id: "pending", label: "Pending" },
    { id: "approved", label: "Approved" },
    { id: "rejected", label: "Rejected" },
  ];

  const statusCounts = useMemo(() => {
    return {
      all: reviews.length,
      pending: pendingCount,
      approved: approvedCount,
      rejected: rejectedCount,
    };
  }, [reviews.length, pendingCount, approvedCount, rejectedCount]);

  const handleApprove = (id: string) => {
    approveReview(id);
    toast({
      title: "Review Approved",
      message: "The review has been verified and is now publicly visible on the storefront.",
      type: "success",
    });
    if (selectedReview && selectedReview.id === id) {
      setSelectedReview((prev) => (prev ? { ...prev, status: "approved" } : null));
    }
  };

  const handleReject = (id: string) => {
    rejectReview(id);
    toast({
      title: "Review Rejected",
      message: "The review has been rejected and will remain hidden from the storefront.",
      type: "info",
    });
    if (selectedReview && selectedReview.id === id) {
      setSelectedReview((prev) => (prev ? { ...prev, status: "rejected" } : null));
    }
  };

  const handleDelete = (id: string) => {
    deleteReview(id);
    toast({
      title: "Review Deleted",
      message: "The customer review has been permanently removed.",
      type: "info",
    });
    if (selectedReview && selectedReview.id === id) {
      setSelectedReview(null);
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="success" size="sm" className="gap-1">
            <Check className="w-3 h-3" />
            Approved (Live)
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="error" size="sm" className="gap-1">
            <X className="w-3 h-3" />
            Rejected
          </Badge>
        );
      case "pending":
      default:
        return (
          <Badge variant="warning" size="sm" className="gap-1">
            <Clock className="w-3 h-3" />
            Pending Review
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1C1C1C]">
          Review & Community Feedback Moderation
        </h2>
      </div>

      {/* 4 Compact, Modern KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* 1. Total Reviews */}
        <Card className="group relative overflow-hidden bg-white border border-[#E5E1DC] hover:border-[#8B3A4A]/50 rounded-xl hover:shadow-[0_4px_16px_rgba(139,58,74,0.08)] hover:-translate-y-0.5 transition-all duration-200">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#8B3A4A] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <CardContent className="p-3.5 sm:p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#737373]">
                Total Reviews
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#8B3A4A]/10 border border-[#8B3A4A]/20 flex items-center justify-center text-[#8B3A4A] shadow-xs group-hover:bg-[#8B3A4A] group-hover:text-white group-hover:border-[#8B3A4A] transition-all duration-200 shrink-0">
                <MessageSquare className="w-4 h-4 transition-transform duration-200 group-hover:scale-105" />
              </div>
            </div>

            <div className="mt-1.5">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#1C1C1C]">
                {reviews.length}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#8B3A4A] bg-[#8B3A4A]/10 px-1.5 py-0.5 rounded">
                  <Star className="w-2.5 h-2.5 fill-current" />
                  {avgRating} Avg
                </span>
                <span className="text-[10px] text-[#737373]">customer feedback</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. Pending Moderation */}
        <Card className="group relative overflow-hidden bg-white border border-[#E5E1DC] hover:border-[#8B3A4A]/50 rounded-xl hover:shadow-[0_4px_16px_rgba(139,58,74,0.08)] hover:-translate-y-0.5 transition-all duration-200">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#8B3A4A] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <CardContent className="p-3.5 sm:p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#737373]">
                Pending Moderation
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#8B3A4A]/10 border border-[#8B3A4A]/20 flex items-center justify-center text-[#8B3A4A] shadow-xs group-hover:bg-[#8B3A4A] group-hover:text-white group-hover:border-[#8B3A4A] transition-all duration-200 shrink-0">
                <Clock className="w-4 h-4 transition-transform duration-200 group-hover:scale-105" />
              </div>
            </div>

            <div className="mt-1.5">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#1C1C1C]">
                {pendingCount}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <span className={`inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                  pendingCount > 0 ? "text-[#B78628] bg-[#B78628]/10" : "text-[#4F7A61] bg-[#4F7A61]/10"
                }`}>
                  {pendingCount > 0 ? <AlertCircle className="w-2.5 h-2.5" /> : <CheckCircle2 className="w-2.5 h-2.5" />}
                  {pendingCount > 0 ? "Requires Audit" : "Queue Clear"}
                </span>
                <span className="text-[10px] text-[#737373]">awaiting review</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. Approved (Live) */}
        <Card className="group relative overflow-hidden bg-white border border-[#E5E1DC] hover:border-[#8B3A4A]/50 rounded-xl hover:shadow-[0_4px_16px_rgba(139,58,74,0.08)] hover:-translate-y-0.5 transition-all duration-200">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#8B3A4A] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <CardContent className="p-3.5 sm:p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#737373]">
                Approved (Live)
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#8B3A4A]/10 border border-[#8B3A4A]/20 flex items-center justify-center text-[#8B3A4A] shadow-xs group-hover:bg-[#8B3A4A] group-hover:text-white group-hover:border-[#8B3A4A] transition-all duration-200 shrink-0">
                <CheckCircle2 className="w-4 h-4 transition-transform duration-200 group-hover:scale-105" />
              </div>
            </div>

            <div className="mt-1.5">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#1C1C1C]">
                {approvedCount}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#4F7A61] bg-[#4F7A61]/10 px-1.5 py-0.5 rounded">
                  <TrendingUp className="w-2.5 h-2.5" />
                  {reviews.length > 0 ? Math.round((approvedCount / reviews.length) * 100) : 100}%
                </span>
                <span className="text-[10px] text-[#737373]">storefront active</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 4. Rejected / Hidden */}
        <Card className="group relative overflow-hidden bg-white border border-[#E5E1DC] hover:border-[#8B3A4A]/50 rounded-xl hover:shadow-[0_4px_16px_rgba(139,58,74,0.08)] hover:-translate-y-0.5 transition-all duration-200">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#8B3A4A] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <CardContent className="p-3.5 sm:p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#737373]">
                Rejected / Hidden
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#8B3A4A]/10 border border-[#8B3A4A]/20 flex items-center justify-center text-[#8B3A4A] shadow-xs group-hover:bg-[#8B3A4A] group-hover:text-white group-hover:border-[#8B3A4A] transition-all duration-200 shrink-0">
                <XCircle className="w-4 h-4 transition-transform duration-200 group-hover:scale-105" />
              </div>
            </div>

            <div className="mt-1.5">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#1C1C1C]">
                {rejectedCount}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#737373] bg-neutral-100 px-1.5 py-0.5 rounded">
                  <ShieldAlert className="w-2.5 h-2.5" />
                  Policy Filter
                </span>
                <span className="text-[10px] text-[#737373]">spam suppressed</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews Table Card */}
      <Card>
        <CardHeader className="py-3.5 px-4 sm:px-6 border-b border-[#E5E1DC]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="w-full sm:max-w-xs md:max-w-sm">
              <Input
                placeholder="Search reviews by user or piece..."
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
                      {statusOptions.find((opt) => opt.id === statusFilter)?.label || "All Statuses"}
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

                {statusOptions.map((item) => {
                  const isSelected = statusFilter === item.id;
                  const count = statusCounts[item.id as keyof typeof statusCounts] ?? 0;
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
                          {count}
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
                  <th className="py-3 px-6">Product Piece</th>
                  <th className="py-3 px-6">Reviewer</th>
                  <th className="py-3 px-6">Rating</th>
                  <th className="py-3 px-6">Feedback Headline & Excerpt</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Date</th>
                  <th className="py-3 px-6 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E1DC]">
                {filteredReviews.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#737373]">
                      No reviews found matching the selected moderation filter.
                    </td>
                  </tr>
                ) : (
                  filteredReviews.map((rev) => {
                    const product = products.find((p) => p.id === rev.productId);
                    const prodTitle = product ? product.title : rev.productId;

                    return (
                      <tr key={rev.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                        {/* Product */}
                        <td className="py-3.5 px-6 font-semibold text-[#1C1C1C] max-w-[180px] truncate">
                          {prodTitle}
                        </td>

                        {/* Reviewer */}
                        <td className="py-3.5 px-6">
                          <p className="font-semibold text-[#242424]">{rev.customerName}</p>
                          {rev.verifiedPurchase && (
                            <span className="text-[10px] text-[#4F7A61] font-medium flex items-center gap-1">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              Verified Buyer
                            </span>
                          )}
                        </td>

                        {/* Rating */}
                        <td className="py-3.5 px-6">
                          <RatingStars rating={rev.rating} showNumber={false} size="sm" />
                        </td>

                        {/* Feedback */}
                        <td className="py-3.5 px-6 max-w-sm">
                          <p className="font-semibold text-[#1C1C1C] line-clamp-1">{rev.title}</p>
                          <p className="text-[11px] text-[#737373] line-clamp-1">{rev.comment}</p>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-6">
                          {getStatusBadge(rev.status)}
                        </td>

                        {/* Date */}
                        <td className="py-3.5 px-6 text-[#737373]">
                          {formatDate(rev.createdAt)}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* View */}
                            <button
                              onClick={() => setSelectedReview(rev)}
                              className="p-1.5 text-[#737373] hover:text-[#1C1C1C] hover:bg-[#F1ECE6] rounded-md transition-colors"
                              title="View Full Testimonial"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Approve */}
                            {rev.status !== "approved" && (
                              <button
                                onClick={() => handleApprove(rev.id)}
                                className="p-1.5 text-[#4F7A61] hover:bg-[#4F7A61]/15 rounded-md transition-colors"
                                title="Approve & Publish Review"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}

                            {/* Reject */}
                            {rev.status !== "rejected" && (
                              <button
                                onClick={() => handleReject(rev.id)}
                                className="p-1.5 text-[#B78628] hover:bg-[#B78628]/15 rounded-md transition-colors"
                                title="Reject / Hide Review"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}

                            {/* Delete */}
                            <button
                              onClick={() => handleDelete(rev.id)}
                              className="p-1.5 text-[#B84A4A] hover:bg-[#B84A4A]/15 rounded-md transition-colors"
                              title="Delete Review Permanently"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Full Review Inspection Modal */}
      {selectedReview && (
        <Modal
          isOpen={Boolean(selectedReview)}
          onClose={() => setSelectedReview(null)}
          title="Review Moderation Dossier"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3.5 bg-[#FAF8F5] rounded-xl border border-[#E5E1DC]">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#737373] font-semibold">
                  Product Under Review
                </span>
                <p className="text-sm font-semibold text-[#1C1C1C]">
                  {products.find((p) => p.id === selectedReview.productId)?.title || selectedReview.productId}
                </p>
              </div>
              <div>{getStatusBadge(selectedReview.status)}</div>
            </div>

            <div className="p-3 bg-white border border-[#E5E1DC] rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-sm text-[#1C1C1C]">
                    {selectedReview.customerName}
                  </span>
                  <span className="text-[#737373] text-[11px] block">
                    {formatDate(selectedReview.createdAt)}
                  </span>
                </div>
                <RatingStars rating={selectedReview.rating} size="sm" showNumber />
              </div>

              <div className="pt-2 border-t border-[#E5E1DC]">
                <h4 className="font-semibold text-sm text-[#1C1C1C]">{selectedReview.title}</h4>
                <p className="text-xs text-[#242424] leading-relaxed mt-1 font-light">
                  {selectedReview.comment}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#E5E1DC]">
              <Button
                variant="outline"
                size="sm"
                className="text-[#B84A4A] border-[#B84A4A]/30 hover:bg-[#B84A4A]/10"
                onClick={() => handleDelete(selectedReview.id)}
              >
                Delete Review
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleReject(selectedReview.id)}
                >
                  Reject Review
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="bg-[#4F7A61] hover:bg-[#3D604C] text-white"
                  onClick={() => handleApprove(selectedReview.id)}
                >
                  Approve & Publish
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
