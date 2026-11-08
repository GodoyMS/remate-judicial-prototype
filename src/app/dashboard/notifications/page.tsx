"use client";

import { Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { NotificationItem } from "@/components/dashboard/NotificationItem";
import { PageHero } from "@/components/dashboard/PageHero";
import { useNotifications } from "@/contexts/notifications-context";
import {
  NOTIFICATION_GROUP_LABELS,
  formatNotificationDate,
  notificationGroup,
  type AppNotification,
  type NotificationGroup,
} from "@/lib/dashboard/notifications";
import { toast } from "sonner";

type TypeFilter = "all" | NotificationGroup;
const TYPE_FILTERS: TypeFilter[] = ["all", "actions", "operations", "documents"];

function groupByDate(items: AppNotification[]) {
  const groups: Record<string, AppNotification[]> = {};
  for (const item of items) {
    const key = formatNotificationDate(item.timestamp);
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  }
  const order = ["Hoy", "Ayer", "Esta semana", "Anteriores"];
  return order
    .filter((k) => groups[k]?.length)
    .map((label) => ({ label, items: groups[label] }));
}

export default function NotificationsPage() {
  return (
    <Suspense>
      <NotificationsContent />
    </Suspense>
  );
}

function NotificationsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const typeParam = searchParams.get("type") as TypeFilter | null;
  const type: TypeFilter = typeParam && TYPE_FILTERS.includes(typeParam) ? typeParam : "all";
  const unreadOnly = searchParams.get("unread") === "1";
  const { notifications, unreadCount, markAllAsRead, toggleRead } =
    useNotifications();

  const setFilters = (next: { type?: TypeFilter; unread?: boolean }) => {
    const params = new URLSearchParams(searchParams.toString());
    const t = next.type ?? type;
    const u = next.unread ?? unreadOnly;
    if (t === "all") params.delete("type");
    else params.set("type", t);
    if (u) params.set("unread", "1");
    else params.delete("unread");
    router.replace(`/dashboard/notifications${params.size ? `?${params}` : ""}`, { scroll: false });
  };

  const counts = useMemo(() => {
    const c: Record<TypeFilter, number> = { all: 0, actions: 0, operations: 0, documents: 0 };
    notifications.forEach((n) => {
      if (unreadOnly && n.read) return;
      c.all++;
      c[notificationGroup(n)]++;
    });
    return c;
  }, [notifications, unreadOnly]);

  const filtered = notifications.filter(
    (n) => (type === "all" || notificationGroup(n) === type) && (!unreadOnly || !n.read)
  );
  const grouped = groupByDate(filtered);

  const handleMarkAll = () => {
    if (unreadCount === 0) {
      toast.info("No hay notificaciones pendientes");
      return;
    }
    markAllAsRead();
    toast.success("Todas marcadas como leídas");
  };

  return (
    <div className="w-full">
      <PageHero
        tone="inverse"
        icon={Bell}
        eyebrow="Centro de alertas"
        badge={
          unreadCount > 0 ? (
            <span className="rounded-full bg-primary text-primary-foreground px-2.5 py-0.5 text-[11px] font-semibold">
              {unreadCount} sin leer
            </span>
          ) : null
        }
        title="Notificaciones"
        description="Acciones pendientes, avances de tus operaciones y documentos nuevos."
        actions={
          <Button
            className="rounded-xl bg-background text-foreground hover:bg-background/90 shadow-sm disabled:opacity-60"
            onClick={handleMarkAll}
            disabled={unreadCount === 0}
          >
            <CheckCheck className="size-4 mr-2" />
            Marcar todo como leído
          </Button>
        }
      />

      <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div
            role="tablist"
            aria-label="Tipo de notificación"
            className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0 [scrollbar-width:none]"
          >
            {TYPE_FILTERS.map((t) => {
              const active = type === t;
              return (
                <button
                  key={t}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilters({ type: t })}
                  className={cn(
                    "inline-flex h-9 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  )}
                >
                  {t === "all" ? "Todas" : NOTIFICATION_GROUP_LABELS[t]}
                  <span className={cn("rounded-full px-1.5 text-xs tabular-nums", active ? "bg-primary-foreground/20" : "bg-muted text-foreground/70")}>
                    {counts[t]}
                  </span>
                </button>
              );
            })}
          </div>
          <label className="inline-flex shrink-0 cursor-pointer items-center gap-2 text-sm text-muted-foreground">
            <Switch checked={unreadOnly} onCheckedChange={(v) => setFilters({ unread: v })} />
            Solo no leídas
          </label>
        </div>

        {filtered.length === 0 ? (
          <EmptyState unreadOnly={unreadOnly} type={type} />
        ) : (
          <div className="flex flex-col gap-8">
            {grouped.map((group) => (
              <section key={group.label}>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 px-1">
                  {group.label}
                </h3>
                <div className="flex flex-col gap-3">
                  {group.items.map((n, i) => (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i, 6) * 0.04 }}
                    >
                      <NotificationItem notification={n} onMarkRead={toggleRead} />
                    </motion.div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </motion.div>
      </div>
    </div>
  );
}

function EmptyState({ unreadOnly, type }: { unreadOnly: boolean; type: TypeFilter }) {
  const copy = unreadOnly
    ? { title: "¡Estás al día!", sub: "No tienes notificaciones sin leer en esta categoría." }
    : type === "actions"
      ? { title: "Nada pendiente", sub: "Cuando algo requiera tu acción, aparecerá aquí." }
      : { title: "Sin notificaciones", sub: "Cuando haya actividad en tu cuenta, aparecerá aquí." };

  return (
    <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="size-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <Bell className="size-6 text-muted-foreground/40" />
      </div>
      <p className="text-base font-semibold text-foreground">{copy.title}</p>
      <p className="text-sm text-muted-foreground mt-1 max-w-xs">{copy.sub}</p>
    </div>
  );
}
