import {
  formatCurrency as formatCurrencyAmount,
  type PropertyCurrency,
} from "@/lib/currency";

export function formatCurrency(
  amount: number,
  currency: PropertyCurrency = "PEN"
): string {
  return formatCurrencyAmount(amount, currency);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("es-PE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: string): string {
  return new Intl.DateTimeFormat("es-PE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatPercent(value: number): string {
  return `${value}%`;
}
