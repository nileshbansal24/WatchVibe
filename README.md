# 🎬 VibeWatch

**AI-powered personalized movie recommendations based on your mood and taste.**

VibeWatch is a Chrome extension that turns a plain-language description of how
you feel — in English, Hindi, or Hinglish — into five hand-picked movie
recommendations. It remembers what you liked, disliked, and already watched, and
uses that memory to make each set of recommendations more personal than the last.

This repository is the **React rewrite (v5)** of the original vanilla-JavaScript
extension. It was rebuilt with a proper component architecture, a service layer,
and custom hooks to make it suitable as a final-year project submission.

---

## ✨ Features

- **Natural-language mood input** — describe a vibe, not a genre.
- **Multilingual understanding** — English, Hindi, and Hinglish all work.
- **AI recommendations** via Google Gemini, returning structured JSON.
- **Real movie metadata** (poster, IMDb rating, genre, runtime) via OMDb.
- **Personalization memory** — like / dislike / watched feedback feeds back
  into future prompts.
- **Search history** — a "Previously Viewed" tab of past recommendations.
- **Settings tab** — store your own API keys locally instead of hard-coding them.
- **Graceful fallbacks** — missing posters, failed lookups, and malformed AI
  output are all handled without crashing.

---

## 🏗️ Architecture

The project follows a layered design so responsibilities are cleanly separated.

```
UI (React components)
        │
        ▼
Hooks  (useRecommendations, useFeedback, useHistory)
        │
        ▼
Services (gemini, omdb, history, feedback, storage, apiKeys, promptBuilder)
        │
        ▼
Chrome storage  +  External APIs (Gemini, OMDb)
```

- **Components** are presentational and receive everything via props.
- **Hooks** hold screen state and call services.
- **Services** contain all side effects (network, storage). Nothing else
  touches `fetch` or `chrome.storage` directly.
- **Utils** are pure helper functions (easy to test).

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for a full breakdown and the
data-flow diagram.

### Folder structure

```
vibewatch/
├── public/
│   ├── manifest.json          # Chrome Manifest V3
│   └── icons/                 # 16 / 48 / 128 px icons
├── src/
│   ├── components/            # React UI components
│   ├── hooks/                 # Custom React hooks
│   ├── services/              # API + storage layer
│   ├── utils/                 # Pure helpers
│   ├── styles/                # popup.css
│   ├── config.js             # Keys, model name, constants
│   ├── App.jsx               # Root component
│   └── main.jsx              # Entry point
├── docs/                      # Architecture + demo notes
├── index.html
├── vite.config.js
└── package.json
```

---

## 🚀 Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Add your API keys

You need two free keys:

- **Gemini** — from [Google AI Studio](https://aistudio.google.com/).
- **OMDb** — from [omdbapi.com](https://www.omdbapi.com/apikey.aspx).

You can either:

- Enter them in the extension's **Settings tab** at runtime (recommended — they
  are stored in local storage, not in the code), **or**
- Replace the placeholders in `src/config.js`.

### 3. Run in the browser (development)

```bash
npm run dev
```

This runs the popup as a normal web page. In dev mode, storage falls back to
`localStorage` so you can test the UI without loading it as an extension.

### 4. Build the extension

```bash
npm run build
```

This produces a `dist/` folder containing the compiled popup, `manifest.json`,
and icons.

### 5. Load it into Chrome

1. Open `chrome://extensions`.
2. Enable **Developer mode** (top-right).
3. Click **Load unpacked** and select the `dist/` folder.
4. Pin VibeWatch and click the icon to open the popup.

---

## 🧠 How personalization works

Each recommendation request assembles a prompt from three inputs:

1. **The current mood** (highest priority).
2. **Recent search history** (last 8 searches).
3. **Explicit feedback** (liked / disliked / watched).

The Gemini model is instructed to prioritize the current request, avoid disliked
and already-watched movies, and never invent titles. Its JSON output is then
enriched with OMDb metadata before being displayed and saved.

---

## 🔒 A note on API keys

Shipping secret keys inside a client-side extension is **not secure** — anyone
can inspect them. This project keeps the keys out of source by letting the user
enter them in Settings. For a production release, the correct pattern is to route
API calls through a small backend proxy that holds the keys server-side.

---

## 🛠️ Tech stack

| Layer        | Technology                     |
| ------------ | ------------------------------ |
| UI           | React 18                       |
| Build tool   | Vite                           |
| Platform     | Chrome Extension (Manifest V3) |
| AI           | Google Gemini API              |
| Movie data   | OMDb API                       |
| Storage      | `chrome.storage.local`         |

---

## 📄 License

Feel free to Use
