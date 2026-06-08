"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Crown,
  MapPin,
  TrendingUp,
  Users,
  Eye,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRightLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TablePagination } from "@/components/ui/table-pagination";
import { CurrencyBadge } from "@/components/shared/CurrencyBadge";
import { adminPremiumProperties } from "@/lib/admin/premium-mock-data";
import { formatCurrency, formatDate } from "@/lib/admin/formatters";
import type { PremiumPropertyAdminStatus } from "@/lib/admin/types";
import { usePagination } from "@/hooks/use-pagination";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  PremiumPropertyAdminStatus,
  { label: string; rowBorder: string; badge: string; icon: typeof Crown }
> = {
  available: {
    label: "Disponible",
    rowBorder: "border-l-amber-500",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock,
  },
  caught: {
    label: "Capturada",
    rowBorder: "border-l-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
  },
  expired: {
    label: "Expirada",
    rowBorder: "border-l-red-400",
    badge: "bg-red-50 text-red-600 border-red-200",
    icon: XCircle,
  },
  converted: {
    label: "Convertida",
    rowBorder: "border-l-blue-400",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    icon: ArrowRightLeft,
  },
};

export default function AdminPremiumPropertiesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [pageSize, setPageSize] = useState(8);

  const filtered = useMemo(
    () =>
      adminPremiumProperties.filter((p) => {
        const q = search.toLowerCase();
        const matchSearch =
          p.title.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q);
        const matchStatus =
          statusFilter === "all" || p.premiumStatus === statusFilter;
        return matchSearch && matchStatus;
      }),
    [search, statusFilter]
  );

  const stats = useMemo(
    () => ({
      total: adminPremiumProperties.length,
      available: adminPremiumProperties.filter((p) => p.premiumStatus === "available").length,
      caught: adminPremiumProperties.filter((p) => p.premiumStatus === "caught").length,
      converted: adminPremiumProperties.filter(
        (p) => p.premiumStatus === "converted" || p.premiumStatus === "expired"
      ).length,
    }),
    []
  );

  const { page, setPage, totalPages, paginatedItems, rangeStart, rangeEnd, totalItems } =
    usePagination(filtered, { pageSize, resetDeps: [search, statusFilter, pageSize] });

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Crown className="size-5 text-amber-600" />
            <h2 className="text-2xl font-bold tracking-tight">Propiedades Premium</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Gestiona ventanas exclusivas, capturas al 100% y conversiones a estándar
          </p>
        </div>
        <Button className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white">
          <Crown className="size-4 mr-2" />
          Nueva propiedad Premium
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Premium", value: stats.total, icon: Crown, color: "text-amber-600 bg-amber-50" },
          { label: "Disponibles", value: stats.available, icon: Clock, color: "text-amber-600 bg-amber-50" },
          { label: "Capturadas", value: stats.caught, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
          { label: "Convertidas", value: stats.converted, icon: ArrowRightLeft, color: "text-blue-600 bg-blue-50" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="rounded-xl border border-border/60 bg-white px-4 py-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase">{s.label}</p>
                <p className="text-2xl font-bold">{s.value}</p>
              </div>
              <div className={cn("size-9 rounded-lg flex items-center justify-center", s.color.split(" ")[1])}>
                <s.icon className={cn("size-4", s.color.split(" ")[0])} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar propiedad premium..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 rounded-xl"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", "available", "caught", "converted"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "text-xs font-medium px-3 py-1.5 rounded-full border transition-all",
                statusFilter === s
                  ? "bg-amber-500 text-white border-amber-500"
                  : "border-border text-muted-foreground hover:border-amber-300 bg-white"
              )}
            >
              {s === "all" ? "Todas" : statusConfig[s as PremiumPropertyAdminStatus]?.label ?? s}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border/60 bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead>Propiedad</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>ROI Premium</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Inversor</TableHead>
              <TableHead>Vence</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedItems.map((p) => {
              const status = statusConfig[p.premiumStatus ?? "available"];
              const isCaught = p.premiumStatus === "caught";
              return (
                <TableRow
                  key={p.id}
                  className={cn("border-l-4", status.rowBorder, isCaught && "bg-emerald-50/20")}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image} alt="" className="size-10 rounded-lg object-cover" />
                      <div>
                        <p className="text-sm font-medium">{p.title}</p>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <MapPin className="size-2.5" />
                          {p.district}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <CurrencyBadge currency={p.currency} />
                      <span className="text-sm font-medium">
                        {formatCurrency(p.totalInvestment, p.currency)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-bold text-amber-700 flex items-center gap-0.5">
                      <TrendingUp className="size-3" />
                      {p.premiumRoi}%
                    </span>
                    <p className="text-[10px] text-muted-foreground">
                      vs {p.roi}% estándar
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={status.badge}>
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {isCaught ? (
                      <div>
                        <p className="text-sm font-medium text-emerald-700">
                          {p.caughtByUserName}
                        </p>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                          <Users className="size-2.5" />
                          1 inversor · 100%
                        </p>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {p.premiumDeadline
                      ? formatDate(p.premiumDeadline.split("T")[0])
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <Button asChild variant="ghost" size="icon-sm" className="rounded-lg">
                      <Link href={`/admin/premium-properties/${p.id}`}>
                        <Eye className="size-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
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
    </div>
  );
}
