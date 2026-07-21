// --------------------------------------------------
// API KEY SERVICE
// --------------------------------------------------
//
// Resolves which API keys to use. Priority:
//   1. A key the user typed into the Settings tab (stored locally).
//   2. The default placeholder key from config.js.
//
// Keeping this in one place means the AI and OMDb services never
// have to worry about *where* the key came from.

import { storage } from "./storage.js";
import {
  DEFAULT_GEMINI_API_KEY,
  DEFAULT_OMDB_API_KEY,
  STORAGE_KEYS,
} from "../config.js";

export async function getGeminiKey() {
  const stored = await storage.get(STORAGE_KEYS.GEMINI_KEY, "");
  return (stored || "").trim() || DEFAULT_GEMINI_API_KEY;
}

export async function getOmdbKey() {
  const stored = await storage.get(STORAGE_KEYS.OMDB_KEY, "");
  return (stored || "").trim() || DEFAULT_OMDB_API_KEY;
}

export async function saveKeys({ geminiKey, omdbKey }) {
  await storage.set(STORAGE_KEYS.GEMINI_KEY, (geminiKey || "").trim());
  await storage.set(STORAGE_KEYS.OMDB_KEY, (omdbKey || "").trim());
}

export async function getSavedKeys() {
  return {
    geminiKey: await storage.get(STORAGE_KEYS.GEMINI_KEY, ""),
    omdbKey: await storage.get(STORAGE_KEYS.OMDB_KEY, ""),
  };
}
