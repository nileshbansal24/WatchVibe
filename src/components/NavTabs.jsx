// --------------------------------------------------
// NavTabs
// --------------------------------------------------
//
// Controlled tab bar. The parent owns the active tab so switching
// views is a pure state change (no DOM class juggling).

import React from "react";

const TABS = [
  { id: "discover", label: "✨ Discover" },
  { id: "history", label: "🕘 Previously Viewed" },
  { id: "settings", label: "⚙️ Settings" },
];

export default function NavTabs({ active, onChange }) {
  return (
    <div className="nav-tabs">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={`nav-tab ${active === tab.id ? "active" : ""}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
