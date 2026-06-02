"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Bell, CheckCheck, Inbox, MailOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    <div className="w-full max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Bell className="size-5 text-primary" />
              </div>
              {unreadCount > 0 && (
                <Badge className="rounded-lg">{unreadCount} sin leer</Badge>
              )}
            </div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">
              Notificaciones
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Subastas, pagos, actualizaciones legales y alertas de tu portafolio.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl shrink-0 self-start"
            onClick={handleMarkAll}
            disabled={unreadCount === 0}
          >
            <CheckCheck className="size-4 mr-2" />
            Marcar todo como leído
          </Button>
        </div>

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
