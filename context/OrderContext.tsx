"use client";

import React, { createContext, useContext, useSyncExternalStore } from "react";
import { Order, CreateOrderInput, OrderStatus } from "@/lib/types";
import { mockOrders } from "@/lib/mock-data";

interface OrderContextType {
  orders: Order[];
  getOrderById: (id: string) => Order | undefined;
  createOrder: (input: CreateOrderInput) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => boolean;
  isHydrated: boolean;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const ORDER_STORAGE_KEY = "fashionhub_orders";

// Initial seed orders from mock data
const INITIAL_ORDERS: Order[] = mockOrders.map((o) => ({
  ...o,
  total: o.totalAmount,
  orderStatus: o.status === "delivered" ? "Delivered" : o.status === "shipped" ? "Shipped" : "Pending",
  paymentMethod: "COD",
  paymentStatus: o.paymentStatus === "paid" ? "Paid" : "Pending",
}));

let orderMemoryState: Order[] = INITIAL_ORDERS;
let hasLoadedOrdersFromStorage = false;
const orderListeners = new Set<() => void>();

function notifyOrderListeners() {
  orderListeners.forEach((listener) => listener());
}

function loadInitialOrders(): Order[] {
  if (typeof window === "undefined") return INITIAL_ORDERS;
  if (!hasLoadedOrdersFromStorage) {
    try {
      const stored = window.localStorage.getItem(ORDER_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          orderMemoryState = parsed;
        } else {
          window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
        }
      } else {
        window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
      }
    } catch {
      orderMemoryState = INITIAL_ORDERS;
    }
    hasLoadedOrdersFromStorage = true;
  }
  return orderMemoryState;
}

function saveOrders(newOrders: Order[]) {
  orderMemoryState = newOrders;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(newOrders));
    } catch (e) {
      console.warn("Failed to save orders to localStorage", e);
    }
  }
  notifyOrderListeners();
}

function subscribeOrders(listener: () => void) {
  orderListeners.add(listener);
  const handleStorage = (e: StorageEvent) => {
    if (e.key === ORDER_STORAGE_KEY && e.newValue) {
      try {
        orderMemoryState = JSON.parse(e.newValue);
        notifyOrderListeners();
      } catch {
        // ignore malformed storage data
      }
    }
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", handleStorage);
  }
  return () => {
    orderListeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorage);
    }
  };
}

const emptySubscribe = () => () => {};

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const isHydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const orders = useSyncExternalStore(
    subscribeOrders,
    loadInitialOrders,
    () => INITIAL_ORDERS
  );

  const getOrderById = (id: string): Order | undefined => {
    const normalized = id.toLowerCase().trim();
    return orders.find(
      (o) =>
        o.id.toLowerCase() === normalized ||
        o.orderNumber.toLowerCase() === normalized ||
        o.orderNumber.toLowerCase().replace("#", "") === normalized
    );
  };

  const createOrder = (input: CreateOrderInput): Order => {
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `FH-${randomSuffix}`;
    const id = `ord-${Date.now()}`;

    const newOrder: Order = {
      id,
      orderNumber,
      customerId: "usr-customer-1",
      customerName: input.customer.fullName,
      customerEmail: input.customer.email,
      customerPhone: input.customer.phone,
      customer: input.customer,
      shippingAddress: input.shippingAddress,
      items: input.items,
      subtotal: input.subtotal,
      shippingFee: input.shippingFee,
      totalAmount: input.total,
      total: input.total,
      status: "pending",
      orderStatus: "Pending",
      paymentStatus: "Pending",
      paymentMethod: "COD",
      createdAt: new Date().toISOString(),
    };

    const updated = [newOrder, ...orderMemoryState];
    saveOrders(updated);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus): boolean => {
    const normalized = orderId.toLowerCase().trim();
    const index = orderMemoryState.findIndex(
      (o) =>
        o.id.toLowerCase() === normalized ||
        o.orderNumber.toLowerCase() === normalized ||
        o.orderNumber.toLowerCase().replace("#", "") === normalized
    );

    if (index === -1) return false;

    const existing = orderMemoryState[index];
    const isDelivered = newStatus.toLowerCase() === "delivered";

    const updatedOrder: Order = {
      ...existing,
      status: newStatus.toLowerCase() as OrderStatus,
      orderStatus: newStatus,
      paymentStatus: isDelivered ? "Paid" : existing.paymentStatus,
      updatedAt: new Date().toISOString(),
    };

    const updatedList = [...orderMemoryState];
    updatedList[index] = updatedOrder;
    saveOrders(updatedList);
    return true;
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        getOrderById,
        createOrder,
        updateOrderStatus,
        isHydrated,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders(): OrderContextType {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
}
