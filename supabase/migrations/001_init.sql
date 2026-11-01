-- Kreato Initial Database Migration: Schema, Indexes, RLS Policies & Seed Data
-- Migration: 001_init.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
CREATE TYPE creator_niche AS ENUM (
  'skincare',
  'haircare',
  'makeup',
  'fashion',
  'food_beverage',
  'fitness',
  'tech_gadgets',
  'finance',
  'travel',
  'gaming',
  'education',
  'other'
);

CREATE TYPE follower_band AS ENUM (
  'nano_10k_50k',
  'micro_50k_100k',
  'mid_100k_250k',
  'macro_250k_500k'
);

CREATE TYPE deliverable_format AS ENUM (
  'reel',
  'story',
  'post',
  'youtube_video',
  'short'
);

CREATE TYPE deal_channel AS ENUM (
  'whatsapp',
  'instagram_dm',
  'email',
  'other'
);

CREATE TYPE deal_status AS ENUM (
  'new',
  'countered',
  'agreed',
  'invoiced',
  'paid'
);

CREATE TYPE draft_kind AS ENUM (
  'counter_offer',
  'reminder'
);

CREATE TYPE draft_tier AS ENUM (
  'ideal',
  'acceptable',
  'walkaway'
);

CREATE TYPE draft_status AS ENUM (
  'draft',
  'approved',
  'discarded'
);

CREATE TYPE invoice_status AS ENUM (
  'issued',
  'paid'
);

-- 2. PROFILES TABLE
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  niche creator_niche NOT NULL DEFAULT 'other',
  follower_band follower_band NOT NULL DEFAULT 'nano_10k_50k',
  state TEXT NOT NULL DEFAULT 'Maharashtra',
  gstin TEXT,
  pan_name TEXT,
  upi_vpa TEXT NOT NULL,
  min_fee_paise BIGINT,
  sim_days_offset INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. BENCHMARKS TABLE (Read-only simulated benchmark rates)
CREATE TABLE benchmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  niche creator_niche NOT NULL,
  follower_band follower_band NOT NULL,
  format deliverable_format NOT NULL,
  median_paise BIGINT NOT NULL,
  min_paise BIGINT NOT NULL,
  max_paise BIGINT NOT NULL,
  is_simulated BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_benchmark_combination UNIQUE (niche, follower_band, format)
);

-- 4. DEALS TABLE
CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  brand_name TEXT NOT NULL,
  brand_key TEXT NOT NULL,
  brand_domain TEXT,
  category creator_niche NOT NULL DEFAULT 'other',
  channel deal_channel NOT NULL DEFAULT 'whatsapp',
  deliverables JSONB NOT NULL DEFAULT '[]'::JSONB,
  deadline DATE,
  fee_paise BIGINT,
  usage_rights JSONB NOT NULL DEFAULT '{"type":"none","months":null,"paid_ads_allowed":false}'::JSONB,
  exclusivity JSONB NOT NULL DEFAULT '{"category":null,"days":null,"start_date":null,"end_date":null}'::JSONB,
  payment_terms JSONB NOT NULL DEFAULT '{"days":null,"advance_percent":null}'::JSONB,
  risky_quotes JSONB NOT NULL DEFAULT '[]'::JSONB,
  scam_result JSONB NOT NULL DEFAULT '{"score":0,"level":"safe","reasons":[]}'::JSONB,
  status deal_status NOT NULL DEFAULT 'new',
  agreed_terms JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. DRAFTS TABLE
CREATE TABLE drafts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  kind draft_kind NOT NULL,
  tier draft_tier,
  language TEXT NOT NULL DEFAULT 'en',
  body TEXT NOT NULL,
  numbers JSONB NOT NULL DEFAULT '{}'::JSONB,
  status draft_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  approved_at TIMESTAMPTZ
);

-- 6. MEMOS TABLE
CREATE TABLE memos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  content JSONB NOT NULL,
  accept_token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '14 days'),
  accepted_at TIMESTAMPTZ,
  accepted_by_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. INVOICES TABLE
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL,
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  supplier_snapshot JSONB NOT NULL,
  client_snapshot JSONB NOT NULL,
  line_items JSONB NOT NULL,
  tax JSONB NOT NULL,
  total_paise BIGINT NOT NULL,
  upi_link TEXT NOT NULL,
  status invoice_status NOT NULL DEFAULT 'issued',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_user_invoice_number UNIQUE (user_id, invoice_number)
);

-- 8. PAYMENTS TABLE
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  paid_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  amount_paise BIGINT NOT NULL,
  promised_days INT NOT NULL,
  actual_days INT NOT NULL
);

-- 9. AUDIT LOG TABLE (Append-only for users)
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id UUID,
  detail JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. AI USAGE TABLE (Per-user rate limit enforcement)
CREATE TABLE ai_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  route TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. INDEXES FOR PERFORMANCE
CREATE INDEX idx_deals_user_status ON deals(user_id, status);
CREATE INDEX idx_deals_brand_key ON deals(user_id, brand_key);
CREATE INDEX idx_deals_brand_domain ON deals(user_id, brand_domain);
CREATE INDEX idx_invoices_user_status ON invoices(user_id, status);
CREATE INDEX idx_payments_user_deal ON payments(user_id, deal_id);
CREATE INDEX idx_memos_token_hash ON memos(accept_token_hash);
CREATE INDEX idx_audit_log_user_created ON audit_log(user_id, created_at DESC);
CREATE INDEX idx_ai_usage_user_window ON ai_usage(user_id, created_at DESC);

-- 12. ROW-LEVEL SECURITY (RLS) POLICIES

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE benchmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE memos ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage ENABLE ROW LEVEL SECURITY;

-- Profiles: Own user only
CREATE POLICY profiles_select ON profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY profiles_insert ON profiles FOR INSERT WITH CHECK (id = auth.uid());
CREATE POLICY profiles_update ON profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY profiles_delete ON profiles FOR DELETE USING (id = auth.uid());

-- Benchmarks: Read-only to authenticated users
CREATE POLICY benchmarks_select ON benchmarks FOR SELECT TO authenticated USING (true);

-- Deals: Own user only
CREATE POLICY deals_select ON deals FOR SELECT USING (user_id = auth.uid());
CREATE POLICY deals_insert ON deals FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY deals_update ON deals FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY deals_delete ON deals FOR DELETE USING (user_id = auth.uid());

-- Drafts: Own user only
CREATE POLICY drafts_select ON drafts FOR SELECT USING (user_id = auth.uid());
CREATE POLICY drafts_insert ON drafts FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY drafts_update ON drafts FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY drafts_delete ON drafts FOR DELETE USING (user_id = auth.uid());

-- Memos: Own user only
CREATE POLICY memos_select ON memos FOR SELECT USING (user_id = auth.uid());
CREATE POLICY memos_insert ON memos FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY memos_update ON memos FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY memos_delete ON memos FOR DELETE USING (user_id = auth.uid());

-- Invoices: Own user only
CREATE POLICY invoices_select ON invoices FOR SELECT USING (user_id = auth.uid());
CREATE POLICY invoices_insert ON invoices FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY invoices_update ON invoices FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY invoices_delete ON invoices FOR DELETE USING (user_id = auth.uid());

-- Payments: Own user only
CREATE POLICY payments_select ON payments FOR SELECT USING (user_id = auth.uid());
CREATE POLICY payments_insert ON payments FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY payments_update ON payments FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY payments_delete ON payments FOR DELETE USING (user_id = auth.uid());

-- Audit Log: Append-only for users (SELECT and INSERT only, NO UPDATE or DELETE)
CREATE POLICY audit_log_select ON audit_log FOR SELECT USING (user_id = auth.uid());
CREATE POLICY audit_log_insert ON audit_log FOR INSERT WITH CHECK (user_id = auth.uid());

-- AI Usage: Own user only
CREATE POLICY ai_usage_select ON ai_usage FOR SELECT USING (user_id = auth.uid());
CREATE POLICY ai_usage_insert ON ai_usage FOR INSERT WITH CHECK (user_id = auth.uid());

