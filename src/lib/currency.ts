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

/* ─────────────────────────────────────────────────────────────────────────
   Display standard for money and rates (audit RM-016)

   The landing mixed hand-typed strings ("S/ 280,000", "S/ 165K", "S/ 48M+")
   with `Intl`-formatted values, so the same kind of number looked different
   from one block to the next. Every monetary or percentage value rendered
   on a marketing surface must go through one of the helpers below.

   Rules:
   - symbol first, then a non-breaking space, then the amount: `S/ 1,500`
   - thousands separated with `,`; no decimals unless the value needs them
   - abbreviations use uppercase K / M with a non-breaking space: `S/ 48 M`
   - percentages use no space before `%`: `22%`
   ───────────────────────────────────────────────────────────────────────── */

/** Non-breaking space — keeps the symbol glued to its amount on wrap. */
const NBSP = " ";

/** `S/ 1,500` — the canonical exact form. */
export function formatMoney(
  amount: number,
  currency: PropertyCurrency = "PEN"
): string {
  const digits = new Intl.NumberFormat("es-PE", {
    maximumFractionDigits: 0,
  }).format(amount);
  return `${getCurrencySymbol(currency)}${NBSP}${digits}`;
}

/** `S/ 48 M` — for headline figures where precision is not the point. */
export function formatMoneyCompact(
  amount: number,
  currency: PropertyCurrency = "PEN"
): string {
  const symbol = getCurrencySymbol(currency);
  const abs = Math.abs(amount);
  if (abs >= 1_000_000) {
    const value = trimZero(amount / 1_000_000);
    return `${symbol}${NBSP}${value}${NBSP}M`;
  }
  if (abs >= 1_000) {
    const value = trimZero(amount / 1_000);
    return `${symbol}${NBSP}${value}${NBSP}K`;
  }
  return formatMoney(amount, currency);
}

/** `22%` — percentages never carry a space before the sign. */
export function formatPercent(value: number, fractionDigits = 0): string {
  return `${value.toFixed(fractionDigits).replace(".", ",")}%`;
}

/** One decimal at most, and no trailing `,0`. */
function trimZero(value: number): string {
  return value
    .toFixed(1)
    .replace(/\.0$/, "")
    .replace(".", ",");
}
