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

const STORAGE_KEY = "remata-demo-user-v1";

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
  if (normalized === "premium@remata.com") return DEMO_USERS["premium@remata.com"];
  if (normalized === "standard@remata.com") return DEMO_USERS["standard@remata.com"];
  return DEFAULT_USER;
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DashboardUser>(DEFAULT_USER);
  const [hydrated, setHydrated] = useState(false);
  const [upgradeRequest, setUpgradeRequest] = useState<PremiumUpgradeRequest | undefined>(undefined);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as DashboardUser;
        // Apply any tier override set by admin approval
        const tierOverride = getTierOverrideForUser(parsed.id);
        const effectiveUser = tierOverride ? { ...parsed, tier: tierOverride } : parsed;
        setUser(effectiveUser);
        setUpgradeRequest(getUpgradeRequestForUser(effectiveUser.id));
      }
    } catch {
      /* ignore */
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
