"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  status?: "online" | "offline" | "busy";
  className?: string;
}

export function Avatar({ src, name, size = "md", status, className }: AvatarProps) {
  const [imageError, setImageError] = useState(false);

  // Reset error when src changes
  useEffect(() => {
    setImageError(false);
  }, [src]);

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
    "2xl": "w-20 h-20 text-xl",
  };

  const statusColors = {
    online: "bg-[#4F7A61]",
    offline: "bg-[#737373]",
    busy: "bg-[#B84A4A]",
  };

  const hasCustomDimensions = className && (className.includes("w-") || className.includes("h-"));
  const dimensionClass = hasCustomDimensions ? "" : sizes[size];

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center shrink-0 rounded-full",
        dimensionClass,
        className
      )}
    >
      <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center font-medium border border-[#E5E1DC] bg-[#8B3A4A]/10 text-[#8B3A4A] select-none">
        {src && !imageError ? (
          src.startsWith("data:") ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={src}
              alt={name || "User Avatar"}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <Image
              src={src}
              alt={name || "User Avatar"}
              width={128}
              height={128}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
              unoptimized={src.startsWith("http")}
            />
          )
        ) : (
          <span className="font-semibold tracking-wider">{getInitials(name)}</span>
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
