// --------------------------------------------------
// MovieCard
// --------------------------------------------------
//
// A single recommendation on the Discover screen: poster, title,
// vibe match, metadata, reason, IMDb link, and feedback controls.

import React from "react";
import MoviePoster from "./MoviePoster.jsx";
import FeedbackButtons from "./FeedbackButtons.jsx";
import {
  clampVibeMatch,
  buildImdbUrl,
  hasRealValue,
  getMovieKey,
} from "../utils/movieUtils.js";

export default function MovieCard({ movie, currentStatus, onFeedback }) {
  const vibeMatch = clampVibeMatch(movie.vibeMatch);
  const imdbUrl = buildImdbUrl(movie.imdbID);

  const title = movie.title || "Unknown Movie";

  const titleNode = imdbUrl ? (
    <a href={imdbUrl} target="_blank" rel="noreferrer" className="movie-link">
      {title}
    </a>
  ) : (
    title
  );

  return (
    <div className="movie-card">
      <div className="movie-content">
        <MoviePoster
          poster={movie.poster}
          title={title}
          imdbUrl={imdbUrl}
          variant="card"
        />

        <div className="movie-info">
          <div className="movie-top">
            <h3 className="movie-title">
              {titleNode}{" "}
              {movie.year ? (
                <span className="movie-year">({movie.year})</span>
              ) : null}
            </h3>
            <span className="vibe-match">{vibeMatch}%</span>
          </div>

          <div className="movie-meta">
            {hasRealValue(movie.imdbRating) && (
              <span>⭐ {movie.imdbRating}/10</span>
            )}
            {hasRealValue(movie.runtime) && <span>⏱ {movie.runtime}</span>}
          </div>

          {hasRealValue(movie.genre) && (
            <p className="movie-genre">{movie.genre}</p>
          )}

          {movie.reason && <p className="movie-reason">{movie.reason}</p>}

          {imdbUrl && (
            <a
              href={imdbUrl}
              target="_blank"
              rel="noreferrer"
              className="imdb-button"
            >
              View on IMDb →
            </a>
          )}

          <FeedbackButtons
            currentStatus={currentStatus}
            onSelect={(status) => onFeedback(movie, status)}
          />
        </div>
      </div>
    </div>
  );
}

export { getMovieKey };
