import { formatCurrency, type PropertyCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";

interface FundsProgressProps {
  amount: number;
  confirmed: number;
  inReview: number;
  currency: PropertyCurrency;
  /** Muestra la leyenda con montos. */
  detailed?: boolean;
  className?: string;
}

/**
 * Barra de aporte: confirmado (sólido) + en conciliación (rayado) + pendiente.
 * Separa "dinero que ya está en custodia" de "dinero que dijiste que enviaste".
 */
export function FundsProgress({
  amount,
  confirmed,
  inReview,
  currency,
  detailed = false,
  className,
}: FundsProgressProps) {
  const pending = Math.max(0, amount - confirmed - inReview);
  const pct = (n: number) => (amount ? Math.min(100, (n / amount) * 100) : 0);
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div
        className="flex h-2 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-label="Aporte confirmado"
        aria-valuemin={0}
        aria-valuemax={amount}
        aria-valuenow={confirmed}
        aria-valuetext={`${formatCurrency(confirmed, currency)} de ${formatCurrency(amount, currency)} confirmados`}
      >
        <div className="h-full bg-primary transition-[width] duration-500" style={{ width: `${pct(confirmed)}%` }} />
        <div
          className="h-full bg-[repeating-linear-gradient(135deg,var(--primary)_0_4px,transparent_4px_8px)] opacity-45 transition-[width] duration-500"
          style={{ width: `${pct(inReview)}%` }}
        />
      </div>
      {detailed && (
        <dl className="grid grid-cols-3 gap-2 text-xs">
          <div>
            <dt className="flex items-center gap-1.5 text-muted-foreground">
              <span aria-hidden className="size-2 rounded-full bg-primary" /> Confirmado
            </dt>
            <dd className="mt-0.5 font-semibold tabular-nums text-foreground">{formatCurrency(confirmed, currency)}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-muted-foreground">
              <span aria-hidden className="size-2 rounded-full bg-primary/45" /> En conciliación
            </dt>
            <dd className="mt-0.5 font-semibold tabular-nums text-foreground">{formatCurrency(inReview, currency)}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-muted-foreground">
              <span aria-hidden className="size-2 rounded-full bg-muted-foreground/30" /> Pendiente
            </dt>
            <dd className="mt-0.5 font-semibold tabular-nums text-foreground">{formatCurrency(pending, currency)}</dd>
          </div>
        </dl>
      )}
    </div>
  );
}
