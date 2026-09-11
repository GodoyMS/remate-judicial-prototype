"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Search,
  MapPin,
  List,
  LayoutGrid,
  ArrowUpDown,
} from "lucide-react";
import { DashboardPropertyCard } from "@/components/dashboard/DashboardPropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CurrencyBadge } from "@/components/shared/CurrencyBadge";
import { dashboardProperties, formatCurrency } from "@/lib/dashboard/mock-data";

const districts = ["Todos", "San Isidro", "La Molina", "Miraflores", "San Borja", "Barranco", "Surco"];

export default function PropertiesPage() {
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("Todos");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("roi");

  const allProperties = useMemo(
    () =>
      dashboardProperties.map((p) => ({
        id: p.id,
        name: p.name,
        address: p.address,
        type: p.type,
        area: p.area,
        price: formatCurrency(p.price, p.currency),
        minInvestment: formatCurrency(p.minInvestment, p.currency),
        currency: p.currency,
        roi: `${p.roi}%`,
        deadline: p.deadline,
        status: p.status,
        district: p.district,
        img: p.img,
        investors: p.investors,
        priceValue: p.price,
        etapa: p.judicial.etapa,
      })),
    []
  );

  const filtered = allProperties
    .filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.address.toLowerCase().includes(search.toLowerCase());
      const matchDistrict = district === "Todos" || p.district === district;
      return matchSearch && matchDistrict;
    })
    .sort((a, b) => {
      if (sortBy === "roi") return parseFloat(b.roi) - parseFloat(a.roi);
      if (sortBy === "price") return a.priceValue - b.priceValue;
      if (sortBy === "deadline") return parseInt(a.deadline) - parseInt(b.deadline);
      return 0;
    });

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Propiedades en remate</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {filtered.length} propiedades verificadas disponibles en soles y dólares
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o dirección..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 rounded-xl border-border/80 bg-card text-sm"
          />
        </div>

        <div className="relative">
          <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-10 pl-9 pr-4 rounded-xl border border-border/80 bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none cursor-pointer"
          >
            <option value="roi">Mayor ROI</option>
            <option value="price">Menor precio</option>
            <option value="deadline">Cierra antes</option>
          </select>
        </div>

        <div className="flex items-center gap-1 rounded-xl border border-border/80 bg-card p-1">
          <button
            onClick={() => setView("grid")}
            className={`p-1.5 rounded-lg transition-colors ${view === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            aria-label="Vista en cuadrícula"
          >
            <LayoutGrid className="size-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-1.5 rounded-lg transition-colors ${view === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            aria-label="Vista en lista"
          >
            <List className="size-4" />
          </button>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {districts.map((d) => (
          <button
            key={d}
            onClick={() => setDistrict(d)}
            className={`text-xs font-medium px-3.5 py-1.5 rounded-full border transition-all ${
              district === d
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border/80 text-muted-foreground hover:border-primary/50 hover:text-foreground bg-card"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {view === "grid" ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p, i) => (
            <DashboardPropertyCard key={p.id} property={p} index={i} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 transition-all hover:shadow-md sm:flex-row sm:items-center"
            >
              <Link
                href={`/dashboard/properties/${p.id}`}
                className="flex min-w-0 flex-1 items-start gap-4"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.img}
                  alt={p.name}
                  className="size-20 shrink-0 rounded-xl object-cover sm:size-16"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-sm font-semibold text-foreground">
                      {p.name}
                    </h3>
                    <CurrencyBadge currency={p.currency} />
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        p.status === "Activo"
                          ? "bg-success/10 text-success"
                          : "bg-warning/10 text-warning"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="size-3 shrink-0" />
                    <span className="truncate">
                      {p.district} · {p.type} · {p.area}
                    </span>
                  </div>
                  <dl className="mt-3 grid max-w-md grid-cols-3 gap-px overflow-hidden rounded-xl border border-border bg-border">
                    <div className="bg-muted px-2 py-2 text-center">
                      <dt className="text-[10px] text-muted-foreground">Precio base</dt>
                      <dd className="mt-0.5 text-xs font-bold text-foreground">{p.price}</dd>
                    </div>
                    <div className="bg-muted px-2 py-2 text-center">
                      <dt className="text-[10px] text-muted-foreground">ROI est.</dt>
                      <dd className="mt-0.5 text-xs font-bold text-success">{p.roi}</dd>
                    </div>
                    <div className="bg-muted px-2 py-2 text-center">
                      <dt className="text-[10px] text-muted-foreground">Cierra</dt>
                      <dd className="mt-0.5 text-xs font-bold text-foreground">{p.deadline}</dd>
                    </div>
                  </dl>
                </div>
              </Link>
              <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                <p className="text-sm text-muted-foreground">
                  Desde <span className="font-semibold text-foreground">{p.minInvestment}</span>
                </p>
                <Button
                  asChild
                  size="sm"
                  className="h-10 w-full rounded-xl font-semibold sm:w-32"
                >
                  <Link href={`/dashboard/invest?property=${p.id}`}>Invertir</Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
