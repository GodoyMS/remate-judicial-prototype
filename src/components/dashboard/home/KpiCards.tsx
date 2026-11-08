import type { ReactNode } from "react";
import { Building2, TrendingUp, Wallet, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface KpiItem {
  label: string;
  value: ReactNode;
  caption: string;
  icon: LucideIcon;
}

interface KpiCardsProps {
  totalInvested: ReactNode;
  inProgress: { count: number; breakdown: string };
  realizedGains: ReactNode;
  lastUpdated: string | null;
  /** Premium: mismas tarjetas, etiquetas de la operación individual. */
  premium?: boolean;
}

/**
 * 2. KPIs principales. "Total invertido" es el dato ancla y va sobre
 * primary; los demás quedan en superficie neutra para no competir con él.
 */
export function KpiCards({ totalInvested, inProgress, realizedGains, lastUpdated, premium }: KpiCardsProps) {
  const items: (KpiItem & { featured?: boolean })[] = [
    {
      label: premium ? "Capital comprometido" : "Total invertido",
      value: totalInvested,
      caption: premium ? "Estándar + Premium · separado por moneda" : "Capital aportado en todas tus inversiones",
      icon: Wallet,
      featured: true,
    },
    {
      label: premium ? "Operaciones activas" : "Inversiones en curso",
      value: String(inProgress.count),
      caption: inProgress.breakdown || "Sin inversiones en curso",
      icon: Building2,
      featured: true,
    },
    {
      label: premium ? "Retornos realizados" : "Retornos generados",
      value: realizedGains,
      caption: premium ? "Ganancias ya acreditadas, sin capital devuelto" : "Solo ganancias realizadas, sin capital devuelto",
      icon: TrendingUp,
      featured: true,
    },
  ];

  return (
    <section aria-label="Indicadores principales" className="flex flex-col gap-2">
      {/* Móvil: una sola tarjeta con tres filas. Tres tarjetas a ancho
          completo empujaban las acciones fuera de la primera pantalla. */}
      <dl className="divide-y divide-primary-foreground/15 rounded-2xl bg-primary px-4 text-primary-foreground shadow-md shadow-primary/20 sm:hidden">
        {items.map((item) => (
          <div key={item.label} className="flex items-start justify-between gap-4 py-3.5">
            <div className="min-w-0">
              <dt className="text-xs font-semibold text-primary-foreground/80">{item.label}</dt>
              <p className="mt-0.5 text-[11px] leading-snug text-primary-foreground/65">{item.caption}</p>
            </div>
            <dd className="shrink-0 text-right text-lg font-bold leading-tight tabular-nums">{item.value}</dd>
          </div>
        ))}
      </dl>
      <div className="hidden sm:grid sm:grid-cols-3 gap-3">
        {items.map((item) => (
          <div
            key={item.label}
            className={cn(
              "rounded-2xl p-5 flex flex-col gap-5",
              item.featured
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "border border-border/60 bg-card shadow-sm"
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
                  item.featured
                    ? "bg-primary-foreground text-primary"
                    : "bg-primary/8 text-primary dark:bg-accent dark:text-accent-foreground"
                )}
              >
                {item.label}
              </span>
              <span
                className={cn(
                  "size-9 rounded-xl flex items-center justify-center",
                  item.featured ? "bg-primary-foreground/15" : "bg-muted text-foreground/70"
                )}
              >
                <item.icon className="size-4" />
              </span>
            </div>
            <div>
              <div className="dash-display break-words">{item.value}</div>
              <p
                className={cn(
                  "dash-caption mt-2",
                  item.featured ? "text-primary-foreground/75" : "text-muted-foreground"
                )}
              >
                {item.caption}
              </p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-muted-foreground min-h-4">
        {lastUpdated ? `Información actualizada: ${lastUpdated}` : null}
      </p>
    </section>
  );
}
