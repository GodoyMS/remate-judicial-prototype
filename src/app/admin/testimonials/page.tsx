"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  Star,
  MoreHorizontal,
  X,
  MessageSquareQuote,
  Video,
  Eye,
  EyeOff,
  Pencil,
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminFiltersShell } from "@/components/admin/AdminFiltersShell";
import { CreateTestimonialDialog } from "@/components/admin/CreateTestimonialDialog";
import { EditTestimonialSheet } from "@/components/admin/EditTestimonialSheet";
import {
  TestimonialsFiltersContent,
  defaultTestimonialsFilters,
  countTestimonialsActiveFilters,
  matchTestimonialPublishedFilter,
  matchTestimonialFeaturedFilter,
  matchTestimonialVideoFilter,
  type TestimonialsFilterState,
} from "@/components/admin/TestimonialsFiltersContent";
import { TablePagination } from "@/components/ui/table-pagination";
import { adminTestimonials } from "@/lib/admin/mock-data";
import { formatDate } from "@/lib/admin/formatters";
import type { AdminTestimonial } from "@/lib/admin/types";
import { usePagination } from "@/hooks/use-pagination";
import { ReadOnlyBanner } from "@/components/admin/rbac/ReadOnlyBanner";
import { PermissionGate } from "@/components/admin/rbac/PermissionGate";
import { cn } from "@/lib/utils";

export default function AdminTestimonialsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState<AdminTestimonial | null>(null);
  const [search, setSearch] = useState("");
  const [filters, setFilters] =
    useState<TestimonialsFilterState>(defaultTestimonialsFilters);
  const [testimonials, setTestimonials] =
    useState<AdminTestimonial[]>(adminTestimonials);

  const filtered = useMemo(
    () =>
      testimonials
        .filter((t) => {
          const q = search.toLowerCase();
          const matchSearch =
            t.name.toLowerCase().includes(q) ||
            t.role.toLowerCase().includes(q) ||
            t.review.toLowerCase().includes(q);
          const matchPublished = matchTestimonialPublishedFilter(
            filters.published,
            t.published
          );
          const matchFeatured = matchTestimonialFeaturedFilter(
            filters.featured,
            t.featured
          );
          const matchVideo = matchTestimonialVideoFilter(
            filters.hasVideo,
            Boolean(t.videoUrl)
          );
          return matchSearch && matchPublished && matchFeatured && matchVideo;
        })
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [testimonials, search, filters]
  );

  const activeFiltersCount = countTestimonialsActiveFilters(filters);

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
      total: testimonials.length,
      published: testimonials.filter((t) => t.published).length,
      draft: testimonials.filter((t) => !t.published).length,
      withVideo: testimonials.filter((t) => t.videoUrl).length,
      featured: testimonials.filter((t) => t.featured).length,
    }),
    [testimonials]
  );

  const nextSortOrder = useMemo(
    () => Math.max(0, ...testimonials.map((t) => t.sortOrder)) + 1,
    [testimonials]
  );

  const handleCreate = (testimonial: AdminTestimonial) => {
    setTestimonials((prev) => [...prev, testimonial]);
  };

  const handleSave = (testimonial: AdminTestimonial) => {
    setTestimonials((prev) =>
      prev.map((t) => (t.id === testimonial.id ? testimonial : t))
    );
  };

  const handleDelete = (id: string) => {
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
  };

  const togglePublished = (id: string) => {
    setTestimonials((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, published: !t.published } : t
      )
    );
    toast.success("Estado de publicación actualizado");
  };

  const toggleFeatured = (id: string) => {
    setTestimonials((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, featured: !t.featured } : t
      )
    );
    toast.success("Destacado actualizado");
  };

  const openEdit = (testimonial: AdminTestimonial) => {
    setSelected(testimonial);
    setEditOpen(true);
  };

  const clearFilters = () => setFilters(defaultTestimonialsFilters);

  return (
    <div className="w-full">
      <ReadOnlyBanner module="testimonials" />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Contenido de landing
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Testimonios
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestiona las historias de inversores en la página principal
          </p>
        </div>
        <PermissionGate module="testimonials" showDisabled>
          <Button
            onClick={() => setCreateOpen(true)}
            className="w-full shrink-0 rounded-xl font-semibold sm:w-auto"
          >
            <Plus className="mr-2 size-4" />
            Nuevo testimonio
          </Button>
        </PermissionGate>
      </motion.div>

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
        {[
          {
            label: "Total",
            value: String(stats.total),
            sub: "testimonios",
            icon: MessageSquareQuote,
            accent: "text-blue-600 bg-blue-50",
          },
          {
            label: "Publicados",
            value: String(stats.published),
            sub: "en landing",
            icon: Eye,
            accent: "text-emerald-600 bg-emerald-50",
          },
          {
            label: "Borradores",
            value: String(stats.draft),
            sub: "ocultos",
            icon: EyeOff,
            accent: "text-amber-600 bg-amber-50",
          },
          {
            label: "Con video",
            value: String(stats.withVideo),
            sub: "multimedia",
            icon: Video,
            accent: "text-violet-600 bg-violet-50",
          },
          {
            label: "Destacados",
            value: String(stats.featured),
            sub: "prioridad",
            icon: Star,
            accent: "text-orange-600 bg-orange-50",
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
              placeholder="Buscar por nombre, rol o contenido..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-xl border-border/80 bg-background pl-9"
            />
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <AdminFiltersShell
              activeCount={activeFiltersCount}
              onClear={clearFilters}
              title="Filtrar testimonios"
              description="Publicación, destacados y tipo de contenido"
              popoverClassName="w-[min(100vw-2rem,480px)]"
            >
              <TestimonialsFiltersContent filters={filters} onChange={setFilters} />
            </AdminFiltersShell>
            <span className="hidden whitespace-nowrap text-xs text-muted-foreground sm:inline">
              {filtered.length} de {testimonials.length}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border/60 bg-muted/40 hover:bg-muted/40">
                <TableHead className="min-w-[200px] pl-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Inversor
                </TableHead>
                <TableHead className="min-w-[240px] text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Testimonio
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Rating
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Tipo
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Orden
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
              {paginatedItems.map((t) => (
                <TableRow
                  key={t.id}
                  className={cn(
                    "group border-l-[3px] transition-colors hover:bg-muted/25",
                    t.published ? "border-l-emerald-500" : "border-l-amber-500"
                  )}
                >
                  <TableCell className="py-3 pl-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {t.avatar}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="max-w-[160px] truncate text-sm font-medium">
                            {t.name}
                          </p>
                          {t.featured && (
                            <Star className="size-3 shrink-0 fill-amber-500 text-amber-500" />
                          )}
                        </div>
                        <p className="max-w-[180px] truncate text-[10px] text-muted-foreground">
                          {t.role}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <p className="line-clamp-2 max-w-[280px] text-xs text-muted-foreground">
                      {t.review}
                    </p>
                    {t.amount && (
                      <p className="mt-1 text-[10px] font-medium text-foreground/70">
                        {t.amount}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.stars }).map((_, i) => (
                        <Star
                          key={i}
                          className="size-3 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    {t.videoUrl ? (
                      <span className="inline-flex items-center gap-1 rounded-md border border-violet-200 bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
                        <Video className="size-3" />
                        Video
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-md border border-border bg-muted/50 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                        Texto
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="py-3">
                    <span className="text-sm font-medium tabular-nums">{t.sortOrder}</span>
                  </TableCell>
                  <TableCell className="py-3">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold",
                        t.published
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-amber-200 bg-amber-50 text-amber-700"
                      )}
                    >
                      {t.published ? "Publicado" : "Borrador"}
                    </span>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      {formatDate(t.createdAt)}
                    </p>
                  </TableCell>
                  <TableCell className="py-3 pr-4">
                    <PermissionGate module="testimonials" fallback={<span className="text-[10px] text-muted-foreground">Solo lectura</span>}>
                    <div className="flex items-center justify-end gap-0.5 opacity-80 group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="rounded-lg"
                        onClick={() => openEdit(t)}
                      >
                        <Pencil className="size-4" />
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
                          <DropdownMenuItem onClick={() => openEdit(t)}>
                            <Pencil className="mr-2 size-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleFeatured(t.id)}>
                            <Star className="mr-2 size-4" />
                            {t.featured ? "Quitar destacado" : "Destacar"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => togglePublished(t.id)}>
                            {t.published ? (
                              <>
                                <EyeOff className="mr-2 size-4" />
                                Despublicar
                              </>
                            ) : (
                              <>
                                <Eye className="mr-2 size-4" />
                                Publicar
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => {
                              handleDelete(t.id);
                              toast.success("Testimonio eliminado");
                            }}
                          >
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    </PermissionGate>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-16 text-center">
                    <X className="mx-auto mb-2 size-8 text-muted-foreground/30" />
                    <p className="text-sm font-medium text-foreground">
                      Sin testimonios
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Ajusta los filtros o crea un nuevo testimonio
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearFilters}
                      className="mt-3 rounded-xl"
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

      <CreateTestimonialDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={handleCreate}
        nextSortOrder={nextSortOrder}
      />

      <EditTestimonialSheet
        testimonial={selected}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}
