"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Crown, ArrowRight, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Compacta a una fila (E-015, E-022): título, una frase y máximo 2
 * beneficios. Los cuatro argumentos completos viven en `/premium`.
 */
export function PremiumUpgradeBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-premium/25 bg-premium/5 px-5 py-4"
    >
      <div className="size-10 rounded-xl bg-premium/15 flex items-center justify-center shrink-0">
        <Crown className="size-5 text-premium" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">Acceso Premium</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Financia el 100% de una oportunidad durante su ventana de exclusividad.
        </p>
        <div className="flex flex-wrap gap-3 mt-1.5">
          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
            <Zap className="size-3 text-premium" /> Acceso anticipado
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
            <Sparkles className="size-3 text-premium" /> Oportunidades exclusivas
          </span>
        </div>
      </div>
      <Button
        asChild
        variant="outline"
        className="rounded-xl border-premium/40 text-premium hover:bg-premium/10 shrink-0 w-full sm:w-auto"
      >
        <Link href="/premium">
          Ver beneficios
          <ArrowRight className="size-4 ml-1" />
        </Link>
      </Button>
    </motion.div>
  );
}
