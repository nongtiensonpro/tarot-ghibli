const READING_KEY = 'tarot-ghibli-reading';

export function saveReading(reading) {
  sessionStorage.setItem(READING_KEY, JSON.stringify(reading));
}

export function loadReading() {
  const serialized = sessionStorage.getItem(READING_KEY);

  if (!serialized) {
    return null;
  }

  try {
    return JSON.parse(serialized);
  } catch {
    sessionStorage.removeItem(READING_KEY);
    return null;
  }
}

export function clearReading() {
  sessionStorage.removeItem(READING_KEY);
}
