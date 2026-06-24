"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  RotateCcw,
  Target,
  ArrowDownToLine,
  Flag,
  CheckCircle2,
  Clock,
  X,
  Search,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { getRetornosByUserId, subscribeRetornos } from "@/lib/retornos/store";
import type { Retorno, RetornoType, TicketStatus } from "@/lib/retornos/types";
import { formatDateTime } from "@/lib/admin/formatters";
import { formatCurrency } from "@/lib/currency";
import { useCurrentUser } from "@/contexts/user-context";
import { RetornoDetailSheet } from "@/components/dashboard/retornos/RetornoDetailSheet";
import { CreateTicketDialog } from "@/components/dashboard/retornos/CreateTicketDialog";

const typeConfig: Record<RetornoType, { label: string; icon: typeof TrendingUp; color: string; bg: string }> = {
  roi_return: {
    label: "Retorno ROI",
    icon: TrendingUp,
    color: "text-emerald-600",
    bg: "bg-emerald-50 border-emerald-200",
  },
  refund: {
    label: "Reembolso",
    icon: RotateCcw,
    color: "text-blue-600",
    bg: "bg-blue-50 border-blue-200",
  },
  goal_not_reached: {
    label: "Devolución",
    icon: Target,
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-200",
  },
};

const ticketStatusConfig: Record<TicketStatus, { label: string; color: string }> = {
  flagged: { label: "En observación", color: "border-amber-200 bg-amber-50 text-amber-700" },
  in_review: { label: "En revisión", color: "border-blue-200 bg-blue-50 text-blue-700" },
  resolved: { label: "Resuelto", color: "border-emerald-200 bg-emerald-50 text-emerald-700" },
};

const DEMO_USER_ID = "user-001";

export default function DashboardRetornosPage() {
  const { user } = useCurrentUser();
  const [retornos, setRetornos] = useState<Retorno[]>(() =>
    getRetornosByUserId(DEMO_USER_ID)
  );
  const [selected, setSelected] = useState<Retorno | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [ticketRetorno, setTicketRetorno] = useState<Retorno | null>(null);
  const [ticketOpen, setTicketOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<RetornoType | "all">("all");

  const refresh = useCallback(() => {
    const updated = getRetornosByUserId(DEMO_USER_ID);
    setRetornos(updated);
    if (selected) {
      const updatedSelected = updated.find((r) => r.id === selected.id);
      if (updatedSelected) setSelected(updatedSelected);
    }
  }, [selected]);

  useEffect(() => subscribeRetornos(refresh), [refresh]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return retornos.filter((r) => {
      const matchSearch =
        r.propertyTitle.toLowerCase().includes(q) || r.id.toLowerCase().includes(q);
      const matchType = typeFilter === "all" || r.type === typeFilter;
      return matchSearch && matchType;
    });
  }, [retornos, search, typeFilter]);

  const stats = useMemo(
    () => ({
      total: retornos.length,
      roi: retornos.filter((r) => r.type === "roi_return").length,
      refund: retornos.filter((r) => r.type === "refund").length,
      totalAmount: retornos.reduce((sum, r) => sum + r.amount, 0),
    }),
    [retornos]
  );

  function openDetail(r: Retorno) {
    setSelected(r);
    setDetailOpen(true);
  }

  function openTicket(r: Retorno) {
    setTicketRetorno(r);
    setTicketOpen(true);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Mi cuenta
        </p>
        <h2 className="text-2xl font-bold tracking-tight">Retornos</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Revisa todos tus retornos, reembolsos y devoluciones
        </p>
      </motion.div>

      {/* Summary */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total", value: retornos.length, sub: "retornos", icon: ArrowDownToLine, color: "text-blue-600 bg-blue-50" },
          { label: "ROI", value: stats.roi, sub: "ganancias", icon: TrendingUp, color: "text-emerald-600 bg-emerald-50" },
          { label: "Reembolsos", value: stats.refund, sub: "recibidos", icon: RotateCcw, color: "text-violet-600 bg-violet-50" },
          { label: "Devoluciones", value: retornos.filter((r) => r.type === "goal_not_reached").length, sub: "procesadas", icon: Target, color: "text-amber-600 bg-amber-50" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="rounded-xl border border-border/60 bg-background px-4 py-3"
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{s.label}</p>
                <p className="mt-0.5 text-xl font-bold">{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.sub}</p>
              </div>
              <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", s.color.split(" ")[1])}>
                <s.icon className={cn("size-4", s.color.split(" ")[0])} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por propiedad o ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as RetornoType | "all")}>
          <SelectTrigger className="w-full rounded-xl sm:w-44">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="roi_return">Retorno ROI</SelectItem>
            <SelectItem value="refund">Reembolso</SelectItem>
            <SelectItem value="goal_not_reached">Devolución</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-20">
          <X className="mb-3 size-10 text-muted-foreground/30" />
          <p className="text-sm font-medium">Sin retornos</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {search || typeFilter !== "all"
              ? "Ajusta los filtros para ver más resultados"
              : "Aún no tienes retornos registrados"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r, i) => {
            const cfg = typeConfig[r.type];
            const ticket = r.ticket;
            const ticketCfg = ticket ? ticketStatusConfig[ticket.status] : null;

            return (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-xl border border-border/60 bg-background p-4 transition-all hover:border-foreground/20 hover:shadow-sm"
              >
                {/* Top row: icon + info + amount */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl border", cfg.bg)}>
                      <cfg.icon className={cn("size-5", cfg.color)} />
                    </div>
                    <div className="min-w-0">
                      <p className="line-clamp-1 font-semibold text-sm">{r.propertyTitle}</p>
                      <p className="text-xs text-muted-foreground">{cfg.label}</p>
                      <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{r.id}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-bold text-foreground">
                      {formatCurrency(r.amount, r.currency)}
                    </p>
                    <div className="mt-1 flex items-center justify-end gap-1.5 text-xs text-emerald-600">
                      <CheckCircle2 className="size-3" />
                      Confirmado
                    </div>
                  </div>
                </div>

                {/* Bottom row: date + ticket badge + action buttons */}
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="size-3" />
                    {formatDateTime(r.createdAt)}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {ticket && ticketCfg && (
                      <span className={cn("rounded-md border px-1.5 py-0.5 text-[10px] font-semibold", ticketCfg.color)}>
                        <Flag className="mr-1 inline size-2.5" />
                        {ticketCfg.label}
                      </span>
                    )}
                    {!ticket && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 rounded-lg gap-1 px-2.5 text-xs border-amber-200 text-amber-700 hover:bg-amber-50"
                        onClick={() => openTicket(r)}
                      >
                        <Flag className="size-3" />
                        Observar
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 rounded-lg gap-1 px-2.5 text-xs"
                      onClick={() => openDetail(r)}
                    >
                      <Eye className="size-3" />
                      Ver detalles
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <RetornoDetailSheet
        retorno={selected}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        userName={user.name}
      />

      <CreateTicketDialog
        retorno={ticketRetorno}
        open={ticketOpen}
        onOpenChange={setTicketOpen}
        userName={user.name}
      />
    </div>
  );
}
