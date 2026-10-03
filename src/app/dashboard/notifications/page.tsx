"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Bell, CheckCheck, Inbox, MailOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotificationItem } from "@/components/dashboard/NotificationItem";
import { useNotifications } from "@/contexts/notifications-context";
import {
  formatNotificationDate,
  type AppNotification,
} from "@/lib/dashboard/notifications";
import { toast } from "sonner";

type FilterTab = "all" | "unread" | "read";

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
  const [tab, setTab] = useState<FilterTab>("all");
  const { notifications, unreadCount, markAllAsRead, toggleRead } =
    useNotifications();

  const filtered = useMemo(() => {
    if (tab === "unread") return notifications.filter((n) => !n.read);
    if (tab === "read") return notifications.filter((n) => n.read);
    return notifications;
  }, [notifications, tab]);

  const grouped = useMemo(() => groupByDate(filtered), [filtered]);

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
      {/* Hero inverso a sangre: continúa la banda del Topbar (ver HERO_ROUTES)
          anulando el padding de <main>. Oscuro en claro, claro en oscuro. */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 mb-6 rounded-b-3xl bg-foreground text-background px-4 sm:px-6 lg:px-8 pt-4 pb-8 sm:pb-10"
      >
        <div className="mx-auto max-w-3xl flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-background/60">
                Centro de alertas
              </p>
              {unreadCount > 0 && (
                <span className="rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-[10px] font-semibold">
                  {unreadCount} sin leer
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Notificaciones
            </h2>
            <p className="text-sm text-background/75 mt-1">
              Subastas, pagos, actualizaciones legales y alertas de tu portafolio.
            </p>
          </div>
          <Button
            size="sm"
            className="rounded-xl shrink-0 w-fit bg-background text-foreground hover:bg-background/90 shadow-sm disabled:opacity-60"
            onClick={handleMarkAll}
            disabled={unreadCount === 0}
          >
            <CheckCheck className="size-4 mr-2" />
            Marcar todo como leído
          </Button>
        </div>
      </motion.div>

      <div className="w-full max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as FilterTab)}
          className="gap-6"
        >
          <TabsList className="w-full sm:w-auto h-10 rounded-xl bg-muted/50 p-1">
            <TabsTrigger value="all" className="rounded-lg gap-1.5 px-4">
              <Inbox className="size-3.5" />
              Todos
              <span className="text-muted-foreground text-xs">
                ({notifications.length})
              </span>
            </TabsTrigger>
            <TabsTrigger value="unread" className="rounded-lg gap-1.5 px-4">
              No leídos
              {unreadCount > 0 && (
                <span className="size-4 inline-flex items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                  {unreadCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="read" className="rounded-lg gap-1.5 px-4">
              <MailOpen className="size-3.5" />
              Leídos
              <span className="text-muted-foreground text-xs">
                ({notifications.filter((n) => n.read).length})
              </span>
            </TabsTrigger>
          </TabsList>

          {(["all", "unread", "read"] as const).map((value) => (
            <TabsContent key={value} value={value} className="mt-0">
              {filtered.length === 0 ? (
                <EmptyState tab={value} />
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
                            transition={{ delay: i * 0.04 }}
                          >
                            <NotificationItem
                              notification={n}
                              onMarkRead={toggleRead}
                            />
                          </motion.div>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>
      </div>
    </div>
  );
}

function EmptyState({ tab }: { tab: FilterTab }) {
  const copy = {
    all: {
      title: "Sin notificaciones",
      sub: "Cuando haya actividad en tu cuenta, aparecerá aquí.",
    },
    unread: {
      title: "¡Estás al día!",
      sub: "No tienes notificaciones sin leer. Buen trabajo.",
    },
    read: {
      title: "Sin historial leído",
      sub: "Las notificaciones que marques como leídas aparecerán aquí.",
    },
  }[tab];

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
