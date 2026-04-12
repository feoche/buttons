import { toFileName } from "./helpers";

const CACHE_NAME = "buttons-sounds-v1";

/**
 * Download all sounds into the Cache API for offline use.
 * Calls `onProgress` with (completed, total) as each file finishes.
 */
export async function downloadAllSounds(
  onProgress?: (done: number, total: number) => void
): Promise<void> {
  const data: { title: string }[] = await fetch("/json/data.json").then((r) =>
    r.json()
  );

  const urls = data
    .map((item) => {
      const f = toFileName(item.title);
      return f ? `/sounds/${f}.mp3` : null;
    })
    .filter(Boolean) as string[];

  const cache = await caches.open(CACHE_NAME);
  const total = urls.length;
  let done = 0;

  // Download in batches of 6 to avoid hammering the server
  for (let i = 0; i < urls.length; i += 6) {
    await Promise.allSettled(
      urls.slice(i, i + 6).map(async (url) => {
        try {
          const response = await fetch(url);
          if (response.ok) await cache.put(url, response);
        } catch {
          // skip failed files
        }
        onProgress?.(++done, total);
      })
    );
  }
}

/** Remove all cached sounds. */
export async function clearSoundCache(): Promise<void> {
  await caches.delete(CACHE_NAME);
}

/** Returns the number of items currently in the sound cache. */
export async function getCachedCount(): Promise<number> {
  try {
    return (await (await caches.open(CACHE_NAME)).keys()).length;
  } catch {
    return 0;
  }
}

