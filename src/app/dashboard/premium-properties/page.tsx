"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Crown, Filter, Sparkles } from "lucide-react";
import { PremiumPropertyCard } from "@/components/dashboard/PremiumPropertyCard";
import { PremiumUpgradeBanner } from "@/components/dashboard/PremiumUpgradeBanner";
import { PremiumBadge } from "@/components/dashboard/PremiumBadge";
import { useCurrentUser } from "@/contexts/user-context";
import { premiumProperties } from "@/lib/premium/mock-data";
import { cn } from "@/lib/utils";

const filters = [
  { id: "all", label: "Todas" },
  { id: "available", label: "Disponibles" },
  { id: "caught", label: "Capturadas" },
  { id: "converted", label: "Convertidas" },
] as const;

export default function PremiumPropertiesPage() {
  const { user, isPremium } = useCurrentUser();
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    if (activeFilter === "all") return premiumProperties;
    if (activeFilter === "available") {
      return premiumProperties.filter((p) => p.status === "available");
    }
    if (activeFilter === "caught") {
      return premiumProperties.filter((p) => p.status === "caught");
    }
    return premiumProperties.filter(
      (p) => p.status === "converted" || p.status === "expired"
    );
  }, [activeFilter]);

  const availableCount = premiumProperties.filter((p) => p.status === "available").length;

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold text-foreground tracking-tight">
              Inversiones Premium
            </h2>
            {isPremium && <PremiumBadge size="md" />}
          </div>
          <p className="text-sm text-muted-foreground">
            {isPremium
              ? `${availableCount} oportunidades disponibles para captura al 100%`
              : "Acceso exclusivo para usuarios Premium"}
          </p>
        </div>
        {isPremium && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-2.5"
          >
            <Sparkles className="size-4 text-amber-600" />
            <div>
              <p className="text-[10px] text-amber-700 font-medium">Tu ventaja Premium</p>
              <p className="text-xs font-bold text-amber-900">ROI hasta 52% · Comisión 0.5%</p>
            </div>
          </motion.div>
        )}
      </div>

      {!isPremium && (
        <div className="mb-8">
          <PremiumUpgradeBanner />
        </div>
      )}

      {isPremium && (
        <div className="rounded-2xl border border-amber-200/60 bg-gradient-to-r from-amber-50/80 to-white p-4 mb-6 flex items-start gap-3">
          <div className="size-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <Crown className="size-4 text-amber-700" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Hola {user.name.split(" ")[0]}, tienes acceso anticipado
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Captura propiedades invirtiendo el 100% antes de que expire la ventana premium.
              Si nadie invierte, la propiedad se abre al mercado estándar con ROI reducido.
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 flex-wrap mb-6">
        <Filter className="size-4 text-muted-foreground" />
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={cn(
              "text-xs font-medium px-3.5 py-1.5 rounded-full border transition-all",
              activeFilter === f.id
                ? "bg-amber-500 text-white border-amber-500"
                : "border-border/80 text-muted-foreground hover:border-amber-300 hover:text-foreground bg-white"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((property, i) => (
          <PremiumPropertyCard
            key={property.id}
            property={property}
            userId={user.id}
            isPremium={isPremium}
            index={i}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Crown className="size-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No hay propiedades en esta categoría</p>
        </div>
      )}
    </div>
  );
}
