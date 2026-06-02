"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  MapPin,
  TrendingUp,
  Users,
  Eye,
  Star,
  MoreHorizontal,
  X,
  Building2,
  FileCheck,
  FilePen,
} from "lucide-react";
import { toast } from "sonner";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { AdminFiltersShell } from "@/components/admin/AdminFiltersShell";
import { CreatePropertyDialog } from "@/components/admin/CreatePropertyDialog";
import {
  PropertiesFiltersContent,
  defaultPropertiesFilters,
  countPropertiesActiveFilters,
  matchPublishedFilter,
  type PropertiesFilterState,
} from "@/components/admin/PropertiesFiltersContent";
import { TablePagination } from "@/components/ui/table-pagination";
import { matchesMulti } from "@/lib/admin/filters";
import { adminProperties } from "@/lib/admin/mock-data";
import { formatCurrency, formatDate } from "@/lib/admin/formatters";
import type { AdminProperty, PropertyStatus } from "@/lib/admin/types";
import { usePagination } from "@/hooks/use-pagination";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  PropertyStatus,
  { label: string; rowBorder: string; badge: string }
> = {
  published: {
    label: "Activa",
    rowBorder: "border-l-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  draft: {
    label: "Borrador",
    rowBorder: "border-l-amber-500",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
  },
  closed: {
    label: "Cerrada",
    rowBorder: "border-l-slate-400",
    badge: "bg-slate-50 text-slate-600 border-slate-200",
  },
};

export default function AdminPropertiesPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filters, setFilters] =
    useState<PropertiesFilterState>(defaultPropertiesFilters);
  const [properties, setProperties] = useState<AdminProperty[]>(adminProperties);

  const filtered = useMemo(
    () =>
      properties.filter((p) => {
        const q = search.toLowerCase();
        const matchSearch =
          p.title.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q);
        const matchRegion = !filters.region || p.region === filters.region;
        const matchDistrict =
          filters.districts.length === 0 ||
          filters.districts.includes(p.district);
        const matchPublished = matchPublishedFilter(filters.published, p.published);
        const matchStatus = matchesMulti(filters.statuses, p.status);
        const matchAmount =
          p.totalInvestment >= filters.amountRange[0] &&
          p.totalInvestment <= filters.amountRange[1];
        return (
          matchSearch &&
          matchRegion &&
          matchDistrict &&
          matchPublished &&
          matchStatus &&
          matchAmount
        );
      }),
    [properties, search, filters]
  );

  const activeFiltersCount = countPropertiesActiveFilters(filters);

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
    resetDeps: [search, filters, pageSize],
  });

  const stats = useMemo(
    () => ({
      total: properties.length,
      published: properties.filter((p) => p.status === "published").length,
      draft: properties.filter((p) => p.status === "draft").length,
      featured: properties.filter((p) => p.featured).length,
    }),
    [properties]
  );

  const toggleFeatured = (id: string) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p))
    );
    toast.success("Propiedad actualizada");
  };

  const togglePublished = (id: string) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              published: !p.published,
              status: !p.published ? "published" : "draft",
            }
          : p
      )
    );
    toast.success("Estado de publicación actualizado");
  };

  const clearFilters = () => {
    setFilters(defaultPropertiesFilters);
  };

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6"
      >
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
            Catálogo administrativo
          </p>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Gestión de propiedades
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Publicación, financiamiento y seguimiento de activos en remate
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="rounded-xl font-semibold shrink-0 w-full sm:w-auto"
        >
          <Plus className="size-4 mr-2" />
          Nueva propiedad
        </Button>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          {
            label: "Total activos",
            value: String(stats.total),
            sub: "en plataforma",
            icon: Building2,
            accent: "text-blue-600 bg-blue-50",
          },
          {
            label: "Publicadas",
            value: String(stats.published),
            sub: "subastas activas",
            icon: FileCheck,
            accent: "text-emerald-600 bg-emerald-50",
          },
          {
            label: "Borradores",
            value: String(stats.draft),
            sub: "pendientes",
            icon: FilePen,
            accent: "text-amber-600 bg-amber-50",
          },
          {
            label: "Destacadas",
            value: String(stats.featured),
            sub: "en home",
            icon: Star,
            accent: "text-violet-600 bg-violet-50",
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
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide truncate">
                  {s.label}
                </p>
                <p className="text-lg font-bold text-foreground mt-0.5">{s.value}</p>
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

      <div className="rounded-xl border border-border/60 bg-background overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border-b border-border/40 bg-muted/15">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por título o dirección..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 rounded-xl border-border/80 bg-background w-full"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <AdminFiltersShell
              activeCount={activeFiltersCount}
              onClear={clearFilters}
              title="Filtrar propiedades"
              description="Combina regiones, estados y más"
              popoverClassName="w-[min(100vw-2rem,640px)]"
            >
              <PropertiesFiltersContent filters={filters} onChange={setFilters} />
            </AdminFiltersShell>
            <span className="text-xs text-muted-foreground whitespace-nowrap hidden sm:inline">
              {filtered.length} de {properties.length}
            </span>
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground px-4 py-2 sm:hidden border-b border-border/30">
          {filtered.length} de {properties.length} propiedades
        </p>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40 border-b border-border/60">
                <TableHead className="pl-4 min-w-[220px] text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Propiedad
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Ubicación
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  ROI
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground min-w-[120px]">
                  Progreso
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Inversores
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
              {paginatedItems.map((p) => {
                const progress = Math.round(
                  (p.raisedAmount / p.totalInvestment) * 100
                );
                const cfg = statusConfig[p.status];
                return (
                  <TableRow
                    key={p.id}
                    className={cn(
                      "group border-l-[3px] hover:bg-muted/25 transition-colors",
                      cfg.rowBorder
                    )}
                  >
                    <TableCell className="pl-4 py-3">
                      <div className="flex items-center gap-3 min-w-[200px]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.image}
                          alt={p.title}
                          className="size-10 rounded-lg object-cover shrink-0 ring-1 ring-border/60"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-medium truncate max-w-[200px]">
                              {p.title}
                            </p>
                            {p.featured && (
                              <Star className="size-3 text-amber-500 fill-amber-500 shrink-0" />
                            )}
                          </div>
                          <p className="text-[10px] text-muted-foreground">
                            {formatDate(p.publishDate)}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="size-3 shrink-0" />
                        <span className="truncate max-w-[140px]">
                          {p.district}, {p.region}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 whitespace-nowrap">
                      <span className="text-sm font-bold text-emerald-600 flex items-center gap-0.5 tabular-nums">
                        <TrendingUp className="size-3" />
                        +{p.roi}%
                      </span>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="w-28 min-w-[100px]">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-medium text-muted-foreground tabular-nums">
                            {progress}%
                          </span>
                        </div>
                        <Progress value={progress} className="h-1.5" />
                        <p className="text-[10px] text-muted-foreground mt-0.5 tabular-nums">
                          {formatCurrency(p.raisedAmount)} /{" "}
                          {formatCurrency(p.totalInvestment)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 whitespace-nowrap">
                      <span className="text-sm flex items-center gap-1 tabular-nums">
                        <Users className="size-3.5 text-muted-foreground" />
                        {p.investorsCount}
                      </span>
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
                        >
                          <Link href={`/admin/properties/${p.id}`}>
                            <Eye className="size-4" />
                          </Link>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="rounded-lg"
                            >
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl">
                            <DropdownMenuItem onClick={() => toggleFeatured(p.id)}>
                              <Star className="size-4 mr-2" />
                              {p.featured ? "Quitar destacado" : "Marcar destacada"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => togglePublished(p.id)}>
                              {p.published ? "Despublicar" : "Publicar"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/properties/${p.id}`}>
                                Ver detalle
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-16 text-center">
                    <X className="size-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm font-medium text-foreground">
                      Sin propiedades
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Ajusta los filtros o crea una nueva propiedad
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
        />
      </div>

      <CreatePropertyDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
