"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Crown, Filter, Sparkles } from "lucide-react";
import { PremiumPropertyCard } from "@/components/dashboard/PremiumPropertyCard";
import { PremiumUpgradeBanner } from "@/components/dashboard/PremiumUpgradeBanner";
import { PremiumBadge } from "@/components/dashboard/PremiumBadge";
import { useCurrentUser } from "@/contexts/user-context";
import { getAllPremiumProperties, premiumProperties } from "@/lib/premium/mock-data";
import type { PremiumProperty } from "@/lib/premium/types";
import { cn } from "@/lib/utils";

const filters = [
  { id: "all", label: "Todas" },
  { id: "available", label: "Disponibles" },
  { id: "caught", label: "Capturadas" },
  { id: "converted", label: "Pasaron a inversión colectiva" },
] as const;

type FilterId = (typeof filters)[number]["id"];

export default function PremiumPropertiesPage() {
  return (
    <Suspense>
      <PremiumPropertiesContent />
    </Suspense>
  );
}

function PremiumPropertiesContent() {
  const { user, isPremium } = useCurrentUser();
  const searchParams = useSearchParams();
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const [properties, setProperties] = useState<PremiumProperty[]>(premiumProperties);

  useEffect(() => {
    setProperties(getAllPremiumProperties());
  }, []);

  // "Ver oportunidades" desde el dashboard abre directo el filtro Disponibles (P-002).
  useEffect(() => {
    const requested = searchParams.get("filter");
    if (requested && filters.some((f) => f.id === requested)) {
      setActiveFilter(requested as FilterId);
    }
  }, [searchParams]);

  const filtered = useMemo(() => {
    if (activeFilter === "all") return properties;
    if (activeFilter === "available") {
      return properties.filter((p) => p.status === "available");
    }
    if (activeFilter === "caught") {
      return properties.filter((p) => p.status === "caught");
    }
    return properties.filter(
      (p) => p.status === "converted" || p.status === "expired"
    );
  }, [activeFilter, properties]);

  const availableCount = properties.filter((p) => p.status === "available").length;

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
            className="flex items-center gap-2 rounded-xl bg-premium/10 border border-premium/20 px-4 py-2.5"
          >
            <Sparkles className="size-4 text-premium" />
            <div>
              <p className="text-[10px] text-premium font-medium">Tu ventaja Premium</p>
              <p className="text-xs font-bold text-premium">Acceso anticipado · Comisión 0.5%</p>
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
        <div className="rounded-2xl border border-premium/20 bg-gradient-to-r from-premium/10 to-card p-4 mb-6 flex items-start gap-3">
          <div className="size-9 rounded-xl bg-premium/15 flex items-center justify-center shrink-0">
            <Crown className="size-4 text-premium" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Hola {user.name.split(" ")[0]}, tienes acceso anticipado
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Financia individualmente el 100% del capital requerido antes de que expire la
              ventana Premium. Si nadie invierte en ese periodo, la oportunidad puede
              habilitarse para participación colectiva.
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
                ? "bg-premium text-premium-foreground border-premium"
                : "border-border/80 text-muted-foreground hover:border-premium/40 hover:text-foreground bg-card"
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
