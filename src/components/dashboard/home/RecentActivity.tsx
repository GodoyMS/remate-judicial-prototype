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

/**
 * 5. Actividad reciente: línea de tiempo vertical sobre un panel tipo
 * overlay oscuro translúcido (no negro puro), legible en ambos temas.
 */
export function RecentActivity({ items }: RecentActivityProps) {
  return (
    <section
      aria-labelledby="home-activity"
      className="rounded-3xl bg-neutral-950/80 text-white ring-1 ring-white/10 backdrop-blur-sm p-5 sm:p-6 shadow-lg flex flex-col"
    >
      <div className="flex items-center justify-between gap-3 mb-5">
        <h3 id="home-activity" className="text-lg font-semibold tracking-tight">
          Actividad reciente
        </h3>
        <Link
          href="/dashboard/notifications"
          className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20 transition-colors"
        >
          Ver todas
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-white/60 py-6 text-center">Aún no hay actividad.</p>
      ) : (
        <ol className="relative">
          {/* Riel continuo de la línea de tiempo */}
          <span aria-hidden className="absolute left-[15px] top-4 bottom-4 w-px bg-white/15" />
          {items.map((n) => {
            const Icon = CATEGORY_ICONS[n.category];
            return (
              <li key={n.id} className="relative">
                <Link
                  href={n.href ?? "/dashboard/notifications"}
                  className="group flex items-start gap-4 rounded-2xl py-3 pr-2 -mr-2 transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:bg-white/10"
                >
                  <span className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full bg-neutral-900 ring-1 ring-white/20 text-white/80 group-hover:text-white group-hover:ring-white/40 transition-colors">
                    <Icon className="size-3.5" />
                  </span>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="text-sm font-semibold text-white truncate">{n.title}</p>
                      <time className="text-[11px] text-white/50 whitespace-nowrap shrink-0 tabular-nums">
                        {n.timeAgo}
                      </time>
                    </div>
                    <p className="text-[13px] text-white/65 line-clamp-1 mt-0.5">{n.description}</p>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-white/40 mt-1">
                      {CATEGORY_META[n.category].label}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
