// --------------------------------------------------
// HistoryView
// --------------------------------------------------

import React from "react";
import HistoryCard from "./HistoryCard.jsx";
import { getMovieKey } from "../utils/movieUtils.js";

export default function HistoryView({ uniqueMovies, feedback }) {
  return (
    <div>
      <div className="history-header">
        <h2>Previously Viewed</h2>
        <p>Movies previously recommended to you.</p>
      </div>

      <div id="historyResults">
        {uniqueMovies.length === 0 ? (
          <div className="empty-history">
            <p>🎬 No movie history yet.</p>
            <p>Your previous recommendations will appear here.</p>
          </div>
        ) : (
          uniqueMovies.map((movie) => {
            const key = getMovieKey(movie);
            return (
              <HistoryCard
                key={key}
                movie={movie}
                status={feedback[key]?.status || null}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
