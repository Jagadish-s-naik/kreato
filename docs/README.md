# Kreato — Engineering & Architecture Documentation

Kreato is an income defense and deal follow-through automation platform built specifically for Indian creators (10k–500k followers). It converts ambiguous WhatsApp, Instagram DM, and brand email collaboration pitches into legally protective terms, fair market pricing, and automated follow-through.

---

## 🚀 Start Here If You Are The Frontend Developer

If you are developing the user interface and frontend components, **do NOT start with backend code**. Start directly with:

👉 **[docs/FRONTEND_HANDOFF.md](file:///c:/xampp/htdocs/kreato/docs/FRONTEND_HANDOFF.md)**

This document details every screen, exact UI copy, component states, state transition matrices, accessibility rules, design tokens, exact JSON schemas, and definition-of-ready checklists.

---

## 🕒 What Changed Recently

For dated updates on recent feature implementations and system changes, consult:

👉 **[docs/CHANGELOG_FEATURES.md](file:///c:/xampp/htdocs/kreato/docs/CHANGELOG_FEATURES.md)**

---

## 📑 Documentation Index

| Document | Purpose |
| :--- | :--- |
| **[FRONTEND_HANDOFF.md](file:///c:/xampp/htdocs/kreato/docs/FRONTEND_HANDOFF.md)** | Master specification for frontend engineers: screen maps, exact copy, states, contracts, design tokens. |
| **[CHANGELOG_FEATURES.md](file:///c:/xampp/htdocs/kreato/docs/CHANGELOG_FEATURES.md)** | Dated chronological log of all added, modified, and deprecated features and routes. |
| **[FEATURES.md](file:///c:/xampp/htdocs/kreato/docs/FEATURES.md)** | Numbered master list (Features 1–14) with user flows, inputs, outputs, edge cases, and acceptance criteria. |
| **[API.md](file:///c:/xampp/htdocs/kreato/docs/API.md)** | Machine-checkable summary of all server route handlers, HTTP methods, auth requirements, and schemas. |
| **[DATABASE.md](file:///c:/xampp/htdocs/kreato/docs/DATABASE.md)** | Complete PostgreSQL database schema, tables, columns, indexes, and Row-Level Security (RLS) policies. |
| **[RADAR_SPEC.md](file:///c:/xampp/htdocs/kreato/docs/RADAR_SPEC.md)** | Mathematical specifications and financial formulas for the 5-tier Money Leak Radar in integer paise. |
| **[PRD.md](file:///c:/xampp/htdocs/kreato/docs/PRD.md)** | Product Requirements Document outlining creator pain points, user personas, and target outcomes. |
| **[ARCHITECTURE.md](file:///c:/xampp/htdocs/kreato/docs/ARCHITECTURE.md)** | System topology, separation of concerns (pure `/lib` vs server `/backend` vs client `/frontend`). |
| **[SECURITY.md](file:///c:/xampp/htdocs/kreato/docs/SECURITY.md)** | Threat model, PII masking, AES-256-GCM token encryption, prompt-injection defense, and OAuth boundaries. |
| **[AI_PROMPTS.md](file:///c:/xampp/htdocs/kreato/docs/AI_PROMPTS.md)** | System prompts, few-shot examples, untrusted data isolation (`<message>`), and Gemini configuration. |
| **[TEST_PLAN.md](file:///c:/xampp/htdocs/kreato/docs/TEST_PLAN.md)** | Unit test specifications, deterministic test cases, and manual QA validation steps. |
| **[KNOWN_LIMITS.md](file:///c:/xampp/htdocs/kreato/docs/KNOWN_LIMITS.md)** | Documented technical boundaries, third-party constraints, and honest platform limitations. |
| **[DEMO_SCRIPT.md](file:///c:/xampp/htdocs/kreato/docs/DEMO_SCRIPT.md)** | Step-by-step walkthrough for recording realistic demos with accurate numbers and real API calls. |
| **[TASKS.md](file:///c:/xampp/htdocs/kreato/docs/TASKS.md)** | Progress tracking and milestone checklist. |

---

## 📖 System Glossary

- **Deal Card**: The core visual summary representing a sponsorship opportunity, containing brand info, deliverables, compensation, radar leak score, and status.
- **Money Leak Radar**: The mathematical engine that quantifies financial losses across 5 leak vectors: delayed payment financing, unlimited revisions, perpetual usage, uncompensated exclusivity, and underpricing against benchmark medians.
- **Walk-away Ladder**: A 3-tier negotiation matrix offering **Ideal** (premium), **Acceptable** (fair benchmark baseline), and **Walk-away Floor** (minimum boundary where creator walks away).
- **Personal Brand Ledger**: A private, creator-specific scorecard analyzing past deals with a brand, calculating average payment delays, total revenue, and leak history.
- **Deal Memo**: A 1-page plain-language agreement summary with a single-use 32-byte cryptographic token allowing brand managers to accept terms without logging in.
- **Effective Clock**: A client-side simulated time offset (`sim_days_offset`) enabling creators to test overdue scenarios (e.g. 45 days past due) without altering real server dates.
- **Simulated Benchmark Data**: Static, representative rate cards across 12 niches, 4 follower tiers, and 5 deliverable formats, always visibly labeled with "Simulated benchmark data".

