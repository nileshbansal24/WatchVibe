// --------------------------------------------------
// HistoryCard
// --------------------------------------------------

import React from "react";
import MoviePoster from "./MoviePoster.jsx";
import { hasRealValue, feedbackLabel } from "../utils/movieUtils.js";

export default function HistoryCard({ movie, status }) {
  const label = feedbackLabel(status);

  return (
    <div className="history-card">
      <MoviePoster
        poster={movie.poster}
        title={movie.title}
        variant="history"
      />

      <div className="history-info">
        <div className="history-movie-title">
          {movie.title || "Unknown Movie"}{" "}
          {movie.year ? `(${movie.year})` : ""}
        </div>

        <div className="history-meta">
          {hasRealValue(movie.imdbRating) && <>⭐ {movie.imdbRating}/10</>}
          {hasRealValue(movie.runtime) && <> • {movie.runtime}</>}
        </div>

        <div className="history-query">
          Recommended for: &quot;{movie.searchedFor}&quot;
        </div>

        {label && <span className="history-feedback">{label}</span>}
      </div>
    </div>
  );
}
