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
import { formatCurrency, sumByCurrency } from "@/lib/currency";
import { useCurrentUser } from "@/contexts/user-context";
import { RetornoDetailSheet } from "@/components/dashboard/retornos/RetornoDetailSheet";
import { PageHero } from "@/components/dashboard/PageHero";
import { MoneyLines } from "@/components/shared/MoneyLines";
import { trackingHref } from "@/components/premium/reservation-ui";
import { getPremiumPropertyById } from "@/lib/premium/mock-data";
import { isActive, useReservations } from "@/lib/premium/reservations";
import { formatLimaDate } from "@/lib/premium/dates";
import Link from "next/link";
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
  const premiumReservations = useReservations();
  const premiumSettled = useMemo(
    () => premiumReservations.filter((r) => r.userId === user.id && r.status === "settled" && r.settlement),
    [premiumReservations, user.id]
  );
  const premiumInProgress = premiumReservations.filter((r) => r.userId === user.id && isActive(r)).length;
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
    // Realizado, capital devuelto y proyección son lecturas distintas (E-043,
    // auditoría Premium slide 13): nunca se mezclan en una sola cifra.
    const gains = sumByCurrency(retornos.map((r) => ({ amount: r.gainAmount, currency: r.currency })));
    const capital = sumByCurrency(retornos.map((r) => ({ amount: r.principalAmount, currency: r.currency })));
    premiumSettled.forEach((r) => {
      gains[r.currency] = (gains[r.currency] ?? 0) + Math.max(0, r.settlement!.gain);
      capital[r.currency] = (capital[r.currency] ?? 0) + r.settlement!.capitalReturned;
    });
    return { gains, capital };
  }, [retornos, premiumSettled]);

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

      {/* Resumen: realizado, capital devuelto y proyección por separado */}
      <div className="mb-6 grid gap-3 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-primary p-5 text-primary-foreground shadow-sm shadow-primary/20"
          data-testid="retornos-realized"
        >
          <span className="inline-flex rounded-full bg-primary-foreground px-2.5 py-1 text-xs font-semibold text-primary">Realizado</span>
          <div className="mt-4 text-2xl font-bold tabular-nums leading-tight">
            <MoneyLines values={stats.gains} empty={formatCurrency(0, "PEN")} />
          </div>
          <p className="mt-2 text-xs text-primary-foreground/75">Solo ganancias efectivamente abonadas</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 }}
          className="rounded-2xl bg-primary p-5 text-primary-foreground shadow-sm shadow-primary/20"
        >
          <span className="inline-flex rounded-full bg-primary-foreground px-2.5 py-1 text-xs font-semibold text-primary">Capital devuelto</span>
          <div className="mt-4 text-2xl font-bold tabular-nums leading-tight">
            <MoneyLines values={stats.capital} empty={formatCurrency(0, "PEN")} />
          </div>
          <p className="mt-2 text-xs text-primary-foreground/75">Tu propio capital, separado del rendimiento</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="flex flex-col rounded-2xl border border-border/60 bg-card p-5 shadow-sm"
        >
          <span className="inline-flex w-fit rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-foreground">En seguimiento</span>
          <p className="mt-4 text-sm text-muted-foreground">
            Las proyecciones de tus operaciones en curso no son dinero disponible: las verás en cada inversión.
          </p>
          <Link
            href={premiumInProgress > 0 ? "/dashboard/my-investments?tab=premium" : "/dashboard/my-investments"}
            className="mt-auto pt-3 text-sm font-medium text-primary hover:underline"
          >
            Ver mis inversiones en curso →
          </Link>
        </motion.div>
      </div>

      {premiumSettled.length > 0 && (
        <section className="mb-6 rounded-2xl border border-border/60 bg-card shadow-sm" aria-labelledby="premium-settled">
          <h2 id="premium-settled" className="border-b border-border/60 px-4 py-3 text-sm font-semibold text-foreground sm:px-5">
            Liquidaciones Premium
          </h2>
          <ul className="divide-y divide-border/60">
            {premiumSettled.map((r) => (
              <li key={r.id}>
                <Link href={trackingHref(r.id)} className="flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 hover:bg-muted/40 sm:px-5">
                  <div className="min-w-0 basis-full sm:basis-auto sm:flex-1">
                    <p className="text-sm font-semibold text-foreground sm:truncate">{getPremiumPropertyById(r.propertyId)?.name ?? r.code}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.code} · abonado el {formatLimaDate(r.settlement!.settledAt)}
                    </p>
                  </div>
                  <div className="text-xs sm:text-right">
                    <p className="text-muted-foreground">Capital devuelto</p>
                    <p className="font-semibold tabular-nums text-foreground">{formatCurrency(r.settlement!.capitalReturned, r.currency)}</p>
                  </div>
                  <div className="text-xs sm:text-right">
                    <p className="text-muted-foreground">Ganancia neta</p>
                    <p className="font-semibold tabular-nums text-success">{formatCurrency(r.settlement!.gain, r.currency)}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

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
