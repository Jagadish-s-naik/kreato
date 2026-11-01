# Kreato — Complete API Route Index

This document provides a machine-checkable reference of every HTTP endpoint supported by Kreato.

| Method | Endpoint | Auth | Request Schema | Response Schema | Description |
| :--- | :--- | :---: | :--- | :--- | :--- |
| `POST` | `/api/copilot/extract` |  Yes | `ExtractDealRequest` | `DealExtractionResult` | AI deal term extraction and leak computation |
| `POST` | `/api/ladder/draft` |  Yes | `DraftLadderRequest` | `DraftResponse` | Gemini counter-offer drafter for selected tier |
| `POST` | `/api/reminder/draft` |  Yes | `DraftReminderRequest` | `DraftResponse` | Staged payment reminder drafter |
| `POST` | `/api/memo` |  Yes | `CreateMemoRequest` | `CreateMemoResult` | Creates cryptographic 1-page memo link |
| `GET` | `/api/memo/[token]` | ❌ No | URL param `token` | `MemoPublicView` | Public brand-facing terms review |
| `POST` | `/api/memo/[token]/accept` | ❌ No | `AcceptMemoRequest` | `ActionSuccess` | Public brand acceptance and sign-off |
| `GET` | `/api/deals` |  Yes | Query `?status=...` | `DealListResponse` | List creator deals with joined relations |
| `POST` | `/api/deals` |  Yes | `CreateDealRequest` | `Deal` | Manually insert or save new deal |
| `GET` | `/api/deals/[id]` |  Yes | URL param `id` | `Deal` | Fetch deal details by ID |
| `PATCH` | `/api/deals/[id]` |  Yes | `UpdateDealRequest` | `Deal` | Update deal status or terms |
| `DELETE` | `/api/deals/[id]` |  Yes | URL param `id` | `ActionSuccess` | Delete deal and associated relations |
| `GET` | `/api/brand-ledger` |  Yes | None | `BrandLedgerEntry[]` | Personal Brand Ledger track record |
| `GET` | `/api/benchmarks` |  Yes | Query `?niche=&follower_band=` | `Benchmark[]` | Simulated deliverable rate benchmarks |
| `GET` | `/api/invoices` |  Yes | Query `?deal_id=...` | `Invoice[]` | List invoices for deal |
| `POST` | `/api/invoices` |  Yes | `CreateInvoiceRequest` | `Invoice` | Generate GST invoice with FY sequential number |
| `POST` | `/api/payments` |  Yes | `RecordPaymentRequest` | `Payment` | Log settlement and mark invoice/deal paid |
| `GET` | `/api/calendar/[dealId]/ics` |  Yes | URL param `dealId` | `text/calendar` | Downloadable RFC 5545 iCalendar file |
| `GET` | `/api/youtube/stats` |  Yes | Query `?input=@handle` | `YouTubeChannelStats` | Public channel statistics lookup |
| `POST` | `/api/youtube/link` |  Yes | `YouTubeLinkRequest` | `YouTubeLink` | Link channel and update verified follower band |
| `DELETE` | `/api/youtube/unlink` |  Yes | None | `ActionSuccess` | Unlink YouTube channel |
| `GET` | `/api/gmail/status` |  Yes | None | `GmailStatusResponse` | Check Gmail connection status (404 if disabled) |
| `GET` | `/api/gmail/connect` |  Yes | None | HTTP 302 Redirect | Initiates Google OAuth 2.0 PKCE flow |
| `GET` | `/api/gmail/callback` |  Yes | Query `?code=&state=` | HTTP 302 Redirect | Google OAuth callback handler |
| `GET` | `/api/gmail/search` |  Yes | `GmailSearchQuery` | `GmailMessageMetadata[]` | In-memory message list with relevance hints |
| `POST` | `/api/gmail/import` |  Yes | `GmailImportRequest` | `GmailImportResult` | Batch imports selected messages into deals |
| `POST` | `/api/gmail/disconnect` |  Yes | None | `ActionSuccess` | Revokes Google token and deletes connection |
| `GET` | `/api/user/profile` |  Yes | None | `Profile` | Creator profile and settings |
| `PATCH` | `/api/user/profile` |  Yes | `UpdateProfileRequest` | `Profile` | Update creator profile, UPI, or GSTIN |
| `GET` | `/api/user/audit-log` |  Yes | None | `AuditLogEntry[]` | Creator immutable audit trail |
| `GET` | `/api/user/export` |  Yes | None | `UserDataExport` | Full JSON data sovereignty export |
| `POST` | `/api/user/delete` |  Yes | None | `ActionSuccess` | Cascade account deletion |

