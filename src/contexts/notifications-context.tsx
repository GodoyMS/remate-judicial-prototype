"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  INITIAL_NOTIFICATIONS,
  PREMIUM_NOTIFICATIONS,
  type AppNotification,
} from "@/lib/dashboard/notifications";
import { readStoredUser } from "@/contexts/user-context";

function getInitialNotifications(): AppNotification[] {
  if (typeof window === "undefined") return INITIAL_NOTIFICATIONS;
  const user = readStoredUser();
  if (user?.tier === "premium") {
    return [...PREMIUM_NOTIFICATIONS, ...INITIAL_NOTIFICATIONS];
  }
  return INITIAL_NOTIFICATIONS;
}

const STORAGE_KEY = "rematto-notifications-v1";

interface NotificationsContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  toggleRead: (id: string) => void;
  addNotification: (input: Omit<AppNotification, "id" | "timestamp" | "timeAgo" | "read">) => void;
}

const NotificationsContext = createContext<NotificationsContextValue | null>(
  null
);

function loadStored(): AppNotification[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AppNotification[];
  } catch {
    return null;
  }
}

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(
    INITIAL_NOTIFICATIONS
  );
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = loadStored();
    if (stored?.length) {
      setNotifications(stored);
    } else {
      setNotifications(getInitialNotifications());
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications, hydrated]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const toggleRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  }, []);

  const addNotification = useCallback(
    (input: Omit<AppNotification, "id" | "timestamp" | "timeAgo" | "read">) => {
      const notification: AppNotification = {
        ...input,
        id: `n-${Date.now()}`,
        timestamp: Date.now(),
        timeAgo: "ahora",
        read: false,
      };
      setNotifications((prev) => [notification, ...prev]);
    },
    []
  );

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      toggleRead,
      addNotification,
    }),
    [notifications, unreadCount, markAsRead, markAllAsRead, toggleRead, addNotification]
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) {
    throw new Error(
      "useNotifications must be used within NotificationsProvider"
    );
  }
  return ctx;
}
