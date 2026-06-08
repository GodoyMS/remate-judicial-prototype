"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Eye,
  FileText,
  TrendingUp,
  Clock,
  Wallet,
  X,
  ArrowUpDown,
  RotateCcw,
  CreditCard,
  Landmark,
  Smartphone,
  Receipt,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TablePagination } from "@/components/ui/table-pagination";
import { InvestmentDetailSheet } from "@/components/dashboard/InvestmentDetailSheet";
import {
  userInvestments,
  dashboardProperties,
  getPropertyById,
  formatCurrency,
  formatDate,
} from "@/lib/dashboard/mock-data";
import { formatMixedCurrencyTotals, sumByCurrency } from "@/lib/currency";
import type { UserInvestment, InvestmentStatus } from "@/lib/dashboard/types";
import { usePagination } from "@/hooks/use-pagination";
import { cn } from "@/lib/utils";

const statusOptions = [
  { value: "all", label: "Todos" },
  { value: "active", label: "Activas" },
  { value: "completed", label: "Completadas" },
  { value: "pending", label: "Pendientes" },
  { value: "cancelled", label: "Canceladas" },
] as const;

const statusConfig: Record<
  InvestmentStatus,
  { label: string; rowBorder: string; badge: string }
> = {
  active: {
    label: "Activa",
    rowBorder: "border-l-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  completed: {
    label: "Completada",
    rowBorder: "border-l-blue-500",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
  },
  pending: {
    label: "Pendiente",
    rowBorder: "border-l-amber-500",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
  },
  cancelled: {
    label: "Cancelada",
    rowBorder: "border-l-red-400",
    badge: "bg-red-50 text-red-600 border-red-200",
  },
};

function PaymentMethodIcon({ method }: { method: string }) {
  if (method.includes("Yape") || method.includes("Plin")) {
    return <Smartphone className="size-3.5 shrink-0 text-violet-600" />;
  }
  if (method.includes("Transferencia")) {
    return <Landmark className="size-3.5 shrink-0 text-blue-600" />;
  }
  return <CreditCard className="size-3.5 shrink-0 text-slate-600" />;
}

export default function MyInvestmentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [pageSize, setPageSize] = useState(5);
  const [selectedInvestment, setSelectedInvestment] =
    useState<UserInvestment | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const districts = useMemo(
    () => [...new Set(dashboardProperties.map((p) => p.district))],
    []
  );

  const enriched = useMemo(
    () =>
      userInvestments.map((inv) => ({
        ...inv,
        property: getPropertyById(inv.propertyId)!,
      })),
    []
  );

  const filtered = useMemo(
    () =>
      enriched
        .filter((inv) => {
          const q = search.toLowerCase();
          const matchSearch =
            inv.property.name.toLowerCase().includes(q) ||
            inv.certificateId.toLowerCase().includes(q) ||
            inv.id.toLowerCase().includes(q);
          const matchStatus =
            statusFilter === "all" || inv.status === statusFilter;
          const matchDistrict =
            districtFilter === "all" || inv.property.district === districtFilter;
          const matchPayment =
            paymentFilter === "all" ||
            (paymentFilter === "card" &&
              inv.paymentMethod.includes("Tarjeta")) ||
            (paymentFilter === "transfer" &&
              inv.paymentMethod.includes("Transferencia")) ||
            (paymentFilter === "yape" &&
              (inv.paymentMethod.includes("Yape") ||
                inv.paymentMethod.includes("Plin")));
          return matchSearch && matchStatus && matchDistrict && matchPayment;
        })
        .sort((a, b) => {
          if (sortBy === "date-desc")
            return (
              new Date(b.datePaid).getTime() - new Date(a.datePaid).getTime()
            );
          if (sortBy === "date-asc")
            return (
              new Date(a.datePaid).getTime() - new Date(b.datePaid).getTime()
            );
          if (sortBy === "amount-desc") return b.amount - a.amount;
          if (sortBy === "roi-desc") return b.roi - a.roi;
          return 0;
        }),
    [enriched, search, statusFilter, districtFilter, paymentFilter, sortBy]
  );

  const {
    page,
    setPage,
    totalPages,
    paginatedItems,
    rangeStart,
    rangeEnd,
    totalItems,
  } = usePagination(filtered, {
    pageSize,
    resetDeps: [search, statusFilter, districtFilter, paymentFilter, sortBy, pageSize],
  });

  const stats = useMemo(() => {
    const investedByCurrency = sumByCurrency(enriched);
    const returnsByCurrency = sumByCurrency(
      enriched.map((i) => ({
        amount: i.estimatedReturn,
        currency: i.currency,
      }))
    );
    return {
      totalLabel: formatMixedCurrencyTotals(investedByCurrency),
      returnsLabel: formatMixedCurrencyTotals(returnsByCurrency),
      active: enriched.filter((i) => i.status === "active").length,
      transactions: enriched.length,
    };
  }, [enriched]);

  const activeFiltersCount = [
    statusFilter !== "all",
    districtFilter !== "all",
    paymentFilter !== "all",
    search.length > 0,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setDistrictFilter("all");
    setPaymentFilter("all");
    setSortBy("date-desc");
  };

  const openInvestment = (inv: UserInvestment) => {
    setSelectedInvestment(inv);
    setSheetOpen(true);
  };

  return (
    <div className="w-full -mx-0">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
              Registro de transacciones
            </p>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">
              Mis inversiones
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Historial de aportes, certificados y estados de cada participación
            </p>
          </div>
          <Button variant="outline" size="sm" className="rounded-xl w-fit shrink-0">
            <Download className="size-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          {
            label: "Transacciones",
            value: String(stats.transactions),
            sub: "registros totales",
            icon: Receipt,
            accent: "text-slate-600 bg-slate-50",
          },
          {
            label: "Capital invertido",
            value: stats.totalLabel,
            sub: "monto acumulado",
            icon: Wallet,
            accent: "text-blue-600 bg-blue-50",
          },
          {
            label: "Posiciones activas",
            value: String(stats.active),
            sub: "en subasta o legal",
            icon: TrendingUp,
            accent: "text-emerald-600 bg-emerald-50",
          },
          {
            label: "Retorno estimado",
            value: stats.returnsLabel,
            sub: "proyección total",
            icon: Clock,
            accent: "text-amber-600 bg-amber-50",
          },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="rounded-xl border border-border/60 bg-white bg-background px-4 py-3"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide truncate">
                  {s.label}
                </p>
                <p className="text-lg font-bold text-foreground mt-0.5 truncate">
                  {s.value}
                </p>
                <p className="text-[10px] text-muted-foreground">{s.sub}</p>
              </div>
              <div
                className={cn(
                  "size-9 rounded-lg flex items-center justify-center shrink-0",
                  s.accent.split(" ")[1]
                )}
              >
                <s.icon className={cn("size-4", s.accent.split(" ")[0])} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters toolbar */}
      <div className="rounded-xl border border-border/60 b bg-white mb-4 overflow-hidden">
        <div className="flex flex-col gap-3 p-4 border-b border-border/40 bg-muted/15">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="relative flex-1 min-w-0 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por certificado, ID o propiedad..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10 rounded-xl border-border/80 bg-background"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
 
              <Select value={districtFilter} onValueChange={setDistrictFilter}>
                <SelectTrigger className="h-10 w-full sm:w-[150px] rounded-xl">
                  <SelectValue placeholder="Distrito" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los distritos</SelectItem>
                  {districts.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="h-10 w-full sm:w-[160px] rounded-xl">
                  <SelectValue placeholder="Método de pago" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los métodos</SelectItem>
                  <SelectItem value="card">Tarjeta</SelectItem>
                  <SelectItem value="transfer">Transferencia</SelectItem>
                  <SelectItem value="yape">Yape / Plin</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-10 w-full sm:w-[160px] rounded-xl">
                  <ArrowUpDown className="size-3.5 mr-1 text-muted-foreground shrink-0" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Más recientes</SelectItem>
                  <SelectItem value="date-asc">Más antiguos</SelectItem>
                  <SelectItem value="amount-desc">Mayor monto</SelectItem>
                  <SelectItem value="roi-desc">Mayor ROI</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              {statusOptions.slice(1).map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() =>
                    setStatusFilter(
                      statusFilter === o.value ? "all" : o.value
                    )
                  }
                  className={cn(
                    "rounded-lg px-2.5 py-1 text-xs font-medium border transition-all",
                    statusFilter === o.value
                      ? statusConfig[o.value as InvestmentStatus].badge
                      : "border-border/60 text-muted-foreground hover:bg-muted/50"
                  )}
                >
                  {o.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {activeFiltersCount > 0 && (
                <>
                  <Badge variant="secondary" className="rounded-lg text-[10px]">
                    {activeFiltersCount} filtro{activeFiltersCount > 1 ? "s" : ""}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-8 rounded-lg text-xs text-muted-foreground"
                  >
                    <RotateCcw className="size-3.5 mr-1" />
                    Limpiar
                  </Button>
                </>
              )}
              <span className="text-xs text-muted-foreground hidden sm:inline">
                {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        {/* Full-width records table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40 border-b border-border/60">
                <TableHead className="pl-4 min-w-[200px] text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Propiedad / Activo
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Fecha
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Monto
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Método
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  ROI
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Retorno est.
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Estado
                </TableHead>
                <TableHead className="pr-4 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedItems.map((inv) => {
                const cfg = statusConfig[inv.status];
                return (
                  <TableRow
                    key={inv.id}
                    className={cn(
                      "group border-l-[3px] hover:bg-muted/25 transition-colors",
                      cfg.rowBorder,
                      inv.status === "cancelled" && "opacity-75"
                    )}
                  >
                    <TableCell className="pl-4 py-3">
                      <div className="flex items-center gap-2.5 min-w-[200px]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={inv.property.img}
                          alt=""
                          className="size-9 rounded-lg object-cover shrink-0 ring-1 ring-border/60"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate max-w-[220px]">
                            {inv.property.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {inv.property.district} · {inv.property.type}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 whitespace-nowrap">
                      <p className="text-sm font-medium">
                        {formatDate(inv.datePaid)}
                      </p>
                    </TableCell>
                    <TableCell className="py-3 whitespace-nowrap">
                      <p className="text-sm font-bold tabular-nums">
                        {formatCurrency(inv.amount, inv.currency)}
                      </p>
                    </TableCell>
                    <TableCell className="py-3">
                      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground max-w-[140px]">
                        <PaymentMethodIcon method={inv.paymentMethod} />
                        <span className="truncate">{inv.paymentMethod}</span>
                      </span>
                    </TableCell>
                    <TableCell className="py-3 whitespace-nowrap">
                      <span className="text-sm font-bold text-emerald-600 tabular-nums">
                        +{inv.roi}%
                      </span>
                    </TableCell>
                    <TableCell className="py-3 whitespace-nowrap">
                      <p className="text-sm font-semibold text-emerald-600 tabular-nums">
                        {inv.status === "cancelled"
                          ? "—"
                          : formatCurrency(inv.estimatedReturn, inv.currency)}
                      </p>
                      {inv.status !== "cancelled" && inv.status !== "completed" && (
                        <p className="text-[10px] text-muted-foreground flex items-center gap-0.5 mt-0.5">
                          <Clock className="size-2.5" />
                          {inv.daysUntilRoi > 0
                            ? `${inv.daysUntilRoi} días`
                            : "Próximo"}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="py-3">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold",
                          cfg.badge
                        )}
                      >
                        {cfg.label}
                      </span>
                    </TableCell>
                    <TableCell className="pr-4 py-3">
                      <div className="flex items-center justify-end gap-0.5 opacity-80 group-hover:opacity-100">
                        <Button
                          asChild
                          variant="ghost"
                          size="icon-sm"
                          className="rounded-lg"
                          title="Ver propiedad"
                        >
                          <Link href={`/dashboard/properties/${inv.propertyId}`}>
                            <Eye className="size-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="rounded-lg"
                          title="Detalle de transacción"
                          onClick={() => openInvestment(inv)}
                        >
                          <FileText className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="py-16 text-center">
                    <X className="size-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm font-medium text-foreground">
                      Sin transacciones
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Ajusta los filtros o limpia la búsqueda
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearFilters}
                      className="rounded-xl mt-3"
                    >
                      Limpiar filtros
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <TablePagination
          page={page}
          totalPages={totalPages}
          totalItems={totalItems}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[5, 10, 20]}
        />
      </div>

      <InvestmentDetailSheet
        investment={selectedInvestment}
        property={
          selectedInvestment
            ? (getPropertyById(selectedInvestment.propertyId) ?? null)
            : null
        }
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  );
}
