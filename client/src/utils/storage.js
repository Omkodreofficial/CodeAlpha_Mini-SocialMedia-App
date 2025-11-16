// client/src/utils/storage.js

export function saveItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getItem(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

export function removeItem(key) {
  localStorage.removeItem(key);
}
