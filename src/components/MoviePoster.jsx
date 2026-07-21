// --------------------------------------------------
// MoviePoster
// --------------------------------------------------
//
// Renders a poster image (optionally linked to IMDb) or a graceful
// placeholder. Shared by both the discover cards and history cards
// via the `variant` prop.

import React from "react";
import { hasRealValue } from "../utils/movieUtils.js";

export default function MoviePoster({ poster, title, imdbUrl, variant = "card" }) {
  const showImage = hasRealValue(poster);

  const imgClass = variant === "history" ? "history-poster" : "movie-poster";
  const placeholderClass =
    variant === "history"
      ? "history-poster-placeholder"
      : "poster-placeholder";

  if (!showImage) {
    return <div className={placeholderClass}>🎬</div>;
  }

  const img = <img src={poster} alt={`${title} poster`} className={imgClass} />;

  // History posters are not linked; discover posters link to IMDb.
  if (variant === "history" || !imdbUrl) {
    return img;
  }

  return (
    <a href={imdbUrl} target="_blank" rel="noreferrer" className="poster-link">
      {img}
    </a>
  );
}
