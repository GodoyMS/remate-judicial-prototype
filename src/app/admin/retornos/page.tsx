"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  ArrowDownToLine,
  Flag,
  CheckCircle2,
  Clock,
  RotateCcw,
  TrendingUp,
  Target,
  UserCheck,
  X,
  Eye,
  Filter,
  History,
  ShieldCheck,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TablePagination } from "@/components/ui/table-pagination";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  getRetornos,
  subscribeRetornos,
  getAssignedToRetornos,
} from "@/lib/retornos/store";
import type { Retorno, RetornoType, TicketStatus } from "@/lib/retornos/types";
import { formatDateTime, formatCurrency } from "@/lib/admin/formatters";
import { usePagination } from "@/hooks/use-pagination";
import { useAdminAuth } from "@/contexts/admin-auth-context";
import { CreateRetornoDialog } from "@/components/admin/retornos/CreateRetornoDialog";
import { RetornoDetailSheet } from "@/components/admin/retornos/RetornoDetailSheet";
import { AssignTicketPopover } from "@/components/admin/retornos/AssignTicketPopover";
import { ResolveTicketDialog } from "@/components/admin/retornos/ResolveTicketDialog";
import { TicketActivitySheet } from "@/components/admin/retornos/TicketActivitySheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const retornoTypeConfig: Record<RetornoType, { label: string; icon: typeof TrendingUp; color: string }> = {
  roi_return: { label: "Retorno ROI", icon: TrendingUp, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  refund: { label: "Reembolso", icon: RotateCcw, color: "text-blue-600 bg-blue-50 border-blue-200" },
  goal_not_reached: { label: "Meta no alcanzada", icon: Target, color: "text-amber-600 bg-amber-50 border-amber-200" },
};

const ticketStatusConfig: Record<TicketStatus, { label: string; color: string }> = {
  flagged: { label: "Observado", color: "border-amber-200 bg-amber-50 text-amber-700" },
  in_review: { label: "En revisión", color: "border-blue-200 bg-blue-50 text-blue-700" },
  resolved: { label: "Resuelto", color: "border-emerald-200 bg-emerald-50 text-emerald-700" },
};

type FilterType = RetornoType | "all";
type FilterTicket = TicketStatus | "flagged_first" | "all" | "none";

function sortRetornos(list: Retorno[]): Retorno[] {
  return [...list].sort((a, b) => {
    const aFlagged = a.ticket?.status === "flagged" ? 0 : 1;
    const bFlagged = b.ticket?.status === "flagged" ? 0 : 1;
    if (aFlagged !== bFlagged) return aFlagged - bFlagged;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

function RetornosTable({
  retornos,
  adminId,
  adminName,
  onViewDetail,
  onActivity,
  onAssigned,
  onResolve,
}: {
  retornos: Retorno[];
  adminId: string;
  adminName: string;
  onViewDetail: (r: Retorno) => void;
  onActivity: (r: Retorno) => void;
  onAssigned: () => void;
  onResolve: (r: Retorno) => void;
}) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<FilterType>("all");
  const [ticketFilter, setTicketFilter] = useState<FilterTicket>("all");
  const [pageSize, setPageSize] = useState(8);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let list = retornos.filter((r) => {
      const matchSearch =
        r.id.toLowerCase().includes(q) ||
        r.userName.toLowerCase().includes(q) ||
        r.userEmail.toLowerCase().includes(q) ||
        r.propertyTitle.toLowerCase().includes(q);
      const matchType = typeFilter === "all" || r.type === typeFilter;
      const matchTicket =
        ticketFilter === "all"
          ? true
          : ticketFilter === "none"
          ? !r.ticket
          : ticketFilter === "flagged_first"
          ? true
          : r.ticket?.status === ticketFilter;
      return matchSearch && matchType && matchTicket;
    });
    if (ticketFilter === "flagged_first") {
      list = sortRetornos(list);
    }
    return list;
  }, [retornos, search, typeFilter, ticketFilter]);

  const { page, setPage, totalPages, paginatedItems, rangeStart, rangeEnd, totalItems } =
    usePagination(filtered, { pageSize, resetDeps: [search, typeFilter, ticketFilter, pageSize] });

  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-background">
      <div className="flex flex-col gap-3 border-b border-border/40 bg-muted/15 p-4 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente, ID, propiedad..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-xl border-border/80 bg-background pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as FilterType)}>
          <SelectTrigger className="w-full rounded-xl sm:w-44">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            <SelectItem value="roi_return">Retorno ROI</SelectItem>
            <SelectItem value="refund">Reembolso</SelectItem>
            <SelectItem value="goal_not_reached">Meta no alcanzada</SelectItem>
          </SelectContent>
        </Select>
        <Select value={ticketFilter} onValueChange={(v) => setTicketFilter(v as FilterTicket)}>
          <SelectTrigger className="w-full rounded-xl sm:w-48">
            <SelectValue placeholder="Ticket" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="flagged_first">🚩 Observados primero</SelectItem>
            <SelectItem value="flagged">Observados</SelectItem>
            <SelectItem value="in_review">En revisión</SelectItem>
            <SelectItem value="resolved">Resueltos</SelectItem>
            <SelectItem value="none">Sin ticket</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/60 bg-muted/40 hover:bg-muted/40">
              <TableHead className="pl-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground min-w-[180px]">
                Cliente
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground min-w-[200px]">
                Propiedad
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Tipo
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Monto
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Ticket
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Fecha
              </TableHead>
              <TableHead className="pr-4 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground min-w-[160px]">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedItems.map((r) => {
              const typeCfg = retornoTypeConfig[r.type];
              const isFlagged = r.ticket?.status === "flagged";
              return (
                <TableRow
                  key={r.id}
                  className={cn(
                    "group cursor-pointer border-l-[3px] transition-colors hover:bg-muted/25",
                    isFlagged ? "border-l-amber-500" : "border-l-transparent"
                  )}
                  onClick={() => onViewDetail(r)}
                >
                  <TableCell className="py-3 pl-4">
                    <div className="flex items-center gap-2">
                      {isFlagged && <Flag className="size-3.5 shrink-0 text-amber-500" />}
                      <div>
                        <p className="max-w-[160px] truncate text-sm font-medium">{r.userName}</p>
                        <p className="max-w-[180px] truncate text-[10px] text-muted-foreground">{r.userEmail}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <p className="line-clamp-1 max-w-[220px] text-sm">{r.propertyTitle}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">{r.id}</p>
                  </TableCell>
                  <TableCell className="py-3">
                    <span className={cn("inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold", typeCfg.color)}>
                      <typeCfg.icon className="size-3" />
                      {typeCfg.label}
                    </span>
                  </TableCell>
                  <TableCell className="py-3">
                    <span className="text-sm font-semibold">{formatCurrency(r.amount, r.currency)}</span>
                  </TableCell>
                  <TableCell className="py-3">
                    {r.ticket ? (
                      <span className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold", ticketStatusConfig[r.ticket.status].color)}>
                        {ticketStatusConfig[r.ticket.status].label}
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="py-3">
                    <span className="text-xs text-muted-foreground">{formatDateTime(r.createdAt)}</span>
                  </TableCell>
                  <TableCell className="py-3 pr-4" onClick={(e) => e.stopPropagation()}>
                    <TooltipProvider>
                      <div className="flex items-center justify-end gap-1">
                        {r.ticket && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                className="rounded-lg"
                                onClick={() => onActivity(r)}
                              >
                                <History className="size-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Ver historial de actividad</TooltipContent>
                          </Tooltip>
                        )}
                        {r.ticket?.status === "flagged" && (
                          <AssignTicketPopover
                            retorno={r}
                            currentAdminId={adminId}
                            currentAdminName={adminName}
                            onAssigned={onAssigned}
                          />
                        )}
                        {r.ticket?.status === "in_review" &&
                          r.ticket.assignedToId === adminId && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon-sm"
                                  className="rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                                  onClick={() => onResolve(r)}
                                >
                                  <ShieldCheck className="size-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Resolver ticket</TooltipContent>
                            </Tooltip>
                          )}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="rounded-lg"
                              onClick={() => onViewDetail(r)}
                            >
                              <Eye className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Ver detalle</TooltipContent>
                        </Tooltip>
                      </div>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-16 text-center">
                  <X className="mx-auto mb-2 size-8 text-muted-foreground/30" />
                  <p className="text-sm font-medium">Sin retornos</p>
                  <p className="mt-1 text-xs text-muted-foreground">Ajusta los filtros o crea un nuevo retorno</p>
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
      />
    </div>
  );
}

export default function AdminRetornosPage() {
  const { account } = useAdminAuth();
  const [retornos, setRetornos] = useState<Retorno[]>(() => sortRetornos(getRetornos()));
  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected] = useState<Retorno | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [activityRetorno, setActivityRetorno] = useState<Retorno | null>(null);
  const [activityOpen, setActivityOpen] = useState(false);
  const [resolveRetorno, setResolveRetorno] = useState<Retorno | null>(null);
  const [resolveOpen, setResolveOpen] = useState(false);

  const refresh = useCallback(() => {
    setRetornos(sortRetornos(getRetornos()));
    if (selected) {
      const updated = getRetornos().find((r) => r.id === selected.id);
      if (updated) setSelected(updated);
    }
  }, [selected]);

  useEffect(() => subscribeRetornos(refresh), [refresh]);

  const myRetornos = useMemo(
    () => (account ? sortRetornos(getAssignedToRetornos(account.id)) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [account, retornos]
  );

  const flaggedCount = retornos.filter((r) => r.ticket?.status === "flagged").length;

  const stats = useMemo(
    () => ({
      total: retornos.length,
      flagged: retornos.filter((r) => r.ticket?.status === "flagged").length,
      inReview: retornos.filter((r) => r.ticket?.status === "in_review").length,
      resolved: retornos.filter((r) => r.ticket?.status === "resolved").length,
    }),
    [retornos]
  );

  function openDetail(r: Retorno) {
    setSelected(r);
    setDetailOpen(true);
  }

  function openActivity(r: Retorno) {
    setActivityRetorno(r);
    setActivityOpen(true);
  }

  function openResolve(r: Retorno) {
    setResolveRetorno(r);
    setResolveOpen(true);
  }

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Finanzas
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Retornos</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestiona retornos de inversión, reembolsos y devoluciones
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="rounded-xl gap-2">
          <Plus className="size-4" />
          Nuevo retorno
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Total", value: stats.total, sub: "retornos", icon: ArrowDownToLine, accent: "text-blue-600 bg-blue-50" },
          { label: "Observados", value: stats.flagged, sub: "pendientes de acción", icon: Flag, accent: "text-amber-600 bg-amber-50" },
          { label: "En revisión", value: stats.inReview, sub: "asignados", icon: Clock, accent: "text-violet-600 bg-violet-50" },
          { label: "Resueltos", value: stats.resolved, sub: "tickets cerrados", icon: CheckCircle2, accent: "text-emerald-600 bg-emerald-50" },
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
                <p className="mt-0.5 text-lg font-bold">{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.sub}</p>
              </div>
              <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", s.accent.split(" ")[1])}>
                <s.icon className={cn("size-4", s.accent.split(" ")[0])} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4 rounded-xl">
          <TabsTrigger value="all" className="rounded-lg gap-1.5">
            <Filter className="size-3.5" />
            Todos
            {flaggedCount > 0 && (
              <span className="ml-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[9px] font-bold text-white">
                {flaggedCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="mine" className="rounded-lg gap-1.5">
            <UserCheck className="size-3.5" />
            Asignados a mí
            {myRetornos.length > 0 && (
              <span className="ml-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[9px] font-bold text-background">
                {myRetornos.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <RetornosTable
            retornos={retornos}
            adminId={account?.id ?? ""}
            adminName={account?.name ?? "Admin"}
            onViewDetail={openDetail}
            onActivity={openActivity}
            onAssigned={refresh}
            onResolve={openResolve}
          />
        </TabsContent>

        <TabsContent value="mine">
          {myRetornos.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <UserCheck className="mb-3 size-10 text-muted-foreground/30" />
              <p className="text-sm font-medium text-foreground">Sin tickets asignados</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Los tickets que te asignen aparecerán aquí
              </p>
            </div>
          ) : (
            <RetornosTable
              retornos={myRetornos}
              adminId={account?.id ?? ""}
              adminName={account?.name ?? "Admin"}
              onViewDetail={openDetail}
              onActivity={openActivity}
              onAssigned={refresh}
              onResolve={openResolve}
            />
          )}
        </TabsContent>
      </Tabs>

      <CreateRetornoDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        adminName={account?.name ?? "Admin"}
      />

      <RetornoDetailSheet
        retorno={selected}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />

      <ResolveTicketDialog
        retorno={resolveRetorno}
        open={resolveOpen}
        onOpenChange={setResolveOpen}
        resolverName={account?.name ?? "Admin"}
        onResolved={() => { setResolveOpen(false); refresh(); }}
      />

      <TicketActivitySheet
        retorno={activityRetorno}
        open={activityOpen}
        onOpenChange={setActivityOpen}
      />
    </div>
  );
}
