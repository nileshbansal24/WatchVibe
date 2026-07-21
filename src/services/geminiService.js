// --------------------------------------------------
// GEMINI AI SERVICE
// --------------------------------------------------
//
// Responsible only for talking to the Gemini API and turning the
// raw text response into a clean list of movie objects.

import { MODEL_NAME, RECOMMENDATION_COUNT } from "../config.js";
import { getGeminiKey } from "./apiKeys.js";
import { buildPrompt } from "./promptBuilder.js";

const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";

// Tolerant JSON parse: Gemini occasionally wraps output in code fences
// even when told not to, so we strip them before a second attempt.
export function parseAIResponse(rawResponse) {
  try {
    return JSON.parse(rawResponse);
  } catch (firstError) {
    const cleaned = rawResponse
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();
    return JSON.parse(cleaned);
  }
}

export async function getRecommendations({ mood, history, feedback }) {
  const apiKey = await getGeminiKey();
  const prompt = buildPrompt({ mood, history, feedback });

  const response = await fetch(
    `${ENDPOINT}/${MODEL_NAME}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" },
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("Gemini API error:", data);
    throw new Error(data?.error?.message || "Gemini API request failed.");
  }

  const rawResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawResponse) {
    throw new Error("The AI returned an empty response.");
  }

  const parsed = parseAIResponse(rawResponse);

  if (
    !parsed.movies ||
    !Array.isArray(parsed.movies) ||
    parsed.movies.length === 0
  ) {
    throw new Error(
      "The AI response did not contain valid movie recommendations."
    );
  }

  return parsed.movies.slice(0, RECOMMENDATION_COUNT);
}
