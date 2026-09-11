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

  const login = useCallback((email: string) => {
    const next = resolveUser(email);
    // Apply tier override on login too
    const tierOverride = getTierOverrideForUser(next.id);
    const effective = tierOverride ? { ...next, tier: tierOverride } : next;
    setUser(effective);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(effective));
    setUpgradeRequest(getUpgradeRequestForUser(effective.id));
    return effective;
  }, []);

  const logout = useCallback(() => {
    setUser(DEFAULT_USER);
    setUpgradeRequest(undefined);
    localStorage.removeItem(STORAGE_KEY);
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
      login,
      logout,
      upgradeToPremium,
      refreshUpgradeRequest,
    }),
    [effectiveUser, hydrated, upgradeRequest, login, logout, upgradeToPremium, refreshUpgradeRequest]
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
