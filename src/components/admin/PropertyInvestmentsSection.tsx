"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Banknote,
  CheckCircle2,
  Clock,
  CreditCard,
  ExternalLink,
  Hash,
  Landmark,
  Mail,
  Search,
  Smartphone,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TablePagination } from "@/components/ui/table-pagination";
import { AdminFiltersShell } from "@/components/admin/AdminFiltersShell";
import { ConfirmedInvestmentsFiltersContent } from "@/components/admin/ConfirmedInvestmentsFiltersContent";
import { PaymentVerificationRejectDialog } from "@/components/admin/PaymentVerificationRejectDialog";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/admin/formatters";
import {
  PAYMENT_METHOD_LABELS,
  applyConfirmedFilters,
  countConfirmedActiveFilters,
  createDefaultConfirmedFilters,
  filterInvestmentsByTab,
  getConfirmedAmountBounds,
  getTransactionNumber,
  type ConfirmedInvestmentsFilterState,
  type InvestmentTab,
} from "@/lib/admin/investments";
import { currentAdmin } from "@/lib/admin/mock-data";
import type { PaymentMethodId, PropertyInvestment } from "@/lib/admin/types";
import { usePagination } from "@/hooks/use-pagination";
import { cn } from "@/lib/utils";

const paymentIcons: Record<PaymentMethodId, typeof CreditCard> = {
  card: CreditCard,
  yape: Smartphone,
  transfer: Banknote,
  deposit: Landmark,
};

interface PropertyInvestmentsSectionProps {
  investments: PropertyInvestment[];
  onInvestmentsChange: (investments: PropertyInvestment[]) => void;
}

export function PropertyInvestmentsSection({
  investments,
  onInvestmentsChange,
}: PropertyInvestmentsSectionProps) {
  const [activeTab, setActiveTab] = useState<InvestmentTab>("confirmed");
  const [rejectTarget, setRejectTarget] = useState<PropertyInvestment | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<PropertyInvestment | null>(null);
  const [pageSize, setPageSize] = useState(8);
  const [transactionSearch, setTransactionSearch] = useState("");

  const confirmedSource = useMemo(
    () => filterInvestmentsByTab(investments, "confirmed"),
    [investments]
  );

  const amountBounds = useMemo(
    () => getConfirmedAmountBounds(confirmedSource),
    [confirmedSource]
  );

  const defaultConfirmedFilters = useMemo(
    () => createDefaultConfirmedFilters(amountBounds),
    [amountBounds.min, amountBounds.max]
  );

  const [advancedFilters, setAdvancedFilters] =
    useState<ConfirmedInvestmentsFilterState>(defaultConfirmedFilters);

  useEffect(() => {
    setAdvancedFilters(createDefaultConfirmedFilters(amountBounds));
  }, [amountBounds.min, amountBounds.max]);

  const confirmedFilters = useMemo(
    (): ConfirmedInvestmentsFilterState => ({
      ...advancedFilters,
      transactionSearch,
    }),
    [advancedFilters, transactionSearch]
  );

  const confirmedUsers = useMemo(() => {
    const map = new Map<string, { id: string; name: string; email: string }>();
    for (const inv of confirmedSource) {
      map.set(inv.userId, {
        id: inv.userId,
        name: inv.userName,
        email: inv.userEmail,
      });
    }
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [confirmedSource]);

  const counts = useMemo(
    () => ({
      confirmed: confirmedSource.length,
      pending: filterInvestmentsByTab(investments, "pending").length,
      rejected: filterInvestmentsByTab(investments, "rejected").length,
    }),
    [investments, confirmedSource.length]
  );

  const tabInvestments = useMemo(() => {
    if (activeTab === "confirmed") {
      return applyConfirmedFilters(confirmedSource, confirmedFilters, amountBounds);
    }
    return filterInvestmentsByTab(investments, activeTab);
  }, [investments, activeTab, confirmedSource, confirmedFilters, amountBounds]);

  const sortedTabInvestments = useMemo(() => {
    return [...tabInvestments].sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  }, [tabInvestments]);

  const confirmedFilterCount = countConfirmedActiveFilters(advancedFilters, amountBounds);

  const {
    page,
    setPage,
    totalPages,
    paginatedItems,
    rangeStart,
    rangeEnd,
    totalItems,
  } = usePagination(sortedTabInvestments, {
    pageSize,
    resetDeps: [
      activeTab,
      sortedTabInvestments.length,
      pageSize,
      transactionSearch,
      advancedFilters.userIds.join(","),
      advancedFilters.paymentMethods.join(","),
      advancedFilters.amountMin,
      advancedFilters.amountMax,
    ],
  });

  const updateInvestment = (id: string, patch: Partial<PropertyInvestment>) => {
    onInvestmentsChange(
      investments.map((inv) => (inv.id === id ? { ...inv, ...patch } : inv))
    );
  };

  const handleConfirm = (inv: PropertyInvestment) => {
    const now = new Date().toISOString();
    updateInvestment(inv.id, {
      status: "confirmed",
      confirmedAt: now,
    });
    toast.success("Pago confirmado", {
      description: `Se envió un correo a ${inv.userEmail} confirmando el registro de ${formatCurrency(inv.amount, inv.currency)}.`,
    });
    setConfirmTarget(null);
  };

  const handleReject = (inv: PropertyInvestment, reason: string) => {
    const now = new Date().toISOString();
    updateInvestment(inv.id, {
      status: "rejected",
      rejectionReason: reason,
      rejectedBy: currentAdmin.name,
      rejectedAt: now,
    });
    toast.success("Pago rechazado", {
      description: `Se notificó a ${inv.userEmail} con el motivo indicado.`,
    });
    setRejectTarget(null);
    setActiveTab("rejected");
  };

  const clearConfirmedFilters = () => {
    setTransactionSearch("");
    setAdvancedFilters(createDefaultConfirmedFilters(amountBounds));
  };

  const handleTabChange = (tab: InvestmentTab) => {
    setActiveTab(tab);
    if (tab !== "confirmed") {
      setTransactionSearch("");
    }
  };

  return (
    <Card className="rounded-2xl border-border/60 shadow-sm overflow-hidden">
      <CardHeader className="border-b border-border/60 bg-muted/20 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <CardTitle className="text-lg">Inversiones y pagos</CardTitle>
            <CardDescription className="text-sm mt-1 max-w-xl">
              Gestiona las inversiones confirmadas automáticamente y verifica los
              comprobantes de transferencia y depósito enviados desde el portal del
              inversor.
            </CardDescription>
          </div>
          {counts.pending > 0 && (
            <Badge variant="secondary" className="shrink-0 rounded-lg px-2.5 py-1 text-xs">
              <Clock className="size-3.5 mr-1" />
              {counts.pending} pendiente{counts.pending !== 1 ? "s" : ""} de revisión
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Tabs
          value={activeTab}
          onValueChange={(v) => handleTabChange(v as InvestmentTab)}
          className="gap-0"
        >
          <div className="px-4 sm:px-6 pt-4 border-b border-border/40">
            <TabsList className="w-full sm:w-auto h-auto flex flex-wrap gap-1 rounded-xl bg-muted/50 p-1">
              <TabsTrigger value="confirmed" className="rounded-lg gap-1.5 text-xs sm:text-sm">
                <CheckCircle2 className="size-3.5" />
                Confirmados
                <span className="tabular-nums opacity-70">({counts.confirmed})</span>
              </TabsTrigger>
              <TabsTrigger value="pending" className="rounded-lg gap-1.5 text-xs sm:text-sm">
                <Clock className="size-3.5" />
                Pendientes
                <span
                  className={cn(
                    "tabular-nums",
                    counts.pending > 0 ? "text-amber-600 font-semibold" : "opacity-70"
                  )}
                >
                  ({counts.pending})
                </span>
              </TabsTrigger>
              <TabsTrigger value="rejected" className="rounded-lg gap-1.5 text-xs sm:text-sm">
                <XCircle className="size-3.5" />
                Rechazados
                <span className="tabular-nums opacity-70">({counts.rejected})</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="confirmed" className="mt-0 focus-visible:outline-none">
            <div className="px-4 sm:px-6 py-3 border-b border-border/40 bg-muted/10">
              <div className="flex flex-row  justify-between gap-2">
                <div className="relative flex-1 min-w-0 max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por N° de transacción…"
                    value={transactionSearch}
                    onChange={(e) => setTransactionSearch(e.target.value)}
                    className="pl-9 h-10 rounded-xl bg-background"
                  />
                </div>
                <AdminFiltersShell
                  activeCount={confirmedFilterCount}
                  onClear={clearConfirmedFilters}
                  title="Filtrar confirmados"
                  description="Usuario, tipo de pago y rango de monto"
                  popoverClassName="w-[min(100vw-2rem,640px)]"
                >
                  <ConfirmedInvestmentsFiltersContent
                    filters={advancedFilters}
                    onChange={setAdvancedFilters}
                    users={confirmedUsers}
                    amountBounds={amountBounds}
                  />
                </AdminFiltersShell>
              </div>
              {(transactionSearch.trim() || confirmedFilterCount > 0) && (
                <p className="text-[11px] text-muted-foreground mt-2">
                  Mostrando {sortedTabInvestments.length} de {confirmedSource.length}{" "}
                  inversiones confirmadas
                </p>
              )}
            </div>
            <InvestmentTabPanel
              tab="confirmed"
              items={paginatedItems}
              activeTab={activeTab}
              totalItems={totalItems}
              totalSourceCount={confirmedSource.length}
              hasActiveFilters={
                !!transactionSearch.trim() || confirmedFilterCount > 0
              }
              page={page}
              totalPages={totalPages}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              onConfirm={setConfirmTarget}
              onReject={setRejectTarget}
            />
          </TabsContent>

          <TabsContent value="pending" className="mt-0 focus-visible:outline-none">
            <InvestmentTabPanel
              tab="pending"
              items={paginatedItems}
              activeTab={activeTab}
              totalItems={totalItems}
              page={page}
              totalPages={totalPages}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              onConfirm={setConfirmTarget}
              onReject={setRejectTarget}
            />
          </TabsContent>

          <TabsContent value="rejected" className="mt-0 focus-visible:outline-none">
            <InvestmentTabPanel
              tab="rejected"
              items={paginatedItems}
              activeTab={activeTab}
              totalItems={totalItems}
              page={page}
              totalPages={totalPages}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              onConfirm={setConfirmTarget}
              onReject={setRejectTarget}
            />
          </TabsContent>
        </Tabs>
      </CardContent>

      <PaymentVerificationRejectDialog
        investment={rejectTarget}
        open={!!rejectTarget}
        onOpenChange={(open) => !open && setRejectTarget(null)}
        onConfirm={handleReject}
      />

      <AlertDialog open={!!confirmTarget} onOpenChange={(open) => !open && setConfirmTarget(null)}>
        <AlertDialogContent className="rounded-2xl sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar verificación de pago</AlertDialogTitle>
            <AlertDialogDescription className="space-y-3 text-left">
              <span className="block">
                Vas a acreditar la inversión de{" "}
                <strong>{confirmTarget?.userName}</strong> por{" "}
                <strong>{confirmTarget && formatCurrency(confirmTarget.amount, confirmTarget.currency)}</strong>.
              </span>
              <span className="flex items-start gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2.5 text-xs text-foreground/90">
                <Mail className="size-4 text-primary shrink-0 mt-0.5" />
                Enviaremos un correo a{" "}
                <span className="font-medium">{confirmTarget?.userEmail}</span> indicando que
                su pago fue registrado correctamente.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-2">
            <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl"
              onClick={() => confirmTarget && handleConfirm(confirmTarget)}
            >
              Confirmar y notificar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

function InvestmentTabPanel({
  tab,
  activeTab,
  items,
  totalItems,
  totalSourceCount,
  hasActiveFilters,
  page,
  totalPages,
  rangeStart,
  rangeEnd,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onConfirm,
  onReject,
}: {
  tab: InvestmentTab;
  activeTab: InvestmentTab;
  items: PropertyInvestment[];
  totalItems: number;
  totalSourceCount?: number;
  hasActiveFilters?: boolean;
  page: number;
  totalPages: number;
  rangeStart: number;
  rangeEnd: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onConfirm: (inv: PropertyInvestment) => void;
  onReject: (inv: PropertyInvestment) => void;
}) {
  if (tab !== activeTab) return null;

  if (items.length === 0) {
    return (
      <EmptyTabState
        tab={tab}
        filtered={hasActiveFilters && (totalSourceCount ?? 0) > 0}
      />
    );
  }

  return (
    <>
      <Accordion type="multiple" className="px-2 sm:px-4 py-2">
        {items.map((inv) => (
          <InvestmentAccordionItem
            key={inv.id}
            investment={inv}
            tab={tab}
            onConfirm={() => onConfirm(inv)}
            onReject={() => onReject(inv)}
          />
        ))}
      </Accordion>
      <TablePagination
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        pageSizeOptions={[8, 12, 20]}
        className="border-t border-border/60"
      />
    </>
  );
}

function EmptyTabState({
  tab,
  filtered,
}: {
  tab: InvestmentTab;
  filtered?: boolean;
}) {
  if (filtered) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <Search className="size-10 text-muted-foreground/40 mb-3" />
        <p className="text-sm font-semibold">Sin resultados</p>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm">
          No hay inversiones que coincidan con la búsqueda o los filtros aplicados.
        </p>
      </div>
    );
  }

  const copy = {
    confirmed: {
      title: "Sin inversiones confirmadas",
      description: "Las inversiones con tarjeta o Yape aparecerán aquí automáticamente.",
    },
    pending: {
      title: "Sin solicitudes pendientes",
      description:
        "Cuando un inversor envíe una transferencia o depósito desde /dashboard/invest, aparecerá aquí para tu revisión.",
    },
    rejected: {
      title: "Sin pagos rechazados",
      description: "Las solicitudes rechazadas y su motivo quedarán registradas en esta pestaña.",
    },
  };
  const { title, description } = copy[tab];
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="size-12 rounded-2xl bg-muted flex items-center justify-center mb-3">
        {tab === "confirmed" ? (
          <CheckCircle2 className="size-6 text-muted-foreground" />
        ) : tab === "pending" ? (
          <Clock className="size-6 text-muted-foreground" />
        ) : (
          <XCircle className="size-6 text-muted-foreground" />
        )}
      </div>
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-xs text-muted-foreground mt-1 max-w-sm">{description}</p>
    </div>
  );
}

function InvestmentSummary({
  inv,
  tab,
  compact,
}: {
  inv: PropertyInvestment;
  tab: InvestmentTab;
  compact?: boolean;
}) {
  const PaymentIcon = paymentIcons[inv.paymentMethod];
  const initials = inv.userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);
  const txRef = getTransactionNumber(inv);

  return (
    <div className="flex items-center gap-3 flex-1 min-w-0 text-left w-full">
      <div className="size-9 rounded-full bg-primary/15 flex items-center justify-center text-[10px] font-bold text-secondary shrink-0">
        {initials}
      </div>
      <div className="flex-1 min-w-0 grid gap-0.5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="text-sm font-semibold truncate">{inv.userName}</span>
          <Badge variant="outline" className="text-[9px] rounded-md font-normal gap-0.5 h-5 px-1.5">
            <PaymentIcon className="size-2.5" />
            {true && PAYMENT_METHOD_LABELS[inv.paymentMethod]}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-x-2 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-0.5 font-mono">
            <Hash className="size-3 shrink-0" />
            {txRef}
          </span>
          <span className="hidden sm:inline">·</span>
          <span>{formatDateTime(inv.submittedAt)}</span>
          {tab === "confirmed" && inv.confirmedAt && (
            <>
              <span className="hidden sm:inline">·</span>
              <span className="text-emerald-600/90">
                Confirmado {formatDate(inv.confirmedAt)}
              </span>
            </>
          )}
          {tab === "rejected" && inv.rejectedAt && (
            <>
              <span className="hidden sm:inline">·</span>
              <span className="text-destructive/80">Rechazado {formatDate(inv.rejectedAt)}</span>
            </>
          )}
        </div>
      </div>
      <p className="text-base font-bold tabular-nums shrink-0">{formatCurrency(inv.amount, inv.currency)}</p>
    </div>
  );
}

function InvestmentAccordionItem({
  investment: inv,
  tab,
  onConfirm,
  onReject,
}: {
  investment: PropertyInvestment;
  tab: InvestmentTab;
  onConfirm: () => void;
  onReject: () => void;
}) {
  return (
    <AccordionItem value={inv.id} className="border border-border/50 rounded-xl px-3 sm:px-4 mb-2 last:mb-0">
      <AccordionTrigger className="py-3 hover:no-underline [&>svg]:ml-2 items-center gap-4">
        <InvestmentSummary inv={inv} tab={tab} compact />
      </AccordionTrigger>
      <AccordionContent className="pb-4">
        <div className="space-y-3 pt-1 border-t border-border/40">
          <p className="text-xs text-muted-foreground">{inv.userEmail}</p>
          {inv.confirmedAt && tab === "confirmed" && (
            <p className="text-[11px] text-muted-foreground">
              Confirmado {formatDateTime(inv.confirmedAt)}
            </p>
          )}
          <PaymentDetailsBlock investment={inv} tab={tab} />
          {tab === "pending" && (
            <div className="flex flex-wrap gap-2 pt-1">
              <Button size="sm" className="rounded-xl" onClick={onConfirm}>
                <CheckCircle2 className="size-3.5 mr-1" />
                Confirmar
              </Button>
              <Button size="sm" variant="outline" className="rounded-xl" onClick={onReject}>
                Rechazar
              </Button>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

function PaymentDetailsBlock({
  investment: inv,
  tab,
}: {
  investment: PropertyInvestment;
  tab: InvestmentTab;
}) {
  const showVerificationDetails =
    inv.paymentMethod === "transfer" || inv.paymentMethod === "deposit";

  if (!showVerificationDetails && tab !== "rejected") {
    if (inv.paymentMethod === "card" && inv.cardLastFour) {
      return (
        <p className="text-xs text-muted-foreground">
          Tarjeta terminada en •••• {inv.cardLastFour}
        </p>
      );
    }
    if (inv.paymentMethod === "yape") {
      return (
        <p className="text-xs text-muted-foreground">
          {inv.yapePhone && <>Tel. {inv.yapePhone}</>}
          {inv.yapeApprovalCode && <> · Cód. {inv.yapeApprovalCode}</>}
        </p>
      );
    }
    return null;
  }

  return (
    <div className="rounded-xl border border-border/60 bg-muted/25 p-3 sm:p-4">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
        {inv.paymentMethod === "transfer" && (
          <>
            <DetailItem label="Cuenta origen" value={inv.originAccountNumber} />
            <DetailItem label="N.º operación" value={inv.transferNumber} />
          </>
        )}
        {inv.paymentMethod === "deposit" && (
          <>
            <DetailItem label="N.º voucher" value={inv.voucherNumber} />
            <DetailItem
              label="Fecha voucher"
              value={inv.voucherDate ? formatDate(inv.voucherDate) : undefined}
            />
            <DetailItem label="N.º operación" value={inv.operationNumber} />
          </>
        )}
        {inv.receiptUrl && (
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">
              Comprobante
            </p>
            <a
              href={inv.receiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              Ver voucher
              <ExternalLink className="size-3" />
            </a>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={inv.receiptUrl}
              alt="Comprobante de pago"
              className="mt-2 rounded-lg border border-border/60 max-h-24 object-cover w-full max-w-[200px]"
            />
          </div>
        )}
      </div>

      {tab === "rejected" && inv.rejectionReason && (
        <div className="mt-3 pt-3 border-t border-border/50 space-y-1">
          <p className="text-[10px] uppercase tracking-wide text-destructive/80 font-medium">
            Motivo del rechazo
          </p>
          <p className="text-xs text-foreground/90 leading-relaxed">{inv.rejectionReason}</p>
          {inv.rejectedBy && inv.rejectedAt && (
            <p className="text-[10px] text-muted-foreground mt-1">
              Rechazado por {inv.rejectedBy} · {formatDateTime(inv.rejectedAt)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="font-medium text-foreground mt-0.5">{value}</p>
    </div>
  );
}
