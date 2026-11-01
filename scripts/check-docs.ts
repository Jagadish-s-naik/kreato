import fs from "fs";
import path from "path";

function checkDocs() {
  console.log("=========================================");
  console.log("Checking Documentation Consistency...");
  console.log("=========================================\n");

  const errors: string[] = [];

  const rootDir = process.cwd();
  const apiDocPath = path.join(rootDir, "docs", "API.md");
  const dbDocPath = path.join(rootDir, "docs", "DATABASE.md");
  const featuresDocPath = path.join(rootDir, "docs", "FEATURES.md");
  const changelogDocPath = path.join(rootDir, "docs", "CHANGELOG_FEATURES.md");

  if (!fs.existsSync(apiDocPath)) errors.push("Missing docs/API.md");
  if (!fs.existsSync(dbDocPath)) errors.push("Missing docs/DATABASE.md");
  if (!fs.existsSync(featuresDocPath)) errors.push("Missing docs/FEATURES.md");
  if (!fs.existsSync(changelogDocPath)) errors.push("Missing docs/CHANGELOG_FEATURES.md");

  if (errors.length > 0) {
    console.error("Documentation files missing:\n", errors.join("\n"));
    process.exit(1);
  }

  const apiDoc = fs.readFileSync(apiDocPath, "utf8");
  const dbDoc = fs.readFileSync(dbDocPath, "utf8");
  const featuresDoc = fs.readFileSync(featuresDocPath, "utf8");
  const changelogDoc = fs.readFileSync(changelogDocPath, "utf8");

  // Check (a): Route handlers vs docs/API.md
  console.log("Rule (a): Verifying all route handlers are listed in docs/API.md...");
  const appApiDir = path.join(rootDir, "app", "api");
  if (fs.existsSync(appApiDir)) {
    const routeFiles: string[] = [];
    const scanRoutes = (dir: string) => {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          scanRoutes(fullPath);
        } else if (item === "route.ts" || item === "route.js") {
          routeFiles.push(fullPath);
        }
      }
    };
    scanRoutes(appApiDir);

    for (const rFile of routeFiles) {
      const relPath = path.relative(path.join(rootDir, "app"), path.dirname(rFile)).replace(/\\/g, "/");
      const endpoint = `/${relPath}`;
      if (!apiDoc.includes(endpoint)) {
        errors.push(`Route ${endpoint} exists on disk but is not documented in docs/API.md`);
      }
    }
  }

  // Check (b): Tables in migrations vs docs/DATABASE.md
  console.log("Rule (b): Verifying all migration tables are listed in docs/DATABASE.md...");
  const migrationsDir = path.join(rootDir, "supabase", "migrations");
  if (fs.existsSync(migrationsDir)) {
    const migrationFiles = fs.readdirSync(migrationsDir).filter((f) => f.endsWith(".sql"));
    const tableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([a-zA-Z0-9_]+)/gi;

    for (const mFile of migrationFiles) {
      const sql = fs.readFileSync(path.join(migrationsDir, mFile), "utf8");
      let match;
      while ((match = tableRegex.exec(sql)) !== null) {
        const tableName = match[1];
        if (!dbDoc.includes(tableName)) {
          errors.push(`Table '${tableName}' from ${mFile} is not documented in docs/DATABASE.md`);
        }
      }
    }
  }

  // Check (c): Numbered features in FEATURES.md vs CHANGELOG_FEATURES.md
  console.log("Rule (c): Verifying all features in FEATURES.md have entries in CHANGELOG_FEATURES.md...");
  const featureRegex = /###\s+Feature\s+(\d+):/gi;
  let fMatch;
  while ((fMatch = featureRegex.exec(featuresDoc)) !== null) {
    const featureNum = fMatch[1];
    const changelogPattern = new RegExp(`Feature\\s+${featureNum}[:\\s]`, "i");
    if (!changelogPattern.test(changelogDoc)) {
      errors.push(`Feature ${featureNum} in docs/FEATURES.md has no corresponding entry in docs/CHANGELOG_FEATURES.md`);
    }
  }

  if (errors.length > 0) {
    console.error("\n❌ DOCS CONSISTENCY CHECK FAILED with the following errors:\n");
    errors.forEach((e) => console.error(`  - ${e}`));
    process.exit(1);
  }

  console.log("\n[PASS] All documentation consistency rules passed cleanly!");
}

checkDocs();
