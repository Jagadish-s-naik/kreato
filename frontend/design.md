# Design Specification & Style Guide

Based on the reference dashboard image (`Realty Hub` design style).

---

## 1. Visual Theme & Aesthetics
- **Theme**: Light, clean, modern, ultra-soft glassmorphism / neumorphic-inspired flat surface layout.
- **Background**: Soft tinted off-white / light neutral-cyan background (`#EEF3F6` to `#F4F7F9`).
- **Surface & Cards**:
  - Pure white (`#FFFFFF`) rounded container cards with subtle soft drop-shadows: `box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04), 0 1px 4px rgba(0, 0, 0, 0.02)`.
  - Border radius: Highly rounded corners (`rounded-2xl` to `rounded-3xl` / 16px - 24px).
  - Clean separation using whitespace and card blocks rather than heavy borders.

---

## 2. Color Palette & Accents

| Token | Hex / Value | Usage |
|---|---|---|
| **Background** | `#EEF3F6` | Main application background |
| **Card Surface** | `#FFFFFF` | Main dashboard cards, panels |
| **Sidebar Background**| `#F6F9FA` / `#FFFFFF` | Left navigation sidebar |
| **Active Nav Item** | `#1A1D1F` (Dark) | Selected navigation pill (black/dark grey with white text/icons) |
| **Primary Text** | `#111827` (Dark Charcoal / Black) | Headings, user names, primary numbers |
| **Secondary Text** | `#6B7280` / `#8B95A5` | Subtitles, labels, metadata |
| **Pastel Green Accent** | `#D5EDB3` / `#C4E897` | Unassigned leads card, badges, indicator lines |
| **Pastel Teal/Cyan Accent** | `#A8E6DC` / `#B2EBF2` | Valuation leads card, indicator lines |
| **Pastel Coral/Rose Accent** | `#F8B6B6` / `#FFC1C1` | Potential seller leads card, sale badges |
| **Status Tag / Badges** | Soft pills with rounded full borders (Rental: mint green, Sale: coral pink) |

---

## 3. Typography & Hierarchy
- **Font Family**: Inter, Plus Jakarta Sans, or similar clean geometric sans-serif.
- **Header 1 (Page Title)**: Large bold sans-serif (`text-2xl` / `text-3xl`, font-weight 600-700), e.g. "My Activity".
- **Section Headers**: Medium semibold (`text-lg`, font-weight 600), e.g. "My Summary", "New Objects (3)", "Live Feed".
- **Stat Numbers**: Clean, tabular-friendly bold numbers (`text-2xl` to `text-3xl`).
- **Metric Labels / Metadata**: Micro-copy (`text-xs` to `text-sm`, text-muted).

---

## 4. Layout Structure (3-Column Layout)

### A. Left Sidebar (Navigation & Controls)
- **Top Brand Logo**: Icon + brand title (e.g. `Realty Hub` or your project branding).
- **Navigation Groups**:
  - **Menu**: "My Activity" (active dark pill), "My Stats", "Overview".
  - **Leads**: "Leads List", "Buyers List", "Import" (with collapsible arrow).
  - **Comms**: "Emails", "Texts", "Live Chat", "Postcards", "Templates".
- **Bottom Floating Dock / Agent Control Card**:
  - Quick action floating bar: Headset, mic toggle, message notification count badge, notifications, settings gear.
  - User Mini Profile: Avatar, user name, email, quick menu trigger (three dots).

### B. Center Main Content Area
1. **Top Search Bar**:
   - Floating pill-shaped input with search icon, shortcut indicator (`⌘`), and microphone voice-search icon.
2. **Profile / Hero Card**:
   - Large rounded white card.
   - User portrait avatar + Name ("Fred Jhonson"), role badge/title ("Agent 286 days on the platform").
   - Action buttons: Top right quick action icons (share, edit/pencil).
   - Contact detail rows: Phone, Email, Location ("Los Angeles"), Agency ("Horizon Realty Group").
   - Key KPI Row:
     - "Total Listings": 1203 (with coral underline bar)
     - "Properties sold": 912 (with teal underline bar)
     - "Properties rent": 320 (with lime green underline bar)
3. **"My Summary" Card**:
   - Timeframe filter selector (e.g., "This Month" dropdown) + reload icon button.
   - 3 Pastel Summary Blocks:
     - Card 1 (Pastel Lime): "Unassigned Leads", update time, diagonal expand arrow icon, total count badge ("23").
     - Card 2 (Pastel Teal): "Valuation Seller Leads", update time, total count badge ("98").
     - Card 3 (Pastel Rose): "Potential Seller Leads", update time, total count badge ("231").
4. **"New Objects" (Listing Cards Horizontal Grid)**:
   - Header with counter "(3)", timeframe dropdown ("This Month"), reload button.
   - Property cards:
     - Rounded corner property thumbnail images.
     - Tag overlay pills (e.g. "Rental" in mint green, "Sale" in coral red).
     - Fullscreen / inspect action button.

### C. Right Column (Activity & Live Feed)
1. **Top Header**:
   - "Integration" pill button (showing Zoom, Slack, Gmail connected icons).
   - "Now online (3)" avatar stack.
2. **"Live Feed" Section**:
   - Feed header with refresh icon.
   - **Recent Property Action Card**:
     - Timeline indicator (e.g., "Tu, 25.03, 1:23 pm").
     - Property preview image card with "Sale" badge, property title ("Single Family Residential"), address, action buttons ("Property Viewed", viewer avatar stack).
   - **Lead Activity Cards**:
     - Feed card 1: User avatar ("Logan Davidson"), task ("Follow up mail"), action icons (email, expand), role badge ("Agent"), status ("Created").
     - Feed card 2: User avatar ("Megan Pearce"), task ("First customer call"), action icons (call, expand), status ("Was Assigned").
     - Feed card 3: User avatar ("Mason Reynolds"), task ("First customer call"), action icons, search action button ("Add Search"), query tag ("Q Coronado, Single Family Residential").

---

## 5. UI Elements & Micro-interactions
- **Buttons & Icon Buttons**: Circular or smooth rounded pills with ultra-light border/shadow.
- **Pills & Badges**: Fully rounded (`rounded-full`) with subtle tint colors.
- **Transitions**: Smooth 150-200ms ease transitions on hover/click states.

