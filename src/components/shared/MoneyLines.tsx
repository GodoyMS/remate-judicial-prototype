import { formatCurrency, type PropertyCurrency } from "@/lib/currency";

/**
 * Montos por moneda, uno por línea. Soles y dólares nunca se suman ni se
 * concatenan en una sola cifra sin conversión explícita (auditoría Premium).
 */
export function MoneyLines({
  values,
  empty = "—",
}: {
  values: Partial<Record<PropertyCurrency, number>>;
  empty?: string;
}) {
  const entries = (["PEN", "USD"] as PropertyCurrency[]).filter((c) => values[c]);
  if (entries.length === 0) return <>{empty}</>;
  return (
    <>
      {entries.map((c) => (
        <span key={c} className="block">
          {formatCurrency(values[c]!, c)}
        </span>
      ))}
    </>
  );
}
