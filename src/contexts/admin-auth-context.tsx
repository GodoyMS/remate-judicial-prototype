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
import { usePathname, useRouter } from "next/navigation";
import type { AdminAccount, AdminModule, AdminRole, PermissionLevel } from "@/lib/admin/rbac/types";
import {
  authenticateAdmin,
  findRoleById,
  getAccounts,
  getRoles,
  normalizeAdminAccount,
  saveAccounts,
} from "@/lib/admin/rbac/store";
import {
  canAccessModule,
  canReadModule,
  canWriteModule,
  getEffectivePermission,
  getModuleFromPath,
} from "@/lib/admin/rbac/permissions";

const SESSION_KEY = "remata-admin-session-v1";

interface AdminSessionData {
  accountId: string;
  email: string;
  loggedInAt: string;
}

interface AdminAuthContextValue {
  account: AdminAccount | null;
  role: AdminRole | null;
  roles: AdminRole[];
  accounts: AdminAccount[];
  hydrated: boolean;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  login: (email: string, password: string) => AdminAccount | null;
  logout: () => void;
  refreshStore: () => void;
  canAccess: (module: AdminModule) => boolean;
  canRead: (module: AdminModule) => boolean;
  canWrite: (module: AdminModule) => boolean;
  getPermission: (module: AdminModule) => PermissionLevel;
  updateLastLogin: (accountId: string) => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

function loadSession(): AdminSessionData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AdminSessionData;
  } catch {
    return null;
  }
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<AdminAccount | null>(null);
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [accounts, setAccounts] = useState<AdminAccount[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const refreshStore = useCallback(() => {
    setRoles(getRoles());
    setAccounts(getAccounts());
  }, []);

  useEffect(() => {
    refreshStore();
    const session = loadSession();
    if (session) {
      const found = getAccounts().find((a) => a.id === session.accountId);
      if (found?.active) {
        const normalized = normalizeAdminAccount(found);
        if (normalized !== found) {
          const updatedAccounts = getAccounts().map((a) =>
            a.id === normalized.id ? normalized : a
          );
          saveAccounts(updatedAccounts);
        }
        setAccount(normalized);
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setHydrated(true);
  }, [refreshStore]);

  const role = useMemo(() => {
    if (!account) return null;
    return findRoleById(account.roleId) ?? null;
  }, [account, roles]);

  const login = useCallback(
    (email: string, password: string) => {
      const authenticated = authenticateAdmin(email, password);
      if (!authenticated) return null;

      const session: AdminSessionData = {
        accountId: authenticated.id,
        email: authenticated.email,
        loggedInAt: new Date().toISOString(),
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));

      const updatedAccounts = getAccounts().map((a) =>
        a.id === authenticated.id
          ? { ...a, lastLogin: session.loggedInAt }
          : a
      );
      saveAccounts(updatedAccounts);
      const normalized = normalizeAdminAccount({
        ...authenticated,
        lastLogin: session.loggedInAt,
      });
      setAccounts(updatedAccounts.map((a) => (a.id === normalized.id ? normalized : a)));
      setAccount(normalized);
      return normalized;
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setAccount(null);
  }, []);

  const updateLastLogin = useCallback((accountId: string) => {
    const now = new Date().toISOString();
    const updatedAccounts = getAccounts().map((a) =>
      a.id === accountId ? { ...a, lastLogin: now } : a
    );
    saveAccounts(updatedAccounts);
    setAccounts(updatedAccounts);
    setAccount((prev) => (prev?.id === accountId ? { ...prev, lastLogin: now } : prev));
  }, []);

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      account: hydrated ? account : null,
      role: hydrated ? role : null,
      roles,
      accounts,
      hydrated,
      isAuthenticated: hydrated && !!account,
      isSuperAdmin: !!account?.isSuperAdmin,
      login,
      logout,
      refreshStore,
      canAccess: (module) => canAccessModule(account, role, module),
      canRead: (module) => canReadModule(account, role, module),
      canWrite: (module) => canWriteModule(account, role, module),
      getPermission: (module) => getEffectivePermission(account, role, module),
      updateLastLogin,
    }),
    [
      account,
      role,
      roles,
      accounts,
      hydrated,
      login,
      logout,
      refreshStore,
      updateLastLogin,
    ]
  );

  return (
    <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return ctx;
}

export function AdminRouteGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { hydrated, isAuthenticated, canAccess, account } = useAdminAuth();

  useEffect(() => {
    if (!hydrated) return;

    if (!isAuthenticated) {
      router.replace("/login-admin");
      return;
    }

    const module = getModuleFromPath(pathname);
    if (module && !canAccess(module)) {
      router.replace("/admin?denied=1");
    }
  }, [hydrated, isAuthenticated, pathname, canAccess, router, account]);

  if (!hydrated) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Cargando panel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const module = getModuleFromPath(pathname);
  if (module && !canAccess(module)) return null;

  return <>{children}</>;
}
