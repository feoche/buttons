import { useState, useEffect } from "react";
import type { SoundButton } from "../types";
import { enrichButton } from "../utils/helpers";

/**
 * Fetches and enriches button data from `/json/data.json`.
 * Returns the enriched array once loaded, or an empty array while loading.
 */
export function useButtonData(): SoundButton[] {
  const [data, setData] = useState<SoundButton[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/json/data.json")
      .then((res) => res.json())
      .then((raw: SoundButton[]) => {
        if (!cancelled) {
          setData(raw.map(enrichButton));
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return data;
}

