// --------------------------------------------------
// useRecommendations HOOK
// --------------------------------------------------
//
// The heart of the app. Orchestrates the full pipeline:
//   history + feedback  ->  Gemini  ->  OMDb enrichment
//   ->  save to history  ->  update memory status.
//
// Exposes loading, error, results, and a `recommend(mood)` action.

import { useState, useCallback } from "react";
import { getRecommendations } from "../services/geminiService.js";
import { enrichMovies } from "../services/omdbService.js";
import {
  getSearchHistory,
  saveSearchToHistory,
} from "../services/historyService.js";
import { getMovieFeedback } from "../services/feedbackService.js";
import { MAX_HISTORY_FOR_AI } from "../config.js";

export function useRecommendations() {
  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState(null);
  const [lastQuery, setLastQuery] = useState("");

  const recommend = useCallback(async (mood) => {
    setStatus("loading");
    setError(null);
    setLastQuery(mood);

    try {
      const [history, feedback] = await Promise.all([
        getSearchHistory(),
        getMovieFeedback(),
      ]);

      const recentHistory = history.slice(-MAX_HISTORY_FOR_AI);

      // 1. Ask the AI.
      const aiMovies = await getRecommendations({
        mood,
        history: recentHistory,
        feedback,
      });

      // 2. Enrich with real metadata.
      const enriched = await enrichMovies(aiMovies);

      // 3. Persist and surface.
      await saveSearchToHistory(mood, enriched);
      setMovies(enriched);
      setStatus("success");
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong.");
      setStatus("error");
    }
  }, []);

  const clear = useCallback(() => {
    setMovies([]);
    setStatus("idle");
    setError(null);
    setLastQuery("");
  }, []);

  return { movies, status, error, lastQuery, recommend, clear };
}
