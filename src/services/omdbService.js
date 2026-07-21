// --------------------------------------------------
// OMDB SERVICE
// --------------------------------------------------
//
// Enriches AI recommendations with real metadata: poster, IMDb
// rating, genre, runtime, director, and the IMDb id (used as a
// stable key for feedback).

import { getOmdbKey } from "./apiKeys.js";

const ENDPOINT = "https://www.omdbapi.com/";

async function fetchByTitle(title, year, apiKey) {
  const params = new URLSearchParams({ apikey: apiKey, t: title });
  if (year) params.append("y", String(year));

  const response = await fetch(`${ENDPOINT}?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`OMDb request failed for ${title}`);
  }

  const data = await response.json();

  // If the exact year misses, retry without the year constraint.
  if (data.Response === "False" && year) {
    const retryParams = new URLSearchParams({ apikey: apiKey, t: title });
    const retry = await fetch(`${ENDPOINT}?${retryParams.toString()}`);
    return retry.json();
  }

  return data;
}

// Takes the raw AI movies and returns them enriched with OMDb data.
// Runs all lookups in parallel for speed.
export async function enrichMovies(movies) {
  const apiKey = await getOmdbKey();

  return Promise.all(
    movies.map(async (movie) => {
      try {
        const details = await fetchByTitle(movie.title, movie.year, apiKey);

        if (details.Response === "False") {
          return { ...movie, omdbFound: false };
        }

        return {
          ...movie,
          omdbFound: true,
          imdbID: details.imdbID,
          imdbRating: details.imdbRating,
          poster: details.Poster,
          genre: details.Genre,
          plot: details.Plot,
          runtime: details.Runtime,
          director: details.Director,
        };
      } catch (error) {
        console.error(`Could not fetch details for ${movie.title}:`, error);
        return { ...movie, omdbFound: false };
      }
    })
  );
}
