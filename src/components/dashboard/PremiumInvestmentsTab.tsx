"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Crown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MoneyLines } from "@/components/shared/MoneyLines";
import { StatusPill } from "@/components/premium/StatusPill";
import { FundsProgress } from "@/components/premium/FundsProgress";
import { nextStepFor, trackingHref } from "@/components/premium/reservation-ui";
import { useCurrentUser } from "@/contexts/user-context";
import { getPremiumPropertyById } from "@/lib/premium/mock-data";
import {
  ACTIVE_STATUSES,
  RESERVATION_STATUS_LABELS,
  RESERVATION_STATUS_TONE,
  getFunds,
  useReservations,
  type PremiumReservation,
  type ReservationStatus,
} from "@/lib/premium/reservations";
import { formatLimaDate } from "@/lib/premium/dates";
import { formatCurrency, type PropertyCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";

const STATUS_FILTERS: { id: "all" | "active" | ReservationStatus | "closed"; label: string }[] = [
  { id: "all", label: "Todas las etapas" },
  { id: "active", label: "Activas" },
  { id: "requested", label: "En revisión" },
  { id: "reserved", label: "Reservadas" },
  { id: "in_custody", label: "Aporte en custodia" },
  { id: "in_process", label: "En proceso" },
  { id: "settled", label: "Liquidadas" },
  { id: "closed", label: "No aprobadas o retiradas" },
];

type ByCurrency = Partial<Record<PropertyCurrency, number>>;

function add(acc: ByCurrency, c: PropertyCurrency, n: number) {
  if (n > 0) acc[c] = (acc[c] ?? 0) + n;
}

/**
 * Pestaña Premium de "Mis inversiones": misma estructura que Estándar
 * (KPIs, filtros, tabla) con los datos de las reservas. Cada fila abre el
 * seguimiento completo de la operación.
 */
export function PremiumInvestmentsTab() {
  const { user, isPremium } = useCurrentUser();
  const all = useReservations();
  const mine = useMemo(() => all.filter((r) => r.userId === user.id), [all, user.id]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof STATUS_FILTERS)[number]["id"]>("all");
  const [sort, setSort] = useState<"recent" | "amount">("recent");

  const kpis = useMemo(() => {
    const custody: ByCurrency = {};
    const pending: ByCurrency = {};
    const gains: ByCurrency = {};
    let active = 0;
    let settled = 0;
    let earliestDue: string | undefined;
    mine.forEach((r) => {
      const f = getFunds(r);
      if (ACTIVE_STATUSES.includes(r.status)) {
        active++;
        add(custody, r.currency, f.confirmed);
      }
      if (r.status === "reserved") {
        add(pending, r.currency, f.pending);
        if (f.pending > 0 && r.reservedUntil && (!earliestDue || r.reservedUntil < earliestDue)) earliestDue = r.reservedUntil;
      }
      if (r.status === "settled" && r.settlement) {
        settled++;
        add(gains, r.currency, r.settlement.gain);
      }
    });
    return { custody, pending, gains, active, settled, earliestDue };
  }, [mine]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return mine
      .map((r) => ({ r, p: getPremiumPropertyById(r.propertyId) }))
      .filter(({ r, p }) => {
        if (status === "active" && !ACTIVE_STATUSES.includes(r.status)) return false;
        if (status === "closed" && !["rejected", "withdrawn", "expired"].includes(r.status)) return false;
        if (!["all", "active", "closed"].includes(status) && r.status !== status) return false;
        if (!q) return true;
        return [p?.name, p?.district, r.code].some((v) => v?.toLowerCase().includes(q));
      })
      .sort((a, b) =>
        sort === "amount"
          ? b.r.amount - a.r.amount
          : new Date(b.r.requestedAt).getTime() - new Date(a.r.requestedAt).getTime()
      );
  }, [mine, query, status, sort]);

  if (!isPremium && mine.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
        <span className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-premium/12 text-premium">
          <Crown className="size-5" />
        </span>
        <p className="text-sm font-semibold text-foreground">Aún no tienes operaciones Premium</p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Con acceso Premium financias individualmente el 100% de una oportunidad y la sigues aquí, hito por hito.
        </p>
        <Button asChild variant="outline" className="mt-5 rounded-xl">
          <Link href="/dashboard/account?section=premium">Conocer Premium</Link>
        </Button>
      </div>
    );
  }

  const cards = [
    { label: "Operaciones activas", value: String(kpis.active), sub: "en revisión, reserva o proceso" },
    { label: "Capital en custodia", value: <MoneyLines values={kpis.custody} />, sub: "solo aportes confirmados" },
    {
      label: "Aporte pendiente",
      value: <MoneyLines values={kpis.pending} />,
      sub: kpis.earliestDue ? `próximo vencimiento: ${formatLimaDate(kpis.earliestDue)}` : "sin aportes pendientes",
    },
    { label: "Ganancia realizada", value: <MoneyLines values={kpis.gains} />, sub: `${kpis.settled} operación${kpis.settled === 1 ? "" : "es"} liquidada${kpis.settled === 1 ? "" : "s"}` },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="rounded-2xl bg-primary px-4 py-4 text-primary-foreground shadow-sm shadow-primary/20"
            data-testid={`premium-kpi-${i}`}
          >
            <p className="text-[10px] font-semibold uppercase tracking-wide text-primary-foreground/75">{c.label}</p>
            <div className="mt-1 text-lg font-bold leading-tight tabular-nums sm:text-2xl">{c.value}</div>
            <p className="mt-1 text-[11px] text-primary-foreground/75">{c.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border/60 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por propiedad, distrito o código…"
              className="h-10 rounded-xl pl-9"
              aria-label="Buscar operaciones Premium"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
              <SelectTrigger className="h-10 w-full rounded-xl sm:w-48" aria-label="Filtrar por etapa">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper">
                {STATUS_FILTERS.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
              <SelectTrigger className="h-10 w-full rounded-xl sm:w-40" aria-label="Ordenar">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="recent">Más recientes</SelectItem>
                <SelectItem value="amount">Mayor capital</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm font-semibold text-foreground">
              {mine.length === 0 ? "Aún no tienes operaciones Premium" : "Ninguna operación coincide con el filtro"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {mine.length === 0 ? "Cuando solicites una reserva, la verás aquí." : "Prueba con otra etapa o búsqueda."}
            </p>
            {mine.length === 0 && (
              <Button asChild className="mt-5 rounded-xl">
                <Link href="/dashboard/premium-properties?filter=available">
                  Ver oportunidades disponibles
                  <ArrowRight />
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Escritorio: tabla */}
            <table className="hidden w-full text-sm md:table">
              <thead>
                <tr className="bg-primary/5 text-left text-[11px] font-semibold uppercase tracking-wide text-primary dark:text-accent-foreground">
                  <th className="px-4 py-3">Operación</th>
                  <th className="px-4 py-3">Solicitud</th>
                  <th className="px-4 py-3 text-right">Capital</th>
                  <th className="w-44 px-4 py-3">Aporte</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3"><span className="sr-only">Ver</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {rows.map(({ r, p }) => (
                  <DesktopRow key={r.id} r={r} name={p?.name ?? r.propertyId} img={p?.img} district={p?.district} />
                ))}
              </tbody>
            </table>

            {/* Móvil: tarjetas */}
            <ul className="divide-y divide-border/60 md:hidden">
              {rows.map(({ r, p }) => (
                <li key={r.id}>
                  <MobileRow r={r} name={p?.name ?? r.propertyId} img={p?.img} />
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

function fundsPct(r: PremiumReservation) {
  return getFunds(r).confirmedPct;
}

function DesktopRow({ r, name, img, district }: { r: PremiumReservation; name: string; img?: string; district?: string }) {
  const funds = getFunds(r);
  const href = trackingHref(r.id);
  return (
    <tr className="group cursor-pointer transition-colors hover:bg-muted/40" data-testid={`premium-row-${r.id}`}>
      <td className="px-4 py-3">
        <Link href={href} className="flex items-center gap-3 outline-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {img && <img src={img} alt="" className="size-10 shrink-0 rounded-lg object-cover" />}
          <span className="min-w-0">
            <span className="block truncate font-semibold text-foreground group-hover:text-primary">{name}</span>
            <span className="block text-xs text-muted-foreground">
              {r.code}
              {district ? ` · ${district}` : ""}
            </span>
          </span>
        </Link>
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{formatLimaDate(r.requestedAt)}</td>
      <td className="whitespace-nowrap px-4 py-3 text-right font-semibold tabular-nums text-foreground">
        {formatCurrency(r.amount, r.currency)}
      </td>
      <td className="px-4 py-3">
        {["requested", "rejected", "withdrawn"].includes(r.status) ? (
          <span className="text-xs text-muted-foreground">—</span>
        ) : (
          <div className="flex items-center gap-2">
            <FundsProgress amount={r.amount} confirmed={funds.confirmed} inReview={funds.inReview} currency={r.currency} className="flex-1" />
            <span className="w-9 text-right text-xs tabular-nums text-muted-foreground">{fundsPct(r)}%</span>
          </div>
        )}
      </td>
      <td className="px-4 py-3">
        <StatusPill tone={RESERVATION_STATUS_TONE[r.status]} size="xs">
          {RESERVATION_STATUS_LABELS[r.status]}
        </StatusPill>
      </td>
      <td className="px-4 py-3 text-right">
        <Link href={href} className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline" aria-label={`Ver seguimiento de ${name}`}>
          Ver
          <ArrowRight className="size-3.5" />
        </Link>
      </td>
    </tr>
  );
}

function MobileRow({ r, name, img }: { r: PremiumReservation; name: string; img?: string }) {
  const next = nextStepFor(r);
  return (
    <Link href={trackingHref(r.id)} className="flex items-center gap-3 p-4 active:bg-muted/50" data-testid={`premium-row-${r.id}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {img && <img src={img} alt="" className="size-14 shrink-0 rounded-xl object-cover" />}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-sm font-semibold text-foreground">{name}</p>
        </div>
        <p className="text-sm font-bold tabular-nums text-foreground">{formatCurrency(r.amount, r.currency)}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <StatusPill tone={RESERVATION_STATUS_TONE[r.status]} size="xs">
            {RESERVATION_STATUS_LABELS[r.status]}
          </StatusPill>
        </div>
        <p className={cn("mt-1.5 text-xs", next.actionable ? "font-medium text-foreground" : "text-muted-foreground")}>{next.text}</p>
      </div>
      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
    </Link>
  );
}
