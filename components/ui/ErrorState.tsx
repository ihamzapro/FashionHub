import React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "./Button";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We encountered an unexpected error while retrieving this information. Please try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl border border-[#B84A4A]/20 shadow-sm",
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-[#B84A4A]/10 flex items-center justify-center text-[#B84A4A] mb-4">
        <AlertCircle className="w-6 h-6 stroke-[1.8]" />
      </div>
      <h4 className="text-base font-semibold text-[#242424] mb-1.5">{title}</h4>
      <p className="text-xs text-[#737373] max-w-sm mb-6 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
        >
          Try Again
        </Button>
      )}
    </div>
  );
}
