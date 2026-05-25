"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  Eye,
  FileText,
  TrendingUp,
  Clock,
  Wallet,
  X,
  ArrowUpDown,
} from "lucide-react";
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
import { Slider } from "@/components/ui/slider";
import { InvestmentDetailSheet } from "@/components/dashboard/InvestmentDetailSheet";
import {
  userInvestments,
  dashboardProperties,
  getPropertyById,
  formatCurrency,
  formatDate,
} from "@/lib/dashboard/mock-data";
import type { UserInvestment } from "@/lib/dashboard/types";

const statusOptions = [
  { value: "all", label: "Todos los estados" },
  { value: "active", label: "Activas" },
  { value: "completed", label: "Completadas" },
  { value: "pending", label: "Pendientes" },
];

const statusBadge = {
  active: { label: "Activa", variant: "default" as const },
  completed: { label: "Completada", variant: "secondary" as const },
  pending: { label: "Pendiente", variant: "outline" as const },
  cancelled: { label: "Cancelada", variant: "destructive" as const },
};

export default function MyInvestmentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [roiFilter, setRoiFilter] = useState("all");
  const [amountRange, setAmountRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState("date-desc");
  const [showFilters, setShowFilters] = useState(true);
  const [selectedInvestment, setSelectedInvestment] = useState<UserInvestment | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const districts = useMemo(
    () => [...new Set(dashboardProperties.map((p) => p.district))],
    []
  );

  const enriched = userInvestments.map((inv) => {
    const property = getPropertyById(inv.propertyId)!;
    return { ...inv, property };
  });

  const filtered = enriched
    .filter((inv) => {
      const matchSearch =
        inv.property.name.toLowerCase().includes(search.toLowerCase()) ||
        inv.certificateId.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || inv.status === statusFilter;
      const matchDistrict = districtFilter === "all" || inv.property.district === districtFilter;
      const matchRoi =
        roiFilter === "all" ||
        (roiFilter === "high" && inv.roi >= 20) ||
        (roiFilter === "medium" && inv.roi >= 15 && inv.roi < 20) ||
        (roiFilter === "low" && inv.roi < 15);
      const matchAmount = inv.amount >= amountRange[0] && inv.amount <= amountRange[1];
      return matchSearch && matchStatus && matchDistrict && matchRoi && matchAmount;
    })
    .sort((a, b) => {
      if (sortBy === "date-desc") return new Date(b.datePaid).getTime() - new Date(a.datePaid).getTime();
      if (sortBy === "date-asc") return new Date(a.datePaid).getTime() - new Date(b.datePaid).getTime();
      if (sortBy === "amount-desc") return b.amount - a.amount;
      if (sortBy === "roi-desc") return b.roi - a.roi;
      return 0;
    });

  const stats = {
    total: enriched.reduce((s, i) => s + i.amount, 0),
    active: enriched.filter((i) => i.status === "active").length,
    returns: enriched.reduce((s, i) => s + i.estimatedReturn, 0),
  };

  const activeFiltersCount = [
    statusFilter !== "all",
    districtFilter !== "all",
    roiFilter !== "all",
    amountRange[0] > 0 || amountRange[1] < 10000,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setDistrictFilter("all");
    setRoiFilter("all");
    setAmountRange([0, 10000]);
  };

  const openInvestment = (inv: UserInvestment) => {
    setSelectedInvestment(inv);
    setSheetOpen(true);
  };

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
      >
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Mis inversiones</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Historial completo de tus participaciones en remates judiciales
          </p>
        </div>
      </motion.div>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total invertido", value: formatCurrency(stats.total), icon: Wallet, color: "text-blue-600 bg-blue-50" },
          { label: "Inversiones activas", value: String(stats.active), icon: TrendingUp, color: "text-green-600 bg-green-50" },
          { label: "Retornos estimados", value: formatCurrency(stats.returns), icon: Clock, color: "text-amber-600 bg-amber-50" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="rounded-2xl border-border/60">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{s.label}</p>
                  <p className="text-xl font-bold mt-0.5">{s.value}</p>
                </div>
                <div className={`size-9 rounded-xl flex items-center justify-center ${s.color.split(" ")[1]}`}>
                  <s.icon className={`size-4 ${s.color.split(" ")[0]}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
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
                      <Badge className="text-[10px] h-4 px-1.5">{activeFiltersCount}</Badge>
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
                      placeholder="Propiedad o certificado..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-8 h-9 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Estado</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full rounded-xl h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Distrito</label>
                  <Select value={districtFilter} onValueChange={setDistrictFilter}>
                    <SelectTrigger className="w-full rounded-xl h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {districts.map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">ROI</label>
                  <Select value={roiFilter} onValueChange={setRoiFilter}>
                    <SelectTrigger className="w-full rounded-xl h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="high">Alto (≥20%)</SelectItem>
                      <SelectItem value="medium">Medio (15-19%)</SelectItem>
                      <SelectItem value="low">Bajo (&lt;15%)</SelectItem>
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
                    max={10000}
                    step={500}
                    value={amountRange}
                    onValueChange={setAmountRange}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.aside>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="rounded-xl lg:hidden w-fit"
            >
              <SlidersHorizontal className="size-4 mr-1" />
              Filtros
            </Button>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48 rounded-xl h-9 ml-auto">
                <ArrowUpDown className="size-3.5 mr-1 text-muted-foreground" />
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

          <Card className="rounded-2xl border-border/60 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="pl-4">Propiedad</TableHead>
                  <TableHead>Inversión</TableHead>
                  <TableHead>ROI</TableHead>
                  <TableHead>Fecha pago</TableHead>
                  <TableHead>Retorno est.</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="pr-4 text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((inv) => {
                  const badge = statusBadge[inv.status];
                  return (
                    <TableRow key={inv.id}>
                      <TableCell className="pl-4">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={inv.property.img}
                            alt={inv.property.name}
                            className="size-10 rounded-lg object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate max-w-[160px]">{inv.property.name}</p>
                            <p className="text-[10px] text-muted-foreground">{inv.property.district}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-sm">{formatCurrency(inv.amount)}</TableCell>
                      <TableCell>
                        <span className="text-sm font-bold text-green-600">+{inv.roi}%</span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{formatDate(inv.datePaid)}</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium text-green-600">{formatCurrency(inv.estimatedReturn)}</p>
                          <p className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                            <Clock className="size-2.5" />
                            {inv.status === "completed"
                              ? "Recibido"
                              : inv.daysUntilRoi > 0
                              ? `${inv.daysUntilRoi} días`
                              : "Próximo"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={badge.variant} className="text-[10px]">
                          {badge.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button asChild variant="ghost" size="icon-sm" className="rounded-lg" title="Ver propiedad">
                            <Link href={`/dashboard/properties/${inv.propertyId}`}>
                              <Eye className="size-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="rounded-lg"
                            title="Ver inversión"
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
                    <TableCell colSpan={7} className="text-center py-12">
                      <X className="size-8 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No se encontraron inversiones</p>
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

      <InvestmentDetailSheet
        investment={selectedInvestment}
        property={selectedInvestment ? getPropertyById(selectedInvestment.propertyId) ?? null : null}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  );
}
