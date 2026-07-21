// --------------------------------------------------
// HISTORY SERVICE
// --------------------------------------------------
//
// CRUD for the user's search history. Each entry records the mood
// query, the movies recommended, and a timestamp.

import { storage } from "./storage.js";
import { STORAGE_KEYS, MAX_STORED_HISTORY } from "../config.js";
import { toStoredMovie, getMovieKey } from "../utils/movieUtils.js";

export async function getSearchHistory() {
  return storage.get(STORAGE_KEYS.SEARCH_HISTORY, []);
}

export async function saveSearchToHistory(mood, movies) {
  const history = await getSearchHistory();

  const newEntry = {
    query: mood,
    recommendedMovies: movies.map(toStoredMovie),
    timestamp: new Date().toISOString(),
  };

  history.push(newEntry);

  const trimmed = history.slice(-MAX_STORED_HISTORY);
  await storage.set(STORAGE_KEYS.SEARCH_HISTORY, trimmed);

  return trimmed;
}

// Flattens history into a de-duplicated, newest-first list of movies
// for the "Previously Viewed" screen.
export function flattenHistory(history) {
  const all = [];

  [...history].reverse().forEach((entry) => {
    entry.recommendedMovies.forEach((movie) => {
      all.push({
        ...movie,
        searchedFor: entry.query,
        timestamp: entry.timestamp,
      });
    });
  });

  const seen = new Set();
  const unique = [];

  all.forEach((movie) => {
    const key = getMovieKey(movie);
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(movie);
    }
  });

  return unique;
}
