"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin,
  TrendingUp,
  Lock,
  CheckCircle2,
  XCircle,
  Crown,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CurrencyBadge } from "@/components/shared/CurrencyBadge";
import { PremiumCountdown } from "@/components/dashboard/PremiumCountdown";
import { PremiumExclusiveBadge } from "@/components/dashboard/PremiumBadge";
import type { PremiumProperty } from "@/lib/premium/types";
import { isCaughtByUser, isCaughtByOther } from "@/lib/premium/mock-data";
import { formatCurrency } from "@/lib/dashboard/mock-data";
import { cn } from "@/lib/utils";

interface PremiumPropertyCardProps {
  property: PremiumProperty;
  userId: string;
  isPremium: boolean;
  index?: number;
}

export function PremiumPropertyCard({
  property,
  userId,
  isPremium,
  index = 0,
}: PremiumPropertyCardProps) {
  const caughtByMe = isCaughtByUser(property, userId);
  const caughtByOther = isCaughtByOther(property, userId);
  const isAvailable = property.status === "available";
  const isConverted = property.status === "converted" || property.status === "expired";
  const estimatedReturn = (property.totalValue * property.premiumRoi) / 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className={cn(
        "group rounded-2xl border overflow-hidden shadow-sm transition-all duration-300",
        caughtByMe
          ? "border-amber-300 bg-gradient-to-br from-amber-50/50 to-white ring-1 ring-amber-200"
          : caughtByOther
            ? "border-border/40 bg-muted/30 opacity-90"
            : isAvailable
              ? "border-amber-200/60 bg-white hover:shadow-xl hover:-translate-y-1"
              : "border-border/60 bg-white"
      )}
    >
      <Link href={`/dashboard/premium-properties/${property.id}`} className="block">
        <div className="relative overflow-hidden aspect-[16/9]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={property.img}
            alt={property.name}
            className={cn(
              "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105",
              !isPremium && "blur-[2px] scale-105",
              caughtByOther && "grayscale-[30%]"
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <PremiumExclusiveBadge />
            {caughtByMe && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                <CheckCircle2 className="size-2.5" />
                Capturada por ti
              </span>
            )}
            {caughtByOther && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-700 text-white">
                <XCircle className="size-2.5" />
                Ya capturada
              </span>
            )}
            {isConverted && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                Ahora estándar
              </span>
            )}
          </div>

          <div className="absolute top-3 right-3">
            <CurrencyBadge currency={property.currency} />
          </div>

          {!isPremium && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
              <div className="flex flex-col items-center gap-2 text-white">
                <Lock className="size-8" />
                <span className="text-xs font-semibold">Solo usuarios Premium</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-1">
            <span>{property.type} · {property.area}</span>
          </div>
          <h3 className="text-sm font-semibold text-foreground leading-snug">{property.name}</h3>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
            <MapPin className="size-2.5" />
            <span className="truncate">{property.address}</span>
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4 flex flex-col gap-3">
        <div className="grid grid-cols-3 divide-x divide-border/60 rounded-xl border border-border/60 overflow-hidden text-center">
          <div className="py-2 px-1">
            <p className="text-[9px] text-muted-foreground">Valor total</p>
            <p className="text-[10px] font-semibold text-foreground mt-0.5">
              {formatCurrency(property.totalValue, property.currency)}
            </p>
          </div>
          <div className="py-2 px-1 bg-amber-50/50">
            <p className="text-[9px] text-amber-700">ROI Premium</p>
            <p className="text-[10px] font-bold text-amber-700 mt-0.5 flex items-center justify-center gap-0.5">
              <TrendingUp className="size-2.5" />
              {property.premiumRoi}%
            </p>
          </div>
          <div className="py-2 px-1">
            <p className="text-[9px] text-muted-foreground">Ganancia est.</p>
            <p className="text-[10px] font-bold text-emerald-600 mt-0.5">
              {formatCurrency(estimatedReturn, property.currency)}
            </p>
          </div>
        </div>

        {isAvailable && isPremium && (
          <PremiumCountdown deadline={property.premiumDeadline} compact />
        )}

        {caughtByOther && (
          <p className="text-xs text-muted-foreground text-center py-1">
            Capturada por <span className="font-medium text-foreground">{property.caughtByUserName}</span>
          </p>
        )}

        <div className="flex items-center gap-2">
          {isPremium ? (
            <>
              {isAvailable && (
                <Button
                  asChild
                  size="sm"
                  className="flex-1 h-9 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-semibold shadow-sm"
                >
                  <Link href={`/dashboard/premium-invest?property=${property.id}`}>
                    <Crown className="size-3.5 mr-1" />
                    Capturar 100%
                  </Link>
                </Button>
              )}
              {caughtByMe && (
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="flex-1 h-9 rounded-xl border-amber-300 text-amber-800 text-xs font-semibold"
                >
                  <Link href={`/dashboard/premium-properties/${property.id}`}>
                    Ver mi inversión
                    <ArrowRight className="size-3 ml-1" />
                  </Link>
                </Button>
              )}
              {caughtByOther && (
                <Button
                  size="sm"
                  disabled
                  className="flex-1 h-9 rounded-xl text-xs"
                >
                  Propiedad capturada
                </Button>
              )}
              {isConverted && (
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="flex-1 h-9 rounded-xl text-xs"
                >
                  <Link href="/dashboard/properties">Ver en estándar</Link>
                </Button>
              )}
            </>
          ) : (
            <Button
              asChild
              size="sm"
              className="flex-1 h-9 rounded-xl bg-[#163300] text-[#9FE870] hover:bg-[#163300]/90 text-xs font-semibold"
            >
              <Link href="/dashboard/account?section=premium">
                <Crown className="size-3.5 mr-1" />
                Actualizar a Premium
              </Link>
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
