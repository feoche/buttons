import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const PUBLIC_DIR = resolve(ROOT, "public");
const CNAME_PATH = resolve(ROOT, "CNAME");
const OUTPUT_PATH = resolve(PUBLIC_DIR, "sitemap.xml");

function getSiteOrigin() {
  try {
    const cname = readFileSync(CNAME_PATH, "utf-8").trim();
    if (!cname) return "https://example.com";
    return `https://${cname}`;
  } catch {
    return "https://example.com";
  }
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

const origin = getSiteOrigin();
const today = new Date().toISOString().slice(0, 10);

const urls = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/index.md", priority: "0.8", changefreq: "weekly" },
  { path: "/docs/api", priority: "0.6", changefreq: "monthly" },
  { path: "/.well-known/api-catalog", priority: "0.8", changefreq: "weekly" },
  { path: "/.well-known/agent-skills/index.json", priority: "0.7", changefreq: "weekly" },
  { path: "/.well-known/mcp/server-card.json", priority: "0.6", changefreq: "weekly" },
];

const urlset = urls
  .map(({ path, priority, changefreq }) => {
    const loc = escapeXml(`${origin}${path}`);
    return [
      "  <url>",
      `    <loc>${loc}</loc>`,
      `    <lastmod>${today}</lastmod>`,
      `    <changefreq>${changefreq}</changefreq>`,
      `    <priority>${priority}</priority>`,
      "  </url>",
    ].join("\n");
  })
  .join("\n");

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  urlset,
  "</urlset>",
  "",
].join("\n");

writeFileSync(OUTPUT_PATH, sitemap, "utf-8");
console.log(`Generated sitemap: ${OUTPUT_PATH}`);

