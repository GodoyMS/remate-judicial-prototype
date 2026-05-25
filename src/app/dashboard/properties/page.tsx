"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  TrendingUp,
  Clock,
  Home,
  List,
  LayoutGrid,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const allProperties = [
  {
    id: 1,
    name: "Departamento en San Isidro",
    address: "Av. Javier Prado Este 1240, San Isidro",
    type: "Departamento",
    area: "112 m²",
    price: "S/ 285,000",
    minInvestment: "S/ 500",
    roi: "22%",
    deadline: "8 días",
    status: "Activo",
    district: "San Isidro",
    img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop",
    badge: "🔥 Alta demanda",
    badgeStyle: "bg-orange-50 text-orange-700",
    investors: 23,
  },
  {
    id: 2,
    name: "Casa en La Molina",
    address: "Jr. Las Casuarinas 350, La Molina",
    type: "Casa",
    area: "280 m²",
    price: "S/ 520,000",
    minInvestment: "S/ 1,000",
    roi: "18%",
    deadline: "15 días",
    status: "Activo",
    district: "La Molina",
    img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop",
    badge: "⚖️ Proceso expedito",
    badgeStyle: "bg-blue-50 text-blue-700",
    investors: 14,
  },
  {
    id: 3,
    name: "Penthouse en Miraflores",
    address: "Calle Berlín 847, Miraflores",
    type: "Penthouse",
    area: "195 m²",
    price: "S/ 680,000",
    minInvestment: "S/ 2,000",
    roi: "20%",
    deadline: "22 días",
    status: "Próximo",
    district: "Miraflores",
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop",
    badge: "⭐ Exclusivo",
    badgeStyle: "bg-purple-50 text-purple-700",
    investors: 8,
  },
  {
    id: 4,
    name: "Oficina en San Borja",
    address: "Av. Angamos Oeste 600, San Borja",
    type: "Oficina",
    area: "85 m²",
    price: "S/ 190,000",
    minInvestment: "S/ 500",
    roi: "18%",
    deadline: "30 días",
    status: "Activo",
    district: "San Borja",
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop",
    badge: "🏢 Comercial",
    badgeStyle: "bg-teal-50 text-teal-700",
    investors: 19,
  },
  {
    id: 5,
    name: "Departamento en Barranco",
    address: "Jr. Unión 245, Barranco",
    type: "Departamento",
    area: "78 m²",
    price: "S/ 165,000",
    minInvestment: "S/ 500",
    roi: "24%",
    deadline: "5 días",
    status: "Activo",
    district: "Barranco",
    img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&h=400&fit=crop",
    badge: "⚡ Cierra pronto",
    badgeStyle: "bg-red-50 text-red-700",
    investors: 31,
  },
  {
    id: 6,
    name: "Casa en Surco",
    address: "Calle Las Flores 180, Santiago de Surco",
    type: "Casa",
    area: "220 m²",
    price: "S/ 410,000",
    minInvestment: "S/ 1,000",
    roi: "19%",
    deadline: "18 días",
    status: "Próximo",
    district: "Surco",
    img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
    badge: "🌿 Residencial",
    badgeStyle: "bg-green-50 text-green-700",
    investors: 6,
  },
];

const districts = ["Todos", "San Isidro", "La Molina", "Miraflores", "San Borja", "Barranco", "Surco"];

export default function PropertiesPage() {
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("Todos");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("roi");

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
      if (sortBy === "price") return parseInt(a.price.replace(/\D/g, "")) - parseInt(b.price.replace(/\D/g, ""));
      if (sortBy === "deadline") return parseInt(a.deadline) - parseInt(b.deadline);
      return 0;
    });

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Propiedades en remate</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {filtered.length} propiedades verificadas disponibles
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o dirección..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 rounded-xl border-border/80 bg-white text-sm"
          />
        </div>

        {/* Sort */}
        <div className="relative">
          <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-10 pl-9 pr-4 rounded-xl border border-border/80 bg-white text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none cursor-pointer"
          >
            <option value="roi">Mayor ROI</option>
            <option value="price">Menor precio</option>
            <option value="deadline">Cierra antes</option>
          </select>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 rounded-xl border border-border/80 bg-white p-1">
          <button
            onClick={() => setView("grid")}
            className={`p-1.5 rounded-lg transition-colors ${view === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <LayoutGrid className="size-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-1.5 rounded-lg transition-colors ${view === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <List className="size-4" />
          </button>
        </div>
      </div>

      {/* District filters */}
      <div className="flex gap-2 flex-wrap mb-6">
        {districts.map((d) => (
          <button
            key={d}
            onClick={() => setDistrict(d)}
            className={`text-xs font-medium px-3.5 py-1.5 rounded-full border transition-all ${
              district === d
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border/80 text-muted-foreground hover:border-primary/50 hover:text-foreground bg-white"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Grid/List */}
      {view === "grid" ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="group rounded-2xl border border-border/60 bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <Link href={`/dashboard/properties/${p.id}`} className="block">
                <div className="relative overflow-hidden aspect-[16/9]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.img}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className={`text-[10px] font-medium rounded-full px-2.5 py-1 border ${p.badgeStyle} border-current/20`}>
                      {p.badge}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className={`text-[10px] font-medium rounded-full px-2.5 py-1 ${
                      p.status === "Activo" ? "bg-green-600 text-white" : "bg-amber-500 text-white"
                    }`}>
                      {p.status}
                    </span>
                  </div>
                </div>

                <div className="p-4 pb-0">
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-1">
                    <Home className="size-3" />
                    <span>{p.type} · {p.area}</span>
                    <span className="ml-auto text-[10px] text-muted-foreground">{p.investors} inversores</span>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground leading-snug">{p.name}</h3>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                    <MapPin className="size-2.5" />
                    <span className="truncate">{p.address}</span>
                  </div>
                </div>
              </Link>

              <div className="p-4 pt-3 flex flex-col gap-3">
                <div className="grid grid-cols-3 divide-x divide-border/60 rounded-xl border border-border/60 overflow-hidden text-center">
                  <div className="py-2 px-1">
                    <p className="text-[9px] text-muted-foreground">Precio base</p>
                    <p className="text-[10px] font-semibold text-foreground mt-0.5">{p.price}</p>
                  </div>
                  <div className="py-2 px-1">
                    <p className="text-[9px] text-muted-foreground">ROI est.</p>
                    <p className="text-[10px] font-bold text-green-600 mt-0.5 flex items-center justify-center gap-0.5">
                      <TrendingUp className="size-2.5" />{p.roi}
                    </p>
                  </div>
                  <div className="py-2 px-1">
                    <p className="text-[9px] text-muted-foreground">Cierra</p>
                    <p className="text-[10px] font-semibold text-foreground mt-0.5 flex items-center justify-center gap-0.5">
                      <Clock className="size-2.5 text-amber-500" />{p.deadline}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">Desde {p.minInvestment}</span>
                  <Button
                    asChild
                    size="sm"
                    className="flex-1 h-8 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold"
                  >
                    <Link href={`/dashboard/invest?property=${p.id}`}>Invertir</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
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
              className="flex items-center gap-4 rounded-2xl border border-border/60 bg-white p-4 hover:shadow-md transition-all group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.img}
                alt={p.name}
                className="size-16 rounded-xl object-cover shrink-0 cursor-pointer"
              />
              <Link href={`/dashboard/properties/${p.id}`} className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground truncate">{p.name}</h3>
                  <span className={`text-[10px] font-medium rounded-full px-2 py-0.5 shrink-0 ${
                    p.status === "Activo" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                  }`}>{p.status}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                  <MapPin className="size-3" />
                  <span className="truncate">{p.address}</span>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs font-medium text-foreground">{p.price}</span>
                  <span className="text-xs font-bold text-green-600 flex items-center gap-0.5">
                    <TrendingUp className="size-3" />{p.roi} ROI
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                    <Clock className="size-3" />{p.deadline}
                  </span>
                </div>
              </Link>
              <div className="flex items-center gap-2 shrink-0">
                <div className="hidden sm:flex items-center gap-1">
                  <SlidersHorizontal className="size-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{p.investors} inversores</span>
                </div>
                <Button
                  asChild
                  size="sm"
                  className="h-8 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold"
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
