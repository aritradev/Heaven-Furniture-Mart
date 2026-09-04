---
name: ui-ux-pro-max
description: |
  UI/UX design intelligence for web, mobile, and desktop. This skill should be used when designing, building, reviewing, or fixing interfaces, including pages, components, design systems, accessibility, interaction, layout, color palette, typography, visual hierarchy, responsive design, animations, charts, icons, and micro-copy. Runs search script to get design guidelines, patterns, color schemes, font pairings, chart types, UX rules, and anti-patterns tailored to product domain and tech stack.
---

# UI/UX Pro Max Skill

AI-powered design intelligence with 84 UI styles, 192 color palettes, 74 font pairings, 98 UX guidelines, and 25 chart types across 22 tech stacks.

## When to Apply

Use this skill whenever working on UI structure, visual design choices, component design, layout, typography, colors, animations, or user experience quality control.

### Primary Use Cases

- Designing new pages (Landing Page, Dashboard, Admin, SaaS, Mobile App)
- Creating or refactoring UI components (buttons, modals, forms, tables, charts)
- Selecting color palettes, typography systems, spacing, and layout rules
- Reviewing UI code for UX, accessibility (WCAG), or visual consistency
- Implementing navigation structures, animations, or responsive behavior
- Product-level design decisions (style, visual hierarchy, brand identity)

## Rule Categories by Priority

| Priority | Category | Impact | Domain | Key Checks (Must Have) | Anti-Patterns (Avoid) |
|----------|----------|--------|--------|------------------------|------------------------|
| 1 | Accessibility | CRITICAL | `ux` | Contrast 4.5:1, Alt text, Keyboard nav, Aria-labels | Removing focus rings, Icon-only buttons without labels |
| 2 | Touch & Interaction | CRITICAL | `ux` | Min size 44×44px, 8px+ spacing, Loading feedback | Reliance on hover only, Instant state changes (0ms) |
| 3 | Performance | HIGH | `ux` | WebP/AVIF, Lazy loading, Reserve space (CLS < 0.1) | Layout thrashing, Cumulative Layout Shift |
| 4 | Style Selection | HIGH | `style`, `product` | Match product type, Consistency, SVG icons (no emoji) | Mixing flat & skeuomorphic randomly, Emoji as icons |
| 5 | Layout & Responsive | HIGH | `ux` | Mobile-first breakpoints, Viewport meta, No horizontal scroll | Horizontal scroll, Fixed px container widths, Disable zoom |
| 6 | Typography & Color | MEDIUM | `typography`, `color` | Base 16px, Line-height 1.5, Semantic color tokens | Text < 12px body, Gray-on-gray, Raw hex in components |
| 7 | Animation | MEDIUM | `ux` | Context-aware timing, Motion conveys meaning | One duration for every transition, Animating width/height |
| 8 | Forms & Feedback | MEDIUM | `ux` | Visible labels, Error near field, Helper text | Placeholder-only label, Errors only at top |
| 9 | Navigation Patterns | HIGH | `ux` | Predictable back, Bottom nav ≤5, Deep linking | Overloaded nav, Broken back behavior |
| 10 | Charts & Data | LOW | `chart` | Legends, Tooltips, Accessible colors | Relying on color alone to convey meaning |

## Prerequisites

The bundled scripts require Python 3 (standard library only — no third-party packages needed).

```bash
python3 --version || python --version
```

## How to Use This Skill

### Step 1: Analyze User Requirements
Extract product type, target audience, style preferences, tech stack, and target platform.

### Step 2: Generate Design System (new projects/pages)
```bash
python3 scripts/search.py "<product_type> <industry> <keywords>" --design-system -p "Project Name"
```

### Step 3: Detailed Searches (as needed)
```bash
python3 scripts/search.py "<keyword>" --domain <domain> [-n <max_results>]
```
**Domains**: `product`, `style`, `color`, `typography`, `chart`, `ux`, `landing`, `react`, `web`, `icons`, `google-fonts`, `gsap`.

### Step 4: Stack Guidelines
```bash
python3 scripts/search.py "<keyword>" --stack <stack_name>
```
**Supported Stacks**: `html-css`, `react`, `nextjs`, `vue`, `svelte`, `tailwind`, `bootstrap`, `shadcn`, `material-ui`, `flutter`, `swiftui`, `react-native`, `android`, `ios`, `unity`, `web-components`, etc.
