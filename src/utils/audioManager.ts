import type { SoundButton } from "../types";

declare function gtag(
  command: string,
  event: string,
  params: Record<string, string>
): void;

const audio = new Audio();
let iframe: HTMLIFrameElement | null = null;

/** The fullPath of the button currently loaded into the audio element */
let currentButtonPath: string | null = null;

/** Expose the shared audio element so components can track progress */
export function getAudioElement(): HTMLAudioElement {
  return audio;
}

/** Returns the fullPath of the currently loaded button, or null */
export function getCurrentButtonPath(): string | null {
  return currentButtonPath;
}

function getIframe(): HTMLIFrameElement {
  if (!iframe) {
    iframe = document.createElement("iframe");
    iframe.style.width = "0";
    iframe.style.height = "0";
    document.body.appendChild(iframe);
  }
  return iframe;
}

function trackPlay(title: string): void {
  if (typeof gtag !== "undefined") {
    gtag("event", "button_play", { event_label: title });
  }
}

export function playSound(button: SoundButton, repeat: boolean): void {
  if (!button.fullPath) return;

  // Non-mp3 source (e.g. YouTube URL) → delegate to iframe
  if (!button.fullPath.endsWith(".mp3")) {
    const url = button.fullPath;
    let embedUrl = "";
    if (url.includes("youtube")) {
      embedUrl = url
        .replace("watch?v=", "embed/")
        .replace(/^(.*?)&(.*?)$/g, "$1?rel=0&autoplay=1&$2");
    }
    getIframe().src = embedUrl;
    return;
  }

  // mp3 playing
  const isSameButton = currentButtonPath === button.fullPath;

  if (isSameButton) {
    // Same button toggling
    const nearEnd =
      audio.duration - audio.currentTime < audio.duration / 20;
    if (!audio.currentTime || nearEnd || button._paused) {
      if (!button._paused) {
        audio.currentTime = 0.01;
      }
      audio.play();
      trackPlay(button.title);
      button._paused = false;
    } else {
      audio.pause();
      button._paused = true;
    }
  } else {
    // New button
    if (audio.currentTime && audio.currentTime <= audio.duration) {
      audio.pause();
    }
    currentButtonPath = button.fullPath;
    audio.src = button.fullPath;
    audio.preload = "auto";
    audio.currentTime = 0.01;
    audio.loop = repeat;
    audio.play();
    trackPlay(button.title);
  }
}
