export type PropertyCurrency = "PEN" | "USD";

export const CURRENCY_OPTIONS: {
  value: PropertyCurrency;
  label: string;
  symbol: string;
}[] = [
  { value: "PEN", label: "Soles (PEN)", symbol: "S/" },
  { value: "USD", label: "Dólares (USD)", symbol: "US$" },
];

export function formatCurrency(
  amount: number,
  currency: PropertyCurrency = "PEN"
): string {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getCurrencySymbol(currency: PropertyCurrency): string {
  return currency === "USD" ? "US$" : "S/";
}

export function getCurrencyLabel(currency: PropertyCurrency): string {
  return currency === "USD" ? "dólares" : "soles";
}

export function getCurrencyName(currency: PropertyCurrency): string {
  return currency === "USD" ? "Dólares" : "Soles";
}

export function formatMixedCurrencyTotals(
  amounts: Partial<Record<PropertyCurrency, number>>
): string {
  const parts: string[] = [];
  if (amounts.PEN) parts.push(formatCurrency(amounts.PEN, "PEN"));
  if (amounts.USD) parts.push(formatCurrency(amounts.USD, "USD"));
  return parts.length > 0 ? parts.join(" + ") : formatCurrency(0, "PEN");
}

export function sumByCurrency<T extends { amount: number; currency: PropertyCurrency }>(
  items: T[]
): Partial<Record<PropertyCurrency, number>> {
  return items.reduce<Partial<Record<PropertyCurrency, number>>>((acc, item) => {
    acc[item.currency] = (acc[item.currency] ?? 0) + item.amount;
    return acc;
  }, {});
}
