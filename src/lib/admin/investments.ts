import type { InvestmentStatus, PaymentMethodId, PropertyInvestment } from "./types";

export const PAYMENT_METHOD_LABELS: Record<PaymentMethodId, string> = {
  card: "Tarjeta débito / crédito",
  yape: "Yape",
  transfer: "Transferencia bancaria",
  deposit: "Depósito en cuenta",
};

export type InvestmentTab = "confirmed" | "pending" | "rejected";

export function requiresPaymentVerification(method: PaymentMethodId): boolean {
  return method === "transfer" || method === "deposit";
}

export function getInvestmentTab(inv: PropertyInvestment): InvestmentTab {
  if (inv.status === "rejected") return "rejected";
  if (inv.status === "pending") return "pending";
  return "confirmed";
}

export function filterInvestmentsByTab(
  investments: PropertyInvestment[],
  tab: InvestmentTab
): PropertyInvestment[] {
  return investments.filter((inv) => getInvestmentTab(inv) === tab);
}

export function sumConfirmedAmount(investments: PropertyInvestment[]): number {
  return investments
    .filter((inv) => inv.status === "confirmed")
    .reduce((sum, inv) => sum + inv.amount, 0);
}

export function countUniqueInvestors(investments: PropertyInvestment[]): number {
  const confirmed = investments.filter((inv) => inv.status === "confirmed");
  return new Set(confirmed.map((i) => i.userId)).size;
}

export const INVESTMENT_STATUS_LABELS: Record<InvestmentStatus, string> = {
  confirmed: "Confirmada",
  pending: "Pendiente de verificación",
  rejected: "Rechazada",
};

export interface ConfirmedInvestmentsFilterState {
  transactionSearch: string;
  userIds: string[];
  paymentMethods: PaymentMethodId[];
  amountMin: number;
  amountMax: number;
}

export function getTransactionNumber(inv: PropertyInvestment): string {
  if (inv.transferNumber) return inv.transferNumber;
  if (inv.operationNumber) return inv.operationNumber;
  if (inv.yapeApprovalCode) return inv.yapeApprovalCode;
  if (inv.voucherNumber) return inv.voucherNumber;
  if (inv.cardLastFour) return `TARJ-${inv.cardLastFour}`;
  return inv.id.toUpperCase();
}

export function getConfirmedAmountBounds(investments: PropertyInvestment[]): {
  min: number;
  max: number;
} {
  if (investments.length === 0) return { min: 500, max: 50000 };
  const amounts = investments.map((i) => i.amount);
  return { min: Math.min(...amounts), max: Math.max(...amounts) };
}

export function createDefaultConfirmedFilters(
  bounds: { min: number; max: number }
): ConfirmedInvestmentsFilterState {
  return {
    transactionSearch: "",
    userIds: [],
    paymentMethods: [],
    amountMin: bounds.min,
    amountMax: bounds.max,
  };
}

export function applyConfirmedFilters(
  investments: PropertyInvestment[],
  filters: ConfirmedInvestmentsFilterState,
  bounds: { min: number; max: number }
): PropertyInvestment[] {
  const query = filters.transactionSearch.trim().toLowerCase();

  return investments.filter((inv) => {
    if (query && !getTransactionNumber(inv).toLowerCase().includes(query)) {
      return false;
    }
    if (filters.userIds.length > 0 && !filters.userIds.includes(inv.userId)) {
      return false;
    }
    if (
      filters.paymentMethods.length > 0 &&
      !filters.paymentMethods.includes(inv.paymentMethod)
    ) {
      return false;
    }
    const amountFiltered =
      filters.amountMin !== bounds.min || filters.amountMax !== bounds.max;
    if (amountFiltered && (inv.amount < filters.amountMin || inv.amount > filters.amountMax)) {
      return false;
    }
    return true;
  });
}

export function countConfirmedActiveFilters(
  filters: ConfirmedInvestmentsFilterState,
  bounds: { min: number; max: number }
): number {
  let count = 0;
  if (filters.transactionSearch.trim()) count += 1;
  if (filters.userIds.length > 0) count += 1;
  if (filters.paymentMethods.length > 0) count += 1;
  if (filters.amountMin !== bounds.min || filters.amountMax !== bounds.max) count += 1;
  return count;
}
