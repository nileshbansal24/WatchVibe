// --------------------------------------------------
// useHistory HOOK
// --------------------------------------------------
//
// Provides the raw search history plus a memoized, de-duplicated
// flattened list for the "Previously Viewed" screen, and a
// human-readable memory status string.

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getSearchHistory,
  flattenHistory,
} from "../services/historyService.js";

function memoryStatusText(count) {
  if (count === 0) return "No movie history yet.";
  if (count === 1) return "Remembering 1 previous search.";
  return `Remembering ${count} previous searches.`;
}

export function useHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await getSearchHistory();
    setHistory(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const uniqueMovies = useMemo(() => flattenHistory(history), [history]);
  const memoryStatus = useMemo(
    () => memoryStatusText(history.length),
    [history.length]
  );

  const reset = useCallback(() => setHistory([]), []);

  return { history, uniqueMovies, memoryStatus, loading, refresh, reset };
}
