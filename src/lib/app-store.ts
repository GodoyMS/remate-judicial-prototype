import type { PropertyCurrency } from "@/lib/currency";
import type { PremiumPropertyAdminStatus, UserTier } from "@/lib/admin/types";
import { seedPremiumUpgradeRequests } from "@/lib/admin/premium-upgrade-mock-data";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface PremiumUpgradeRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  userDni?: string;
  totalInvested: number;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  resolvedAt?: string;
}

export interface PendingPremiumInvestment {
  id: string;
  certificateId: string;
  propertyId: string;
  propertyName: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  currency: PropertyCurrency;
  premiumRoi: number;
  estimatedReturn: number;
  paymentMethod: "transfer" | "deposit";
  submittedAt: string;
  status: "pending_verification" | "approved" | "rejected";
  // Transfer fields
  transferNumber?: string;
  originAccountNumber?: string;
  // Deposit fields
  voucherNumber?: string;
  voucherDate?: string;
  operationNumber?: string;
  rejectionReason?: string;
  resolvedAt?: string;
}

export interface PremiumPropertyOverride {
  propertyId: string;
  premiumStatus: PremiumPropertyAdminStatus;
  caughtByUserId?: string;
  caughtByUserName?: string;
  caughtAt?: string;
}

// ─── Storage Keys ─────────────────────────────────────────────────────────────

const UPGRADE_REQUESTS_KEY = "remata-upgrade-requests-v1";
const PENDING_INVESTMENTS_KEY = "remata-pending-premium-investments-v1";
const PROPERTY_OVERRIDES_KEY = "remata-premium-property-overrides-v1";
const TIER_OVERRIDES_KEY = "remata-tier-overrides-v1";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

// ─── Upgrade Requests ─────────────────────────────────────────────────────────

const UPGRADE_REQUESTS_SEED_KEY = "remata-upgrade-requests-seeded-v1";

function ensureUpgradeRequestsSeeded(): void {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(UPGRADE_REQUESTS_SEED_KEY)) return;

  const existing = readJson<PremiumUpgradeRequest[]>(UPGRADE_REQUESTS_KEY, []);
  if (existing.length === 0) {
    writeJson(UPGRADE_REQUESTS_KEY, seedPremiumUpgradeRequests);
  }

  localStorage.setItem(UPGRADE_REQUESTS_SEED_KEY, "1");
}

export function getUpgradeRequests(): PremiumUpgradeRequest[] {
  ensureUpgradeRequestsSeeded();
  return readJson<PremiumUpgradeRequest[]>(UPGRADE_REQUESTS_KEY, []);
}

export function saveUpgradeRequest(req: PremiumUpgradeRequest): void {
  const all = getUpgradeRequests();
  const idx = all.findIndex((r) => r.id === req.id);
  if (idx >= 0) {
    all[idx] = req;
  } else {
    // Replace a prior rejected request instead of stacking duplicates per user.
    const rejectedIdx = all.findIndex(
      (r) => r.userId === req.userId && r.status === "rejected"
    );
    if (rejectedIdx >= 0) {
      all[rejectedIdx] = req;
    } else {
      all.unshift(req);
    }
  }
  writeJson(UPGRADE_REQUESTS_KEY, all);
}

export function updateUpgradeRequest(
  id: string,
  updates: Partial<PremiumUpgradeRequest>
): void {
  const all = getUpgradeRequests();
  writeJson(
    UPGRADE_REQUESTS_KEY,
    all.map((r) => (r.id === id ? { ...r, ...updates } : r))
  );
}

export function getUpgradeRequestForUser(
  userId: string
): PremiumUpgradeRequest | undefined {
  const userRequests = getUpgradeRequests().filter((r) => r.userId === userId);
  if (userRequests.length === 0) return undefined;

  const statusPriority: Record<PremiumUpgradeRequest["status"], number> = {
    pending: 0,
    rejected: 1,
    approved: 2,
  };

  return [...userRequests].sort((a, b) => {
    const priorityDiff = statusPriority[a.status] - statusPriority[b.status];
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
  })[0];
}

// ─── Pending Premium Investments ──────────────────────────────────────────────

export function getPendingPremiumInvestments(): PendingPremiumInvestment[] {
  return readJson<PendingPremiumInvestment[]>(PENDING_INVESTMENTS_KEY, []);
}

export function savePendingPremiumInvestment(
  inv: PendingPremiumInvestment
): void {
  const all = getPendingPremiumInvestments();
  const idx = all.findIndex((i) => i.id === inv.id);
  if (idx >= 0) {
    all[idx] = inv;
  } else {
    all.unshift(inv);
  }
  writeJson(PENDING_INVESTMENTS_KEY, all);
}

export function updatePendingPremiumInvestment(
  id: string,
  updates: Partial<PendingPremiumInvestment>
): void {
  const all = getPendingPremiumInvestments();
  writeJson(
    PENDING_INVESTMENTS_KEY,
    all.map((i) => (i.id === id ? { ...i, ...updates } : i))
  );
}

export function getPendingInvestmentsForProperty(
  propertyId: string
): PendingPremiumInvestment[] {
  return getPendingPremiumInvestments().filter(
    (i) => i.propertyId === propertyId
  );
}

export function getPendingInvestmentsForUser(
  userId: string
): PendingPremiumInvestment[] {
  return getPendingPremiumInvestments().filter((i) => i.userId === userId);
}

// ─── Premium Property Overrides ───────────────────────────────────────────────

export function getPremiumPropertyOverrides(): PremiumPropertyOverride[] {
  return readJson<PremiumPropertyOverride[]>(PROPERTY_OVERRIDES_KEY, []);
}

export function getPremiumPropertyOverride(
  propertyId: string
): PremiumPropertyOverride | undefined {
  return getPremiumPropertyOverrides().find((o) => o.propertyId === propertyId);
}

export function setPremiumPropertyOverride(
  override: PremiumPropertyOverride
): void {
  const all = getPremiumPropertyOverrides();
  const idx = all.findIndex((o) => o.propertyId === override.propertyId);
  if (idx >= 0) {
    all[idx] = override;
  } else {
    all.push(override);
  }
  writeJson(PROPERTY_OVERRIDES_KEY, all);
}

// ─── Tier Overrides (admin can upgrade a user's tier) ─────────────────────────

export type TierOverrides = Record<string, UserTier>;

export function getTierOverrides(): TierOverrides {
  return readJson<TierOverrides>(TIER_OVERRIDES_KEY, {});
}

export function setTierOverride(userId: string, tier: UserTier): void {
  const all = getTierOverrides();
  all[userId] = tier;
  writeJson(TIER_OVERRIDES_KEY, all);
}

export function getTierOverrideForUser(userId: string): UserTier | undefined {
  return getTierOverrides()[userId];
}
