"use client";

import { History, User, ShieldCheck, Check, Flag, RotateCcw, MessageSquare, UserCheck, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { Retorno, TicketActivity, TicketActivityType } from "@/lib/retornos/types";
import { formatDateTime } from "@/lib/admin/formatters";
import { RichTextContent } from "@/components/admin/RichTextContent";

const activityConfig: Record<
  TicketActivityType,
  { icon: typeof Flag; color: string; label: string }
> = {
  created: { icon: MessageSquare, color: "bg-blue-100 text-blue-600", label: "Creado" },
  flagged: { icon: Flag, color: "bg-amber-100 text-amber-600", label: "Observado" },
  assigned: { icon: UserCheck, color: "bg-violet-100 text-violet-600", label: "Asignado" },
  in_review: { icon: ShieldCheck, color: "bg-sky-100 text-sky-600", label: "En revisión" },
  resolved: { icon: Check, color: "bg-emerald-100 text-emerald-600", label: "Resuelto" },
  reopened: { icon: RotateCcw, color: "bg-orange-100 text-orange-600", label: "Reabierto" },
  admin_message: { icon: ShieldCheck, color: "bg-emerald-100 text-emerald-600", label: "Admin" },
  client_message: { icon: User, color: "bg-blue-100 text-blue-600", label: "Cliente" },
};

interface TicketActivitySheetProps {
  retorno: Retorno | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ActivityItem({ item }: { item: TicketActivity }) {
  const cfg = activityConfig[item.type];
  const isMessage = item.type === "admin_message" || item.type === "client_message";

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={cn("flex size-7 shrink-0 items-center justify-center rounded-full", cfg.color)}>
          <cfg.icon className="size-3.5" />
        </div>
        <div className="mt-1 w-px flex-1 bg-border/60" />
      </div>
      <div className="flex-1 pb-5 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-sm font-semibold">{item.title}</p>
          <time className="shrink-0 text-[10px] text-muted-foreground">
            {formatDateTime(item.createdAt)}
          </time>
        </div>
        <p className="text-xs text-muted-foreground">
          {item.byRole === "admin" ? "Admin · " : "Cliente · "}
          {item.byUser}
        </p>
        {isMessage && item.description && (
          <div className={cn(
            "mt-2 rounded-xl border p-3",
            item.byRole === "admin"
              ? "border-emerald-200 bg-emerald-50/50"
              : "border-blue-200 bg-blue-50/50"
          )}>
            <RichTextContent html={item.description} />
            {item.attachments && item.attachments.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {item.attachments.map((a, i) => (
                  <a
                    key={i}
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-md bg-background border border-border px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    📎 {a.name}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function TicketActivitySheet({ retorno, open, onOpenChange }: TicketActivitySheetProps) {
  if (!retorno?.ticket) return null;
  const { ticket } = retorno;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-left">
            <History className="size-4 text-muted-foreground" />
            Historial de actividad
          </SheetTitle>
          <SheetDescription className="text-left font-mono text-xs">
            {ticket.id} · {retorno.id}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          <div className="mb-4 rounded-xl border border-border/60 bg-muted/20 p-4">
            <p className="text-xs text-muted-foreground">Asunto del ticket</p>
            <p className="mt-0.5 font-medium">{ticket.title}</p>
          </div>

          {ticket.activity.length === 0 ? (
            <div className="flex flex-col items-center py-12">
              <X className="size-8 text-muted-foreground/30" />
              <p className="mt-2 text-sm text-muted-foreground">Sin actividad registrada</p>
            </div>
          ) : (
            <div>
              {ticket.activity.map((item) => (
                <ActivityItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
