import type { PropertyCurrency } from "@/lib/currency";
import { sumByCurrency } from "@/lib/currency";
import { PAYMENT_METHOD_LABELS } from "./investments";
import type {
  AdminProperty,
  AdminUser,
  InvestmentStatus,
  PaymentMethodId,
  PropertyInvestment,
  PropertyStatus,
  UserTier,
} from "./types";

export type AnalyticsDatePreset = "7d" | "30d" | "90d" | "6m" | "1y" | "all";

export interface AnalyticsFilterState {
  datePreset: AnalyticsDatePreset;
  regions: string[];
  currencies: PropertyCurrency[];
  propertyStatuses: PropertyStatus[];
  investmentStatuses: InvestmentStatus[];
}

export const defaultAnalyticsFilters: AnalyticsFilterState = {
  datePreset: "6m",
  regions: [],
  currencies: [],
  propertyStatuses: [],
  investmentStatuses: [],
};

export function countAnalyticsActiveFilters(filters: AnalyticsFilterState): number {
  return [
    filters.datePreset !== "6m",
    filters.regions.length > 0,
    filters.currencies.length > 0,
    filters.propertyStatuses.length > 0,
    filters.investmentStatuses.length > 0,
  ].filter(Boolean).length;
}

const MONTH_LABELS = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
] as const;

const REFERENCE_DATE = new Date("2026-06-08T12:00:00");

function getDateRangeFromPreset(preset: AnalyticsDatePreset): { from: Date | null; to: Date } {
  const to = REFERENCE_DATE;
  if (preset === "all") return { from: null, to };

  const from = new Date(to);
  switch (preset) {
    case "7d":
      from.setDate(from.getDate() - 7);
      break;
    case "30d":
      from.setDate(from.getDate() - 30);
      break;
    case "90d":
      from.setDate(from.getDate() - 90);
      break;
    case "6m":
      from.setMonth(from.getMonth() - 6);
      break;
    case "1y":
      from.setFullYear(from.getFullYear() - 1);
      break;
  }
  return { from, to };
}

function isWithinRange(dateStr: string, from: Date | null, to: Date): boolean {
  const date = new Date(dateStr);
  if (from && date < from) return false;
  if (date > to) return false;
  return true;
}

export function filterInvestmentsForAnalytics(
  investments: PropertyInvestment[],
  properties: AdminProperty[],
  filters: AnalyticsFilterState
): PropertyInvestment[] {
  const { from, to } = getDateRangeFromPreset(filters.datePreset);
  const propertyMap = new Map(properties.map((p) => [p.id, p]));

  return investments.filter((inv) => {
    const property = propertyMap.get(inv.propertyId);
    if (!property) return false;

    const dateToCheck = inv.confirmedAt ?? inv.submittedAt;
    if (!isWithinRange(dateToCheck, from, to)) return false;

    if (filters.regions.length > 0 && !filters.regions.includes(property.region)) {
      return false;
    }
    if (filters.currencies.length > 0 && !filters.currencies.includes(inv.currency)) {
      return false;
    }
    if (
      filters.propertyStatuses.length > 0 &&
      !filters.propertyStatuses.includes(property.status)
    ) {
      return false;
    }
    if (
      filters.investmentStatuses.length > 0 &&
      !filters.investmentStatuses.includes(inv.status)
    ) {
      return false;
    }
    return true;
  });
}

export function filterPropertiesForAnalytics(
  properties: AdminProperty[],
  filters: AnalyticsFilterState
): AdminProperty[] {
  return properties.filter((p) => {
    if (filters.regions.length > 0 && !filters.regions.includes(p.region)) return false;
    if (filters.currencies.length > 0 && !filters.currencies.includes(p.currency)) return false;
    if (
      filters.propertyStatuses.length > 0 &&
      !filters.propertyStatuses.includes(p.status)
    ) {
      return false;
    }
    return true;
  });
}

export interface AnalyticsKpis {
  totalInvested: Partial<Record<PropertyCurrency, number>>;
  confirmedCount: number;
  pendingCount: number;
  rejectedCount: number;
  uniqueInvestors: number;
  avgInvestment: number;
  conversionRate: number;
  totalProperties: number;
  fundedProperties: number;
  avgFundingProgress: number;
  avgRoi: number;
  premiumUsers: number;
  standardUsers: number;
  totalGains: number;
  investmentGrowth: number;
  avgInvestmentsPerUser: number;
}

export function computeAnalyticsKpis(
  investments: PropertyInvestment[],
  properties: AdminProperty[],
  users: AdminUser[]
): AnalyticsKpis {
  const confirmed = investments.filter((i) => i.status === "confirmed");
  const pending = investments.filter((i) => i.status === "pending");
  const rejected = investments.filter((i) => i.status === "rejected");
  const totalSubmitted = investments.length;

  const totalInvested = sumByCurrency(confirmed);
  const uniqueInvestors = new Set(confirmed.map((i) => i.userId)).size;
  const confirmedTotal = confirmed.reduce((s, i) => s + i.amount, 0);

  const fundedProperties = properties.filter((p) => p.raisedAmount > 0).length;
  const avgFundingProgress =
    properties.length > 0
      ? properties.reduce((s, p) => s + (p.raisedAmount / p.totalInvestment) * 100, 0) /
        properties.length
      : 0;

  const publishedWithRoi = properties.filter((p) => p.status !== "draft");
  const avgRoi =
    publishedWithRoi.length > 0
      ? publishedWithRoi.reduce((s, p) => s + p.roi, 0) / publishedWithRoi.length
      : 0;

  const premiumUsers = users.filter((u) => u.tier === "premium" && u.status === "active").length;
  const standardUsers = users.filter((u) => u.tier === "standard" && u.status === "active").length;

  const investorUserIds = new Set(confirmed.map((i) => i.userId));
  const totalGains = users
    .filter((u) => investorUserIds.has(u.id))
    .reduce((s, u) => s + u.totalGains, 0);

  const { current, previous } = getMonthlyInvestmentComparison(investments);
  const investmentGrowth =
    previous > 0 ? ((current - previous) / previous) * 100 : current > 0 ? 100 : 0;

  return {
    totalInvested,
    confirmedCount: confirmed.length,
    pendingCount: pending.length,
    rejectedCount: rejected.length,
    uniqueInvestors,
    avgInvestment: uniqueInvestors > 0 ? confirmedTotal / uniqueInvestors : 0,
    conversionRate: totalSubmitted > 0 ? (confirmed.length / totalSubmitted) * 100 : 0,
    totalProperties: properties.length,
    fundedProperties,
    avgFundingProgress,
    avgRoi,
    premiumUsers,
    standardUsers,
    totalGains,
    investmentGrowth,
    avgInvestmentsPerUser:
      uniqueInvestors > 0 ? confirmed.length / uniqueInvestors : 0,
  };
}

function getMonthlyInvestmentComparison(investments: PropertyInvestment[]): {
  current: number;
  previous: number;
} {
  const confirmed = investments.filter((i) => i.status === "confirmed");
  const currentMonth = REFERENCE_DATE.getMonth();
  const currentYear = REFERENCE_DATE.getFullYear();

  let current = 0;
  let previous = 0;

  for (const inv of confirmed) {
    const date = new Date(inv.confirmedAt ?? inv.submittedAt);
    const amount = inv.amount;
    if (date.getFullYear() === currentYear && date.getMonth() === currentMonth) {
      current += amount;
    } else if (
      date.getFullYear() === currentYear &&
      date.getMonth() === currentMonth - 1
    ) {
      previous += amount;
    } else if (currentMonth === 0 && date.getFullYear() === currentYear - 1 && date.getMonth() === 11) {
      previous += amount;
    }
  }

  return { current, previous };
}

export interface MonthlyInvestmentPoint {
  month: string;
  pen: number;
  usd: number;
  total: number;
  count: number;
}

export function groupInvestmentsByMonth(
  investments: PropertyInvestment[],
  monthsBack = 6
): MonthlyInvestmentPoint[] {
  const confirmed = investments.filter((i) => i.status === "confirmed");
  const points: MonthlyInvestmentPoint[] = [];

  for (let i = monthsBack - 1; i >= 0; i--) {
    const date = new Date(REFERENCE_DATE);
    date.setMonth(date.getMonth() - i);
    const month = date.getMonth();
    const year = date.getFullYear();

    let pen = 0;
    let usd = 0;
    let count = 0;

    for (const inv of confirmed) {
      const invDate = new Date(inv.confirmedAt ?? inv.submittedAt);
      if (invDate.getMonth() === month && invDate.getFullYear() === year) {
        if (inv.currency === "USD") usd += inv.amount;
        else pen += inv.amount;
        count += 1;
      }
    }

    points.push({
      month: MONTH_LABELS[month],
      pen,
      usd,
      total: pen + usd,
      count,
    });
  }

  return points;
}

export interface StatusDistributionPoint {
  status: InvestmentStatus;
  label: string;
  count: number;
  amount: Partial<Record<PropertyCurrency, number>>;
}

export function getInvestmentStatusDistribution(
  investments: PropertyInvestment[]
): StatusDistributionPoint[] {
  const statuses: InvestmentStatus[] = ["confirmed", "pending", "rejected"];
  const labels: Record<InvestmentStatus, string> = {
    confirmed: "Confirmadas",
    pending: "Pendientes",
    rejected: "Rechazadas",
  };

  return statuses.map((status) => {
    const filtered = investments.filter((i) => i.status === status);
    return {
      status,
      label: labels[status],
      count: filtered.length,
      amount: sumByCurrency(filtered),
    };
  });
}

export interface PaymentMethodPoint {
  method: PaymentMethodId;
  label: string;
  count: number;
  amount: number;
}

export function getPaymentMethodDistribution(
  investments: PropertyInvestment[]
): PaymentMethodPoint[] {
  const confirmed = investments.filter((i) => i.status === "confirmed");
  const methods: PaymentMethodId[] = ["card", "yape", "transfer", "deposit"];

  return methods
    .map((method) => {
      const filtered = confirmed.filter((i) => i.paymentMethod === method);
      return {
        method,
        label: PAYMENT_METHOD_LABELS[method],
        count: filtered.length,
        amount: filtered.reduce((s, i) => s + i.amount, 0),
      };
    })
    .filter((p) => p.count > 0);
}

export interface RegionDistributionPoint {
  region: string;
  count: number;
  amount: number;
  properties: number;
}

export function getRegionalDistribution(
  investments: PropertyInvestment[],
  properties: AdminProperty[]
): RegionDistributionPoint[] {
  const confirmed = investments.filter((i) => i.status === "confirmed");
  const propertyMap = new Map(properties.map((p) => [p.id, p]));
  const regionData = new Map<string, { amount: number; count: number; propertyIds: Set<string> }>();

  for (const inv of confirmed) {
    const property = propertyMap.get(inv.propertyId);
    if (!property) continue;
    const existing = regionData.get(property.region) ?? {
      amount: 0,
      count: 0,
      propertyIds: new Set<string>(),
    };
    existing.amount += inv.amount;
    existing.count += 1;
    existing.propertyIds.add(property.id);
    regionData.set(property.region, existing);
  }

  return Array.from(regionData.entries())
    .map(([region, data]) => ({
      region,
      count: data.count,
      amount: data.amount,
      properties: data.propertyIds.size,
    }))
    .sort((a, b) => b.amount - a.amount);
}

export interface TopPropertyRow {
  id: string;
  title: string;
  district: string;
  region: string;
  raisedAmount: number;
  totalInvestment: number;
  progress: number;
  investorsCount: number;
  roi: number;
  currency: PropertyCurrency;
  status: PropertyStatus;
  image: string;
  investmentVolume: number;
}

export function getTopProperties(
  properties: AdminProperty[],
  investments: PropertyInvestment[],
  limit = 5
): TopPropertyRow[] {
  const confirmed = investments.filter((i) => i.status === "confirmed");
  const volumeByProperty = new Map<string, number>();

  for (const inv of confirmed) {
    volumeByProperty.set(
      inv.propertyId,
      (volumeByProperty.get(inv.propertyId) ?? 0) + inv.amount
    );
  }

  return properties
    .map((p) => ({
      id: p.id,
      title: p.title,
      district: p.district,
      region: p.region,
      raisedAmount: p.raisedAmount,
      totalInvestment: p.totalInvestment,
      progress: Math.round((p.raisedAmount / p.totalInvestment) * 100),
      investorsCount: p.investorsCount,
      roi: p.roi,
      currency: p.currency,
      status: p.status,
      image: p.image,
      investmentVolume: volumeByProperty.get(p.id) ?? 0,
    }))
    .sort((a, b) => b.investmentVolume - a.investmentVolume)
    .slice(0, limit);
}

export interface TopInvestorRow {
  userId: string;
  name: string;
  email: string;
  tier: UserTier;
  totalInvested: number;
  totalGains: number;
  investmentCount: number;
  propertiesCount: number;
  avgInvestment: number;
  gainsRate: number;
  lastInvestment: string;
  verified: boolean;
  status: AdminUser["status"];
}

export function getTopInvestors(
  investments: PropertyInvestment[],
  users: AdminUser[],
  limit = 8
): TopInvestorRow[] {
  const confirmed = investments.filter((i) => i.status === "confirmed");
  const userMap = new Map(users.map((u) => [u.id, u]));
  const investorStats = new Map<
    string,
    {
      totalInvested: number;
      investmentCount: number;
      propertyIds: Set<string>;
      lastInvestment: string;
    }
  >();

  for (const inv of confirmed) {
    const existing = investorStats.get(inv.userId) ?? {
      totalInvested: 0,
      investmentCount: 0,
      propertyIds: new Set<string>(),
      lastInvestment: inv.confirmedAt ?? inv.submittedAt,
    };
    existing.totalInvested += inv.amount;
    existing.investmentCount += 1;
    existing.propertyIds.add(inv.propertyId);
    const invDate = inv.confirmedAt ?? inv.submittedAt;
    if (new Date(invDate) > new Date(existing.lastInvestment)) {
      existing.lastInvestment = invDate;
    }
    investorStats.set(inv.userId, existing);
  }

  return Array.from(investorStats.entries())
    .map(([userId, stats]) => {
      const user = userMap.get(userId);
      return {
        userId,
        name: user?.name ?? "Usuario desconocido",
        email: user?.email ?? "",
        tier: user?.tier ?? "standard",
        totalInvested: stats.totalInvested,
        totalGains: user?.totalGains ?? 0,
        investmentCount: stats.investmentCount,
        propertiesCount: stats.propertyIds.size,
        avgInvestment: stats.investmentCount > 0 ? stats.totalInvested / stats.investmentCount : 0,
        gainsRate:
          stats.totalInvested > 0 ? ((user?.totalGains ?? 0) / stats.totalInvested) * 100 : 0,
        lastInvestment: stats.lastInvestment,
        verified: user?.verified ?? false,
        status: user?.status ?? "active",
      };
    })
    .sort((a, b) => b.totalInvested - a.totalInvested)
    .slice(0, limit);
}

export interface UserGrowthPoint {
  month: string;
  newUsers: number;
  cumulative: number;
}

export function getUserGrowthData(users: AdminUser[], monthsBack = 6): UserGrowthPoint[] {
  const points: UserGrowthPoint[] = [];
  let cumulative = 0;

  const usersBeforeRange = users.filter((u) => {
    const joined = new Date(u.joinedAt);
    const rangeStart = new Date(REFERENCE_DATE);
    rangeStart.setMonth(rangeStart.getMonth() - monthsBack);
    return joined < rangeStart;
  }).length;

  cumulative = usersBeforeRange;

  for (let i = monthsBack - 1; i >= 0; i--) {
    const date = new Date(REFERENCE_DATE);
    date.setMonth(date.getMonth() - i);
    const month = date.getMonth();
    const year = date.getFullYear();

    const newUsers = users.filter((u) => {
      const joined = new Date(u.joinedAt);
      return joined.getMonth() === month && joined.getFullYear() === year;
    }).length;

    cumulative += newUsers;
    points.push({
      month: MONTH_LABELS[month],
      newUsers,
      cumulative,
    });
  }

  return points;
}

export interface TierDistributionPoint {
  tier: UserTier;
  label: string;
  count: number;
  totalInvested: number;
}

export function getTierDistribution(
  users: AdminUser[],
  investments: PropertyInvestment[]
): TierDistributionPoint[] {
  const confirmed = investments.filter((i) => i.status === "confirmed");
  const investedByUser = new Map<string, number>();

  for (const inv of confirmed) {
    investedByUser.set(inv.userId, (investedByUser.get(inv.userId) ?? 0) + inv.amount);
  }

  const tiers: UserTier[] = ["premium", "standard"];
  const labels: Record<UserTier, string> = {
    premium: "Premium",
    standard: "Standard",
  };

  return tiers.map((tier) => {
    const tierUsers = users.filter((u) => u.tier === tier && u.status === "active");
    const totalInvested = tierUsers.reduce(
      (s, u) => s + (investedByUser.get(u.id) ?? u.totalInvested),
      0
    );
    return {
      tier,
      label: labels[tier],
      count: tierUsers.length,
      totalInvested,
    };
  });
}

export interface FunnelStep {
  step: string;
  count: number;
  percentage: number;
}

export function getInvestmentFunnel(investments: PropertyInvestment[]): FunnelStep[] {
  const total = investments.length;
  const confirmed = investments.filter((i) => i.status === "confirmed").length;
  const rejected = investments.filter((i) => i.status === "rejected").length;
  // Processed = ya pasaron por verificación (confirmadas + rechazadas);
  // las pendientes aún no completan el embudo.
  const processed = confirmed + rejected;

  return [
    {
      step: "Solicitudes enviadas",
      count: total,
      percentage: 100,
    },
    {
      step: "Procesadas",
      count: processed,
      percentage: total > 0 ? (processed / total) * 100 : 0,
    },
    {
      step: "Confirmadas",
      count: confirmed,
      percentage: total > 0 ? (confirmed / total) * 100 : 0,
    },
  ];
}

const PRESET_MONTHS_BACK: Record<AnalyticsDatePreset, number> = {
  "7d": 2,
  "30d": 2,
  "90d": 4,
  "6m": 6,
  "1y": 12,
  all: 12,
};

export function getMonthsBackForPreset(preset: AnalyticsDatePreset): number {
  return PRESET_MONTHS_BACK[preset];
}

export interface PremiumCandidate {
  user: AdminUser;
  score: number;
  rank: number;
  reasons: string[];
  metrics: {
    totalInvested: number;
    investmentCount: number;
    propertiesCount: number;
    avgInvestment: number;
    totalGains: number;
    gainsRate: number;
    daysActive: number;
  };
}

export function getPremiumSuggestions(
  investments: PropertyInvestment[],
  users: AdminUser[],
  limit = 5
): PremiumCandidate[] {
  const confirmed = investments.filter((i) => i.status === "confirmed");
  const eligibleUsers = users.filter((u) => u.tier === "standard" && u.status === "active");

  const investorStats = new Map<
    string,
    {
      totalInvested: number;
      investmentCount: number;
      propertyIds: Set<string>;
    }
  >();

  for (const inv of confirmed) {
    const existing = investorStats.get(inv.userId) ?? {
      totalInvested: 0,
      investmentCount: 0,
      propertyIds: new Set<string>(),
    };
    existing.totalInvested += inv.amount;
    existing.investmentCount += 1;
    existing.propertyIds.add(inv.propertyId);
    investorStats.set(inv.userId, existing);
  }

  const maxInvested = Math.max(
    ...eligibleUsers.map((u) => investorStats.get(u.id)?.totalInvested ?? u.totalInvested),
    1
  );

  const candidates: PremiumCandidate[] = eligibleUsers
    .map((user) => {
      const stats = investorStats.get(user.id) ?? {
        totalInvested: user.totalInvested,
        investmentCount: 0,
        propertyIds: new Set<string>(),
      };

      const reasons: string[] = [];
      let score = 0;

      const investedScore = (stats.totalInvested / maxInvested) * 35;
      score += investedScore;
      if (stats.totalInvested >= 15000) {
        reasons.push(`Capital invertido alto (${formatAmountShort(stats.totalInvested)})`);
      } else if (stats.totalInvested >= 8000) {
        reasons.push(`Inversor activo con ${formatAmountShort(stats.totalInvested)} invertidos`);
      }

      if (stats.investmentCount >= 3) {
        score += 20;
        reasons.push(`${stats.investmentCount} inversiones confirmadas`);
      } else if (stats.investmentCount >= 2) {
        score += 12;
        reasons.push("Inversor recurrente en la plataforma");
      }

      if (stats.propertyIds.size >= 2) {
        score += 15;
        reasons.push(`Diversificación en ${stats.propertyIds.size} propiedades`);
      }

      const gainsRate =
        stats.totalInvested > 0 ? (user.totalGains / stats.totalInvested) * 100 : 0;
      if (gainsRate >= 15) {
        score += 15;
        reasons.push(`Rendimiento del ${gainsRate.toFixed(1)}% sobre capital`);
      } else if (gainsRate >= 8) {
        score += 8;
        reasons.push("Ganancias consistentes en su portafolio");
      }

      if (user.verified) {
        score += 10;
        reasons.push("Identidad verificada (KYC completo)");
      }

      const joinedDate = new Date(user.joinedAt);
      const daysActive = Math.floor(
        (REFERENCE_DATE.getTime() - joinedDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysActive >= 180) {
        score += 10;
        reasons.push(`Usuario fiel — ${Math.floor(daysActive / 30)} meses en la plataforma`);
      } else if (daysActive >= 90) {
        score += 5;
      }

      const avgInvestment =
        stats.investmentCount > 0 ? stats.totalInvested / stats.investmentCount : 0;
      if (avgInvestment >= 5000) {
        score += 5;
        reasons.push(`Ticket promedio elevado (${formatAmountShort(avgInvestment)})`);
      }

      if (reasons.length === 0) {
        reasons.push("Perfil con potencial de crecimiento");
      }

      return {
        user,
        score: Math.round(Math.min(score, 100)),
        rank: 0,
        reasons: reasons.slice(0, 4),
        metrics: {
          totalInvested: stats.totalInvested,
          investmentCount: stats.investmentCount,
          propertiesCount: stats.propertyIds.size,
          avgInvestment,
          totalGains: user.totalGains,
          gainsRate,
          daysActive,
        },
      };
    })
    .filter((c) => c.score >= 25)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((c, i) => ({ ...c, rank: i + 1 }));

  return candidates;
}

export interface CurrencySplitPoint {
  currency: PropertyCurrency;
  label: string;
  amount: number;
  count: number;
  percentage: number;
}

export function getCurrencySplit(investments: PropertyInvestment[]): CurrencySplitPoint[] {
  const confirmed = investments.filter((i) => i.status === "confirmed");
  const totals = sumByCurrency(confirmed);
  const totalAmount = (totals.PEN ?? 0) + (totals.USD ?? 0);

  const currencies: PropertyCurrency[] = ["PEN", "USD"];
  const labels: Record<PropertyCurrency, string> = {
    PEN: "Soles (PEN)",
    USD: "Dólares (USD)",
  };

  return currencies
    .map((currency) => {
      const amount = totals[currency] ?? 0;
      const count = confirmed.filter((i) => i.currency === currency).length;
      return {
        currency,
        label: labels[currency],
        amount,
        count,
        percentage: totalAmount > 0 ? (amount / totalAmount) * 100 : 0,
      };
    })
    .filter((p) => p.amount > 0);
}

export interface DistrictHeatmapPoint {
  district: string;
  region: string;
  amount: number;
  count: number;
}

export function getDistrictHeatmap(
  investments: PropertyInvestment[],
  properties: AdminProperty[]
): DistrictHeatmapPoint[] {
  const confirmed = investments.filter((i) => i.status === "confirmed");
  const propertyMap = new Map(properties.map((p) => [p.id, p]));
  const districtData = new Map<string, { amount: number; count: number; region: string }>();

  for (const inv of confirmed) {
    const property = propertyMap.get(inv.propertyId);
    if (!property) continue;
    const key = property.district;
    const existing = districtData.get(key) ?? {
      amount: 0,
      count: 0,
      region: property.region,
    };
    existing.amount += inv.amount;
    existing.count += 1;
    districtData.set(key, existing);
  }

  return Array.from(districtData.entries())
    .map(([district, data]) => ({
      district,
      region: data.region,
      amount: data.amount,
      count: data.count,
    }))
    .sort((a, b) => b.amount - a.amount);
}

function formatAmountShort(amount: number): string {
  if (amount >= 1000) return `S/ ${(amount / 1000).toFixed(1)}k`;
  return `S/ ${amount.toLocaleString("es-PE")}`;
}

export const DATE_PRESET_LABELS: Record<AnalyticsDatePreset, string> = {
  "7d": "Últimos 7 días",
  "30d": "Últimos 30 días",
  "90d": "Últimos 90 días",
  "6m": "Últimos 6 meses",
  "1y": "Último año",
  all: "Todo el historial",
};
