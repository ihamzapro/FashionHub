import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface AvatarProps {
  src?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "busy";
  className?: string;
}

export function Avatar({ src, name, size = "md", status, className }: AvatarProps) {
  const getInitials = (n?: string) => {
    if (!n) return "FH";
    const parts = n.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  };

  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
  };

  const statusColors = {
    online: "bg-[#4F7A61]",
    offline: "bg-[#737373]",
    busy: "bg-[#B84A4A]",
  };

  return (
    <div className={cn("relative inline-block shrink-0", className)}>
      <div
        className={cn(
          "rounded-full overflow-hidden flex items-center justify-center font-medium border border-[#E5E1DC] bg-[#F1ECE6] text-[#242424]",
          sizes[size]
        )}
      >
        {src ? (
          <Image
            src={src}
            alt={name || "User Avatar"}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>
      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white",
            statusColors[status]
          )}
        />
      )}
    </div>
  );
}
