// localStorage access that never throws (private mode, quota, disabled storage).

export function readItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.warn(`Could not write ${key} to localStorage`, error);
  }
}

export function removeItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export function keysWithPrefix(prefix: string): string[] {
  try {
    return Object.keys(localStorage).filter((key) => key.startsWith(prefix));
  } catch {
    return [];
  }
}
