import { mockProducts } from "./products";
import { mockCategories } from "./categories";
import { mockUsers } from "./users";
import { mockOrders } from "./orders";
import { mockReviews } from "./reviews";
import { mockNotifications } from "./notifications";
import { Product, User, Order, Review } from "../types";

export {
  mockProducts,
  mockCategories,
  mockUsers,
  mockOrders,
  mockReviews,
  mockNotifications,
};

// Helper data accessors
export function getProductById(id: string): Product | undefined {
  return mockProducts.find((p) => p.id === id || p.slug === id);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  const category = mockCategories.find(
    (c) => c.slug.toLowerCase() === categorySlug.toLowerCase() || c.name.toLowerCase() === categorySlug.toLowerCase()
  );
  if (!category) return mockProducts;
  return mockProducts.filter(
    (p) =>
      p.category.toLowerCase() === category.name.toLowerCase() ||
      p.tags.includes(category.slug.toLowerCase()) ||
      p.tags.includes(category.name.toLowerCase())
  );
}

export function getFeaturedProducts(): Product[] {
  return mockProducts.filter((p) => p.isFeatured);
}

export function getNewArrivals(): Product[] {
  return mockProducts.filter((p) => p.isNewArrival);
}

export function getTrendingProducts(): Product[] {
  return mockProducts.filter((p) => p.isTrending);
}

export function getReviewsByProductId(productId: string): Review[] {
  return mockReviews.filter((r) => r.productId === productId);
}

export function getUserById(userId: string): User | undefined {
  return mockUsers.find((u) => u.id === userId);
}

export function getOrdersByCustomerId(customerId: string): Order[] {
  return mockOrders.filter((o) => o.customerId === customerId);
}

export function getOrdersBySupplierId(supplierId: string): Order[] {
  return mockOrders.filter((o) => o.supplierIds?.includes(supplierId));
}
