---
name: Modern Agritech System
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#42493e'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#72796e'
  outline-variant: '#c2c9bb'
  surface-tint: '#3b6934'
  primary: '#154212'
  on-primary: '#ffffff'
  primary-container: '#2d5a27'
  on-primary-container: '#9dd090'
  inverse-primary: '#a1d494'
  secondary: '#5e604d'
  on-secondary: '#ffffff'
  secondary-container: '#e1e1c9'
  on-secondary-container: '#636451'
  tertiary: '#3a3939'
  on-tertiary: '#ffffff'
  tertiary-container: '#515050'
  on-tertiary-container: '#c5c2c2'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#bcf0ae'
  primary-fixed-dim: '#a1d494'
  on-primary-fixed: '#002201'
  on-primary-fixed-variant: '#23501e'
  secondary-fixed: '#e4e4cc'
  secondary-fixed-dim: '#c8c8b0'
  on-secondary-fixed: '#1b1d0e'
  on-secondary-fixed-variant: '#474836'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1b1b1b'
  on-tertiary-fixed-variant: '#474746'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Be Vietnam Pro
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: Be Vietnam Pro
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Work Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Work Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Work Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Work Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
---

## Brand & Style

This design system is built for a modern African agritech landscape, balancing the reliability of a fintech platform with the warmth of a community-driven marketplace. The aesthetic is rooted in **Corporate Modernism** with a **Minimalist** approach to information density, ensuring the UI feels efficient rather than overwhelming.

The target audience ranges from small-scale farmers to large-scale distributors. Consequently, the UI must evoke a sense of "digital tools for real-world growth." It prioritizes high legibility, clear hierarchy, and a human-centered feel through generous white space and soft geometry. To optimize for low-bandwidth environments, the design avoids heavy decorative assets, relying instead on clean typography and solid color blocks to create impact.

## Colors

The palette is derived from natural, earthy tones to establish immediate industry relevance and trust.

*   **Primary (Earthy Green):** Used for primary actions, branding, and success states. It represents growth and stability.
*   **Secondary (Sand Beige):** Used as a soft background alternative for cards or section highlighting, providing warmth without the starkness of pure white.
*   **Charcoal Black:** Reserved for primary typography and deep functional elements (navigation bars).
*   **Warm White:** The default background color to ensure high contrast and readability in high-glare outdoor environments.

For accessibility and low-bandwidth considerations, avoid complex gradients. Use solid fills to ensure clarity even on lower-quality mobile displays.

## Typography

The typography strategy uses two distinct sans-serif families to balance character with utility.

**Be Vietnam Pro** is utilized for headlines and display text. Its contemporary, slightly wider proportions feel welcoming and modern, perfect for establishing a friendly brand voice.

**Work Sans** is used for all body copy, data, and labels. It is a highly legible, professional font that performs exceptionally well on small screens and in data-heavy contexts like marketplace listings or financial dashboards. 

To maintain low-bandwidth efficiency, limit the number of font weights used in production to 400 (Regular), 500 (Medium), and 600/700 (Semi-Bold/Bold).

## Layout & Spacing

This design system employs a **Fluid Grid** model based on an 8px base unit. 

*   **Mobile (0-599px):** 4-column grid with 16px margins and 16px gutters. This is the primary target for field-use by farmers.
*   **Tablet (600-1023px):** 8-column grid with 24px margins.
*   **Desktop (1024px+):** 12-column grid with a maximum container width of 1280px to prevent excessive line lengths.

The spacing rhythm focuses on "stacking" elements vertically with consistent increments (8, 16, 24, 48). Elements within cards should use the `stack-sm` or `stack-md` units to maintain a compact but breathable feel. Large sections and landing pages should use `stack-lg` to define clear boundaries.

## Elevation & Depth

To maintain high performance and visual clarity, this design system avoids heavy shadows. Depth is primarily conveyed through **Tonal Layers** and subtle outlines.

1.  **Base Layer:** The Warm White background (#FAFAFA).
2.  **Surface Layer:** Cards and containers use a white fill with a 1px solid border in a very light grey or the Sand Beige (#F5F5DC) to define edges.
3.  **Elevation:** Only active or "floated" elements (like a navigation bar or a primary action button) should use a shadow. Use a very soft, diffused ambient shadow: `0px 4px 12px rgba(28, 28, 28, 0.05)`.

This approach ensures that the interface remains legible even on screens with low brightness or in direct sunlight.

## Shapes

The shape language is defined by "Soft Geometry." 

Using a `roundedness` level of **2**, standard UI elements (buttons, input fields) carry a 0.5rem (8px) corner radius. Cards and larger containers use `rounded-lg` (1rem / 16px) or `rounded-xl` (1.5rem / 24px) to create a friendly, approachable container for content. 

Circular shapes are reserved strictly for avatars and icon backgrounds to provide a clear visual distinction from functional components.

## Components

### Buttons
*   **Primary:** Solid Earthy Green (#2D5A27) with white text. 8px rounded corners.
*   **Secondary:** Sand Beige (#F5F5DC) fill with Charcoal Black text.
*   **Tertiary:** Transparent background with an Earthy Green border or text-only for low-priority actions.

### Cards
Cards are the primary vehicle for marketplace listings and dashboard widgets. They should feature a 1px border (#E0E0E0), 16px padding, and 16px corner radius. Images within cards should have a top-only radius of 16px to sit flush with the container.

### Input Fields
Inputs use a white background, 8px rounded corners, and a 1px border. On focus, the border transitions to Earthy Green. Use clear, persistent labels in Work Sans (label-md) to ensure the user always knows the context of the data being entered.

### Chips & Badges
Small, highly rounded (pill-shaped) elements used for status (e.g., "In Stock," "Verified"). Use low-saturation background colors with high-saturation text to maintain readability without overwhelming the layout.

### Lists
Lists follow a fintech-inspired pattern: leading icon or avatar, title and subtitle stacked, and a trailing action or value. Use subtle horizontal dividers (1px Sand Beige) to separate items.