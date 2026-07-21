// --------------------------------------------------
// MOVIE UTILITIES
// --------------------------------------------------

// A stable identity for a movie. Prefer the IMDb id; fall back to
// a title+year composite when OMDb had no match.
export function getMovieKey(movie) {
  if (movie.imdbID && movie.imdbID !== "N/A") {
    return movie.imdbID;
  }
  return `${movie.title}-${movie.year}`;
}

// The AI is asked for 70–99; clamp defensively in case it drifts.
export function clampVibeMatch(value) {
  return Math.min(99, Math.max(70, Number(value) || 80));
}

export function hasRealValue(value) {
  return value && value !== "N/A";
}

export function buildImdbUrl(imdbID) {
  if (!hasRealValue(imdbID)) return null;
  return `https://www.imdb.com/title/${imdbID}/`;
}

// Human label for a feedback status, used in badges.
export function feedbackLabel(status) {
  switch (status) {
    case "liked":
      return "❤️ Liked";
    case "disliked":
      return "👎 Not for me";
    case "watched":
      return "👁 Watched";
    default:
      return "";
  }
}

// Trim a full movie object down to just the fields we persist.
export function toStoredMovie(movie) {
  return {
    title: movie.title,
    year: movie.year,
    imdbID: movie.imdbID || null,
    poster: movie.poster || null,
    imdbRating: movie.imdbRating || null,
    genre: movie.genre || null,
    runtime: movie.runtime || null,
    vibeMatch: movie.vibeMatch || null,
    reason: movie.reason || null,
  };
}
