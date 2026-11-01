import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Database RLS & Multi-Tenant Security Verification", () => {
  const migrationPath = path.resolve(__dirname, "../../supabase/migrations/001_init.sql");
  const migrationSql = fs.readFileSync(migrationPath, "utf8");

  it("enforces Row-Level Security on all 9 tables", () => {
    const requiredRlsTables = [
      "profiles",
      "benchmarks",
      "deals",
      "drafts",
      "memos",
      "invoices",
      "payments",
      "audit_log",
      "ai_usage",
    ];

    for (const table of requiredRlsTables) {
      expect(
        migrationSql.includes(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;`),
        `Table ${table} must enable ROW LEVEL SECURITY`
      ).toBe(true);
    }
  });

  it("enforces append-only integrity on audit_log (NO UPDATE or DELETE policies)", () => {
    expect(migrationSql).toContain("CREATE POLICY audit_log_select ON audit_log");
    expect(migrationSql).toContain("CREATE POLICY audit_log_insert ON audit_log");
    // Ensure no update or delete policies exist for audit_log
    expect(migrationSql).not.toContain("CREATE POLICY audit_log_update ON audit_log");
    expect(migrationSql).not.toContain("CREATE POLICY audit_log_delete ON audit_log");
  });

  it("strictly enforces auth.uid() scoping on deals, invoices, and memos", () => {
    expect(migrationSql).toContain("CREATE POLICY deals_select ON deals FOR SELECT USING (user_id = auth.uid());");
    expect(migrationSql).toContain("CREATE POLICY invoices_select ON invoices FOR SELECT USING (user_id = auth.uid());");
    expect(migrationSql).toContain("CREATE POLICY memos_select ON memos FOR SELECT USING (user_id = auth.uid());");
    expect(migrationSql).toContain("CREATE POLICY payments_select ON payments FOR SELECT USING (user_id = auth.uid());");
  });

  it("permits authenticated read-only access to simulated benchmarks", () => {
    expect(migrationSql).toContain("CREATE POLICY benchmarks_select ON benchmarks FOR SELECT TO authenticated USING (true);");
    expect(migrationSql).not.toContain("CREATE POLICY benchmarks_insert");
    expect(migrationSql).not.toContain("CREATE POLICY benchmarks_update");
    expect(migrationSql).not.toContain("CREATE POLICY benchmarks_delete");
  });

  it("enforces RLS and zero client-facing policies on gmail_connections (Migration 002)", () => {
    const migration002Path = path.resolve(__dirname, "../../supabase/migrations/002_google_integrations.sql");
    const migration002Sql = fs.readFileSync(migration002Path, "utf8");

    // Both tables must have RLS enabled
    expect(migration002Sql).toContain("ALTER TABLE youtube_links ENABLE ROW LEVEL SECURITY;");
    expect(migration002Sql).toContain("ALTER TABLE gmail_connections ENABLE ROW LEVEL SECURITY;");

    // youtube_links has creator-scoped policies
    expect(migration002Sql).toContain('CREATE POLICY "Users can manage own youtube link"');
    expect(migration002Sql).toContain("ON youtube_links");
    expect(migration002Sql).toContain("USING (auth.uid() = user_id)");

    // gmail_connections MUST NOT have any CREATE POLICY statements (zero client policies, server-only)
    expect(migration002Sql).not.toContain("CREATE POLICY gmail_connections_select");
    expect(migration002Sql).not.toContain("CREATE POLICY gmail_connections_insert");
    expect(migration002Sql).not.toContain("CREATE POLICY gmail_connections_update");
    expect(migration002Sql).not.toContain("CREATE POLICY gmail_connections_delete");
  });
});

