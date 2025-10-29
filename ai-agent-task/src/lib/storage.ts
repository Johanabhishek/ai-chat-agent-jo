// src/lib/storage.ts

const PREFIX = "chat-session:";

export function saveSession(sessionId: string, messages: any[]) {
  localStorage.setItem(PREFIX + sessionId, JSON.stringify(messages));
}

export function loadSession(sessionId: string): any[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(PREFIX + sessionId);
  try {
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getAllSessionIds(): string[] {
  if (typeof window === "undefined") return [];
  return Object.keys(localStorage)
    .filter((k) => k.startsWith(PREFIX))
    .map((k) => k.replace(PREFIX, ""));
}

export function deleteSession(sessionId: string) {
  localStorage.removeItem(PREFIX + sessionId);
}
