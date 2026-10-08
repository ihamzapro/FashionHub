export type UserRole = "customer" | "supplier" | "admin";

export interface UserAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  storeName?: string; // For suppliers
  bio?: string;
  address?: UserAddress;
  status: "active" | "inactive" | "suspended";
  createdAt: string;
  updatedAt?: string;
}

export type ProductBadgeType = "new" | "sale" | "limited" | "trending" | "exclusive" | "out-of-stock";

export interface ProductAttribute {
  name: string; // e.g. "Size", "Color", "Material"
  options: string[];
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number; // For supplier/admin margins
  images: string[];
  category: string;
  subcategory?: string;
  brand: string;
  supplierId: string;
  supplierName: string;
  stock: number;
  sku: string;
  rating: number;
  reviewCount: number;
  badge?: ProductBadgeType;
  tags: string[];
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isTrending?: boolean;
  availableSizes?: string[];
  availableColors?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  parentId?: string;
  productCount: number;
  featured?: boolean;
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded"
  | "Pending"
  | "Shipped"
  | "Delivered";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded" | "Pending" | "Paid";
export type PaymentMethod = "COD" | "cash_on_delivery";

export interface OrderItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  selectedSize?: string;
  selectedColor?: string;
  sku?: string;
}

export interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customer?: CustomerInfo;
  supplierIds?: string[];
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  tax?: number;
  totalAmount: number;
  total?: number;
  status: OrderStatus;
  orderStatus?: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  shippingAddress: ShippingAddress;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateOrderInput {
  customer: CustomerInfo;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
}

export interface Review {
  id: string;
  productId: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  helpfulVotes?: number;
  createdAt: string;
}

export type NotificationType = "info" | "success" | "warning" | "order" | "promotion";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  product: Product;
  addedAt: string;
}
