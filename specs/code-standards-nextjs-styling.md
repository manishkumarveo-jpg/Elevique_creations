# Code Standards — Next.js & Styling
> Elevique Client Portal · Tailwind CSS v4, Layout Breakpoints, and UI Styling Tokens

This specification details the frontend styling guidelines, Tailwind CSS v4 variables, typography standards, and interface layout systems.

---

## 1. UI Styling Token Registry

Elevique uses a dark, premium aesthetic using custom HSL colors and glassmorphic variables. These tokens are declared inside `src/app/globals.css`:

```css
:root {
  --black: #050505;
  --white: #ffffff;
  
  /* Glassmorphism Variables */
  --glass-bg: rgba(255, 255, 255, 0.03);
  --glass-border: rgba(255, 255, 255, 0.08);
  --glass-glow: rgba(124, 58, 237, 0.15); /* Purple accent glow */
  
  /* Text Accents */
  --p-t1: #f3f4f6; /* High emphasis */
  --p-t2: #9ca3af; /* Medium emphasis */
  --p-t3: #6b7280; /* Disabled / low-contrast labels */
  
  /* Status Colors */
  --p-green: #10b981;
  --p-amber: #f59e0b;
  --p-red: #ef4444;
}
```

---

## 2. Typography Rules

- **Font Family**: The project uses the **Outfit** typeface from Google Fonts. It is configured in the root layout file (`src/app/layout.tsx`).
- **Headings**: Set to uppercase tracking letters for a cinematic, premium visual look.
- **Sizes**: Define standard paragraph sizing limits (`text-sm` for details, `text-base` for standard text, `text-2xl` for subheadings, and `text-5xl` for page headings).

---

## 3. Responsive Breakpoints

All page layouts must be designed mobile-first. Tailwind CSS v4 layout prefixes must target these key layout breakpoints:

| Breakpoint | Pixel Threshold | Primary Use Case |
|---|---|---|
| `sm` | `>= 640px` | Large phone / portrait tablet cards. |
| `md` | `>= 768px` | Tablet views, simple split columns. |
| `lg` | `>= 1024px` | Standard laptop screens, sidebars display inline. |
| `xl` | `>= 1280px` | Widescreen displays, multi-column dashboard layouts. |

---

## 4. UI Invariants & Warnings

- **No Tailwind CSS v3 arbitrary style configs**: Do not mix configuration properties from older compilers. All custom colors and sizing classes must use CSS custom variables configured inside `globals.css` or Tailwind v4 `@theme` setups.
- **Backdrop Filters**: Keep visual elements readable on background video playbacks by applying backdrop filters (`backdrop-blur-md`).
