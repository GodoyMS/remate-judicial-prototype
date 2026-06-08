"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Crown, TrendingUp, Eye, Sparkles, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PremiumBadge } from "@/components/dashboard/PremiumBadge";
import { PremiumInvestmentDetailSheet } from "@/components/dashboard/PremiumInvestmentDetailSheet";
import { PremiumUpgradeBanner } from "@/components/dashboard/PremiumUpgradeBanner";
import { useCurrentUser } from "@/contexts/user-context";
import {
  getPremiumInvestmentsForUser,
  getPremiumPropertyById,
} from "@/lib/premium/mock-data";
import { formatCurrency, formatDate } from "@/lib/dashboard/mock-data";
import type { PremiumInvestment } from "@/lib/premium/types";
import { cn } from "@/lib/utils";

const statusConfig = {
  active: { label: "Activa", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  pending: { label: "Pendiente", className: "bg-amber-50 text-amber-700 border-amber-200" },
  completed: { label: "Completada", className: "bg-blue-50 text-blue-700 border-blue-200" },
};

export function PremiumInvestmentsTab() {
  const { user, isPremium } = useCurrentUser();
  const [selected, setSelected] = useState<PremiumInvestment | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const investments = useMemo(
    () => getPremiumInvestmentsForUser(user.id),
    [user.id]
  );

  const enriched = useMemo(
    () =>
      investments.map((inv) => ({
        ...inv,
        property: getPremiumPropertyById(inv.propertyId)!,
      })),
    [investments]
  );

  const totalInvested = enriched.reduce((sum, i) => sum + i.amount, 0);
  const totalReturn = enriched.reduce((sum, i) => sum + i.estimatedReturn, 0);

  if (!isPremium) {
    return (
      <div className="space-y-6">
        <PremiumUpgradeBanner />
        <div className="rounded-2xl border border-dashed border-border/60 p-12 text-center">
          <Lock className="size-10 mx-auto mb-3 text-muted-foreground/40" />
          <p className="text-sm font-medium text-foreground mb-1">Sin inversiones Premium</p>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Las inversiones exclusivas al 100% solo están disponibles para usuarios Premium.
          </p>
        </div>
      </div>
    );
  }

  if (enriched.length === 0) {
    return (
      <div className="rounded-2xl border border-amber-200/60 bg-amber-50/30 p-12 text-center">
        <Crown className="size-10 mx-auto mb-3 text-amber-500" />
        <p className="text-sm font-medium text-foreground mb-1">Aún no tienes inversiones Premium</p>
        <p className="text-xs text-muted-foreground mb-4">
          Captura una propiedad al 100% y obtén retornos excepcionales.
        </p>
        <Button asChild className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white">
          <Link href="/dashboard/premium-properties">Explorar oportunidades Premium</Link>
        </Button>
      </div>
    );
  }

  const openDetail = (inv: PremiumInvestment) => {
    setSelected(inv);
    setSheetOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {[
          {
            label: "Inversiones Premium",
            value: String(enriched.length),
            sub: "capturas al 100%",
            icon: Crown,
            accent: "text-amber-600 bg-amber-50",
          },
          {
            label: "Capital Premium",
            value: formatCurrency(totalInvested, enriched[0]?.currency ?? "PEN"),
            sub: "inversión exclusiva",
            icon: Sparkles,
            accent: "text-violet-600 bg-violet-50",
          },
          {
            label: "Retorno estimado",
            value: formatCurrency(totalReturn, enriched[0]?.currency ?? "PEN"),
            sub: "ROI premium",
            icon: TrendingUp,
            accent: "text-emerald-600 bg-emerald-50",
          },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="rounded-xl border border-amber-200/60 bg-gradient-to-br from-amber-50/30 to-white px-4 py-3"
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{s.label}</p>
                <p className="text-lg font-bold text-foreground mt-0.5">{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.sub}</p>
              </div>
              <div className={cn("size-9 rounded-lg flex items-center justify-center", s.accent.split(" ")[1])}>
                <s.icon className={cn("size-4", s.accent.split(" ")[0])} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="rounded-xl border border-amber-200/60 bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-amber-50/50 hover:bg-amber-50/50">
              <TableHead className="text-xs">Propiedad</TableHead>
              <TableHead className="text-xs">Inversión</TableHead>
              <TableHead className="text-xs">Participación</TableHead>
              <TableHead className="text-xs">ROI Premium</TableHead>
              <TableHead className="text-xs">Retorno est.</TableHead>
              <TableHead className="text-xs">Estado</TableHead>
              <TableHead className="text-xs w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {enriched.map((inv) => {
              const status = statusConfig[inv.status];
              return (
                <TableRow
                  key={inv.id}
                  className="cursor-pointer hover:bg-amber-50/30 border-l-4 border-l-amber-400"
                  onClick={() => openDetail(inv)}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <PremiumBadge size="sm" variant="subtle" />
                      <div>
                        <p className="text-sm font-medium">{inv.property.name}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">{inv.certificateId}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-semibold">
                    {formatCurrency(inv.amount, inv.currency)}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-bold text-amber-700">{inv.ownershipPercent}%</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-bold text-amber-700 flex items-center gap-0.5">
                      <TrendingUp className="size-3" />
                      {inv.premiumRoi}%
                    </span>
                  </TableCell>
                  <TableCell className="text-sm font-bold text-emerald-600">
                    {formatCurrency(inv.estimatedReturn, inv.currency)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={status.className}>
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon-sm" className="rounded-lg">
                      <Eye className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <PremiumInvestmentDetailSheet
        investment={selected}
        property={selected ? getPremiumPropertyById(selected.propertyId) ?? null : null}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        userName={user.name}
      />
    </div>
  );
}
