import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium tracking-wide uppercase text-[#242424]"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-[#737373] pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              "w-full h-10 px-3.5 bg-white border rounded-lg text-sm text-[#242424] placeholder:text-[#737373]",
              "transition-colors duration-150 outline-none",
              "border-[#E5E1DC] hover:border-[#D6D2CC]",
              "focus:border-[#8B3A4A] focus:ring-2 focus:ring-[#8B3A4A]/10",
              "disabled:bg-[#F1ECE6]/50 disabled:text-[#737373] disabled:cursor-not-allowed",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-[#B84A4A] focus:border-[#B84A4A] focus:ring-[#B84A4A]/10",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 text-[#737373] flex items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-[#B84A4A]">{error}</p>}
        {!error && helperText && <p className="text-xs text-[#737373]">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
