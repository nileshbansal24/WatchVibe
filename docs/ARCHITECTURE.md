# VibeWatch — Architecture

This document explains how VibeWatch is structured and why. It is aimed at
readers evaluating the project (supervisors, examiners) and at future
contributors.

## Design goals

1. **Separation of concerns** — UI, state, and side effects live in different
   layers.
2. **Testability** — pure functions and services can be tested in isolation.
3. **Portability** — the app runs both as a Chrome extension and as a plain web
   page during development.
4. **Safety** — no crashes on missing data or malformed AI output.

## Layered overview

```
┌──────────────────────────────────────────────────┐
│                    Components                      │
│  Header · NavTabs · DiscoverView · HistoryView ·   │
│  SettingsView · MovieCard · HistoryCard ·          │
│  MoviePoster · FeedbackButtons                     │
└───────────────────────┬──────────────────────────┘
                        │ props / callbacks
┌───────────────────────▼──────────────────────────┐
│                      Hooks                         │
│  useRecommendations · useFeedback · useHistory     │
└───────────────────────┬──────────────────────────┘
                        │ function calls
┌───────────────────────▼──────────────────────────┐
│                    Services                        │
│  geminiService · omdbService · historyService ·    │
│  feedbackService · storage · apiKeys ·             │
│  promptBuilder                                     │
└───────────────────────┬──────────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        ▼                               ▼
 chrome.storage.local            External APIs
 (localStorage in dev)          (Gemini, OMDb)
```

## The recommendation pipeline

When the user submits a mood, `useRecommendations.recommend()` runs:

1. **Gather context** — `historyService.getSearchHistory()` and
   `feedbackService.getMovieFeedback()` run in parallel.
2. **Build the prompt** — `promptBuilder.buildPrompt()` combines the mood,
   the last 8 searches, and all feedback into a single instruction.
3. **Call Gemini** — `geminiService.getRecommendations()` sends the prompt,
   requests a JSON response, and tolerantly parses it (stripping stray code
   fences if present). It returns exactly 5 movie objects.
4. **Enrich** — `omdbService.enrichMovies()` looks up each title on OMDb in
   parallel, attaching poster, IMDb id, rating, genre, runtime, and director.
   Failed lookups degrade gracefully to `omdbFound: false`.
5. **Persist** — `historyService.saveSearchToHistory()` stores the query and
   the enriched results (trimmed to the 30 most recent searches).
6. **Render** — state updates flow back to `DiscoverView`, which renders one
   `MovieCard` per movie.

## Personalization model

Two kinds of memory shape recommendations:

- **Implicit** — the search history (what the user has asked for before).
- **Explicit** — like / dislike / watched feedback, which is more trustworthy
  and weighted more heavily in the prompt.

Feedback uses **toggle semantics**: clicking the same status twice removes it.
Movies are identified by a stable key — the IMDb id when available, otherwise a
`title-year` composite (`utils/movieUtils.getMovieKey`).

## Storage abstraction

`services/storage.js` wraps `chrome.storage.local`. When that API is absent
(i.e. during `npm run dev` in a normal tab), it transparently falls back to
`localStorage`. Every other module depends on this wrapper, never on the Chrome
API directly, which keeps the app runnable and testable outside the extension.

## Error handling strategy

- **AI parsing** — two-pass JSON parse (raw, then fence-stripped).
- **Empty / invalid AI output** — throws a descriptive error surfaced in the UI.
- **OMDb failures** — caught per-movie; the movie still renders with a
  placeholder poster.
- **Empty mood** — validated in the UI before any network call.

## Key files at a glance

| File                              | Responsibility                                  |
| --------------------------------- | ----------------------------------------------- |
| `config.js`                       | Constants, model name, storage keys             |
| `services/storage.js`             | Storage wrapper with dev fallback               |
| `services/apiKeys.js`             | Resolves user-entered vs. default keys          |
| `services/promptBuilder.js`       | Builds the Gemini prompt                        |
| `services/geminiService.js`       | Calls Gemini, parses movies                     |
| `services/omdbService.js`         | Enriches movies with real metadata              |
| `services/historyService.js`      | Search-history CRUD + flatten/dedupe            |
| `services/feedbackService.js`     | Like/dislike/watched storage                    |
| `hooks/useRecommendations.js`     | Orchestrates the full pipeline                  |
| `hooks/useFeedback.js`            | Feedback state + toggle                         |
| `hooks/useHistory.js`             | History state + memory status                   |
| `App.jsx`                         | Tab routing, wiring hooks to views              |
