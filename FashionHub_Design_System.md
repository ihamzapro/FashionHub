# FashionHub --- Design System & Color Rules

## Purpose

This document is the **single source of truth for the FashionHub
frontend visual design**.

All AI coding agents and developers working on FashionHub MUST follow
these design rules when creating or modifying UI.

The project is a modern fashion and lifestyle marketplace built with
Next.js, React, TypeScript, and Tailwind CSS.

------------------------------------------------------------------------

# 1. Brand Identity

FashionHub should feel:

-   Premium
-   Modern
-   Elegant
-   Minimal
-   Fashion-focused
-   Professional
-   Clean
-   Trustworthy

The visual identity is based on:

**Charcoal + Warm Neutrals + Burgundy**

Do NOT use bright, playful, highly saturated colors as the primary
visual language.

Do NOT introduce a new primary color without a clear functional reason.

------------------------------------------------------------------------

# 2. Official Color Palette

These are the official FashionHub colors.

  Role                   Name            Hex
  ---------------------- --------------- -----------
  Primary                Charcoal        `#1C1C1C`
  Primary Hover          Soft Black      `#111111`
  Accent                 Burgundy        `#8B3A4A`
  Accent Hover           Dark Burgundy   `#722F3D`
  Main Background        Warm Ivory      `#FAF8F5`
  Secondary Background   Soft Beige      `#F1ECE6`
  Card Background        White           `#FFFFFF`
  Main Text              Charcoal Text   `#242424`
  Secondary Text         Warm Gray       `#737373`
  Border                 Light Gray      `#E5E1DC`
  Success                Muted Green     `#4F7A61`
  Warning                Warm Amber      `#B78628`
  Error                  Muted Red       `#B84A4A`

------------------------------------------------------------------------

# 3. Color Roles

## 3.1 Charcoal --- Primary

**Hex:** `#1C1C1C`

Use Charcoal for:

-   Main navigation text
-   Primary buttons
-   Important headings
-   Dashboard sidebars
-   High-priority actions
-   Main brand elements
-   Footer backgrounds when appropriate
-   Strong UI emphasis

Charcoal is the main structural color.

Example:

``` css
background: #1C1C1C;
color: #FFFFFF;
```

------------------------------------------------------------------------

## 3.2 Soft Black --- Primary Hover

**Hex:** `#111111`

Use only for hover/active states of charcoal elements.

Example:

``` text
Normal button: #1C1C1C
Hover button:  #111111
```

Do not use Soft Black as the main background for every section.

------------------------------------------------------------------------

## 3.3 Burgundy --- Brand Accent

**Hex:** `#8B3A4A`

Burgundy is the main FashionHub accent.

Use it selectively for:

-   Add to Cart
-   Wishlist active state
-   Active navigation
-   Selected filters
-   Important links
-   Product badges
-   Rating highlights
-   Selected tabs
-   Important status indicators
-   Small visual accents
-   Promotional elements

Burgundy should be noticeable but not dominate the entire interface.

------------------------------------------------------------------------

## 3.4 Dark Burgundy --- Accent Hover

**Hex:** `#722F3D`

Use for Burgundy hover/active states.

Example:

``` text
Normal: #8B3A4A
Hover:  #722F3D
```

Do not replace every dark color with Burgundy.

------------------------------------------------------------------------

# 4. Background Colors

## Main Background

**Hex:** `#FAF8F5`

Use for:

-   Main storefront background
-   Large page sections
-   Product listing background
-   Dashboard background where appropriate

This gives FashionHub a warm premium appearance instead of a cold
pure-white interface.

------------------------------------------------------------------------

## Secondary Background

**Hex:** `#F1ECE6`

Use for:

-   Category sections
-   Promotional sections
-   Filter areas
-   Secondary cards
-   Soft visual separation
-   Empty states
-   Supporting sections

------------------------------------------------------------------------

## Card Background

**Hex:** `#FFFFFF`

Use for:

-   Product cards
-   Dashboard cards
-   Forms
-   Tables
-   Modals
-   Order cards
-   Analytics cards
-   Dropdowns

Cards should remain visually clear against the warm ivory background.

------------------------------------------------------------------------

# 5. Typography Colors

## Main Text

**Hex:** `#242424`

Use for:

-   Headings
-   Product names
-   Important labels
-   Primary content

------------------------------------------------------------------------

## Secondary Text

**Hex:** `#737373`

Use for:

-   Descriptions
-   Supporting text
-   Metadata
-   Dates
-   Helper text
-   Secondary labels

Never use very light gray for important readable text.

------------------------------------------------------------------------

# 6. Border Color

**Hex:** `#E5E1DC`

Use for:

-   Card borders
-   Inputs
-   Tables
-   Dividers
-   Dropdowns
-   Product sections

Borders should be subtle.

Avoid heavy black borders unless specifically required.

------------------------------------------------------------------------

# 7. Semantic Colors

Semantic colors should only communicate state.

## Success

**Hex:** `#4F7A61`

Use for:

-   Successful order
-   Delivered status
-   Successful form submission
-   In-stock indicators
-   Positive confirmations

## Warning

**Hex:** `#B78628`

Use for:

-   Low stock
-   Pending action
-   Warning messages
-   Attention-required states

## Error

**Hex:** `#B84A4A`

Use for:

-   Validation errors
-   Failed actions
-   Delete warnings
-   Cancelled states
-   Out-of-stock errors

Do not use semantic colors as decorative colors.

------------------------------------------------------------------------

# 8. Recommended Color Distribution

Follow this approximate visual balance:

-   **60--70%:** Warm neutrals / white
-   **20--30%:** Charcoal
-   **5--10%:** Burgundy
-   Semantic colors only when required

Burgundy must remain an accent, not the dominant background color.

------------------------------------------------------------------------

# 9. Buttons

## Primary Button

Use Charcoal.

``` text
Background: #1C1C1C
Text: #FFFFFF
Hover: #111111
```

Use for:

-   Shop Now
-   Explore
-   Submit
-   Save
-   Confirm
-   Main navigation actions

------------------------------------------------------------------------

## Accent Button

Use Burgundy.

``` text
Background: #8B3A4A
Text: #FFFFFF
Hover: #722F3D
```

Use for:

-   Add to Cart
-   Buy Now
-   Important commerce actions
-   Selected/high-priority actions

Do not make every button Burgundy.

------------------------------------------------------------------------

## Secondary Button

Use a neutral outline.

``` text
Background: transparent
Text: #242424
Border: #E5E1DC
Hover background: #F1ECE6
```

------------------------------------------------------------------------

# 10. Navigation

## Customer Navbar

Preferred:

``` text
Background: #FFFFFF
Text: #242424
Border: #E5E1DC
Active item: #8B3A4A
Hover: #722F3D
```

The navbar should be clean and lightweight.

------------------------------------------------------------------------

# 11. Footer

Preferred:

``` text
Background: #1C1C1C
Text: #FFFFFF
Secondary text: #D6D2CC
Accent links: #8B3A4A
```

Keep the footer elegant rather than overly colorful.

------------------------------------------------------------------------

# 12. Product Cards

Product cards should use:

``` text
Card: #FFFFFF
Border: #E5E1DC
Product name: #242424
Secondary text: #737373
Price: #242424
Rating: #8B3A4A
Wishlist active: #8B3A4A
Primary action: #1C1C1C
```

Hover should be subtle.

Use:

-   Slight shadow increase
-   Small image scale
-   Burgundy icon highlight

Avoid aggressive animations.

------------------------------------------------------------------------

# 13. Product Details

Recommended:

``` text
Page background: #FAF8F5
Product gallery: #FFFFFF
Product title: #242424
Price: #8B3A4A
Primary action: #8B3A4A
Secondary action: #1C1C1C
Border: #E5E1DC
```

Product photography should remain the visual focus.

Do not put heavy color overlays over product images.

------------------------------------------------------------------------

# 14. Customer Dashboard

Customer dashboard should feel lighter and more storefront-oriented.

Use:

``` text
Background: #FAF8F5
Cards: #FFFFFF
Text: #242424
Accent: #8B3A4A
Borders: #E5E1DC
```

Avoid making the entire customer dashboard dark.

------------------------------------------------------------------------

# 15. Supplier Dashboard

Supplier dashboard should feel professional and data-oriented.

Recommended:

``` text
Sidebar: #1C1C1C
Sidebar text: #FFFFFF
Active sidebar item: #8B3A4A
Background: #FAF8F5
Cards: #FFFFFF
Main text: #242424
Secondary text: #737373
Borders: #E5E1DC
```

Charts should use the FashionHub palette.

Preferred chart sequence:

1.  Burgundy `#8B3A4A`
2.  Charcoal `#1C1C1C`
3.  Warm Gray `#737373`
4.  Muted Green `#4F7A61`
5.  Warm Amber `#B78628`

Do not use random bright chart colors.

------------------------------------------------------------------------

# 16. Admin Dashboard

Admin dashboard should be professional and information-dense without
becoming visually heavy.

Recommended:

``` text
Sidebar: #1C1C1C
Active sidebar item: #8B3A4A
Page background: #FAF8F5
Cards: #FFFFFF
Headings: #242424
Secondary text: #737373
Borders: #E5E1DC
```

Use Burgundy for important metrics and active states.

Do not make all statistic cards different bright colors.

------------------------------------------------------------------------

# 17. Status Badges

Use subtle tinted backgrounds rather than strong solid backgrounds.

Examples:

### Pending

``` text
Text: #B78628
Background: rgba(183, 134, 40, 0.10)
```

### Delivered / Success

``` text
Text: #4F7A61
Background: rgba(79, 122, 97, 0.10)
```

### Cancelled / Error

``` text
Text: #B84A4A
Background: rgba(184, 74, 74, 0.10)
```

### Active / Featured

``` text
Text: #8B3A4A
Background: rgba(139, 58, 74, 0.10)
```

------------------------------------------------------------------------

# 18. Forms

Input fields:

``` text
Background: #FFFFFF
Border: #E5E1DC
Text: #242424
Placeholder: #737373
Focus border: #8B3A4A
Focus ring: subtle Burgundy
```

Do not use bright blue focus states.

------------------------------------------------------------------------

# 19. Typography

Recommended font pairing:

### Headings

Use an elegant serif such as:

-   Playfair Display

### Body/UI

Use a clean sans-serif such as:

-   Inter

If these fonts are not already configured, use a suitable fallback
rather than adding unnecessary dependencies.

Typography should create a luxury editorial feel while remaining highly
readable.

------------------------------------------------------------------------

# 20. Spacing & Shape

Use a consistent spacing system.

Prefer:

-   Generous whitespace
-   8px-based spacing
-   Moderate corner radius
-   Subtle shadows
-   Clear visual hierarchy

Avoid:

-   Extremely rounded cards
-   Excessive glassmorphism
-   Heavy shadows
-   Excessive gradients

Recommended card radius:

``` text
12px – 16px
```

Recommended button radius:

``` text
8px – 10px
```

------------------------------------------------------------------------

# 21. Animation Rules

Animations should be:

-   Smooth
-   Fast
-   Subtle
-   Purposeful

Recommended duration:

``` text
150ms – 300ms
```

Use animation for:

-   Hover
-   Dropdowns
-   Modal appearance
-   Sidebar transitions
-   Product card interactions
-   Button feedback

Do NOT animate every element.

Avoid:

-   Excessive bouncing
-   Large scaling
-   Flashing
-   Distracting page transitions

------------------------------------------------------------------------

# 22. Dark Mode

Do not introduce a separate dark-mode color system unless specifically
requested.

The default FashionHub experience should use:

**Warm Ivory + White + Charcoal + Burgundy.**

Dark charcoal sections may be used for navigation, footer, or dashboard
sidebars.

------------------------------------------------------------------------

# 23. Tailwind/CSS Implementation

Where possible, define the palette centrally instead of repeatedly
hardcoding colors throughout components.

Preferred semantic variables:

``` css
:root {
  --color-primary: #1C1C1C;
  --color-primary-hover: #111111;

  --color-accent: #8B3A4A;
  --color-accent-hover: #722F3D;

  --color-background: #FAF8F5;
  --color-secondary-background: #F1ECE6;
  --color-card: #FFFFFF;

  --color-text: #242424;
  --color-text-secondary: #737373;

  --color-border: #E5E1DC;

  --color-success: #4F7A61;
  --color-warning: #B78628;
  --color-error: #B84A4A;
}
```

If the project already has a Tailwind theme/token system, integrate
these values into the existing system instead of creating duplicate
styling systems.

------------------------------------------------------------------------

# 24. AI Coding Rules

When modifying or creating any UI:

1.  Read and follow this design system first.
2.  Reuse existing components.
3.  Reuse existing color tokens.
4.  Do not invent new colors unnecessarily.
5.  Do not randomly change the global theme.
6.  Do not replace Burgundy with blue, purple, green, or another accent.
7.  Keep the visual hierarchy consistent.
8.  Keep customer, supplier, and admin interfaces visually related.
9.  Use semantic colors only for their intended meaning.
10. Do not redesign unrelated pages while implementing a feature.
11. Preserve existing responsive behavior.
12. If a new component is required, make it compatible with this design
    system.
13. If an existing component can be reused, do not create a duplicate.
14. Before finishing, check the new UI against these color and spacing
    rules.

------------------------------------------------------------------------

# 25. Phase-Specific Design Rules

## Phase 1 --- Foundation

Establish:

-   Color tokens
-   Typography
-   Buttons
-   Inputs
-   Cards
-   Navbar
-   Footer
-   Sidebar
-   Product components

This phase defines the visual language for the entire project.

------------------------------------------------------------------------

## Phase 2 --- Customer Storefront

Emphasize:

-   Warm Ivory
-   White
-   Charcoal
-   Burgundy accents

Keep product photography dominant.

------------------------------------------------------------------------

## Phase 3 --- Product, Cart & Wishlist

Use Burgundy for:

-   Wishlist active state
-   Price highlights
-   Add to Cart
-   Buy Now
-   Important product actions

------------------------------------------------------------------------

## Phase 4 --- Checkout & Orders

Use neutral colors for forms.

Use semantic colors for:

-   Pending
-   Confirmed
-   Shipped
-   Delivered
-   Cancelled

Do not make the checkout page overly decorative.

------------------------------------------------------------------------

## Phase 5 --- Authentication

Keep authentication pages minimal.

Use:

-   Warm Ivory background
-   White form card
-   Charcoal headings
-   Burgundy primary action

------------------------------------------------------------------------

## Phase 6 --- Supplier Dashboard

Use:

-   Charcoal sidebar
-   Warm Ivory background
-   White cards
-   Burgundy active states
-   Consistent chart palette

------------------------------------------------------------------------

## Phase 7 --- Admin Dashboard

Use:

-   Charcoal sidebar
-   Warm Ivory background
-   White cards
-   Burgundy highlights
-   Restrained semantic colors

The admin dashboard should feel professional and data-focused.

------------------------------------------------------------------------

## Phase 8 --- Final Polish

Audit every page for:

-   Color consistency
-   Typography consistency
-   Button consistency
-   Border consistency
-   Responsive behavior
-   Hover states
-   Focus states
-   Status colors
-   Accessibility

Remove random colors and duplicated styling.

------------------------------------------------------------------------

# 26. Final Design Rule

When uncertain about a visual decision, prioritize this hierarchy:

**1. Usability**

**2. Accessibility**

**3. Consistency**

**4. FashionHub brand identity**

**5. Visual decoration**

Never sacrifice usability or accessibility just to make the interface
look more fashionable.

The final FashionHub UI should feel like a **premium, modern fashion
marketplace**, with **Charcoal as the structural color, warm neutrals as
the foundation, and Burgundy as the signature accent.**
