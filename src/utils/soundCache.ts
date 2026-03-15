const CACHE_NAME = "buttons-sounds-v1";

/**
 * Download all sounds into the Cache API for offline use.
 * Calls `onProgress` with (completed, total) as each file finishes.
 */
export async function downloadAllSounds(
  onProgress?: (done: number, total: number) => void
): Promise<void> {
  const res = await fetch("/json/data.json");
  const data: { title: string }[] = await res.json();

  // Build the list of sound URLs from the public/sounds directory
  const urls = data
    .map((item) => {
      const fileName = item.title
        .replace(/[\s.,/#!$%^&*;:{}=\-_`~()?<>'"+]/gi, "")
        .toLowerCase()
        .replace(/[àâ]/gi, "a")
        .replace(/ç/gi, "c")
        .replace(/[éèê]/gi, "e")
        .replace(/[ùü]/gi, "u")
        .replace(/[îï]/gi, "i");
      return fileName ? `/sounds/${fileName}.mp3` : null;
    })
    .filter(Boolean) as string[];

  const cache = await caches.open(CACHE_NAME);
  const total = urls.length;
  let done = 0;

  // Download in batches of 6 to avoid hammering the server
  const BATCH = 6;
  for (let i = 0; i < urls.length; i += BATCH) {
    const batch = urls.slice(i, i + BATCH);
    await Promise.allSettled(
      batch.map(async (url) => {
        try {
          const response = await fetch(url);
          if (response.ok) {
            await cache.put(url, response);
          }
        } catch {
          // skip failed files silently
        }
        done++;
        onProgress?.(done, total);
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
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();
    return keys.length;
  } catch {
    return 0;
  }
}

