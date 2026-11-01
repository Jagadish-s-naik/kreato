-- Migration: 002_google_integrations.sql
-- Kreato Google Integrations: YouTube Channel Stats & Gmail Import (Beta)

-- 1. YOUTUBE LINKS TABLE (Optional Public Stats)
CREATE TABLE IF NOT EXISTS youtube_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  channel_id TEXT NOT NULL,
  channel_title TEXT NOT NULL,
  subscriber_count BIGINT NOT NULL,
  band_suggestion follower_band NOT NULL,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS for youtube_links: creators can read, create, update, and delete their own link
ALTER TABLE youtube_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own youtube link"
  ON youtube_links
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_youtube_links_user ON youtube_links(user_id);

-- 2. GMAIL CONNECTIONS TABLE (Beta, Server-Only Tokens)
CREATE TABLE IF NOT EXISTS gmail_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  google_email TEXT NOT NULL,
  encrypted_refresh_token TEXT NOT NULL,
  iv TEXT NOT NULL,
  auth_tag TEXT NOT NULL,
  scope TEXT NOT NULL DEFAULT 'https://www.googleapis.com/auth/gmail.readonly',
  status TEXT NOT NULL DEFAULT 'connected', -- 'connected' | 'needs_reconnect'
  connected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS for gmail_connections: ENABLED with NO client-facing policies.
-- STRICT SECURITY BOUNDARY:
-- Access is restricted entirely to server-side route handlers utilizing the service-role client.
-- Neither authenticated creators nor anonymous clients can read encrypted token columns directly.
ALTER TABLE gmail_connections ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_gmail_connections_user ON gmail_connections(user_id);

-- 3. DEALS TABLE AUGMENTATION FOR SOURCE DEDUPLICATION
ALTER TABLE deals ADD COLUMN IF NOT EXISTS source_ref TEXT;
CREATE INDEX IF NOT EXISTS idx_deals_user_source_ref ON deals(user_id, source_ref);

-- 4. PROFILES TABLE AUGMENTATION FOR VERIFIED FOLLOWER BAND
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS youtube_verified_band follower_band;

