// --------------------------------------------------
// FeedbackButtons
// --------------------------------------------------

import React from "react";

const OPTIONS = [
  { status: "liked", label: "❤️ Like" },
  { status: "disliked", label: "👎 Not for me" },
  { status: "watched", label: "👁 Watched" },
];

export default function FeedbackButtons({ currentStatus, onSelect }) {
  return (
    <div className="feedback-buttons">
      {OPTIONS.map((option) => (
        <button
          key={option.status}
          className={`feedback-button ${
            currentStatus === option.status ? "active" : ""
          }`}
          onClick={() => onSelect(option.status)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
