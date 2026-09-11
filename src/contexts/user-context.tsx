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
import {
  getUpgradeRequestForUser,
  getTierOverrideForUser,
  type PremiumUpgradeRequest,
} from "@/lib/app-store";

const STORAGE_KEY = "rematto-demo-user-v1";
const LEGACY_STORAGE_KEY = "remata-demo-user-v1";
const LOGIN_AT_KEY = "rematto-session-login-at-v1";

/**
 * Duración de sesión en este demo. Un backend real la definiría con un JWT;
 * aquí se aproxima con una marca de tiempo para poder cerrar L-034 (qué pasa
 * cuando la sesión expira) sin inventar infraestructura de autenticación.
 */
const SESSION_TTL_MS = 30 * 60 * 1000;

/**
 * Reads the persisted demo user, migrating the pre-rebrand storage key once
 * so a session created before the "Rematto" rename doesn't get logged out.
 */
export function readStoredUser(): DashboardUser | null {
  try {
    const current = localStorage.getItem(STORAGE_KEY);
    if (current) return JSON.parse(current) as DashboardUser;
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy) {
      localStorage.setItem(STORAGE_KEY, legacy);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      return JSON.parse(legacy) as DashboardUser;
    }
  } catch {
    /* ignore */
  }
  return null;
}

interface UserContextValue {
  user: DashboardUser;
  isPremium: boolean;
  upgradeRequest: PremiumUpgradeRequest | undefined;
  sessionExpired: boolean;
  login: (email: string) => DashboardUser;
  logout: () => void;
  upgradeToPremium: () => void;
  refreshUpgradeRequest: () => void;
}

const UserContext = createContext<UserContextValue | null>(null);

function resolveUser(email: string): DashboardUser {
  const normalized = email.toLowerCase().trim();
  if (normalized === "premium@rematto.com") return DEMO_USERS["premium@rematto.com"];
  if (normalized === "standard@rematto.com") return DEMO_USERS["standard@rematto.com"];
  return DEFAULT_USER;
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DashboardUser>(DEFAULT_USER);
  const [hydrated, setHydrated] = useState(false);
  const [upgradeRequest, setUpgradeRequest] = useState<PremiumUpgradeRequest | undefined>(undefined);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    const parsed = readStoredUser();
    if (parsed) {
      // Apply any tier override set by admin approval
      const tierOverride = getTierOverrideForUser(parsed.id);
      const effectiveUser = tierOverride ? { ...parsed, tier: tierOverride } : parsed;
      setUser(effectiveUser);
      setUpgradeRequest(getUpgradeRequestForUser(effectiveUser.id));
    }
    setHydrated(true);
  }, []);

  // Expiración de sesión (WP-1.4, cierra L-034): sin backend, se aproxima
  // con una marca de tiempo de inicio de sesión revisada periódicamente.
  useEffect(() => {
    const check = () => {
      const loginAt = Number(localStorage.getItem(LOGIN_AT_KEY) ?? 0);
      if (loginAt && Date.now() - loginAt > SESSION_TTL_MS) {
        setSessionExpired(true);
      }
    };
    check();
    const interval = setInterval(check, 60_000);
    return () => clearInterval(interval);
  }, []);

  const login = useCallback((email: string) => {
    const next = resolveUser(email);
    // Apply tier override on login too
    const tierOverride = getTierOverrideForUser(next.id);
    const effective = tierOverride ? { ...next, tier: tierOverride } : next;
    setUser(effective);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(effective));
    localStorage.setItem(LOGIN_AT_KEY, String(Date.now()));
    setSessionExpired(false);
    setUpgradeRequest(getUpgradeRequestForUser(effective.id));
    return effective;
  }, []);

  const logout = useCallback(() => {
    setUser(DEFAULT_USER);
    setUpgradeRequest(undefined);
    setSessionExpired(false);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LOGIN_AT_KEY);
  }, []);

  const upgradeToPremium = useCallback(() => {
    setUser((prev) => {
      const upgraded = { ...prev, tier: "premium" as const };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(upgraded));
      return upgraded;
    });
  }, []);

  const refreshUpgradeRequest = useCallback(() => {
    setUser((prev) => {
      const tierOverride = getTierOverrideForUser(prev.id);
      if (tierOverride && prev.tier !== tierOverride) {
        const upgraded = { ...prev, tier: tierOverride };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(upgraded));
        return upgraded;
      }
      return prev;
    });
    setUpgradeRequest((prev) => {
      const current = prev ? getUpgradeRequestForUser(prev.userId) : undefined;
      return current;
    });
  }, []);

  const effectiveUser = hydrated ? user : DEFAULT_USER;

  const value = useMemo(
    () => ({
      user: effectiveUser,
      isPremium: effectiveUser.tier === "premium",
      upgradeRequest: hydrated ? upgradeRequest : undefined,
      sessionExpired,
      login,
      logout,
      upgradeToPremium,
      refreshUpgradeRequest,
    }),
    [effectiveUser, hydrated, upgradeRequest, sessionExpired, login, logout, upgradeToPremium, refreshUpgradeRequest]
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
