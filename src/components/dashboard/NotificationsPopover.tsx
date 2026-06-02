"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, CheckCheck, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotificationItem } from "@/components/dashboard/NotificationItem";
import { useNotifications } from "@/contexts/notifications-context";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function NotificationsPopover() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"all" | "unread">("all");
  const { notifications, unreadCount, markAllAsRead, toggleRead } =
    useNotifications();

  const unreadNotifications = notifications.filter((n) => !n.read);

  const handleMarkAll = () => {
    if (unreadCount === 0) {
      toast.info("No tienes notificaciones sin leer");
      return;
    }
    markAllAsRead();
    toast.success("Todas las notificaciones marcadas como leídas");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-xl hover:bg-muted/80"
          aria-label="Notificaciones"
        >
          <Bell className={cn("size-4", unreadCount > 0 && "text-foreground")} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-background">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[min(100vw-2rem,400px)] p-0 overflow-hidden rounded-2xl shadow-xl ring-1 ring-border/60"
      >
        <div className="border-b border-border/60 bg-gradient-to-br from-background via-background to-muted/30 px-4 py-3.5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Notificaciones
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {unreadCount > 0
                  ? `${unreadCount} sin leer de ${notifications.length}`
                  : "Estás al día — sin pendientes"}
              </p>
            </div>
            {unreadCount > 0 && (
              <Badge className="rounded-lg bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
                {unreadCount} nuevas
              </Badge>
            )}
          </div>
        </div>

        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as "all" | "unread")}
          className="gap-0"
        >
          <div className="px-3 pt-3 pb-2 border-b border-border/40">
            <TabsList className="w-full h-9 rounded-xl bg-muted/50 p-1">
              <TabsTrigger value="all" className="flex-1 rounded-lg text-xs">
                Todos
                <span className="ml-1 text-muted-foreground">
                  ({notifications.length})
                </span>
              </TabsTrigger>
              <TabsTrigger value="unread" className="flex-1 rounded-lg text-xs">
                No leídos
                {unreadCount > 0 && (
                  <span className="ml-1.5 size-4 inline-flex items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                    {unreadCount}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="mt-0">
            <NotificationList
              items={notifications}
              onToggle={toggleRead}
              emptyMessage="No hay notificaciones"
            />
          </TabsContent>
          <TabsContent value="unread" className="mt-0">
            <NotificationList
              items={unreadNotifications}
              onToggle={toggleRead}
              emptyMessage="¡Excelente! No tienes notificaciones pendientes"
              emptySub="Revisa la pestaña Todos para ver tu historial"
            />
          </TabsContent>
        </Tabs>

        <div className="flex items-center gap-2 border-t border-border/60 bg-muted/20 px-3 py-2.5">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 h-8 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground"
            onClick={handleMarkAll}
          >
            <CheckCheck className="size-3.5 mr-1.5" />
            Marcar todo como leído
          </Button>
          <Button
            size="sm"
            className="flex-1 h-8 rounded-lg text-xs font-semibold"
            asChild
            onClick={() => setOpen(false)}
          >
            <Link href="/dashboard/notifications">
              Ver todos
              <ExternalLink className="size-3 ml-1 opacity-70" />
            </Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function NotificationList({
  items,
  onToggle,
  emptyMessage,
  emptySub,
}: {
  items: ReturnType<typeof useNotifications>["notifications"];
  onToggle: (id: string) => void;
  emptyMessage: string;
  emptySub?: string;
}) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <div className="size-12 rounded-2xl bg-muted flex items-center justify-center mb-3">
          <Bell className="size-5 text-muted-foreground/50" />
        </div>
        <p className="text-sm font-medium text-foreground">{emptyMessage}</p>
        {emptySub && (
          <p className="text-xs text-muted-foreground mt-1">{emptySub}</p>
        )}
      </div>
    );
  }

  return (
    <ScrollArea className="h-[min(340px,50vh)]">
      <div className="flex flex-col gap-2 p-3">
        {items.map((n) => (
          <NotificationItem
            key={n.id}
            notification={n}
            compact
            onMarkRead={onToggle}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
