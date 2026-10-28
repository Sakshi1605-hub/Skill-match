---
name: Radix Enterprise Design System
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45464d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#4b41e1'
  on-secondary: '#ffffff'
  secondary-container: '#645efb'
  on-secondary-container: '#fffbff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#001f26'
  on-tertiary-container: '#0090a9'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#e2dfff'
  secondary-fixed-dim: '#c3c0ff'
  on-secondary-fixed: '#0f0069'
  on-secondary-fixed-variant: '#3323cc'
  tertiary-fixed: '#acedff'
  tertiary-fixed-dim: '#4cd7f6'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#004e5c'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.025em
  headline-xl-mobile:
    fontFamily: Geist
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Geist
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  body-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0em
  label-md:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Geist
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.02em
  code-metric:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: -0.02em
  code-score:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: -0.03em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-sm: 0.75rem
  gutter-lg: 1.5rem
  margin: 1.5rem
  margin-sm: 1rem
  margin-lg: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

### Personality & Direction
The design system pairs high-utility enterprise infrastructure with analytical precision. It rejects decorative AI tropes—avoiding glowing neon brains, generic sparkle glyphs, and sci-fi gradients—in favor of an executive, data-dense workbench aesthetic inspired by Linear, Stripe Dashboard, and Notion. The core voice is quiet, authoritative, legible, and deterministic. It positions automated talent decisions and AI skill scoring as rigorous mathematical telemetry rather than speculative intuition.

### Aesthetic Movement & Craft Principles
- **Functional Precision & Information Density:** Content-first layouts maximize visible data density without visual clutter. Tightly scaled typographic hierarchies, compact component padding, and deliberate micro-alignments allow recruiters, HR executives, and workforce planners to process high-volume skill graphs rapidly.
- **Tonal Subtlety & Crisp Structure:** Structural integrity relies on crisp borders, hairline dividers, and delicate 1px translucent bounding strokes rather than heavy shadows. White surface planes sit cleanly against very light cool grey backdrops.
- **Deterministic AI Artifacts:** Predictive metrics, match confidences, and skill proficiencies are displayed through structured data primitives: radial score rings with tabular numeric values, mono-spaced variance percentages, micro-badges, and transparent audit trails that demystify artificial intelligence scores.

## Colors

### Palette Philosophy
The palette uses deep indigo-slate anchors for structure, paired with a clean electric violet secondary for critical actions and focused workflow tracks. Cyan is reserved specifically for predictive telemetry, model insight tags, and algorithmic indicators. 

### Surface & Neutral Structure
- **Canvas Base (`#F8FAFC`):** The primary workbench background canvas, offering soft optical contrast against data sheets and cards.
- **Sub-surface (`#F1F5F9`):** Outer panels, sidebars, drawer bases, and nested table headers.
- **Card / Pure Surface (`#FFFFFF`):** Workcards, modal overlays, inline forms, and active canvas blocks.
- **Borders & Dividers (`#E2E8F0`):** Default hairline container boundaries, table grids, and input outlines.
- **Muted Borders (`#CBD5E1`):** Active borders, dividers under interactive hover, and segmented pill separators.

### Brand & Interactive Colors
- **Deep Slate Primary (`#0F172A`):** Master brand token, primary text, high-emphasis headers, active dark navigation elements, and primary buttons.
- **Deep Indigo Base (`#1E1B4B`):** Deep brand tint used for high-tier enterprise badge fills and selected navigation nodes.
- **Electric Violet (`#4F46E5` base, `#6366F1` hover):** Focused state rings, active selection toggles, primary workflow completions, and verified skill achievements.
- **Cyan Accent (`#06B6D4`):** Real-time inference vectors, model explainability meters, and contextual skill matching confidence highlights.

### Functional & Semantic Feedback
- **Success (`#10B981`):** Verified skills, confirmed candidate placements, positive compliance tests. Background tint: `#ECFDF5`.
- **Warning (`#F59E0B`):** Data drift warnings, missing skill validations, stale talent benchmarks. Background tint: `#FFFBEB`.
- **Error (`#EF4444`):** Disqualification events, compliance violations, unverified claims. Background tint: `#FEF2F2`.

## Typography

### Structural Framework
The typographic architecture is built on Geist for UI hierarchy and JetBrains Mono for telemetry, match coefficients, algorithm variables, and skill matrices.

### Rules of Usage
- **Display and Headings:** Compact negative tracking (`-0.025em` to `-0.01em`) ensures titles remain dense, sharp, and confident across high-resolution enterprise displays.
- **Readability in Data-Dense Environments:** Body sizes run tight (`13px` default for primary tables and interactive cards, `12px` for metadata lists) with tuned line-heights to support vertical scannability without feeling compressed.
- **Monospace Telemetry:** All numeric metrics, percentages, AI confidence thresholds, and candidate ranking calculations must use `code-metric` or `code-score`. This guarantees absolute tabular column alignment across live-updating lists.

## Layout & Spacing

### Layout System
The system is built on a 12-column adaptive grid supported by an inner 4px base rhythm. Layouts optimize for horizontal density and vertical persistence:
- **Global Shell:** A dual-layer persistent multi-column frame:
  - Global Navigation Sidebar: 64px collapsed icon strip or 240px fully pinned sidebar.
  - Contextual Sub-navigation / Filter Bar: 280px left rail for deep taxonomy filtering, candidate sourcing filters, and pipeline groupings.
  - Global Utility Topbar: 48px fixed height containing enterprise breadcrumbs, organization switchers, search bars, and real-time processing indicators.
  - Main Workbench Canvas: Fluid grid spanning remaining viewport width with minimum horizontal bounds of 1024px.

### Responsive Breakpoints
- **Desktop (1440px and above):** Dual sidebar view uncollapsed, full 12-column analytical canvas, visible side-by-side candidate comparison drawers.
- **Laptop (1024px – 1439px):** Contextual sub-nav collapsible into a slide-over panel. Grid retains 12 columns with condensed gutters (`gutter-sm`).
- **Tablet & Compact (Below 1024px):** Primary sidebar folds into a rail menu. Comparative multi-column tables collapse into vertical card feeds with horizontal metric scroll.

## Elevation & Depth

### Tonal Stratification
Depth is communicated through hairline outlines and precise surface steps rather than high-spread blur effects. 

1. **Level 0 (Base Canvas):** `#F8FAFC` flat surface.
2. **Level 1 (Card & Module Layer):** `#FFFFFF` crisp fill bounded by `1px solid #E2E8F0`. Shadow: `0px 1px 2px rgba(15, 23, 42, 0.04), 0px 1px 3px rgba(15, 23, 42, 0.02)`.
3. **Level 2 (Interactive Floating Elements & Dropdowns):** `#FFFFFF` fill with `1px solid #CBD5E1`. Shadow: `0px 4px 6px -1px rgba(15, 23, 42, 0.06), 0px 2px 4px -2px rgba(15, 23, 42, 0.04)`.
4. **Level 3 (Candidate Detail Drawers & Modals):** `#FFFFFF` fill with `1px solid #94A3B8`. Shadow: `0px 20px 25px -5px rgba(15, 23, 42, 0.08), 0px 8px 10px -6px rgba(15, 23, 42, 0.04)`.

### Border Discipline
Components rely on strict 1px boundary tokens. Outlines always use `#E2E8F0` at rest, moving to `#6366F1` or `#0F172A` on focus or activation. Heavy Drop shadows are never used without an explicit structural border.

## Shapes

### Edge Architecture
The interface uses a calibrated soft profile (`roundedness: 1`):
- **Base Components (Inputs, Buttons, Cells):** `0.25rem` (4px). Delivers crisp tool-like precision.
- **Surfaces (Cards, Content Panels, Modals):** `0.5rem` (8px). Softens modular partitions without appearing playful.
- **Data Pills & Status Badges:** `9999px` (Full Pill). Micro-badges, taxonomy tags, and status dots leverage complete pill geometry to visually decouple categorizations from structural layout boxes.

## Components

### Buttons
- **Primary:** Background `#0F172A`, text `#FFFFFF`, border `1px solid #0F172A`. Hover: `#1E293B`. Active: `#020617`. Focus: 2px offset ring in `#4F46E5`.
- **Secondary:** Background `#FFFFFF`, text `#0F172A`, border `1px solid #E2E8F0`. Hover: `#F8FAFC`, border `#CBD5E1`.
- **Subtle / Ghost:** Background `transparent`, text `#64748B`. Hover: `#F1F5F9`, text `#0F172A`.
- **Action Highlight (AI Runs):** Background `#4F46E5`, text `#FFFFFF`. Hover: `#4338CA`.
- **Dimensions:** Default height `32px` (padding `0 12px`, typography `label-md`). Compact/Dense height `26px` (padding `0 8px`, typography `label-sm`).

### Chips, Pills & Micro-Badges
- **Skill Taxonomy Tag:** Height `22px`, radius `9999px`, background `#F1F5F9`, text `#334155`, border `1px solid #E2E8F0`. Monospace proficiency level suffix (e.g., `React · L4`).
- **Telemetry Micro-Badge:** Height `18px`, radius `9999px`, padding `0 6px`. 
  - *High Match:* Background `#ECFDF5`, text `#065F46`, border `1px solid #A7F3D0`.
  - *Algorithmic Flag:* Background `#EFF6FF`, text `#1E40AF`, border `1px solid #BFDBFE`.
  - *Under Review:* Background `#FFFBEB`, text `#92400E`, border `1px solid #FDE68A`.

### Explainable AI Score Rings
- Compact circular SVG indicators (`32px` inline, `48px` card view) with a background track `#F1F5F9` and stroke width of `3px`.
- Active stroke dynamically rendered via `#4F46E5` (Overall Score) or `#06B6D4` (Skill Affinity).
- Centered numeric value rendered using `code-score` typography.
- Hover action triggers a floating structural popover exposing breakdown dimensions: semantic match weight, historical verification factor, and candidate peer-group percentile.

### Data Tables & Lists
- **Row Architecture:** Row height `40px` compact, `48px` standard. Cell padding horizontal `12px`. Hairline border bottom `1px solid #F1F5F9`.
- **Row Hover:** Background fills to `#F8FAFC` with left edge accentuation.
- **Sticky Column Headers:** Background `#F8FAFC`, uppercase label typography `label-sm`, color `#64748B`, tracking `0.05em`.

### Form Controls (Inputs, Checkboxes, Radios)
- **Text Inputs:** Height `32px`, background `#FFFFFF`, border `1px solid #E2E8F0`, typography `body-md`. Focus state: border `#4F46E5`, inner shadow `none`, outer shadow ring `0 0 0 1px #4F46E5`.
- **Checkboxes & Radios:** `14px` square / circular boxes with `1px solid #CBD5E1`. Checked state: background `#4F46E5`, border `#4F46E5`, white internal glyph.

### Cards & Analytical Panels
- White background (`#FFFFFF`), `1px solid #E2E8F0` border, `8px` corner radius.
- Header zone: Height `44px`, display `flex`, space-between alignment, padding `0 16px`, subtle bottom partition `1px solid #F8FAFC`.
- Action footer: Padding `8px 16px`, background `#F8FAFC`, top hairline border `1px solid #E2E8F0`.