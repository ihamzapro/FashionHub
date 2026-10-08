"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  type?: ToastType;
  duration?: number;
}

interface ToastContextType {
  toast: (options: Omit<ToastItem, "id">) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, message, type = "info", duration = 4000 }: Omit<ToastItem, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = { id, title, message, type, duration };
      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => {
          const icons = {
            success: <CheckCircle2 className="w-5 h-5 text-[#4F7A61] shrink-0" />,
            error: <AlertCircle className="w-5 h-5 text-[#B84A4A] shrink-0" />,
            warning: <AlertTriangle className="w-5 h-5 text-[#B78628] shrink-0" />,
            info: <Info className="w-5 h-5 text-[#8B3A4A] shrink-0" />,
          };

          return (
            <div
              key={t.id}
              className={cn(
                "pointer-events-auto p-4 bg-white border border-[#E5E1DC] rounded-xl shadow-lg flex items-start gap-3",
                "animate-in slide-in-from-bottom-5 fade-in duration-200 transition-all"
              )}
            >
              {icons[t.type || "info"]}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#242424]">{t.title}</p>
                {t.message && (
                  <p className="text-xs text-[#737373] mt-0.5 leading-relaxed">
                    {t.message}
                  </p>
                )}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="text-[#737373] hover:text-[#242424] p-1 rounded-md hover:bg-[#F1ECE6]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
