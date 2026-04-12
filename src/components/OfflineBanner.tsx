import { useState, useEffect } from "react";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { getCachedCount } from "../utils/soundCache";

export default function OfflineBanner() {
  const online = useOnlineStatus();
  const [cachedCount, setCachedCount] = useState<number | null>(null);

  // Fetch cached count once when going offline so we can show it
  useEffect(() => {
    if (!online) {
      getCachedCount().then(setCachedCount);
    }
  }, [online]);

  if (online) return null;

  return (
    <div className="offline-banner" role="alert" aria-live="polite">
      <span className="offline-banner__icon">📶</span>
      <span className="offline-banner__text">
        Hors ligne
        {cachedCount != null && cachedCount > 0
          ? ` — ${cachedCount} son${cachedCount > 1 ? "s" : ""} disponible${cachedCount > 1 ? "s" : ""} en cache`
          : " — aucun son en cache (téléchargez-les depuis le menu ☰)"}
      </span>
    </div>
  );
}

