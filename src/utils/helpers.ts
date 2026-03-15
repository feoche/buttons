import type { SoundButton } from "../types";
import { categorizeButton } from "./categories";

const SPECIAL_CHARS_RE = /[\s.,/#!$%^&*;:{}=\-_`~()?<>'"+]/gi;

export function toFileName(title: string): string {
  return title
    .replace(SPECIAL_CHARS_RE, "")
    .toLowerCase()
    .replace(/[àâ]/gi, "a")
    .replace(/ç/gi, "c")
    .replace(/[éèê]/gi, "e")
    .replace(/[ùü]/gi, "u")
    .replace(/[îï]/gi, "i");
}

function readButtonsFromStorage(): SoundButton[] {
  const raw = localStorage.getItem("buttons");
  return raw ? (JSON.parse(raw) as SoundButton[]) : [];
}

export function saveButton(button: SoundButton): void {
  const stored = readButtonsFromStorage();
  const idx = stored.findIndex(
    (item) => item.title === button.title && item.type === button.type
  );
  if (idx === -1) {
    stored.push(button);
  } else {
    stored[idx] = button;
  }
  localStorage.setItem("buttons", JSON.stringify(stored));
}

export function saveButtons(buttons: SoundButton[]): void {
  localStorage.setItem("buttons", JSON.stringify(buttons));
}

export function loadStoredButtons(): SoundButton[] {
  return readButtonsFromStorage();
}

/** Enrich a raw data.json entry with `type`, `fullPath`, and `category`. */
export function enrichButton(item: SoundButton): SoundButton {
  const fileName = toFileName(item.title);
  return {
    ...item,
    type: "data",
    fullPath: fileName ? `sounds/${fileName}.mp3` : undefined,
    category:
      item.category ??
      categorizeButton(item.title, item.description, item.keywords),
  };
}
