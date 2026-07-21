// --------------------------------------------------
// APPLICATION CONFIGURATION
// --------------------------------------------------
//
// NOTE FOR EVALUATION / DEMO:
// These keys are placeholders for local testing only.
// In a real deployment, never ship secret keys inside a
// client-side extension. Move calls behind a backend proxy
// or use per-user keys entered in a settings screen.
//
// You can replace the placeholder strings below with your own
// keys, OR (recommended) let the user enter them in the Settings
// tab, which stores them in chrome.storage.local and overrides
// these defaults at runtime (see services/apiKeys.js).

export const DEFAULT_GEMINI_API_KEY = "YOUR_GEMINI_API_KEY_HERE";
export const DEFAULT_OMDB_API_KEY = "YOUR_OMDB_API_KEY_HERE";

export const MODEL_NAME = "gemini-1.5-flash";

// How many past searches to feed the AI for personalization.
export const MAX_HISTORY_FOR_AI = 8;

// How many searches we keep in local storage.
export const MAX_STORED_HISTORY = 30;

// Number of recommendations requested per search.
export const RECOMMENDATION_COUNT = 5;

// Storage keys used throughout the app.
export const STORAGE_KEYS = {
  SEARCH_HISTORY: "searchHistory",
  MOVIE_FEEDBACK: "movieFeedback",
  GEMINI_KEY: "geminiApiKey",
  OMDB_KEY: "omdbApiKey",
};
