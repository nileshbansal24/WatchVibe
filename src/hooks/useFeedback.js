// --------------------------------------------------
// useFeedback HOOK
// --------------------------------------------------
//
// Loads the feedback map once and exposes a toggle function that
// keeps React state and storage in sync.

import { useState, useEffect, useCallback } from "react";
import {
  getMovieFeedback,
  toggleMovieFeedback,
} from "../services/feedbackService.js";

export function useFeedback() {
  const [feedback, setFeedback] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getMovieFeedback().then((data) => {
      if (active) {
        setFeedback(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const toggle = useCallback(async (movie, status) => {
    const updated = await toggleMovieFeedback(movie, status);
    setFeedback({ ...updated });
  }, []);

  const reset = useCallback(() => setFeedback({}), []);

  return { feedback, loading, toggle, reset };
}
