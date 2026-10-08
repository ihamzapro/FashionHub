import { Notification } from "../types";

export const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    userId: "usr-customer-1",
    title: "Order Delivered",
    message: "Your order FH-94821 containing Sculptural Soft Leather Shoulder Tote has arrived.",
    type: "order",
    read: false,
    link: "/customer/orders",
    createdAt: "2026-09-24T15:30:00Z",
  },
  {
    id: "notif-2",
    userId: "usr-customer-1",
    title: "New Capsule Drop",
    message: "Atelier V just launched their Autumn/Winter architectural outerwear collection.",
    type: "promotion",
    read: true,
    link: "/products",
    createdAt: "2026-09-20T08:00:00Z",
  },
  {
    id: "notif-3",
    userId: "sup-1",
    title: "New Order Received",
    message: "Order FH-94823 for 2x Organic Heavyweight Boxy Tee requires fulfillment.",
    type: "order",
    read: false,
    link: "/supplier/orders",
    createdAt: "2026-10-02T16:21:00Z",
  },
  {
    id: "notif-4",
    userId: "usr-admin-1",
    title: "Supplier Verification",
    message: "Lumière Labs submitted updated cosmetics compliance certifications for review.",
    type: "info",
    read: false,
    link: "/admin/suppliers",
    createdAt: "2026-10-03T11:00:00Z",
  },
];
