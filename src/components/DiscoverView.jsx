// --------------------------------------------------
// DiscoverView
// --------------------------------------------------
//
// The main screen: mood input, the "Find My Movies" action, memory
// status, and the list of recommendation cards with feedback.

import React, { useState } from "react";
import MovieCard from "./MovieCard.jsx";
import { getMovieKey } from "../utils/movieUtils.js";

const PLACEHOLDER =
  "I'm feeling nostalgic and want something emotional but not too depressing...\n\nYa Hinglish mein bhi bata sakte ho :)";

export default function DiscoverView({
  memoryStatus,
  recommendations,
  onRecommend,
  onFeedback,
  feedback,
}) {
  const [mood, setMood] = useState("");
  const [localError, setLocalError] = useState("");

  const { movies, status, error } = recommendations;
  const isLoading = status === "loading";

  const handleClick = async () => {
    const trimmed = mood.trim();
    if (!trimmed) {
      setLocalError("Tell me what you're in the mood for first 😭");
      return;
    }
    setLocalError("");
    await onRecommend(trimmed);
  };

  return (
    <div>
      <textarea
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        placeholder={PLACEHOLDER}
      />

      <button id="recommendButton" onClick={handleClick} disabled={isLoading}>
        {isLoading ? "Reading your vibe..." : "Find My Movies"}
      </button>

      <p className="memory-status">{memoryStatus}</p>

      <div id="results">
        {localError && <p className="error-message">{localError}</p>}

        {isLoading && (
          <p className="loading">🎬 Finding movies that fit your mood...</p>
        )}

        {status === "error" && error && (
          <div className="error-message">
            <strong>Something went wrong 😭</strong>
            <br />
            <br />
            {error}
          </div>
        )}

        {status === "success" && movies.length > 0 && (
          <>
            <div className="results-heading">Here&apos;s what fits your vibe:</div>
            {movies.map((movie) => (
              <MovieCard
                key={getMovieKey(movie)}
                movie={movie}
                currentStatus={feedback[getMovieKey(movie)]?.status || null}
                onFeedback={onFeedback}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
