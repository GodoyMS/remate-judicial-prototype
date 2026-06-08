const SESSION_KEY = "remata-chat-session-id";

export function getOrCreateChatSessionId(): string {
  if (typeof window === "undefined") return `sess-${Date.now()}`;

  const existing = sessionStorage.getItem(SESSION_KEY);
  if (existing) return existing;

  const id = `sess-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  sessionStorage.setItem(SESSION_KEY, id);
  return id;
}
