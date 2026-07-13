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
          ? "border-info/20 bg-info/10 text-info"
          : "border-success/20 bg-success/10 text-success",
        className
      )}
    >
      {getCurrencyName(currency)}
    </Badge>
  );
}
