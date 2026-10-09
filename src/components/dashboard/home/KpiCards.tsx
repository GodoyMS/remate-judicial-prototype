import { Building2, TrendingUp, Wallet, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface KpiItem {
  label: string;
  value: string;
  caption: string;
  icon: LucideIcon;
}

interface KpiCardsProps {
  totalInvested: string;
  inProgress: { count: number; breakdown: string };
  realizedGains: string;
  lastUpdated: string | null;
}

/**
 * 2. KPIs principales. "Total invertido" es el dato ancla y va sobre
 * primary; los demás quedan en superficie neutra para no competir con él.
 */
export function KpiCards({ totalInvested, inProgress, realizedGains, lastUpdated }: KpiCardsProps) {
  const items: (KpiItem & { featured?: boolean })[] = [
    {
      label: "Total invertido",
      value: totalInvested,
      caption: "Capital aportado en todas tus inversiones",
      icon: Wallet,
      featured: true,
    },
    {
      label: "Inversiones en curso",
      value: String(inProgress.count),
      caption: inProgress.breakdown || "Sin inversiones en curso",
      icon: Building2,
      featured:true
    },
    {
      label: "Retornos generados",
      value: realizedGains,
      caption: "Solo ganancias realizadas, sin capital devuelto",
      icon: TrendingUp,
      featured:true
    },
  ];

  return (
    <section aria-label="Indicadores principales" className="flex flex-col gap-2">
      <div className="grid sm:grid-cols-3 gap-3">
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
              <p className="dash-display break-words">{item.value}</p>
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
