"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Crown, Sparkles, ArrowRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PremiumUpgradeBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-amber-200/60 bg-gradient-to-br from-[#163300] via-[#1e4200] to-[#163300] p-6 md:p-8"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#9FE870]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

      <div className="relative flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="size-10 rounded-xl bg-[#9FE870]/20 flex items-center justify-center">
              <Crown className="size-5 text-[#9FE870]" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#9FE870]/80">
              Inversiones Premium
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight mb-2">
            Captura propiedades al 100% con ROI excepcional
          </h3>
          <p className="text-sm text-white/70 max-w-xl leading-relaxed">
            Como usuario Premium, accede a propiedades exclusivas antes del mercado estándar.
            Invierte el 100% y obtén retornos de hasta <strong className="text-[#9FE870]">52%</strong> —
            si nadie invierte, la propiedad pasa al mercado regular.
          </p>
          <ul className="flex flex-wrap gap-3 mt-4">
            {[
              "Acceso anticipado exclusivo",
              "ROI hasta 2x vs estándar",
              "Inversión 100% — un solo inversor",
              "Notificaciones en tiempo real",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-1.5 text-xs text-white/80 bg-white/10 px-2.5 py-1 rounded-full"
              >
                <Sparkles className="size-3 text-[#9FE870]" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3 shrink-0">
          <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-4 text-center">
            <Lock className="size-6 text-amber-400 mx-auto mb-2" />
            <p className="text-xs text-white/70 mb-1">Tu plan actual</p>
            <p className="text-sm font-bold text-white">Estándar</p>
          </div>
          <Button
            asChild
            className="h-11 rounded-xl bg-[#9FE870] text-[#163300] hover:bg-[#9FE870]/90 font-semibold"
          >
            <Link href="/dashboard/account?section=premium">
              Actualizar a Premium
              <ArrowRight className="size-4 ml-1" />
            </Link>
          </Button>
          <p className="text-[10px] text-white/50 text-center">
            Demo: inicia con premium@remata.com
          </p>
        </div>
      </div>
    </motion.div>
  );
}
