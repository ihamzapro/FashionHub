import React from "react";
import { cn } from "@/lib/utils";
import { PackageOpen } from "lucide-react";
import { Button } from "./Button";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl border border-[#E5E1DC]/80",
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-[#F1ECE6] flex items-center justify-center text-[#737373] mb-4">
        {icon || <PackageOpen className="w-7 h-7 stroke-[1.5]" />}
      </div>
      <h4 className="text-base font-semibold text-[#242424] mb-1.5">{title}</h4>
      <p className="text-xs text-[#737373] max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="default" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
