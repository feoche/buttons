/**
 * Checks all YouTube video IDs in data.json for availability.
 * Uses the free oEmbed endpoint — no API key required.
 *
 * Run with:  node scripts/check-videos.mjs
 *
 * Options (env vars):
 *   CONCURRENCY=10   number of parallel requests (default: 10)
 *   TIMEOUT=8000     request timeout in ms (default: 8000)
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = resolve(__dirname, "../public/json/data.json");

const CONCURRENCY = Number(process.env.CONCURRENCY ?? 10);
const TIMEOUT_MS  = Number(process.env.TIMEOUT    ?? 8000);

// ── helpers ───────────────────────────────────────────────────────────────────

function oembed(videoId) {
  return `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
}

async function checkVideo(videoId) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(oembed(videoId), {
      signal: controller.signal,
      redirect: "follow",
    });
    return res.ok; // 200 = available, 400/404 = unavailable
  } catch {
    return null; // null = network/timeout error
  } finally {
    clearTimeout(timer);
  }
}

/** Run async tasks with a fixed concurrency ceiling. */
async function pool(tasks, concurrency) {
  const results = new Array(tasks.length);
  let idx = 0;

  async function worker() {
    while (idx < tasks.length) {
      const i = idx++;
      results[i] = await tasks[i]();
    }
  }

  await Promise.all(Array.from({ length: concurrency }, worker));
  return results;
}

function bar(done, total, width = 30) {
  const filled = Math.round((done / total) * width);
  return `[${"█".repeat(filled)}${"░".repeat(width - filled)}] ${done}/${total}`;
}

// ── main ──────────────────────────────────────────────────────────────────────

const data = JSON.parse(readFileSync(DATA_PATH, "utf-8"));
const withVideo = data.filter((item) => item.video);

console.log(`\n🎬 Checking ${withVideo.length} YouTube videos (concurrency=${CONCURRENCY})...\n`);

let done = 0;

const tasks = withVideo.map((item) => async () => {
  const available = await checkVideo(item.video);
  done++;
  process.stdout.write(`\r${bar(done, withVideo.length)}  `);
  return { ...item, _available: available };
});

const results = await pool(tasks, CONCURRENCY);

// Clear progress line
process.stdout.write("\r" + " ".repeat(60) + "\r");

// ── Report ────────────────────────────────────────────────────────────────────

const unavailable = results.filter((r) => r._available === false);
const errored     = results.filter((r) => r._available === null);
const available   = results.filter((r) => r._available === true);

console.log(`✅  Available  : ${available.length}`);
console.log(`❌  Unavailable: ${unavailable.length}`);
console.log(`⚠️   Errors     : ${errored.length} (timeout / network)`);

if (unavailable.length > 0) {
  console.log("\n── Unavailable videos ──────────────────────────────────────");
  for (const item of unavailable) {
    console.log(`  ❌  [${item.category ?? "?"}]  "${item.title}"  →  https://youtu.be/${item.video}`);
  }
}

if (errored.length > 0) {
  console.log("\n── Errors (could not reach YouTube) ────────────────────────");
  for (const item of errored) {
    console.log(`  ⚠️   [${item.category ?? "?"}]  "${item.title}"  →  https://youtu.be/${item.video}`);
  }
}

// ── Save report to JSON ───────────────────────────────────────────────────────

const reportPath = resolve(__dirname, "../video-report.json");
const report = {
  date: new Date().toISOString(),
  total: withVideo.length,
  available: available.length,
  unavailable: unavailable.length,
  errors: errored.length,
  unavailableList: unavailable.map(({ title, video, category }) => ({ title, video, category })),
  errorList:       errored.map(({ title, video, category })     => ({ title, video, category })),
};
writeFileSync(reportPath, JSON.stringify(report, null, 2) + "\n", "utf-8");
console.log(`\n📄 Report saved to video-report.json`);

