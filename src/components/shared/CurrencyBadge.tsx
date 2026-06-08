import { Badge } from "@/components/ui/badge";
import { getCurrencyName, type PropertyCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";

interface CurrencyBadgeProps {
  currency: PropertyCurrency;
  className?: string;
}

export function CurrencyBadge({ currency, className }: CurrencyBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[10px] font-semibold uppercase tracking-wide",
        currency === "USD"
          ? "border-blue-200 bg-blue-50 text-blue-700"
          : "border-emerald-200 bg-emerald-50 text-emerald-700",
        className
      )}
    >
      {getCurrencyName(currency)}
    </Badge>
  );
}
