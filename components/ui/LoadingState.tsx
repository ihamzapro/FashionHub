import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface LoadingStateProps {
  message?: string;
  subMessage?: string;
  className?: string;
}

export function LoadingState({
  message = "Loading collection...",
  subMessage = "Please wait a moment while we prepare your view.",
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-16",
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#E5E1DC] flex items-center justify-center mb-4 shadow-sm">
        <Loader2 className="w-6 h-6 text-[#8B3A4A] animate-spin" />
      </div>
      <p className="text-sm font-semibold text-[#242424]">{message}</p>
      {subMessage && (
        <p className="text-xs text-[#737373] mt-1 max-w-xs">{subMessage}</p>
      )}
    </div>
  );
}
