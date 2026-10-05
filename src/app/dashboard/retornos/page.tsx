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
import { RETORNO_CATEGORY_LABELS } from "@/lib/retornos/types";
import { formatDateTime } from "@/lib/admin/formatters";
import { formatCurrency, formatMixedCurrencyTotals, sumByCurrency } from "@/lib/currency";
import { useCurrentUser } from "@/contexts/user-context";
import { RetornoDetailSheet } from "@/components/dashboard/retornos/RetornoDetailSheet";
import { PageHero } from "@/components/dashboard/PageHero";
import { CreateTicketDialog } from "@/components/dashboard/retornos/CreateTicketDialog";

const typeConfig: Record<RetornoType, { label: string; icon: typeof TrendingUp; solid: string; chip: string }> = {
  roi_return: {
    label: RETORNO_CATEGORY_LABELS.roi_return,
    icon: TrendingUp,
    solid: "bg-success text-success-foreground",
    chip: "bg-success/15 text-foreground",
  },
  refund: {
    label: RETORNO_CATEGORY_LABELS.refund,
    icon: RotateCcw,
    solid: "bg-info text-info-foreground",
    chip: "bg-info/15 text-foreground",
  },
  goal_not_reached: {
    label: RETORNO_CATEGORY_LABELS.goal_not_reached,
    icon: Target,
    solid: "bg-warning text-warning-foreground",
    chip: "bg-warning/15 text-foreground",
  },
};

const ticketStatusConfig: Record<TicketStatus, { label: string; color: string }> = {
  flagged: { label: "En observación", color: "bg-warning text-warning-foreground" },
  in_review: { label: "En revisión", color: "bg-info text-info-foreground" },
  resolved: { label: "Resuelto", color: "bg-success text-success-foreground" },
};

export default function DashboardRetornosPage() {
  const { user } = useCurrentUser();
  const [retornos, setRetornos] = useState<Retorno[]>(() =>
    getRetornosByUserId(user.id)
  );
  const [selected, setSelected] = useState<Retorno | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [ticketRetorno, setTicketRetorno] = useState<Retorno | null>(null);
  const [ticketOpen, setTicketOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<RetornoType | "all">("all");

  const refresh = useCallback(() => {
    const updated = getRetornosByUserId(user.id);
    setRetornos(updated);
    if (selected) {
      const updatedSelected = updated.find((r) => r.id === selected.id);
      if (updatedSelected) setSelected(updatedSelected);
    }
  }, [user.id, selected]);

  // Re-load when user changes (demo login switch)
  useEffect(() => {
    setRetornos(getRetornosByUserId(user.id));
  }, [user.id]);

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

  const stats = useMemo(() => {
    // Ganancia, devolución de capital y reembolso son movimientos distintos
    // (E-043): solo la ganancia real alimenta el total de "Retornos".
    const gainByCurrency = sumByCurrency(
      retornos.map((r) => ({ amount: r.gainAmount, currency: r.currency }))
    );
    return {
      total: retornos.length,
      roi: retornos.filter((r) => r.type === "roi_return").length,
      refund: retornos.filter((r) => r.type === "refund").length,
      gainLabel: formatMixedCurrencyTotals(gainByCurrency),
    };
  }, [retornos]);

  function openDetail(r: Retorno) {
    setSelected(r);
    setDetailOpen(true);
  }

  function openTicket(r: Retorno) {
    setTicketRetorno(r);
    setTicketOpen(true);
  }

  return (
    <div className="w-full">
      <PageHero
        tone="inverse"
        icon={ArrowDownToLine}
        eyebrow="Mi cuenta"
        title="Retornos"
        description="Revisa todos tus retornos, reembolsos y devoluciones."
      />

      <div className="w-full">

      {/* Summary */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total", value: retornos.length, sub: "retornos", icon: ArrowDownToLine, color: "text-primary bg-primary/10" },
          { label: "ROI", value: stats.roi, sub: "ganancias", icon: TrendingUp, color: "text-success bg-success/10" },
          { label: "Reembolsos", value: stats.refund, sub: "recibidos", icon: RotateCcw, color: "text-info bg-info/10" },
          { label: "Devoluciones", value: retornos.filter((r) => r.type === "goal_not_reached").length, sub: "procesadas", icon: Target, color: "text-warning bg-warning/10" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="rounded-2xl border border-border/60 bg-card px-4 py-4 shadow-sm"
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

      <div className="mb-6 rounded-2xl bg-primary text-primary-foreground px-5 py-4 shadow-sm shadow-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
        <div>
          <p className="text-sm font-semibold">Ganancias generadas</p>
          <p className="text-[11px] text-primary-foreground/75 mt-0.5">
            Solo ganancia real. No incluye capital devuelto ni reembolsos.
          </p>
        </div>
        <p className="text-xl sm:text-2xl font-bold tabular-nums shrink-0">{stats.gainLabel}</p>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por propiedad o ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 rounded-xl pl-9 bg-card"
          />
        </div>
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as RetornoType | "all")}>
          <SelectTrigger className={cn("h-10 w-full rounded-xl sm:w-44 bg-card", typeFilter !== "all" && "bg-primary text-primary-foreground border-primary [&_svg]:text-primary-foreground")}>
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
        <div className="flex flex-col gap-3">
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
                className="rounded-2xl border border-border/60 bg-card p-4 sm:p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
              >
                {/* Top row: icon + info + amount */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl", cfg.solid)}>
                      <cfg.icon className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="line-clamp-1 font-semibold text-[15px] text-foreground">{r.propertyTitle}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", cfg.chip)}>
                          {cfg.label}
                        </span>
                        <span className="font-mono text-[11px] text-foreground/60">{r.id}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg sm:text-xl font-bold tabular-nums text-foreground">
                      {formatCurrency(r.amount, r.currency)}
                    </p>
                    <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-semibold text-success">
                      <CheckCircle2 className="size-3" />
                      Confirmado
                    </div>
                  </div>
                </div>

                {/* Bottom row: date + ticket badge + action buttons */}
                <div className="mt-4 pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-foreground/70">
                    <Clock className="size-3.5" />
                    {formatDateTime(r.createdAt)}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {ticket && ticketCfg && (
                      <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold", ticketCfg.color)}>
                        <Flag className="mr-1 size-3" />
                        {ticketCfg.label}
                      </span>
                    )}
                    {!ticket && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 rounded-lg gap-1.5 px-3 text-xs font-medium text-foreground/75 hover:text-foreground hover:bg-muted"
                        onClick={() => openTicket(r)}
                      >
                        <Flag className="size-3.5" />
                        Observar
                      </Button>
                    )}
                    <Button
                      size="sm"
                      className="h-8 rounded-lg gap-1.5 px-3 text-xs font-semibold"
                      onClick={() => openDetail(r)}
                    >
                      <Eye className="size-3.5" />
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
    </div>
  );
}
