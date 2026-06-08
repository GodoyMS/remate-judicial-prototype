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
import { DEFAULT_USER, DEMO_USERS } from "@/lib/premium/mock-data";
import type { DashboardUser } from "@/lib/premium/types";

const STORAGE_KEY = "remata-demo-user-v1";

interface UserContextValue {
  user: DashboardUser;
  isPremium: boolean;
  login: (email: string) => DashboardUser;
  logout: () => void;
}

const UserContext = createContext<UserContextValue | null>(null);

function resolveUser(email: string): DashboardUser {
  const normalized = email.toLowerCase().trim();
  if (normalized === "premium@remata.com") return DEMO_USERS["premium@remata.com"];
  if (normalized === "standard@remata.com") return DEMO_USERS["standard@remata.com"];
  return DEFAULT_USER;
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DashboardUser>(DEFAULT_USER);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as DashboardUser;
        setUser(parsed);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const login = useCallback((email: string) => {
    const next = resolveUser(email);
    setUser(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  }, []);

  const logout = useCallback(() => {
    setUser(DEFAULT_USER);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({
      user: hydrated ? user : DEFAULT_USER,
      isPremium: (hydrated ? user : DEFAULT_USER).tier === "premium",
      login,
      logout,
    }),
    [user, hydrated, login, logout]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useCurrentUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useCurrentUser must be used within UserProvider");
  }
  return ctx;
}
