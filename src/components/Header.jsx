// --------------------------------------------------
// Header
// --------------------------------------------------

import React from "react";

export default function Header({ onClear }) {
  return (
    <div className="header">
      <div>
        <h1>🎬 VibeWatch</h1>
        <p className="subtitle">Tell me your vibe. I&apos;ll find your movie.</p>
      </div>

      <button
        className="clear-button"
        title="Clear all VibeWatch data"
        onClick={onClear}
      >
        ↻
      </button>
    </div>
  );
}
