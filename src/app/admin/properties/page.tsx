"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  SlidersHorizontal,
  MapPin,
  TrendingUp,
  Users,
  Eye,
  Star,
  MoreHorizontal,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { CreatePropertyDialog } from "@/components/admin/CreatePropertyDialog";
import { adminProperties, DISTRICTS, REGIONS } from "@/lib/admin/mock-data";
import { formatCurrency, formatDate } from "@/lib/admin/formatters";
import type { AdminProperty } from "@/lib/admin/types";

export default function AdminPropertiesPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("all");
  const [district, setDistrict] = useState("all");
  const [publishedFilter, setPublishedFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [amountRange, setAmountRange] = useState([0, 700000]);
  const [showFilters, setShowFilters] = useState(true);
  const [properties, setProperties] = useState<AdminProperty[]>(adminProperties);

  const allDistricts = useMemo(() => {
    if (region === "all") {
      return Object.values(DISTRICTS).flat();
    }
    const provinceDistricts = Object.entries(DISTRICTS)
      .filter(([key]) => {
        const regionProvinces = adminProperties
          .filter((p) => p.region === region)
          .map((p) => p.province);
        return regionProvinces.some((prov) => key === prov || key.includes(prov));
      })
      .flatMap(([, d]) => d);
    return provinceDistricts.length > 0
      ? provinceDistricts
      : adminProperties.filter((p) => p.region === region).map((p) => p.district);
  }, [region]);

  const filtered = properties.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.address.toLowerCase().includes(search.toLowerCase());
    const matchRegion = region === "all" || p.region === region;
    const matchDistrict = district === "all" || p.district === district;
    const matchPublished =
      publishedFilter === "all" ||
      (publishedFilter === "published" && p.published) ||
      (publishedFilter === "draft" && !p.published);
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    const matchAmount =
      p.totalInvestment >= amountRange[0] && p.totalInvestment <= amountRange[1];
    return matchSearch && matchRegion && matchDistrict && matchPublished && matchStatus && matchAmount;
  });

  const toggleFeatured = (id: string) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p))
    );
    toast.success("Propiedad actualizada");
  };

  const togglePublished = (id: string) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, published: !p.published, status: !p.published ? "published" : "draft" } : p
      )
    );
    toast.success("Estado de publicación actualizado");
  };

  const clearFilters = () => {
    setSearch("");
    setRegion("all");
    setDistrict("all");
    setPublishedFilter("all");
    setStatusFilter("all");
    setAmountRange([0, 700000]);
  };

  const activeFiltersCount = [
    region !== "all",
    district !== "all",
    publishedFilter !== "all",
    statusFilter !== "all",
    amountRange[0] > 0 || amountRange[1] < 700000,
  ].filter(Boolean).length;

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Gestión de propiedades</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {filtered.length} de {properties.length} propiedades
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="rounded-xl font-semibold">
          <Plus className="size-4 mr-1" />
          Nueva propiedad
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {showFilters && (
          <motion.aside
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-72 shrink-0"
          >
            <Card className="rounded-2xl border-border/60 sticky top-0">
              <CardContent className="p-4 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold flex items-center gap-1.5">
                    <SlidersHorizontal className="size-4" />
                    Filtros
                    {activeFiltersCount > 0 && (
                      <Badge variant="default" className="text-[10px] h-4 px-1.5">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </h3>
                  {activeFiltersCount > 0 && (
                    <button onClick={clearFilters} className="text-[10px] text-muted-foreground hover:text-foreground underline">
                      Limpiar
                    </button>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Buscar</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                    <Input
                      placeholder="Nombre o dirección..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-8 h-9 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Región</label>
                  <Select value={region} onValueChange={(v) => { setRegion(v); setDistrict("all"); }}>
                    <SelectTrigger className="w-full rounded-xl h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las regiones</SelectItem>
                      {REGIONS.map((r) => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Distrito / Ciudad</label>
                  <Select value={district} onValueChange={setDistrict}>
                    <SelectTrigger className="w-full rounded-xl h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {[...new Set(allDistricts)].map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Publicación</label>
                  <Select value={publishedFilter} onValueChange={setPublishedFilter}>
                    <SelectTrigger className="w-full rounded-xl h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="published">Publicadas</SelectItem>
                      <SelectItem value="draft">No publicadas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Estado</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full rounded-xl h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="published">Activa</SelectItem>
                      <SelectItem value="draft">Borrador</SelectItem>
                      <SelectItem value="closed">Cerrada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-muted-foreground">Rango de monto</label>
                    <span className="text-[10px] text-muted-foreground">
                      {formatCurrency(amountRange[0])} — {formatCurrency(amountRange[1])}
                    </span>
                  </div>
                  <Slider
                    min={0}
                    max={700000}
                    step={10000}
                    value={amountRange}
                    onValueChange={setAmountRange}
                    className="py-2"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.aside>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="rounded-xl lg:hidden"
            >
              <SlidersHorizontal className="size-4 mr-1" />
              Filtros
            </Button>
          </div>

          <Card className="rounded-2xl border-border/60 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="pl-4">Propiedad</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>ROI</TableHead>
                  <TableHead>Progreso</TableHead>
                  <TableHead>Inversores</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="pr-4 text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => {
                  const progress = Math.round((p.raisedAmount / p.totalInvestment) * 100);
                  return (
                    <TableRow key={p.id} className="group">
                      <TableCell className="pl-4">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p.image} alt={p.title} className="size-10 rounded-lg object-cover shrink-0" />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="text-sm font-medium truncate max-w-[180px]">{p.title}</p>
                              {p.featured && <Star className="size-3 text-amber-500 fill-amber-500 shrink-0" />}
                            </div>
                            <p className="text-[10px] text-muted-foreground">{formatDate(p.publishDate)}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="size-3 shrink-0" />
                          <span className="truncate max-w-[120px]">{p.district}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-bold text-green-600 flex items-center gap-0.5">
                          <TrendingUp className="size-3" />+{p.roi}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="w-24">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] text-muted-foreground">{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-1.5" />
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {formatCurrency(p.raisedAmount)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm flex items-center gap-1">
                          <Users className="size-3 text-muted-foreground" />
                          {p.investorsCount}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            p.status === "published"
                              ? "default"
                              : p.status === "closed"
                              ? "secondary"
                              : "outline"
                          }
                          className="text-[10px]"
                        >
                          {p.status === "published" ? "Activa" : p.status === "closed" ? "Cerrada" : "Borrador"}
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button asChild variant="ghost" size="icon-sm" className="rounded-lg">
                            <Link href={`/admin/properties/${p.id}`}>
                              <Eye className="size-4" />
                            </Link>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon-sm" className="rounded-lg">
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
                                <Link href={`/admin/properties/${p.id}`}>Ver detalle</Link>
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
                    <TableCell colSpan={7} className="text-center py-12">
                      <X className="size-8 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No se encontraron propiedades</p>
                      <Button variant="link" onClick={clearFilters} className="text-xs mt-1">
                        Limpiar filtros
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>

      <CreatePropertyDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
