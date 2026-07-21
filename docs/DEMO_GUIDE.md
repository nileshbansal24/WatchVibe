# VibeWatch — Demo & Viva Guide

A short script for presenting the project live, plus likely questions and
answers.

## 5-minute demo flow

1. **Open the popup.** Point out the header, the three tabs
   (Discover / Previously Viewed / Settings), and the mood input.

2. **Settings first.** Show that keys are entered here and stored locally, not
   hard-coded. Mention this is the safer pattern for a client-side extension.

3. **A simple English search.**
   > "Something feel-good and light for a lazy Sunday afternoon."

   Point out: the loading state, the five cards, the **vibe match %**, real
   posters and IMDb ratings from OMDb, and the natural-language reason under
   each movie.

4. **Give feedback.** Like one film, mark another as "watched." Explain that
   this is stored and will influence the next search.

5. **A Hinglish search** to show multilingual understanding.
   > "Kuch emotional lekin zyada depressing nahi, thoda nostalgic feel."

   Note the recommendations differ and avoid anything you marked "watched."

6. **Previously Viewed tab.** Show the de-duplicated history with feedback
   badges carried over.

7. **Clear data.** Use the ↻ button to reset, demonstrating the confirm dialog.

## Likely questions

**Q: Why did you rewrite it in React?**
The original was one large file mixing DOM manipulation, API calls, and storage.
React let me split it into reusable components, isolate side effects in a service
layer, and manage state with hooks — making it far easier to extend and reason
about.

**Q: How does personalization actually work?**
Every request builds a prompt from the current mood, the last eight searches, and
all explicit feedback. The model is told to prioritize the current mood, avoid
disliked and already-watched films, and never invent titles.

**Q: What happens if the AI returns bad data?**
The JSON parser makes two attempts (raw, then with code fences stripped). If the
result has no valid movies array, a clear error is shown. OMDb failures are
caught per-movie so one bad lookup never breaks the list.

**Q: Is storing API keys in the extension secure?**
No — and I call this out. Keys in any client-side app are inspectable. My
mitigation is to keep them out of source (entered in Settings). The production
answer is a backend proxy that holds keys server-side.

**Q: How is a movie uniquely identified?**
By its IMDb id when OMDb returns one; otherwise a `title-year` composite. This
key drives both de-duplication in history and feedback storage.

**Q: Why two different APIs?**
Gemini provides the creative, mood-aware reasoning; OMDb provides trustworthy
factual metadata (poster, rating, runtime). Separating "taste" from "facts"
keeps each source doing what it's good at.

## Possible future work (good to mention)

- A backend proxy for keys and rate limiting.
- Streaming responses for faster perceived load.
- Unit tests for the services and utils.
- Trailer embeds and watch-provider links.
- Exportable taste profile.
