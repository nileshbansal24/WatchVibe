// --------------------------------------------------
// FEEDBACK SERVICE
// --------------------------------------------------
//
// Stores the user's explicit like / dislike / watched signals,
// keyed by movie. This is the strongest personalization input
// fed back into the AI prompt.

import { storage } from "./storage.js";
import { STORAGE_KEYS } from "../config.js";
import { getMovieKey } from "../utils/movieUtils.js";

export async function getMovieFeedback() {
  return storage.get(STORAGE_KEYS.MOVIE_FEEDBACK, {});
}

// Toggle semantics: clicking the same status again clears it.
export async function toggleMovieFeedback(movie, status) {
  const feedback = await getMovieFeedback();
  const key = getMovieKey(movie);

  if (feedback[key]?.status === status) {
    delete feedback[key];
  } else {
    feedback[key] = {
      title: movie.title,
      year: movie.year,
      imdbID: movie.imdbID || null,
      poster: movie.poster || null,
      genre: movie.genre || null,
      imdbRating: movie.imdbRating || null,
      runtime: movie.runtime || null,
      status,
      updatedAt: new Date().toISOString(),
    };
  }

  await storage.set(STORAGE_KEYS.MOVIE_FEEDBACK, feedback);
  return feedback;
}
