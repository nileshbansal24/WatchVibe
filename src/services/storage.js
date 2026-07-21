// --------------------------------------------------
// STORAGE SERVICE
// --------------------------------------------------
//
// Wraps chrome.storage.local so the rest of the app never
// touches the Chrome API directly. This makes the code:
//   1. Testable (we can swap in a fake storage).
//   2. Runnable in a normal browser tab during development,
//      where `chrome.storage` does not exist — we fall back
//      to localStorage automatically.

const hasChromeStorage =
  typeof chrome !== "undefined" &&
  chrome.storage &&
  chrome.storage.local;

async function chromeGet(key) {
  const data = await chrome.storage.local.get(key);
  return data[key];
}

async function chromeSet(key, value) {
  await chrome.storage.local.set({ [key]: value });
}

async function chromeRemove(keys) {
  await chrome.storage.local.remove(keys);
}

// localStorage fallback (used during `npm run dev`).
function localGet(key) {
  const raw = window.localStorage.getItem(key);
  return raw ? JSON.parse(raw) : undefined;
}

function localSet(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function localRemove(keys) {
  const list = Array.isArray(keys) ? keys : [keys];
  list.forEach((k) => window.localStorage.removeItem(k));
}

export const storage = {
  async get(key, fallback = undefined) {
    try {
      const value = hasChromeStorage ? await chromeGet(key) : localGet(key);
      return value === undefined ? fallback : value;
    } catch (error) {
      console.error(`storage.get failed for "${key}":`, error);
      return fallback;
    }
  },

  async set(key, value) {
    try {
      if (hasChromeStorage) {
        await chromeSet(key, value);
      } else {
        localSet(key, value);
      }
    } catch (error) {
      console.error(`storage.set failed for "${key}":`, error);
    }
  },

  async remove(keys) {
    try {
      if (hasChromeStorage) {
        await chromeRemove(keys);
      } else {
        localRemove(keys);
      }
    } catch (error) {
      console.error("storage.remove failed:", error);
    }
  },
};
