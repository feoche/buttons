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
  if (!measurementId) return;

  injectScript(`https://www.googletagmanager.com/gtag/js?id=${measurementId}`);

  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args: unknown[]) => {
    window.dataLayer.push(args);
  };

  window.gtag("js", new Date());
  window.gtag("config", measurementId);
  isInitialized = true;
}

export function trackEvent(name: string, params?: EventParams): void {
  if (!isInitialized || !window.gtag) return;
  window.gtag("event", name, params ?? {});
}

export function trackButtonClick(button: SoundButton, repeat: boolean): void {
  trackEvent("sound_button_click", {
    button_title: button.title,
    button_category: button.category ?? "uncategorized",
    button_path: button.fullPath,
    is_loop: repeat,
  });
}

