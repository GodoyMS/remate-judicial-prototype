import {
  createEmptyPermissions,
  createFullWritePermissions,
} from "./constants";
import type { AdminAccount, AdminRole } from "./types";

const ROLES_KEY = "remata-admin-roles-v1";
const ACCOUNTS_KEY = "remata-admin-accounts-v1";

const SYSTEM_ROLES: AdminRole[] = [
  {
    id: "role-super-admin",
    name: "Super Admin",
    description: "Acceso total sin restricciones a toda la plataforma",
    color: "#7c3aed",
    isSystem: true,
    permissions: createFullWritePermissions(),
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "role-admin",
    name: "Administrador",
    description: "Acceso completo a todos los módulos operativos del backoffice",
    color: "#2563eb",
    isSystem: true,
    permissions: {
      ...createFullWritePermissions(),
      access: "read",
    },
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "role-analyst",
    name: "Analista",
    description: "Acceso de solo lectura a módulos de consulta y reportes",
    color: "#0891b2",
    isSystem: true,
    permissions: {
      ...createEmptyPermissions(),
      dashboard: "read",
      analytics: "read",
      properties: "read",
      premium_properties: "read",
      users: "read",
      complaints: "read",
      chatbot: "read",
      notifications: "read",
      settings: "read",
    },
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "role-moderator",
    name: "Moderador",
    description: "Gestión de contenido y atención al usuario",
    color: "#d97706",
    isSystem: true,
    permissions: {
      ...createEmptyPermissions(),
      dashboard: "read",
      testimonials: "write",
      complaints: "write",
      chatbot: "write",
      notifications: "read",
      settings: "read",
    },
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
];

const DEFAULT_ACCOUNTS: AdminAccount[] = [
  {
    id: "acc-superadmin",
    name: "Super Admin",
    email: "superadmin@remata.com",
    password: "superadmin1234",
    roleId: "role-super-admin",
    isSuperAdmin: true,
    active: true,
    lastLogin: "2026-06-08T09:00:00.000Z",
    twoFactorEnabled: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "acc-admin",
    name: "Admin Operaciones",
    email: "admin@remata.com",
    password: "admin1234",
    roleId: "role-admin",
    isSuperAdmin: false,
    active: true,
    lastLogin: "2026-06-08T08:30:00.000Z",
    twoFactorEnabled: false,
    createdAt: "2026-02-15T00:00:00.000Z",
  },
  {
    id: "acc-analyst",
    name: "Ana Lista",
    email: "analysist@remata.com",
    password: "analyst1234",
    roleId: "role-analyst",
    isSuperAdmin: false,
    active: true,
    lastLogin: "2026-06-07T16:45:00.000Z",
    twoFactorEnabled: false,
    createdAt: "2026-03-20T00:00:00.000Z",
  },
];

function readFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function getRoles(): AdminRole[] {
  return readFromStorage(ROLES_KEY, SYSTEM_ROLES);
}

export function saveRoles(roles: AdminRole[]): void {
  writeToStorage(ROLES_KEY, roles);
}

export function getAccounts(): AdminAccount[] {
  const accounts = readFromStorage(ACCOUNTS_KEY, DEFAULT_ACCOUNTS);
  const normalized = normalizeAdminAccounts(accounts);
  if (normalized.some((account, index) => account !== accounts[index])) {
    writeToStorage(ACCOUNTS_KEY, normalized);
  }
  return normalized;
}

export function saveAccounts(accounts: AdminAccount[]): void {
  writeToStorage(ACCOUNTS_KEY, normalizeAdminAccounts(accounts));
}

export function resetRbacStore(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ROLES_KEY);
  localStorage.removeItem(ACCOUNTS_KEY);
}

export function findAccountByEmail(email: string): AdminAccount | undefined {
  const normalized = email.toLowerCase().trim();
  return getAccounts().find((a) => a.email.toLowerCase() === normalized);
}

export function findRoleById(roleId: string): AdminRole | undefined {
  return getRoles().find((r) => r.id === roleId);
}

/** Keeps isSuperAdmin in sync with the assigned Super Admin role. */
export function normalizeAdminAccount(account: AdminAccount): AdminAccount {
  const isSuperAdmin = account.roleId === "role-super-admin";
  if (account.isSuperAdmin === isSuperAdmin) return account;
  return { ...account, isSuperAdmin };
}

export function normalizeAdminAccounts(accounts: AdminAccount[]): AdminAccount[] {
  return accounts.map(normalizeAdminAccount);
}

export function authenticateAdmin(
  email: string,
  password: string
): AdminAccount | null {
  const account = findAccountByEmail(email);
  if (!account || !account.active) return null;
  if (account.password !== password) return null;
  return account;
}

export { SYSTEM_ROLES, DEFAULT_ACCOUNTS };
