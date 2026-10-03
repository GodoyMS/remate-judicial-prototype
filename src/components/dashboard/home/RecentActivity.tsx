import Link from "next/link";
import {
  ArrowRight,
  Crown,
  Gavel,
  Scale,
  Sparkles,
  TrendingUp,
  Wallet,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { CATEGORY_META, type AppNotification, type NotificationCategory } from "@/lib/dashboard/notifications";

const CATEGORY_ICONS: Record<NotificationCategory, LucideIcon> = {
  investment: TrendingUp,
  auction: Gavel,
  payment: Wallet,
  legal: Scale,
  system: Sparkles,
  alert: Zap,
  premium: Crown,
};

interface RecentActivityProps {
  items: AppNotification[];
}

/** 5. Actividad reciente: línea de tiempo compacta de lo último que pasó. */
export function RecentActivity({ items }: RecentActivityProps) {
  return (
    <section
      aria-labelledby="home-activity"
      className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm flex flex-col"
    >
      <div className="flex items-center justify-between gap-3 mb-4">
        <h3 id="home-activity" className="dash-heading text-foreground">
          Actividad reciente
        </h3>
        <Link
          href="/dashboard/notifications"
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 -mr-2 text-sm font-medium text-primary dark:text-accent-foreground hover:bg-primary/5 transition-colors"
        >
          Ver todas
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="dash-body text-muted-foreground py-6 text-center">Aún no hay actividad.</p>
      ) : (
        <ol className="relative flex flex-col">
          {items.map((n, i) => {
            const Icon = CATEGORY_ICONS[n.category];
            const isLast = i === items.length - 1;
            return (
              <li key={n.id} className="relative flex gap-3">
                {/* Riel de la línea de tiempo */}
                <div className="relative flex flex-col items-center shrink-0">
                  <span className="relative z-10 size-8 rounded-full bg-primary/8 text-primary dark:bg-accent dark:text-accent-foreground ring-4 ring-card flex items-center justify-center">
                    <Icon className="size-3.5" />
                  </span>
                  {!isLast && <span aria-hidden className="w-px flex-1 bg-border" />}
                </div>
                <Link
                  href={n.href ?? "/dashboard/notifications"}
                  className="group flex-1 min-w-0 flex items-start justify-between gap-3 rounded-xl -mt-1 mb-2 px-2 py-1.5 hover:bg-muted/60 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-primary dark:text-accent-foreground">
                      {CATEGORY_META[n.category].label}
                    </p>
                    <p className="text-sm font-medium text-foreground mt-0.5 truncate">{n.title}</p>
                    <p className="dash-caption font-normal text-muted-foreground line-clamp-1 mt-0.5">
                      {n.description}
                    </p>
                  </div>
                  <span className="text-[11px] text-muted-foreground whitespace-nowrap shrink-0 mt-0.5">
                    {n.timeAgo}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
