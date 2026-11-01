# Kreato Dashboard Architectural Blueprint (Realty Hub Parity)

> **Core Objective**: Map the exact spatial layout, component hierarchy, and 3-column architecture of Realty Hub (Image 2) onto Kreato's creator-business features.
> **Scope**: Strictly isolated to `app/dashboard/page.tsx` and dashboard-specific presentation components in `frontend/components/dashboard/*`. No other pages, no backend modifications.
> **Palette Preserved**: `#F0F4F7` (Background), `#F5F9FA` (Cards/Surfaces), `#EAF2F4` (Borders), `#484C4D` (Primary text), `#000305` (Dark accents), `#DAF4AA` (Pastel green), `#96D7CF` (Muted teal), `#F1B4B9` (Soft coral).

---

## 1. Architectural Component Mapping (Realty Hub ➔ Kreato)

| Realty Hub (Image 2) Component | Kreato Dashboard Component | Role & Data in Kreato |
|---|---|---|
| **Area A: Left Navigation** | `Sidebar.tsx` (Unchanged) | Left navigation sidebar with active dark pill |
| **Area B: Top Search Toolbar** | Dashboard Topbar | Global search pill (`⌘K`), Time-travel simulation clock (`+30d`, `Reset`), Notifications bell |
| **Area B: Hero Profile Card** | `CreatorHeroCard.tsx` | **Aanya Sharma** (`@aanyacreates`), `Beauty & Skincare`, 78.5k followers, Mumbai, GSTIN. Bottom 3 KPI metrics: **Total Income Protected** (₹3,45,000, coral underline), **Deals Closed** (12, teal underline), **Average Paid Terms** (14 Days, lime underline). Quick share & edit buttons. |
| **Area B: Summary Pastel Cards** | `PastelSummaryCards.tsx` | Header ("Commercial Health Summary", "This Month", reload). Exactly 3 horizontal pastel cards: 1. **Money Leak Radar** (Coral `#F1B4B9`, ₹1,25,000 at risk, 1 leak), 2. **Active Deals** (Teal `#96D7CF`, ₹2,45,000 pipeline, 4 deals), 3. **Income Recovered** (Green `#DAF4AA`, ₹1,20,000 negotiated up, 98% health). |
| **Area B: New Objects Grid** | `DealPipelinePreview.tsx` | Header ("Recent Deal Pipeline", `(4)`, timeframe dropdown, "Open Full Kanban →"). Exactly 2 horizontal brand deal cards on desktop (GlowSkin India ₹25k, Mamaearth ₹90k) with status badges, deliverable tags, and compact perpetual risk warning strips. |
| **Area C: Right Live Feed** | `DashboardLiveFeed.tsx` | Dedicated right-hand desktop column (290px–320px). Header ("Creator Live Feed", reload). Vertical connected timeline with circle markers, timestamps, and 3 event cards: 1. **Money Leak Detected** (GlowSkin India, "Run Radar →"), 2. **Invoice Overdue** (KR/2026-27/011, "Draft Reminder →"), 3. **Deal Terms Accepted** (Plum Goodness, "Generate Invoice →"). |

---

## 2. Desktop Grid Structure
```
[ Sidebar: ~240px ]  |  [ Central Content Column: 1fr (flex/grid) ]  |  [ Creator Live Feed: 300px ]
```
- In `app/dashboard/page.tsx`, compose a dedicated 2-column desktop grid for the main work area:
  `grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_310px] gap-6 items-start`
- This ensures the Right Live Feed is a **first-class desktop column** placed directly beside the Central Column, without stretching cards or wrapping onto smaller viewports improperly.

---

## 3. Responsive Strategy
- **Desktop (1280px+)**: Left sidebar + Central Workspace (Hero, Pastel Cards, Recent Deals) + Right Live Feed (310px).
- **Tablet / Laptop (< 1280px)**: Central Workspace takes 100% width, Live Feed cleanly transitions below or collapses.
- **Mobile (< 768px)**: Clean single-column stack with no clipping or horizontal scroll.

---

## 4. Implementation Steps
1. Create `frontend/components/dashboard/DashboardLiveFeed.tsx` tailored to the exact Image 2 timeline style.
2. Update `frontend/components/dashboard/CreatorHeroCard.tsx` with clean font weights, sans typography, and exact metric alignment.
3. Update `frontend/components/dashboard/PastelSummaryCards.tsx` to match the exact 3-column card proportions.
4. Update `frontend/components/dashboard/DealPipelinePreview.tsx` with the exact 2-card layout matching "New Objects".
5. Refactor `app/dashboard/page.tsx` with the grid composition `[minmax(0,1fr)_310px]` side-by-side on desktop.

