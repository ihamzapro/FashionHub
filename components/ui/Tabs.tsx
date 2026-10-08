"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  badge?: string | number;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: "underline" | "pills";
  className?: string;
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = "underline",
  className,
}: TabsProps) {
  if (variant === "pills") {
    return (
      <div
        className={cn(
          "inline-flex p-1 bg-[#F1ECE6] rounded-xl gap-1 text-sm font-medium",
          className
        )}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={cn(
                "px-3.5 py-1.5 rounded-lg transition-all text-xs font-medium flex items-center gap-1.5 cursor-pointer",
                isActive
                  ? "bg-white text-[#1C1C1C] shadow-sm font-semibold"
                  : "text-[#737373] hover:text-[#242424]"
              )}
            >
              {tab.icon}
              {tab.label}
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.2 rounded-full",
                    isActive
                      ? "bg-[#8B3A4A]/10 text-[#8B3A4A]"
                      : "bg-[#E5E1DC] text-[#737373]"
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn("border-b border-[#E5E1DC] flex space-x-6", className)}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "py-3 text-sm font-medium tracking-wide transition-all relative flex items-center gap-2 cursor-pointer",
              isActive
                ? "text-[#1C1C1C] font-semibold"
                : "text-[#737373] hover:text-[#242424]"
            )}
          >
            {tab.icon}
            {tab.label}
            {tab.badge !== undefined && (
              <span
                className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded-full font-mono",
                  isActive
                    ? "bg-[#8B3A4A]/10 text-[#8B3A4A]"
                    : "bg-[#F1ECE6] text-[#737373]"
                )}
              >
                {tab.badge}
              </span>
            )}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8B3A4A] rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}
