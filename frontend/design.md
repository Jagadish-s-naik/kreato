# Kreato Design System & Architecture Specification

> **Product**: Kreato — AI-Powered Business Management & Income Defense Platform for Independent Creators  
> **Visual Reference**: Clean, light SaaS dashboard style (Realty Hub layout adapted to Creator Business)  
> **Status**: Living Canonical Frontend Design System Specification

---

## 1. Visual Theme & Aesthetic Direction
- **Philosophy**: Clean, calm, high-trust fintech/business dashboard tailored for solo creators. Soft off-white canvas with pure white elevated container cards, crisp typography, generous spacing, and purposeful pastel status accents.
- **Surface Elevation & Shadows**:
  - `shadow-soft`: `0 10px 30px -5px rgba(0, 0, 0, 0.04), 0 2px 6px -1px rgba(0, 0, 0, 0.02)`
  - `shadow-card`: `0 4px 20px 0 rgba(0, 0, 0, 0.03)`
  - `shadow-floating`: `0 12px 36px 0 rgba(0, 0, 0, 0.08)`
- **Border Radii**:
  - Container Cards: `rounded-3xl` (24px) / `rounded-4xl` (32px)
  - Interactive Pills & Buttons: `rounded-full` (9999px)
  - Inner Elements & Badges: `rounded-xl` (12px) to `rounded-2xl` (16px)

---

## 2. Color Palette & Semantic Design Tokens

### Base Tokens
| Token | Hex | Role |
|---|---|---|
| **Canvas Background** | `#F0F4F7` | Main page background |
| **Card Surface** | `#FFFFFF` (with `#F5F9FA` sub-panels) | Primary elevated cards |
| **Borders** | `#EAF2F4` / `#E2E8F0` | Subtle clean separators |
| **Primary Text** | `#1A1D1F` / `#111827` | Headings, metrics, prominent labels |
| **Secondary Text** | `#6B7280` / `#484C4D` | Subheadings, descriptions, helper text |
| **Muted Text** | `#9CA3AF` | Timestamps, inactive labels |
| **Dark Navigation** | `#000305` / `#1A1D1F` | Active navigation pill, solid CTA buttons |

### Pastel Status & KPI Tokens (From Visual Reference)
| Token | Background Hex | Text Hex | Semantic Role in Kreato |
|---|---|---|---|
| **Pastel Green** | `#DAF4AA` / `#D5EDB3` | `#2D4B13` | Healthy deals, paid invoices, safe terms, money recovered |
| **Pastel Teal** | `#96D7CF` / `#A8E6DC` | `#0E4A42` | In-progress deals, valuation benchmarks, active deliverables |
| **Pastel Coral** | `#F1B4B9` / `#F8B6B6` | `#702228` | Money at risk (Radar), overdue invoices, scam traps, perpetual leaks |
| **Pastel Mint** | `#CDEFE3` | `#0D523A` | Deliverables completed, agreed memos |

### Semantic Domain Statuses
- **Deal Statuses**:
  - `incoming` (soft blue / neutral)
  - `analyzing` (pastel teal)
  - `countered` (pastel amber / purple)
  - `agreed` (pastel mint)
  - `rejected` (neutral grey)
- **Invoice Statuses**:
  - `draft` (neutral slate)
  - `issued` (soft cyan)
  - `overdue` (pastel coral)
  - `paid` (pastel green)
- **Radar Risk Levels**:
  - `low` (< ₹5,000 at risk)
  - `medium` (₹5,000 – ₹25,000 at risk)
  - `high` (> ₹25,000 at risk)

---

## 3. Typography & Text Hierarchy
- **Font**: Inter / Geist / System Sans (`font-sans`)
- **Scale**:
  - **Hero Title**: `text-2xl` to `text-3xl` font-bold (`24px - 30px`)
  - **Section Titles**: `text-lg` font-semibold (`18px`)
  - **KPI Metrics**: `text-2xl` to `text-3xl` font-bold tabular numbers
  - **Card Headers**: `text-sm` font-bold (`14px`)
  - **Body / Content**: `text-xs` to `text-sm` (`12px - 14px`)
  - **Micro Metadata / Chips**: `text-[10px]` to `text-[11px]` font-medium

---

## 4. Layout Architecture (Adapted 3-Column Shell)
1. **Left Navigation Sidebar (`w-64`)**:
   - Brand logo + title: **Kreato** (Icon + Brand Name)
   - Menu: Dashboard, Deal Inbox, Deal Pipeline, Money Leak Radar
   - Workflows: Contracts, Invoices & Payments, Brand Ledger
   - Bottom Floating Agent/User Dock: Audio/mic toggles, notification badge count, creator profile info.
2. **Center Main Content Area (`flex-1`)**:
   - Top Bar: Universal search with keyboard shortcut (`⌘K`), notifications, active sync indicators, simulation status pill.
   - Dynamic Page View:
     - Dashboard: Creator Profile Overview, KPI Pastel Summary Cards, Deal Pipeline preview, Money Leak Radar alert.
     - Deal Inbox & Extractor: Text paste / Screenshot dropzone with client PII masking preview.
     - Deal Workspace (`/deals/[id]`): Deal terms editor, Money Leak Radar breakdown, Walk-away Ladder counter-offer drafter.
     - Invoices & Payments: Sequential GST invoice generator, UPI QR code, payment timeline simulator.
     - Brand Ledger: Historical repeat brand reliability stats.
3. **Right Live Stream / Activity Column (`w-80`)**:
   - Recent live deal alerts, incoming inquiry updates, payment alerts, quick action triggers.

---

## 5. Security & Privacy UI Principles
- **In-Browser Masking Indicator**: Live badge showing phone/email/UPI tokens masked before sending to AI.
- **Deterministic Transparency**: Every rupee calculated displays a *"Formula & Benchmark Breakdown"* drawer.
- **Creator Gate**: No external action (WhatsApp / Email / Mark Paid) executes without an explicit user click.
