# Frontend Implementation Plan

This plan documents the roadmap and component breakdown for implementing the frontend based on the reference design. Implementation will begin only when explicitly instructed.

---

## Scope & Constraints
- Only work within `frontend/` and necessary frontend root configuration files (e.g. `tailwind.config.js`, `next.config.js`, `app/` if Next.js app router is configured).
- Do not modify or touch backend or unrelated folders.

---

## Phase 1: Setup & Design System Tokens
1. **Theme & Tailwind Configuration**:
   - Register custom colors (pastel lime, pastel teal, pastel coral, light backgrounds `#EEF3F6`, active dark nav `#1A1D1F`).
   - Configure border radiuses (`rounded-2xl`, `rounded-3xl`).
   - Define custom drop shadows matching the soft neumorphic/glassmorphic surface style.
2. **Icon & Asset Integration**:
   - Lucide icons or equivalent icon set for navigation, comms, search, and action buttons.

---

## Phase 2: Core Layout Architecture
1. **Three-Column Dashboard Shell**:
   - Left Sidebar: Navigation groups, collapsible sections, bottom floating dock with agent controls & mini-profile.
   - Main Center Panel: Search bar, agent overview hero card, summary pastel cards, and listing cards carousel/grid.
   - Right Aside: Integrations status, online agent stack, live timeline feed.
2. **Responsive Handling**:
   - Responsive collapsing on smaller screens (sidebar to drawer, right aside collapsible/tabbed).

---

## Phase 3: Component Breakdown
1. **Sidebar (`frontend/components/sidebar/`)**:
   - `SidebarNav.tsx`: Main nav item list with dark active pill state.
   - `AgentDock.tsx`: Floating action dock with mute/mic, audio, settings, and profile thumbnail.
2. **Top Bar & Search (`frontend/components/header/`)**:
   - `SearchBar.tsx`: Pill input with voice search icon and keyboard shortcut indicator.
   - `HeaderActions.tsx`: Integration status badge and online users avatar group.
3. **Hero & Metrics (`frontend/components/dashboard/`)**:
   - `ProfileHeroCard.tsx`: User details, agency info, direct contact details, and KPI metrics with colored underline indicators.
   - `SummaryCards.tsx`: Pastel metric blocks (Unassigned Leads, Valuation Leads, Potential Seller Leads).
   - `ListingGrid.tsx` / `NewObjects.tsx`: Property preview cards with tags ("Sale", "Rental") and action overlays.
4. **Live Activity Feed (`frontend/components/feed/`)**:
   - `LiveFeed.tsx`: Activity stream container with reload trigger.
   - `FeedItemProperty.tsx`: Property viewed event card with image and address.
   - `FeedItemLead.tsx`: Lead action cards (calls, emails, assignment status).

---

## Phase 4: State & Mock Data
1. Mock data models for agent profile, KPI stats, lead summaries, property objects, and live feed timeline items.
2. Interactive states: dropdown time filter toggles ("This Month"), search focus, and navigation selection.

---

## Status
- [x] Design reference documented (`design.md`)
- [x] Implementation plan created (`plan.md`)
- [ ] *Waiting for user approval before starting implementation.*

