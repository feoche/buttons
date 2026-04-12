// ── Buttons App Service Worker ────────────────────────────────────────────────
// Strategy:
//   • App shell (HTML / JS / CSS / fonts / images)  → Cache-first, cache on network hit
//   • /json/data.json                               → Network-first, fallback to cache
//   • /sounds/*.mp3                                 → Sound-cache-first, then network
//                                                     (sound cache is filled by the in-app download feature)
//   • Cross-origin requests                         → Pass through (not intercepted)

const APP_CACHE   = "app-shell-v2";
const SOUND_CACHE = "buttons-sounds-v1"; // shared with src/utils/soundCache.ts

// App shell URLs that must be cached on install so the UI loads offline
const PRECACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/json/data.json",
  "/img/favicon.png",
];

// ── Lifecycle ─────────────────────────────────────────────────────────────────

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(APP_CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== APP_CACHE && k !== SOUND_CACHE)
            .map((k) => {
              console.log("[SW] Deleting old cache:", k);
              return caches.delete(k);
            })
        )
      )
      .then(() => self.clients.claim())
  );
});

// ── Fetch ─────────────────────────────────────────────────────────────────────

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Don't intercept cross-origin (fonts, analytics, YouTube, etc.)
  if (url.origin !== self.location.origin) return;

  const path = url.pathname;

  // 1. Sounds — serve from user's sound cache, fall back to network
  if (path.startsWith("/sounds/") && path.endsWith(".mp3")) {
    event.respondWith(soundFirst(event.request));
    return;
  }

  // 2. data.json — network-first so data stays fresh, cache as fallback
  if (path === "/json/data.json") {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // 3. Navigation (HTML) — serve from cache immediately, update in background
  if (event.request.mode === "navigate") {
    event.respondWith(staleWhileRevalidate(event.request));
    return;
  }

  // 4. Static assets (JS, CSS, fonts, images) — cache-first (hashed filenames are immutable)
  if (/\.(js|css|woff2?|ttf|png|jpg|jpeg|svg|ico|webp)(\?.*)?$/.test(path)) {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  // 5. Everything else — network-first with cache fallback
  event.respondWith(networkFirst(event.request));
});

// ── Strategies ────────────────────────────────────────────────────────────────

/** Sound cache (filled by in-app download) → network → silent fallback */
async function soundFirst(request) {
  const soundCache = await caches.open(SOUND_CACHE);
  const cached = await soundCache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    // Cache sounds fetched on-the-fly too (helps next offline visit)
    if (response.ok) {
      soundCache.put(request, response.clone());
    }
    return response;
  } catch {
    // Offline and not cached — return a valid empty audio response so the
    // browser doesn't throw a network error
    return new Response(new Uint8Array(0), {
      status: 200,
      headers: { "Content-Type": "audio/mpeg", "Content-Length": "0" },
    });
  }
}

/** Cache first, then network, cache network response for future use */
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(APP_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response("Offline", { status: 503 });
  }
}

/** Serve stale cache immediately, update cache in background */
async function staleWhileRevalidate(request) {
  const cache = await caches.open(APP_CACHE);
  const cached = await cache.match(request);

  const networkFetch = fetch(request).then((response) => {
    if (response.ok) cache.put(request, response.clone());
    return response;
  }).catch(() => null);

  return cached || await networkFetch || new Response("Offline", { status: 503 });
}

/** Network first, fall back to cache */
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(APP_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || new Response("Offline", { status: 503 });
  }
}

