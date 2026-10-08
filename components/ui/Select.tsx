import React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options?: SelectOption[];
  error?: string;
  helperText?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options = [], error, helperText, id, children, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-medium tracking-wide uppercase text-[#242424]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              "w-full h-10 pl-3.5 pr-10 bg-white border rounded-lg text-sm text-[#242424] appearance-none",
              "transition-colors duration-150 outline-none cursor-pointer",
              "border-[#E5E1DC] hover:border-[#D6D2CC]",
              "focus:border-[#8B3A4A] focus:ring-2 focus:ring-[#8B3A4A]/10",
              "disabled:bg-[#F1ECE6]/50 disabled:cursor-not-allowed",
              error && "border-[#B84A4A] focus:border-[#B84A4A]",
              className
            )}
            {...props}
          >
            {options.length > 0
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <ChevronDown className="w-4 h-4 text-[#737373] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        {error && <p className="text-xs text-[#B84A4A]">{error}</p>}
        {!error && helperText && <p className="text-xs text-[#737373]">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
