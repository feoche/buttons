import type { ButtonCategory } from "../types";

/**
 * Fallback categorization for user-created buttons (the JSON data already
 * has categories baked in via the add-categories.mjs script).
 */
export function categorizeButton(
  _title: string,
  _description?: string,
  _keywords?: string[]
): ButtonCategory {
  return "autre";
}

