// --------------------------------------------------
// PROMPT BUILDER
// --------------------------------------------------
//
// Builds the natural-language prompt sent to Gemini. Isolated
// from the network layer so it can be unit-tested and tweaked
// without touching API code.

import { RECOMMENDATION_COUNT } from "../config.js";

export function buildHistoryText(history) {
  if (!history.length) {
    return "No previous search history is available. This is likely a new user.";
  }

  return history
    .map((entry, index) => {
      const movieNames = entry.recommendedMovies
        .map((movie) => movie.title)
        .join(", ");

      return [
        `Search ${index + 1}:`,
        `User asked: "${entry.query}"`,
        `Movies previously recommended: ${movieNames}`,
      ].join("\n");
    })
    .join("\n\n");
}

export function buildFeedbackText(feedback) {
  const entries = Object.values(feedback);

  if (!entries.length) {
    return "No explicit movie feedback is available yet.";
  }

  const byStatus = (status) =>
    entries
      .filter((movie) => movie.status === status)
      .map((movie) => movie.title);

  const liked = byStatus("liked");
  const disliked = byStatus("disliked");
  const watched = byStatus("watched");

  return [
    "Liked movies:",
    liked.length ? liked.join(", ") : "None",
    "",
    "Disliked movies:",
    disliked.length ? disliked.join(", ") : "None",
    "",
    "Already watched movies:",
    watched.length ? watched.join(", ") : "None",
  ].join("\n");
}

export function buildPrompt({ mood, history, feedback }) {
  const historyText = buildHistoryText(history);
  const feedbackText = buildFeedbackText(feedback);

  return `
You are VibeWatch, an intelligent and highly personalized movie recommendation assistant.
Your job is to understand the user's current mood, situation, preferences, and natural way of speaking.

LANGUAGE RULES:
- The user may write in English, Hindi, Hinglish, or a mixture of these.
- Understand all of them naturally.
- If the user writes mainly in English, respond in English.
- If the user writes mainly in Hindi, respond naturally in Hindi.
- If the user writes in Hinglish, respond in natural Hinglish.
- Do not unnecessarily translate movie titles.
- Do not sound robotic or overly formal.

PERSONALIZATION RULES:
- The user's CURRENT REQUEST is always the highest priority.
- Explicit movie feedback is more reliable than search history.
- Movies marked "liked" indicate positive taste preferences.
- Movies marked "disliked" should generally be avoided.
- Avoid movies very similar to repeatedly disliked movies.
- Movies marked "watched" should generally not be recommended again.
- Previous searches do not necessarily mean the user liked those movies.
- Notice recurring patterns across multiple searches.
- Avoid unnecessarily repeating previously recommended movies.
- If an old recommendation is an exceptionally strong match for the current request, it may be recommended again.
- Recommend real movies only.
- Never invent movie titles.

CURRENT USER REQUEST:
"${mood}"

RECENT USER SEARCH HISTORY:
${historyText}

USER'S ACTUAL MOVIE FEEDBACK:
${feedbackText}

TASK:
Recommend exactly ${RECOMMENDATION_COUNT} movies that strongly fit the user's current request.

For every movie return:
- title
- year
- vibeMatch: an integer between 70 and 99
- reason: a short, natural explanation of why the movie fits THIS user's current mood and preferences

IMPORTANT OUTPUT RULE:
Return ONLY valid JSON.
Do not use markdown.
Do not use code fences.
Do not write any text before or after the JSON.

Use exactly this structure:
{
    "movies": [
        {
            "title": "Movie Title",
            "year": 2020,
            "vibeMatch": 94,
            "reason": "Short explanation here."
        }
    ]
}
`.trim();
}
