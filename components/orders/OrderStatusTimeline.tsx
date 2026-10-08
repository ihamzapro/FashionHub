import React from "react";
import { OrderStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Check, Clock, Truck, PackageCheck } from "lucide-react";

interface OrderStatusTimelineProps {
  status: OrderStatus;
  className?: string;
}

export function OrderStatusTimeline({ status, className }: OrderStatusTimelineProps) {
  const normalized = status.toLowerCase();

  let activeStepIndex = 0;
  if (normalized === "shipped") {
    activeStepIndex = 1;
  } else if (normalized === "delivered") {
    activeStepIndex = 2;
  }

  const steps = [
    {
      title: "Order Placed",
      description: "Cash on Delivery verified",
      icon: Clock,
    },
    {
      title: "Shipped",
      description: "Handed over to insured courier",
      icon: Truck,
    },
    {
      title: "Delivered",
      description: "Payment collected upon arrival",
      icon: PackageCheck,
    },
  ];

  return (
    <div className={cn("w-full py-4", className)}>
      <div className="relative flex items-center justify-between">
        {/* Background connecting bar */}
        <div className="absolute top-5 left-8 right-8 h-0.5 bg-[#E5E1DC] -z-0" />

        {/* Active progress bar */}
        <div
          className="absolute top-5 left-8 h-0.5 bg-[#1C1C1C] transition-all duration-500 -z-0"
          style={{
            width:
              activeStepIndex === 0
                ? "0%"
                : activeStepIndex === 1
                ? "50%"
                : "calc(100% - 4rem)",
          }}
        />

        {steps.map((step, index) => {
          const isCompleted = index < activeStepIndex;
          const isCurrent = index === activeStepIndex;
          const isPending = index > activeStepIndex;
          const StepIcon = step.icon;

          return (
            <div
              key={step.title}
              className="flex flex-col items-center text-center relative z-10 w-28 sm:w-36"
            >
              {/* Icon Circle */}
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 shadow-xs",
                  isCompleted &&
                    "bg-[#1C1C1C] border-[#1C1C1C] text-white",
                  isCurrent &&
                    "bg-[#8B3A4A] border-[#8B3A4A] text-white ring-4 ring-[#8B3A4A]/15 scale-105",
                  isPending &&
                    "bg-[#FAF8F5] border-[#E5E1DC] text-[#737373]"
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 stroke-[2.5]" />
                ) : (
                  <StepIcon className="w-4.5 h-4.5" />
                )}
              </div>

              {/* Title & Description */}
              <span
                className={cn(
                  "text-xs font-semibold mt-3 transition-colors",
                  isCurrent && "text-[#8B3A4A]",
                  isCompleted && "text-[#1C1C1C]",
                  isPending && "text-[#737373]"
                )}
              >
                {step.title}
              </span>

              <span className="text-[10px] text-[#737373] mt-0.5 hidden sm:block max-w-[120px] leading-tight">
                {step.description}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
