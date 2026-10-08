"use client";

import React, { useState } from "react";
import { mockReviews, mockProducts } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { RatingStars } from "@/components/product/RatingStars";
import { Check, X } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export default function AdminReviewsPage() {
  const { toast } = useToast();
  const [reviewsList, setReviewsList] = useState(mockReviews);

  const handleAction = (id: string, action: "approve" | "remove") => {
    if (action === "approve") {
      toast({
        title: "Review Approved",
        message: "Customer feedback published to product showcase.",
        type: "success",
      });
    } else {
      setReviewsList((prev) => prev.filter((r) => r.id !== id));
      toast({
        title: "Review Removed",
        message: "The flagged review was archived from the platform.",
        type: "info",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1C1C1C]">
          Review & Feedback Moderation
        </h2>
        <p className="text-xs text-[#737373] mt-0.5">
          Moderate customer product experiences, verify authentic buyers, and ensure community guidelines.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews Queue ({reviewsList.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#242424]">
              <thead className="bg-[#FAF8F5] border-b border-[#E5E1DC] text-[#737373] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-6">Product</th>
                  <th className="py-3 px-6">Reviewer</th>
                  <th className="py-3 px-6">Rating</th>
                  <th className="py-3 px-6">Comment</th>
                  <th className="py-3 px-6">Date</th>
                  <th className="py-3 px-6 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E1DC]">
                {reviewsList.map((rev) => {
                  const product = mockProducts.find((p) => p.id === rev.productId);

                  return (
                    <tr key={rev.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                      <td className="py-3.5 px-6 font-semibold text-[#1C1C1C] max-w-[180px] truncate">
                        {product ? product.title : rev.productId}
                      </td>
                      <td className="py-3.5 px-6">
                        <span className="font-medium text-[#242424]">{rev.customerName}</span>
                        {rev.verifiedPurchase && (
                          <span className="block text-[10px] text-[#4F7A61]">Verified Buyer</span>
                        )}
                      </td>
                      <td className="py-3.5 px-6">
                        <RatingStars rating={rev.rating} showNumber={false} size="sm" />
                      </td>
                      <td className="py-3.5 px-6 max-w-sm">
                        <p className="font-semibold text-[#1C1C1C] truncate">{rev.title}</p>
                        <p className="text-[11px] text-[#737373] line-clamp-1">{rev.comment}</p>
                      </td>
                      <td className="py-3.5 px-6 text-[#737373]">
                        {formatDate(rev.createdAt)}
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleAction(rev.id, "approve")}
                            className="p-1.5 text-[#4F7A61] hover:bg-[#4F7A61]/10 rounded-md transition-colors"
                            title="Approve review"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleAction(rev.id, "remove")}
                            className="p-1.5 text-[#B84A4A] hover:bg-[#B84A4A]/10 rounded-md transition-colors"
                            title="Remove / Hide review"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
