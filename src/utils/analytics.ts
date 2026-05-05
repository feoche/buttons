import type { SoundButton } from "../types";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

type EventParams = Record<string, string | number | boolean | undefined>;

let isInitialized = false;
let measurementId = "";

function injectScript(src: string): void {
  const script = document.createElement("script");
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

export function initAnalytics(): void {
  if (isInitialized || typeof window === "undefined") return;

  measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim() ?? "";
  if (!measurementId) {
    console.debug("[Analytics] VITE_GA_MEASUREMENT_ID not set, analytics disabled");
    return;
  }

  try {
    window.dataLayer = window.dataLayer || [];

    // Stub gtag to queue commands until the real one loads
    window.gtag = (...args: unknown[]) => {
      window.dataLayer.push(args);
    };

    // Queue initialization commands
    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      anonymize_ip: true,
      allow_google_signals: false,
    });

    // Inject Google Analytics script
    injectScript(`https://www.googletagmanager.com/gtag/js?id=${measurementId}`);

    isInitialized = true;
  } catch (error) {
    console.warn("[Analytics] Failed to initialize:", error);
  }
}

export function trackEvent(name: string, params?: EventParams): void {
  if (!isInitialized) return;

  if (typeof window.gtag !== "function") {
    console.warn("[Analytics] gtag not ready yet, event queued:", name);
    return;
  }

  try {
    window.gtag("event", name, params ?? {});
  } catch (error) {
    console.warn("[Analytics] Failed to track event:", error);
  }
}

export function trackButtonClick(button: SoundButton, repeat: boolean): void {
  trackEvent("sound_button_click", {
    button_title: button.title,
    button_category: button.category ?? "uncategorized",
    button_path: button.fullPath,
    is_loop: repeat,
  });
}

