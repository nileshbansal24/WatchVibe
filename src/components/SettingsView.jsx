// --------------------------------------------------
// SettingsView
// --------------------------------------------------
//
// Lets the user store their own Gemini and OMDb API keys locally,
// instead of hard-coding them in source. This is the safer pattern
// for a client-side extension and a nice talking point for a viva.

import React, { useState, useEffect } from "react";
import { getSavedKeys, saveKeys } from "../services/apiKeys.js";

export default function SettingsView() {
  const [geminiKey, setGeminiKey] = useState("");
  const [omdbKey, setOmdbKey] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSavedKeys().then((keys) => {
      setGeminiKey(keys.geminiKey || "");
      setOmdbKey(keys.omdbKey || "");
    });
  }, []);

  const handleSave = async () => {
    await saveKeys({ geminiKey, omdbKey });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="settings-view">
      <div className="history-header">
        <h2>Settings</h2>
        <p>Your keys are stored locally on this device only.</p>
      </div>

      <label className="settings-label">Gemini API Key</label>
      <input
        type="password"
        className="settings-input"
        value={geminiKey}
        onChange={(e) => setGeminiKey(e.target.value)}
        placeholder="Paste your Gemini API key"
      />

      <label className="settings-label">OMDb API Key</label>
      <input
        type="password"
        className="settings-input"
        value={omdbKey}
        onChange={(e) => setOmdbKey(e.target.value)}
        placeholder="Paste your OMDb API key"
      />

      <button id="recommendButton" onClick={handleSave}>
        {saved ? "Saved ✓" : "Save Keys"}
      </button>

      <p className="memory-status">
        Get a Gemini key at aistudio.google.com and an OMDb key at
        omdbapi.com.
      </p>
    </div>
  );
}
