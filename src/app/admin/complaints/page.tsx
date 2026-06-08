"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  BookOpen,
  Clock,
  CheckCircle2,
  Eye,
  Mail,
  MoreHorizontal,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TablePagination } from "@/components/ui/table-pagination";
import { ComplaintDetailSheet } from "@/components/admin/ComplaintDetailSheet";
import { ComplaintResponseDialog } from "@/components/admin/ComplaintResponseDialog";
import {
  getComplaints,
  subscribeComplaints,
  updateComplaintStatus,
} from "@/lib/complaints/store";
import { formatDateTime } from "@/lib/admin/formatters";
import type { Complaint, ComplaintStatus } from "@/lib/admin/types";
import { usePagination } from "@/hooks/use-pagination";
import { cn } from "@/lib/utils";

const typeLabels: Record<Complaint["type"], string> = {
  reclamo: "Reclamo",
  queja: "Queja",
  sugerencia: "Sugerencia",
  consulta: "Consulta",
};

const statusLabels: Record<ComplaintStatus, string> = {
  pending: "Pendiente",
  in_review: "En revisión",
  resolved: "Resuelto",
};

const statusColors: Record<ComplaintStatus, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  in_review: "border-blue-200 bg-blue-50 text-blue-700",
  resolved: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

const borderColors: Record<ComplaintStatus, string> = {
  pending: "border-l-amber-500",
  in_review: "border-l-blue-500",
  resolved: "border-l-emerald-500",
};

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>(getComplaints);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | "all">("all");
  const [selected, setSelected] = useState<Complaint | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [responseOpen, setResponseOpen] = useState(false);

  const refresh = useCallback(() => setComplaints(getComplaints()), []);

  useEffect(() => {
    return subscribeComplaints(refresh);
  }, [refresh]);

  const filtered = useMemo(
    () =>
      complaints.filter((c) => {
        const q = search.toLowerCase();
        const matchSearch =
          c.fullName.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.subject.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q);
        const matchStatus = statusFilter === "all" || c.status === statusFilter;
        return matchSearch && matchStatus;
      }),
    [complaints, search, statusFilter]
  );

  const [pageSize, setPageSize] = useState(8);
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
    resetDeps: [search, statusFilter, pageSize],
  });

  const stats = useMemo(
    () => ({
      total: complaints.length,
      pending: complaints.filter((c) => c.status === "pending").length,
      inReview: complaints.filter((c) => c.status === "in_review").length,
      resolved: complaints.filter((c) => c.status === "resolved").length,
    }),
    [complaints]
  );

  const openDetail = (complaint: Complaint) => {
    setSelected(complaint);
    setDetailOpen(true);
  };

  const openResponse = (complaint: Complaint) => {
    setSelected(complaint);
    setResponseOpen(true);
  };

  const handleResponded = (complaint: Complaint) => {
    refresh();
    setSelected(complaint);
  };

  const markInReview = (id: string) => {
    updateComplaintStatus(id, "in_review");
    refresh();
    toast.success("Marcado como en revisión");
  };

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Atención al cliente
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Libro de reclamaciones
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestiona y responde las reclamaciones de los usuarios
          </p>
        </div>
      </motion.div>

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          {
            label: "Total",
            value: String(stats.total),
            sub: "reclamaciones",
            icon: BookOpen,
            accent: "text-blue-600 bg-blue-50",
          },
          {
            label: "Pendientes",
            value: String(stats.pending),
            sub: "sin atender",
            icon: Clock,
            accent: "text-amber-600 bg-amber-50",
          },
          {
            label: "En revisión",
            value: String(stats.inReview),
            sub: "en proceso",
            icon: Eye,
            accent: "text-violet-600 bg-violet-50",
          },
          {
            label: "Resueltas",
            value: String(stats.resolved),
            sub: "respondidas",
            icon: CheckCircle2,
            accent: "text-emerald-600 bg-emerald-50",
          },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="rounded-xl border border-border/60 bg-background px-4 py-3"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-[10px] uppercase tracking-wide text-muted-foreground">
                  {s.label}
                </p>
                <p className="mt-0.5 text-lg font-bold text-foreground">{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.sub}</p>
              </div>
              <div
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-lg",
                  s.accent.split(" ")[1]
                )}
              >
                <s.icon className={cn("size-4", s.accent.split(" ")[0])} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border/60 bg-background">
        <div className="flex flex-col gap-3 border-b border-border/40 bg-muted/15 p-4 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, correo, asunto o ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-xl border-border/80 bg-background pl-9"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as ComplaintStatus | "all")}
          >
            <SelectTrigger className="w-full rounded-xl sm:w-44">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="pending">Pendiente</SelectItem>
              <SelectItem value="in_review">En revisión</SelectItem>
              <SelectItem value="resolved">Resuelto</SelectItem>
            </SelectContent>
          </Select>
          <span className="hidden whitespace-nowrap text-xs text-muted-foreground sm:inline">
            {filtered.length} de {complaints.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border/60 bg-muted/40 hover:bg-muted/40">
                <TableHead className="min-w-[180px] pl-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Solicitante
                </TableHead>
                <TableHead className="min-w-[200px] text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Asunto
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Tipo
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Estado
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Fecha
                </TableHead>
                <TableHead className="pr-4 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedItems.map((c) => (
                <TableRow
                  key={c.id}
                  className={cn(
                    "group cursor-pointer border-l-[3px] transition-colors hover:bg-muted/25",
                    borderColors[c.status]
                  )}
                  onClick={() => openDetail(c)}
                >
                  <TableCell className="py-3 pl-4">
                    <div className="min-w-0">
                      <p className="max-w-[160px] truncate text-sm font-medium">
                        {c.fullName}
                      </p>
                      <p className="max-w-[180px] truncate text-[10px] text-muted-foreground">
                        {c.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <p className="line-clamp-1 max-w-[240px] text-sm">{c.subject}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">{c.id}</p>
                  </TableCell>
                  <TableCell className="py-3">
                    <span className="inline-flex items-center rounded-md border border-border bg-muted/50 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                      {typeLabels[c.type]}
                    </span>
                  </TableCell>
                  <TableCell className="py-3">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold",
                        statusColors[c.status]
                      )}
                    >
                      {statusLabels[c.status]}
                    </span>
                  </TableCell>
                  <TableCell className="py-3">
                    <span className="text-xs text-muted-foreground">
                      {formatDateTime(c.createdAt)}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 pr-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-0.5 opacity-80 group-hover:opacity-100">
                      {c.status !== "resolved" && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="rounded-lg"
                          onClick={() => openResponse(c)}
                          title="Responder"
                        >
                          <Mail className="size-4" />
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm" className="rounded-lg">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl">
                          <DropdownMenuItem onClick={() => openDetail(c)}>
                            <Eye className="mr-2 size-4" />
                            Ver detalle
                          </DropdownMenuItem>
                          {c.status === "pending" && (
                            <DropdownMenuItem onClick={() => markInReview(c.id)}>
                              <Clock className="mr-2 size-4" />
                              Marcar en revisión
                            </DropdownMenuItem>
                          )}
                          {c.status !== "resolved" && (
                            <DropdownMenuItem onClick={() => openResponse(c)}>
                              <Mail className="mr-2 size-4" />
                              Responder por correo
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-16 text-center">
                    <X className="mx-auto mb-2 size-8 text-muted-foreground/30" />
                    <p className="text-sm font-medium text-foreground">
                      Sin reclamaciones
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Ajusta los filtros o espera nuevas solicitudes
                    </p>
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

      <ComplaintDetailSheet
        complaint={selected}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onRespond={openResponse}
      />

      <ComplaintResponseDialog
        complaint={selected}
        open={responseOpen}
        onOpenChange={setResponseOpen}
        onResponded={handleResponded}
      />
    </div>
  );
}
