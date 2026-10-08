# FashionHub --- Project Architecture

## 1. Purpose

This document is the **technical source of truth** for the FashionHub
Final Year Project.

FashionHub is a multi-role fashion marketplace built with:

-   Next.js
-   React
-   TypeScript
-   Tailwind CSS
-   MongoDB
-   Next.js App Router
-   Reusable UI components
-   API/service layer
-   Role-based access control

The system contains three main roles:

-   **Customer**
-   **Supplier**
-   **Admin**

All developers and AI coding agents MUST follow this architecture when
creating or modifying the project.

------------------------------------------------------------------------

# 2. Core Architecture Principles

The project must follow these principles:

1.  Keep UI separate from business logic.
2.  Keep API/database logic separate from UI components.
3.  Use reusable components instead of duplicated UI.
4.  Use TypeScript throughout the project.
5.  Avoid `any` unless there is a documented reason.
6.  Use Server Components by default.
7.  Use Client Components only where interactivity or browser APIs
    require them.
8.  Keep role-specific functionality isolated.
9.  Do not directly access MongoDB from presentation components.
10. Centralize shared types.
11. Centralize API/service functions.
12. Keep mock data replaceable with real API calls.
13. Do not duplicate authentication or authorization logic.
14. Do not introduce unnecessary dependencies.
15. Do not modify unrelated modules when implementing a feature.

------------------------------------------------------------------------

# 3. High-Level System Architecture

The application should follow this conceptual flow:

``` text
┌───────────────────────────────────────────────┐
│                   UI Layer                    │
│       Pages / Layouts / Components             │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────┐
│              State / Hooks Layer              │
│ Auth / Cart / Wishlist / UI State              │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────┐
│              Service / API Layer              │
│ Products / Orders / Users / Reviews / etc.    │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────┐
│              Next.js API Layer                │
│              Route Handlers                   │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────┐
│              Business / Data Layer            │
│ Validation / Authorization / Database Logic    │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────┐
│                  MongoDB                      │
│ Users / Products / Orders / Reviews / etc.    │
└───────────────────────────────────────────────┘
```

The UI must not skip architectural layers unnecessarily.

------------------------------------------------------------------------

# 4. Recommended Project Structure

Use the following scalable structure:

``` text
fashionhub/
│
├── app/
│   ├── (public)/
│   │   ├── page.tsx
│   │   ├── products/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── categories/
│   │   │   └── page.tsx
│   │   ├── wishlist/
│   │   │   └── page.tsx
│   │   ├── cart/
│   │   │   └── page.tsx
│   │   └── checkout/
│   │       └── page.tsx
│   │
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── forgot-password/
│   │       └── page.tsx
│   │
│   ├── (customer)/
│   │   ├── orders/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   └── notifications/
│   │       └── page.tsx
│   │
│   ├── supplier/
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── products/
│   │   │   ├── page.tsx
│   │   │   ├── add/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx
│   │   ├── orders/
│   │   │   └── page.tsx
│   │   ├── analytics/
│   │   │   └── page.tsx
│   │   ├── notifications/
│   │   │   └── page.tsx
│   │   └── profile/
│   │       └── page.tsx
│   │
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── users/
│   │   │   └── page.tsx
│   │   ├── suppliers/
│   │   │   └── page.tsx
│   │   ├── customers/
│   │   │   └── page.tsx
│   │   ├── products/
│   │   │   └── page.tsx
│   │   ├── categories/
│   │   │   └── page.tsx
│   │   ├── orders/
│   │   │   └── page.tsx
│   │   ├── reviews/
│   │   │   └── page.tsx
│   │   ├── reports/
│   │   │   └── page.tsx
│   │   └── notifications/
│   │       └── page.tsx
│   │
│   ├── api/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── products/
│   │   ├── categories/
│   │   ├── cart/
│   │   ├── wishlist/
│   │   ├── orders/
│   │   ├── reviews/
│   │   ├── notifications/
│   │   └── analytics/
│   │
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   └── not-found.tsx
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── products/
│   ├── cart/
│   ├── wishlist/
│   ├── checkout/
│   ├── orders/
│   ├── reviews/
│   ├── notifications/
│   ├── customer/
│   ├── supplier/
│   └── admin/
│
├── lib/
│   ├── api/
│   ├── auth/
│   ├── db/
│   ├── validations/
│   ├── mock-data/
│   ├── utils/
│   └── constants/
│
├── hooks/
│   ├── useAuth.ts
│   ├── useCart.ts
│   ├── useWishlist.ts
│   ├── useProducts.ts
│   └── useNotifications.ts
│
├── models/
│   ├── User.ts
│   ├── Product.ts
│   ├── Category.ts
│   ├── Order.ts
│   ├── Review.ts
│   └── Notification.ts
│
├── types/
│   ├── user.ts
│   ├── product.ts
│   ├── order.ts
│   ├── review.ts
│   └── notification.ts
│
├── public/
│   ├── images/
│   └── icons/
│
├── middleware.ts
├── .env.local
├── DESIGN_SYSTEM.md
├── ARCHITECTURE.md
└── package.json
```

The exact structure may evolve, but new files should follow the same
architectural boundaries.

------------------------------------------------------------------------

# 5. Route Organization

## Public Routes

Public pages include:

``` text
/
/products
/products/[id]
/categories
/login
/register
/forgot-password
```

Public users can browse products without authentication.

------------------------------------------------------------------------

## Customer Routes

Customer-specific pages:

``` text
/cart
/wishlist
/checkout
/orders
/orders/[id]
/profile
/notifications
```

These routes require customer authentication where appropriate.

------------------------------------------------------------------------

## Supplier Routes

All supplier functionality must remain under:

``` text
/supplier/*
```

Examples:

``` text
/supplier/dashboard
/supplier/products
/supplier/products/add
/supplier/products/[id]/edit
/supplier/orders
/supplier/analytics
```

Only users with the `supplier` role should access these pages.

------------------------------------------------------------------------

## Admin Routes

All administrative functionality must remain under:

``` text
/admin/*
```

Examples:

``` text
/admin/dashboard
/admin/users
/admin/suppliers
/admin/customers
/admin/products
/admin/categories
/admin/orders
/admin/reviews
/admin/reports
```

Only users with the `admin` role should access these routes.

------------------------------------------------------------------------

# 6. Role Architecture

The application has exactly three primary roles:

``` text
CUSTOMER
SUPPLIER
ADMIN
```

Do not create additional roles unless explicitly required.

## Customer

Can:

-   Browse products
-   Search products
-   Filter products
-   Add products to cart
-   Manage wishlist
-   Place orders
-   View orders
-   Track orders
-   Submit reviews
-   Manage profile
-   Receive notifications

Cannot:

-   Manage other users
-   Manage supplier products
-   Access admin dashboard

------------------------------------------------------------------------

## Supplier

Can:

-   Manage own products
-   Add products
-   Edit own products
-   Delete own products
-   View own orders
-   Monitor sales
-   View product performance
-   View notifications
-   Manage own profile

Cannot:

-   Manage other suppliers
-   Manage all users
-   Moderate reviews
-   Access admin-only functionality

------------------------------------------------------------------------

## Admin

Can:

-   Manage users
-   Manage suppliers
-   Manage customers
-   Manage products
-   Manage categories
-   Manage orders
-   Moderate reviews
-   View reports
-   View platform analytics
-   Manage notifications/system settings

Admin is the highest application role.

------------------------------------------------------------------------

# 7. Authentication Architecture

Authentication should be centralized.

Create:

``` text
lib/auth/
```

Responsibilities:

-   Get current user
-   Login
-   Logout
-   Registration
-   Session handling
-   Role checking
-   Authentication helpers

Do not implement separate authentication logic inside every page.

------------------------------------------------------------------------

# 8. Authorization

Authentication answers:

> Who is the user?

Authorization answers:

> What can this user access?

Role authorization must be enforced separately from UI visibility.

Example:

``` text
User authenticated?
        │
        ▼
Check role
        │
 ┌──────┼────────┐
 ▼      ▼        ▼
Customer Supplier Admin
```

Hiding an admin button from a customer is NOT sufficient security.

Server/API authorization must also verify the user's role.

------------------------------------------------------------------------

# 9. Middleware

Use `middleware.ts` for appropriate route protection and redirects.

Example conceptual rules:

``` text
/admin/*     → ADMIN only
/supplier/*  → SUPPLIER only
/orders      → authenticated customer
/profile     → authenticated user
```

Do not put all business authorization logic inside middleware.

Detailed authorization should also happen at the API/service layer.

------------------------------------------------------------------------

# 10. Component Architecture

Components should be divided into three levels.

## UI Components

Generic reusable components:

``` text
Button
Input
Dialog
Modal
Badge
Card
Table
Tabs
Dropdown
Select
Skeleton
Toast
```

Location:

``` text
components/ui/
```

These components should not know about MongoDB or specific business
rules.

------------------------------------------------------------------------

## Feature Components

Business-specific reusable components:

``` text
ProductCard
ProductGrid
CartItem
OrderCard
OrderStatusBadge
ReviewCard
NotificationItem
StatCard
```

Example:

``` text
components/products/
components/orders/
components/cart/
```

------------------------------------------------------------------------

## Page Components

Pages should compose reusable components.

Avoid putting huge UI implementations directly inside `page.tsx`.

Bad:

``` text
page.tsx
└── 800 lines of UI
```

Better:

``` text
page.tsx
├── PageHeader
├── ProductFilters
├── ProductGrid
└── Pagination
```

------------------------------------------------------------------------

# 11. Server vs Client Components

Use **Server Components by default**.

Use `"use client"` only when needed.

Client Components are appropriate for:

-   useState
-   useEffect
-   Event handlers
-   Browser APIs
-   Interactive filters
-   Cart interactions
-   Wishlist interactions
-   Modals
-   Dropdowns
-   Client-side forms
-   Interactive charts

Do not add `"use client"` to entire pages simply because one child
component is interactive.

Prefer:

``` text
Server Page
   ↓
Client Interactive Component
```

instead of:

``` text
Entire Page = Client Component
```

------------------------------------------------------------------------

# 12. Data Flow

The preferred data flow is:

``` text
Page
 ↓
Feature Component
 ↓
Hook / Server Function / API Service
 ↓
API Route
 ↓
Validation + Authorization
 ↓
Database Model
 ↓
MongoDB
```

For read operations, Server Components may fetch data directly through
an appropriate server-side service where practical.

For browser-driven mutations:

``` text
Client Component
 ↓
API Service
 ↓
API Route
 ↓
Validation
 ↓
Authorization
 ↓
Database
```

------------------------------------------------------------------------

# 13. API Architecture

API routes should be organized by domain:

``` text
/api/auth
/api/users
/api/products
/api/categories
/api/cart
/api/wishlist
/api/orders
/api/reviews
/api/notifications
/api/analytics
```

Each API endpoint should have a clear responsibility.

Do not create one giant API route for the entire application.

------------------------------------------------------------------------

# 14. Service Layer

Create domain-specific service functions.

Example:

``` text
lib/api/products.ts
lib/api/orders.ts
lib/api/users.ts
lib/api/reviews.ts
```

Services should handle communication with API endpoints or server-side
data operations.

Example conceptual interface:

``` ts
getProducts()
getProductById(id)
createProduct(data)
updateProduct(id, data)
deleteProduct(id)
```

Components should not contain repeated fetch logic.

------------------------------------------------------------------------

# 15. MongoDB Architecture

MongoDB is the primary database.

Recommended conceptual structure:

``` text
MongoDB
│
├── users
├── products
├── categories
├── orders
├── reviews
├── notifications
└── wishlists
```

Cart data can initially be client-side, but the architecture should
allow persistent carts later.

------------------------------------------------------------------------

# 16. Database Connection

Keep MongoDB connection logic centralized.

Recommended:

``` text
lib/db/
```

Example:

``` text
lib/db/mongodb.ts
```

Do not create a new MongoDB connection inside every API route.

Use a reusable database connection.

------------------------------------------------------------------------

# 17. MongoDB Models

Recommended models:

``` text
User
Product
Category
Order
Review
Notification
Wishlist
```

------------------------------------------------------------------------

# 18. User Model

Conceptual fields:

``` text
_id
name
email
passwordHash
role
profileImage
phone
address
status
createdAt
updatedAt
```

Role:

``` text
customer | supplier | admin
```

Never store plain-text passwords.

------------------------------------------------------------------------

# 19. Product Model

Conceptual fields:

``` text
_id
name
categoryId
supplierId
price
description
stock
images[]
rating
reviewCount
status
createdAt
updatedAt
```

Important relationship:

``` text
Product
 ├── categoryId
 └── supplierId
```

A supplier should only be able to modify products belonging to that
supplier.

------------------------------------------------------------------------

# 20. Category Model

Conceptual fields:

``` text
_id
name
description
image
status
createdAt
updatedAt
```

------------------------------------------------------------------------

# 21. Order Model

Conceptual structure:

``` text
_id
customerId
items[]
totalAmount
paymentMethod
shippingAddress
status
createdAt
updatedAt
```

Order item:

``` text
productId
supplierId
productName
price
quantity
subtotal
```

Payment method:

``` text
COD
```

Order status:

``` text
pending
confirmed
shipped
delivered
cancelled
```

------------------------------------------------------------------------

# 22. Review Model

Conceptual fields:

``` text
_id
productId
customerId
rating
comment
status
createdAt
updatedAt
```

Review status:

``` text
pending
approved
rejected
```

Only approved reviews should be publicly visible.

------------------------------------------------------------------------

# 23. Notification Model

Conceptual fields:

``` text
_id
userId
title
message
type
isRead
createdAt
```

Types may include:

``` text
order
review
product
system
alert
```

------------------------------------------------------------------------

# 24. Validation Architecture

Use a centralized validation approach.

Recommended location:

``` text
lib/validations/
```

Validation should cover:

-   Registration
-   Login
-   Product creation
-   Product updates
-   Checkout
-   Order creation
-   Reviews
-   Profile updates

Validation must happen on the server even if frontend validation exists.

Frontend validation improves UX.

Server validation provides actual protection.

------------------------------------------------------------------------

# 25. Error Handling

Use consistent error handling.

The application should support:

``` text
Loading
Success
Empty
Error
```

For API errors, return structured responses.

Do not expose sensitive database errors directly to users.

User-facing messages should be understandable.

------------------------------------------------------------------------

# 26. Loading Architecture

Use Next.js loading states where appropriate:

``` text
loading.tsx
```

Use skeleton components for:

-   Product grids
-   Dashboard cards
-   Tables
-   Order lists
-   Analytics

Avoid showing blank screens while data loads.

------------------------------------------------------------------------

# 27. Empty States

Every data-driven page should handle empty data.

Examples:

``` text
No products found
Your cart is empty
Your wishlist is empty
No orders yet
No reviews pending
No notifications
No suppliers found
```

Provide useful actions where appropriate.

------------------------------------------------------------------------

# 28. Mock Data Architecture

Before backend integration, mock data should live in:

``` text
lib/mock-data/
```

Do not place large mock datasets directly inside components.

The frontend should consume mock data through services so that replacing
mock data with MongoDB/API data requires minimal UI changes.

------------------------------------------------------------------------

# 29. State Management

Use local state for local UI concerns.

Examples:

``` text
Modal open/close
Filter visibility
Selected tab
Form input
```

Use shared state only for truly shared application state:

``` text
Authentication
Cart
Wishlist
Notifications
```

Do not create global state for every small UI value.

------------------------------------------------------------------------

# 30. Cart Architecture

Cart should support:

``` text
Add item
Remove item
Increase quantity
Decrease quantity
Calculate subtotal
Calculate delivery
Calculate total
Clear cart
```

Keep cart calculations centralized.

Do not duplicate total calculations across multiple pages.

------------------------------------------------------------------------

# 31. Wishlist Architecture

Wishlist should support:

``` text
Add
Remove
Check whether item exists
Move to cart
Clear
```

Use a reusable wishlist hook/service.

------------------------------------------------------------------------

# 32. Order Flow

The intended customer order flow is:

``` text
Browse Product
      ↓
Product Details
      ↓
Add to Cart
      ↓
Cart
      ↓
Checkout
      ↓
COD Selection
      ↓
Place Order
      ↓
Order Created
      ↓
Order Confirmation
      ↓
Order Tracking
```

------------------------------------------------------------------------

# 33. Supplier Product Flow

``` text
Supplier Login
      ↓
Supplier Dashboard
      ↓
Products
      ↓
Add Product
      ↓
Validate Product
      ↓
Create Product
      ↓
Product Listed
```

Editing:

``` text
Products
 ↓
Edit
 ↓
Validate
 ↓
Update
```

Deletion should require confirmation.

------------------------------------------------------------------------

# 34. Admin Review Flow

``` text
Customer submits review
        ↓
Review status = pending
        ↓
Admin Review Panel
        ↓
Approve / Reject
        ↓
If approved
        ↓
Publicly visible
```

------------------------------------------------------------------------

# 35. Analytics Architecture

Analytics should be based on actual platform data once MongoDB
integration is complete.

Supplier analytics should be limited to supplier-owned data.

Admin analytics can aggregate platform-wide data.

Examples:

Supplier:

``` text
Own sales
Own orders
Own products
Own product views
```

Admin:

``` text
All sales
All orders
All products
All suppliers
All customers
```

Never expose another supplier's private analytics to a supplier.

------------------------------------------------------------------------

# 36. Image Architecture

Product images should be stored using an appropriate image-storage
solution later.

MongoDB should not be used as a place to store large raw image files
unless specifically designed for that purpose.

The Product model should store image URLs/references:

``` text
images: string[]
```

Use Next.js image optimization for displayed images where appropriate.

------------------------------------------------------------------------

# 37. Security Rules

Never:

-   Store plain-text passwords.
-   Expose database credentials to the browser.
-   Put secrets in client-side code.
-   Trust role information sent blindly by the client.
-   Allow suppliers to edit another supplier's products.
-   Allow customers to access admin APIs.
-   Allow public users to create admin accounts.

Environment variables containing secrets must remain server-side.

Use:

``` text
.env.local
```

and never commit secrets to Git.

------------------------------------------------------------------------

# 38. Environment Variables

Use environment variables for:

``` text
MONGODB_URI
AUTH_SECRET
```

and other server-side credentials as required.

Never prefix secret server variables with `NEXT_PUBLIC_`.

------------------------------------------------------------------------

# 39. Design System Integration

The visual architecture must follow:

``` text
DESIGN_SYSTEM.md
```

The design system defines:

-   Colors
-   Typography
-   Buttons
-   Cards
-   Inputs
-   Spacing
-   Animation
-   Customer UI
-   Supplier UI
-   Admin UI

`ARCHITECTURE.md` defines technical structure.

`DESIGN_SYSTEM.md` defines visual structure.

Both documents must be followed together.

------------------------------------------------------------------------

# 40. AI Coding Agent Rules

Before modifying the project, an AI coding agent MUST:

1.  Read `ARCHITECTURE.md`.
2.  Read `DESIGN_SYSTEM.md`.
3.  Inspect the existing implementation.
4.  Reuse existing components.
5.  Reuse existing services/hooks/types.
6.  Avoid duplicate implementations.
7.  Avoid unrelated changes.
8.  Preserve existing routes.
9.  Preserve the established color system.
10. Follow role boundaries.
11. Keep database logic server-side.
12. Keep secrets server-side.
13. Run lint/type checks where available.
14. Verify affected routes after changes.

If an existing architecture decision conflicts with a new requirement,
explain the conflict before making a large structural change.

------------------------------------------------------------------------

# 41. Rules for Adding New Features

When a new feature is requested:

### Step 1 --- Identify the role

Is it:

``` text
Customer
Supplier
Admin
Shared
```

### Step 2 --- Identify the domain

Examples:

``` text
Products
Orders
Reviews
Users
Notifications
Analytics
```

### Step 3 --- Reuse existing components

Check:

``` text
components/
hooks/
lib/api/
types/
models/
```

before creating new files.

### Step 4 --- Add the minimum required files

Do not create unnecessary abstractions.

### Step 5 --- Maintain role authorization

Ensure the feature cannot be accessed by unauthorized roles.

### Step 6 --- Follow the design system

Use the existing FashionHub tokens and components.

------------------------------------------------------------------------

# 42. Phase Architecture

The project should be developed in these phases:

## Phase 1 --- Foundation

Build:

-   Project structure
-   Design system
-   Layouts
-   Shared components
-   Types
-   Mock data

------------------------------------------------------------------------

## Phase 2 --- Customer Storefront

Build:

-   Homepage
-   Products
-   Categories
-   Search
-   Filters
-   Product grids

------------------------------------------------------------------------

## Phase 3 --- Shopping

Build:

-   Product details
-   Cart
-   Wishlist

------------------------------------------------------------------------

## Phase 4 --- Orders

Build:

-   Checkout
-   COD
-   Order creation
-   Order history
-   Order tracking

------------------------------------------------------------------------

## Phase 5 --- Authentication

Build:

-   Login
-   Registration
-   Forgot password
-   Authentication state
-   Role protection
-   Profile

------------------------------------------------------------------------

## Phase 6 --- Supplier

Build:

-   Supplier dashboard
-   Product management
-   Supplier orders
-   Analytics
-   Notifications

------------------------------------------------------------------------

## Phase 7 --- Admin

Build:

-   Admin dashboard
-   User management
-   Supplier management
-   Product management
-   Category management
-   Order management
-   Review moderation
-   Reports

------------------------------------------------------------------------

## Phase 8 --- Backend Integration & Stabilization

Build/integrate:

-   MongoDB
-   API routes
-   Authentication backend
-   Authorization
-   Validation
-   Database models
-   Error handling
-   Performance
-   Security
-   Final testing

------------------------------------------------------------------------

# 43. Definition of Done

A feature is considered complete only when:

-   UI is implemented.
-   Responsive behavior works.
-   Loading state exists where required.
-   Empty state exists where required.
-   Error handling exists where required.
-   Validation exists where required.
-   Authorization is respected.
-   Existing components are reused.
-   Existing functionality is not broken.
-   TypeScript has no relevant errors.
-   No unnecessary console errors exist.
-   Design follows `DESIGN_SYSTEM.md`.

------------------------------------------------------------------------

# 44. Final Architecture Goal

FashionHub should remain easy to understand and extend.

The intended separation is:

``` text
UI
 ↓
Components
 ↓
Hooks / State
 ↓
Services
 ↓
API
 ↓
Validation + Authorization
 ↓
Models
 ↓
MongoDB
```

The three roles remain clearly separated:

``` text
                 FashionHub
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
      Customer    Supplier     Admin
          │          │          │
       Shopping   Products    Platform
       Orders     Sales       Management
       Wishlist   Analytics   Reports
```

The architecture should support future features without requiring a
complete rewrite.

The final system should be:

-   Maintainable
-   Scalable
-   Secure
-   Responsive
-   Modular
-   Easy to test
-   Easy for AI coding agents to understand
-   Ready for MongoDB integration
-   Suitable for a Final Year Project demonstration and viva
