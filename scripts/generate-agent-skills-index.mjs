import { readFileSync, readdirSync, writeFileSync } from "fs";
import { createHash } from "crypto";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SKILLS_ROOT = resolve(ROOT, "public/.well-known/agent-skills");
const OUTPUT_PATH = resolve(SKILLS_ROOT, "index.json");
const CNAME_PATH = resolve(ROOT, "CNAME");

function getSiteOrigin() {
  try {
    const cname = readFileSync(CNAME_PATH, "utf-8").trim();
    if (!cname) return "https://example.com";
    return `https://${cname}`;
  } catch {
    return "https://example.com";
  }
}

function sha256Hex(text) {
  return createHash("sha256").update(text).digest("hex");
}

function titleCaseSlug(slug) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

const origin = getSiteOrigin();
const skillDirs = readdirSync(SKILLS_ROOT, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort((a, b) => a.localeCompare(b));

const skills = skillDirs
  .map((dirName) => {
    const filePath = resolve(SKILLS_ROOT, dirName, "SKILL.md");
    let markdown;
    try {
      markdown = readFileSync(filePath, "utf-8");
    } catch {
      return null;
    }

    const description = markdown
      .split(/\r?\n/)
      .find((line) => line.trim() && !line.trim().startsWith("#"))
      ?.trim() ?? `Skill guide for ${titleCaseSlug(dirName)}.`;

    return {
      name: titleCaseSlug(dirName),
      type: "documentation",
      description,
      url: `${origin}/.well-known/agent-skills/${dirName}/SKILL.md`,
      sha256: sha256Hex(markdown),
    };
  })
  .filter(Boolean);

const index = {
  $schema: "https://agentskills.io/schemas/agent-skills-index-v0.2.0.json",
  version: "0.2.0",
  generatedAt: new Date().toISOString(),
  skills,
};

writeFileSync(OUTPUT_PATH, `${JSON.stringify(index, null, 2)}\n`, "utf-8");
console.log(`Generated agent skills index: ${OUTPUT_PATH}`);

