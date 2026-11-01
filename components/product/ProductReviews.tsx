"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Star, CheckCircle2, ThumbsUp, PenLine, Filter } from "lucide-react";
import { Review } from "@/lib/types";
import { RatingStars } from "./RatingStars";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import { useReviews } from "@/context/ReviewContext";

export interface ProductReviewsProps {
  productId: string;
  initialReviews: Review[];
  productRating: number;
  productReviewCount: number;
  className?: string;
}

export function ProductReviews({
  productId,
  initialReviews,
  productRating,
  productReviewCount = 0,
  className,
}: ProductReviewsProps) {
  // If product has no mock reviews, generate 2 realistic reviews matching fashion atelier standard
  const defaultReviews: Review[] = useMemo(() => {
    if (initialReviews.length > 0) return initialReviews;
    return [
      {
        id: `gen-rev-${productId}-1`,
        productId,
        customerId: "usr-guest-1",
        customerName: "Camilla Chen",
        customerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop",
        rating: 5,
        title: "Flawless drape and meticulous stitching",
        comment: "The garment exceeded my expectations in person. The silhouette is structured yet fluid, and the fabric has that genuine tactile luxury you only find in artisan collections.",
        verifiedPurchase: true,
        helpfulVotes: 14,
        createdAt: "2026-09-18T14:30:00Z",
      },
      {
        id: `gen-rev-${productId}-2`,
        productId,
        customerId: "usr-guest-2",
        customerName: "Julian Thorne",
        customerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
        rating: 4,
        title: "True to size with exceptional hand-feel",
        comment: "Fits true to atelier sizing specs. Arrived in signature packaging within two days. Highly recommended for anyone curating a capsule wardrobe.",
        verifiedPurchase: true,
        helpfulVotes: 9,
        createdAt: "2026-08-27T11:15:00Z",
      },
    ];
  }, [initialReviews, productId]);

  const { getApprovedReviews, addReview } = useReviews();

  const reviews = useMemo(() => {
    const fromContext = getApprovedReviews(productId);
    if (fromContext && fromContext.length > 0) {
      return fromContext;
    }
    const approvedInitial = (initialReviews || []).filter(
      (r) => r.status === "approved" || !r.status
    );
    if (approvedInitial.length > 0) return approvedInitial;
    return defaultReviews;
  }, [getApprovedReviews, productId, initialReviews, defaultReviews]);

  const [selectedStarFilter, setSelectedStarFilter] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"recent" | "helpful" | "highest">("recent");

  // Modal and submission state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formRating, setFormRating] = useState(5);
  const [formHoverRating, setFormHoverRating] = useState(0);
  const [formName, setFormName] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formComment, setFormComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helpful votes local tracker
  const [helpfulClicked, setHelpfulClicked] = useState<Record<string, boolean>>({});

  const { toast } = useToast();

  // Rating distribution calculations
  const distribution = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
      counts[star] = (counts[star] || 0) + 1;
    });
    const total = reviews.length;
    return [5, 4, 3, 2, 1].map((star) => {
      const count = counts[star as 1 | 2 | 3 | 4 | 5] || 0;
      const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
      return { star, count, percentage };
    });
  }, [reviews]);

  // Overall average
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return productRating;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return Number((sum / reviews.length).toFixed(1));
  }, [reviews, productRating]);

  const [helpfulBonus, setHelpfulBonus] = useState<Record<string, number>>({});

  // Filtered and sorted reviews
  const displayedReviews = useMemo(() => {
    let result = [...reviews];
    if (selectedStarFilter !== null) {
      result = result.filter((r) => Math.round(r.rating) === selectedStarFilter);
    }
    if (sortBy === "recent") {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === "helpful") {
      result.sort((a, b) => {
        const aVotes = (a.helpfulVotes || 0) + (helpfulBonus[a.id] || 0);
        const bVotes = (b.helpfulVotes || 0) + (helpfulBonus[b.id] || 0);
        return bVotes - aVotes;
      });
    } else if (sortBy === "highest") {
      result.sort((a, b) => b.rating - a.rating);
    }
    return result;
  }, [reviews, selectedStarFilter, sortBy, helpfulBonus]);

  const handleHelpfulClick = (reviewId: string) => {
    if (helpfulClicked[reviewId]) return;

    setHelpfulClicked((prev) => ({ ...prev, [reviewId]: true }));
    setHelpfulBonus((prev) => ({ ...prev, [reviewId]: (prev[reviewId] || 0) + 1 }));

    toast({
      title: "Thank you",
      message: "Your feedback has been recorded.",
      type: "info",
    });
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim() || !formTitle.trim() || !formComment.trim()) {
      toast({
        title: "Required Fields",
        message: "Please fill in your name, title, and review comments.",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      addReview({
        productId,
        customerId: `usr-${Date.now().toString(36)}`,
        customerName: formName.trim(),
        customerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
        rating: formRating,
        title: formTitle.trim(),
        comment: formComment.trim(),
        verifiedPurchase: true,
        helpfulVotes: 0,
      });

      setIsSubmitting(false);
      setIsModalOpen(false);

      // Reset form
      setFormName("");
      setFormTitle("");
      setFormComment("");
      setFormRating(5);

      toast({
        title: "Review Awaiting Moderation",
        message: "Your review has been submitted for administrative review and will appear once approved.",
        type: "info",
      });
    }, 400);
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div id="reviews-section" className={cn("space-y-12", className)}>
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E5E1DC] pb-6">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[#8B3A4A]">
            Atelier Client Reviews
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl text-[#1C1C1C] font-normal mt-1">
            Ratings & Feedback ({reviews.length})
          </h2>
        </div>

        <Button
          variant="outline"
          size="md"
          onClick={() => setIsModalOpen(true)}
          className="gap-2 self-start sm:self-auto border-[#1C1C1C] hover:bg-[#1C1C1C] hover:text-white"
        >
          <PenLine className="w-4 h-4" />
          <span>Write a Review</span>
        </Button>
      </div>

      {/* Ratings Summary & Distribution Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white border border-[#E5E1DC] rounded-2xl p-6 sm:p-8 shadow-xs">
        {/* Score & Stars */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center sm:border-r border-[#E5E1DC]/80 md:pr-8 py-2">
          <span className="font-editorial text-5xl sm:text-6xl text-[#1C1C1C] font-normal tracking-tight">
            {averageRating}
          </span>
          <div className="mt-2 mb-1">
            <RatingStars rating={averageRating} size="md" showNumber={false} />
          </div>
          <p className="text-xs text-[#737373]">
            Based on {reviews.length || productReviewCount} verified atelier review{reviews.length === 1 ? "" : "s"}
          </p>
        </div>

        {/* Rating Breakdown Bars */}
        <div className="md:col-span-8 space-y-2.5 md:pl-4">
          {distribution.map(({ star, count, percentage }) => {
            const isFilterActive = selectedStarFilter === star;
            return (
              <button
                key={star}
                type="button"
                onClick={() => setSelectedStarFilter(isFilterActive ? null : star)}
                className={cn(
                  "w-full flex items-center gap-3 text-xs text-[#737373] group rounded-lg p-1 transition-colors text-left",
                  isFilterActive ? "bg-[#FAF8F5] text-[#1C1C1C] font-medium" : "hover:bg-[#FAF8F5]/60"
                )}
              >
                <span className="w-12 shrink-0 flex items-center gap-1 font-mono">
                  <span>{star}</span>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
                </span>

                <div className="flex-1 h-2 rounded-full bg-[#F1ECE6] overflow-hidden">
                  <div
                    className="h-full bg-[#1C1C1C] rounded-full transition-all duration-500 group-hover:bg-[#8B3A4A]"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <span className="w-16 shrink-0 text-right font-mono text-[11px] text-[#737373]">
                  {count} ({percentage}%)
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Sorting Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#737373]" />
          <span className="text-xs text-[#737373]">Filter:</span>
          {selectedStarFilter !== null ? (
            <button
              onClick={() => setSelectedStarFilter(null)}
              className="text-xs bg-[#1C1C1C] text-white px-2.5 py-1 rounded-full flex items-center gap-1.5 cursor-pointer hover:bg-[#8B3A4A] transition-colors"
            >
              <span>{selectedStarFilter} Stars</span>
              <span className="text-[10px]">✕</span>
            </button>
          ) : (
            <span className="text-xs text-[#242424] font-medium">All ratings</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#737373]">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "recent" | "helpful" | "highest")}
            className="text-xs bg-white border border-[#E5E1DC] rounded-lg px-2.5 py-1.5 text-[#242424] focus:outline-none focus:border-[#8B3A4A]"
          >
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {displayedReviews.length > 0 ? (
          displayedReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white border border-[#E5E1DC] rounded-xl p-6 sm:p-7 space-y-4 shadow-xs transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)]"
            >
              {/* Header: User, Verified, Date, Rating */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E1DC]/60 pb-3">
                <div className="flex items-center gap-3">
                  {rev.customerAvatar ? (
                    <div className="relative w-9 h-9 rounded-full overflow-hidden bg-[#F1ECE6] border border-[#E5E1DC] shrink-0">
                      <Image
                        src={rev.customerAvatar}
                        alt={rev.customerName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[#1C1C1C] text-white text-xs font-semibold flex items-center justify-center shrink-0">
                      {rev.customerName.charAt(0)}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#1C1C1C]">
                        {rev.customerName}
                      </span>
                      {rev.verifiedPurchase && (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-[#4F7A61]/10 text-[#4F7A61] px-2 py-0.5 rounded-full font-medium">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Verified Buyer
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#737373]">
                      Reviewed on {formatDate(rev.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="self-start sm:self-auto">
                  <RatingStars rating={rev.rating} size="sm" showNumber={false} />
                </div>
              </div>

              {/* Review Content */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-[#1C1C1C]">{rev.title}</h4>
                <p className="text-xs sm:text-sm text-[#737373] leading-relaxed font-light">
                  {rev.comment}
                </p>
              </div>

              {/* Helpful Footer */}
              <div className="pt-2 flex items-center justify-between text-xs text-[#737373]">
                <button
                  type="button"
                  onClick={() => handleHelpfulClick(rev.id)}
                  disabled={helpfulClicked[rev.id]}
                  className={cn(
                    "inline-flex items-center gap-1.5 py-1 px-2.5 rounded-md border text-xs transition-colors cursor-pointer",
                    helpfulClicked[rev.id]
                      ? "border-[#4F7A61] bg-[#4F7A61]/10 text-[#4F7A61]"
                      : "border-[#E5E1DC] hover:border-[#1C1C1C] text-[#737373] hover:text-[#1C1C1C]"
                  )}
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>Helpful ({(rev.helpfulVotes || 0) + (helpfulBonus[rev.id] || 0)})</span>
                </button>

                <span className="text-[11px] text-[#737373]">Verified Atelier Purchase</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white border border-[#E5E1DC] rounded-xl p-8 space-y-3">
            <p className="text-sm font-medium text-[#242424]">
              No reviews match your selected filter
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedStarFilter(null)}
            >
              Clear Filter
            </Button>
          </div>
        )}
      </div>

      {/* Write a Review Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Share Your Atelier Experience"
        description="Your review helps fellow clients appreciate the cut, craftsmanship, and hand-feel."
        maxWidth="md"
      >
        <form onSubmit={handleReviewSubmit} className="space-y-5 pt-2">
          {/* Star Rating Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#242424] uppercase tracking-wider block">
              Overall Rating
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = (formHoverRating || formRating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormRating(star)}
                    onMouseEnter={() => setFormHoverRating(star)}
                    onMouseLeave={() => setFormHoverRating(0)}
                    aria-label={`Rate ${star} star`}
                    className="p-1 focus:outline-none cursor-pointer transition-transform hover:scale-110"
                  >
                    <Star
                      className={cn(
                        "w-6 h-6 transition-colors",
                        isFilled
                          ? "fill-amber-400 text-amber-400"
                          : "text-[#D6D2CC] hover:text-amber-300"
                      )}
                    />
                  </button>
                );
              })}
              <span className="text-xs font-mono font-medium text-[#737373] ml-2">
                {formHoverRating || formRating} of 5 Stars
              </span>
            </div>
          </div>

          {/* Customer Name */}
          <Input
            label="Your Name / Atelier Alias"
            placeholder="e.g. Elena Rostova"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            required
          />

          {/* Review Title */}
          <Input
            label="Headline / Title"
            placeholder="e.g. Remarkable drape and heavyweight finish"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            required
          />

          {/* Comment */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#242424] block">
              Detailed Feedback
            </label>
            <textarea
              rows={4}
              value={formComment}
              onChange={(e) => setFormComment(e.target.value)}
              placeholder="Tell others how the item fits, the texture of the material, and your styling suggestions..."
              required
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#E5E1DC] rounded-lg text-[#242424] placeholder:text-[#737373] focus:outline-none focus:border-[#8B3A4A] focus:ring-1 focus:ring-[#8B3A4A]"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E1DC]">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="accent"
              size="md"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Publishing..." : "Submit Review"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
