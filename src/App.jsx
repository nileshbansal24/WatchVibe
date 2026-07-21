// --------------------------------------------------
// App
// --------------------------------------------------
//
// Top-level container. Owns the active tab and wires the hooks
// (recommendations, feedback, history) into the view components.

import React, { useState, useCallback } from "react";
import Header from "./components/Header.jsx";
import NavTabs from "./components/NavTabs.jsx";
import DiscoverView from "./components/DiscoverView.jsx";
import HistoryView from "./components/HistoryView.jsx";
import SettingsView from "./components/SettingsView.jsx";

import { useRecommendations } from "./hooks/useRecommendations.js";
import { useFeedback } from "./hooks/useFeedback.js";
import { useHistory } from "./hooks/useHistory.js";

import { storage } from "./services/storage.js";
import { STORAGE_KEYS } from "./config.js";

export default function App() {
  const [activeTab, setActiveTab] = useState("discover");

  const recommendations = useRecommendations();
  const { feedback, toggle, reset: resetFeedback } = useFeedback();
  const {
    uniqueMovies,
    memoryStatus,
    refresh: refreshHistory,
    reset: resetHistory,
  } = useHistory();

  // After a successful search, history changes — refresh it so the
  // memory status and Previously Viewed stay accurate.
  const handleRecommend = useCallback(
    async (mood) => {
      await recommendations.recommend(mood);
      await refreshHistory();
    },
    [recommendations, refreshHistory]
  );

  const handleTabChange = useCallback(
    (tab) => {
      setActiveTab(tab);
      if (tab === "history") refreshHistory();
    },
    [refreshHistory]
  );

  const handleClearAll = useCallback(async () => {
    const confirmed = window.confirm(
      "Clear all VibeWatch search history and movie feedback?"
    );
    if (!confirmed) return;

    await storage.remove([
      STORAGE_KEYS.SEARCH_HISTORY,
      STORAGE_KEYS.MOVIE_FEEDBACK,
    ]);

    resetFeedback();
    resetHistory();
    recommendations.clear();
  }, [resetFeedback, resetHistory, recommendations]);

  return (
    <div className="container">
      <Header onClear={handleClearAll} />
      <NavTabs active={activeTab} onChange={handleTabChange} />

      {activeTab === "discover" && (
        <DiscoverView
          memoryStatus={memoryStatus}
          recommendations={recommendations}
          onRecommend={handleRecommend}
          onFeedback={toggle}
          feedback={feedback}
        />
      )}

      {activeTab === "history" && (
        <HistoryView uniqueMovies={uniqueMovies} feedback={feedback} />
      )}

      {activeTab === "settings" && <SettingsView />}
    </div>
  );
}
