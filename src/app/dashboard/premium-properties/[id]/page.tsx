"use client";

import { use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  TrendingUp,
  Crown,
  CheckCircle2,
  XCircle,
  Lock,
  ArrowRight,
  Shield,
  Percent,
  Calendar,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CurrencyBadge } from "@/components/shared/CurrencyBadge";
import { PremiumCountdown } from "@/components/dashboard/PremiumCountdown";
import { PremiumExclusiveBadge, PremiumBadge } from "@/components/dashboard/PremiumBadge";
import { PremiumUpgradeBanner } from "@/components/dashboard/PremiumUpgradeBanner";
import { useCurrentUser } from "@/contexts/user-context";
import {
  getPremiumPropertyById,
  isCaughtByUser,
  isCaughtByOther,
} from "@/lib/premium/mock-data";
import { formatCurrency } from "@/lib/dashboard/mock-data";
import { cn } from "@/lib/utils";

export default function PremiumPropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const property = getPremiumPropertyById(id);
  const { user, isPremium } = useCurrentUser();

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-semibold">Propiedad no encontrada</p>
        <Button asChild variant="link" className="mt-2">
          <Link href="/dashboard/premium-properties">Volver</Link>
        </Button>
      </div>
    );
  }

  const caughtByMe = isCaughtByUser(property, user.id);
  const caughtByOther = isCaughtByOther(property, user.id);
  const isAvailable = property.status === "available";
  const isConverted = property.status === "converted" || property.status === "expired";
  const estimatedReturn = (property.totalValue * property.premiumRoi) / 100;
  const roiDiff = property.premiumRoi - property.standardRoi;

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-6">
        <Button asChild variant="ghost" size="icon-sm" className="rounded-xl shrink-0">
          <Link href="/dashboard/premium-properties">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-bold truncate">{property.name}</h2>
            <PremiumExclusiveBadge />
            {caughtByMe && (
              <Badge className="bg-success text-success-foreground text-[10px]">
                <CheckCircle2 className="size-3 mr-1" />
                Capturada por ti
              </Badge>
            )}
            {caughtByOther && (
              <Badge variant="secondary" className="text-[10px]">
                <XCircle className="size-3 mr-1" />
                Ya capturada
              </Badge>
            )}
            <CurrencyBadge currency={property.currency} />
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
            <MapPin className="size-3 shrink-0" />
            <span className="truncate">{property.address}</span>
          </p>
        </div>
      </div>

      {!isPremium && (
        <div className="mb-6">
          <PremiumUpgradeBanner />
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="relative rounded-2xl overflow-hidden border border-border/60 bg-card shadow-sm">
              <Carousel className="w-full">
                <CarouselContent>
                  {property.images.map((img, i) => (
                    <CarouselItem key={i}>
                      <div className="relative aspect-[16/10]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img}
                          alt={`${property.name} ${i + 1}`}
                          className={cn(
                            "w-full h-full object-cover",
                            !isPremium && "blur-sm"
                          )}
                        />
                        {!isPremium && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <div className="text-center text-white">
                              <Lock className="size-10 mx-auto mb-2" />
                              <p className="text-sm font-semibold">Contenido Premium</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-3 bg-card/90 hover:bg-card border-0 shadow-md" />
                <CarouselNext className="right-3 bg-card/90 hover:bg-card border-0 shadow-md" />
              </Carousel>
            </div>
          </motion.div>

          <Card className="rounded-2xl border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Descripción</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {isPremium ? property.description : "Actualiza a Premium para ver el análisis completo de esta propiedad exclusiva."}
              </p>
            </CardContent>
          </Card>

          {caughtByMe && isPremium && (
            <Card className="rounded-2xl border-premium/20 bg-gradient-to-br from-premium/10 to-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Crown className="size-4 text-premium" />
                  Tu inversión exclusiva
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="rounded-xl bg-card border border-premium/15 p-4">
                    <p className="text-xs text-muted-foreground">Inversión total</p>
                    <p className="text-xl font-bold text-foreground mt-1">
                      {formatCurrency(property.totalValue, property.currency)}
                    </p>
                    <p className="text-[10px] text-premium mt-1">100% de la propiedad</p>
                  </div>
                  <div className="rounded-xl bg-success/10 border border-success/20 p-4">
                    <p className="text-xs text-success">Retorno estimado</p>
                    <p className="text-xl font-bold text-success mt-1">
                      {formatCurrency(estimatedReturn, property.currency)}
                    </p>
                    <p className="text-[10px] text-success mt-1">ROI {property.premiumRoi}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="size-3.5" />
                  Capturada el {new Date(property.caughtAt!).toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric" })}
                </div>
              </CardContent>
            </Card>
          )}

          {caughtByOther && isPremium && (
            <Card className="rounded-2xl border-border/60 bg-muted/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="size-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    <User className="size-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Propiedad ya capturada</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Otro inversionista Premium financió el 100% el{" "}
                      {new Date(property.caughtAt!).toLocaleDateString("es-PE")}.
                      Esta oportunidad ya no está disponible.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card className={cn(
            "rounded-2xl overflow-hidden",
            isAvailable && isPremium
              ? "border-premium/20 ring-1 ring-premium/15"
              : "border-border/60"
          )}>
            <div className={cn(
              "p-4",
              isAvailable && isPremium
                ? "bg-gradient-to-br from-premium to-premium/80 text-premium-foreground"
                : "bg-muted/30"
            )}>
              {/* Jerarquía financiera (P-006): capital requerido manda sobre ROI y ganancia */}
              <p className={cn("text-xs font-medium mb-1", isAvailable && isPremium ? "text-premium-foreground/80" : "text-muted-foreground")}>
                Capital requerido
              </p>
              <p className="text-3xl font-bold">{formatCurrency(property.totalValue, property.currency)}</p>
              <p className={cn("text-xs mt-1", isAvailable && isPremium ? "text-premium-foreground/70" : "text-muted-foreground")}>
                Financiado por un solo inversionista (100%)
              </p>
            </div>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Percent className="size-3.5" />
                    Retorno estimado
                  </span>
                  <span className="font-semibold text-premium">
                    {property.premiumRoi}%
                    <span className="text-[10px] text-muted-foreground font-normal ml-1">
                      (+{roiDiff}% vs. estándar)
                    </span>
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <TrendingUp className="size-3.5" />
                    Ganancia estimada
                  </span>
                  <span className="font-bold text-success">
                    {formatCurrency(estimatedReturn, property.currency)}
                  </span>
                </div>
              </div>

              <Separator />

              {isAvailable && isPremium && (
                <PremiumCountdown deadline={property.premiumDeadline} />
              )}

              {isPremium ? (
                <>
                  {isAvailable && (
                    <Button
                      asChild
                      className="w-full min-h-11 h-auto py-2.5 rounded-xl bg-gradient-to-r from-premium to-premium/80 hover:from-premium/90 hover:to-premium/70 text-premium-foreground font-semibold whitespace-normal text-center"
                    >
                      <Link href={`/dashboard/premium-invest?property=${property.id}`} className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
                        <span className="inline-flex items-center gap-2">
                          <Crown className="size-4 shrink-0" />
                          Capturar al 100%
                        </span>
                        <span className="text-sm sm:text-base font-bold">
                          {formatCurrency(property.totalValue, property.currency)}
                        </span>
                      </Link>
                    </Button>
                  )}
                  {caughtByMe && (
                    <Button
                      asChild
                      variant="outline"
                      className="w-full h-11 rounded-xl border-premium/40"
                    >
                      <Link href="/dashboard/my-investments?tab=premium">
                        Ver en mis inversiones
                        <ArrowRight className="size-4 ml-2" />
                      </Link>
                    </Button>
                  )}
                  {caughtByOther && (
                    <Button disabled className="w-full h-11 rounded-xl">
                      <XCircle className="size-4 mr-2" />
                      Propiedad capturada
                    </Button>
                  )}
                  {isConverted && (
                    <Button asChild variant="outline" className="w-full h-11 rounded-xl">
                      <Link href="/dashboard/properties">Ver como propiedad estándar</Link>
                    </Button>
                  )}
                </>
              ) : (
                <Button
                  asChild
                  className="w-full h-11 rounded-xl bg-premium text-premium-foreground hover:bg-premium/90 font-semibold"
                >
                  <Link href="/dashboard/account?section=premium">
                    <Crown className="size-4 mr-2" />
                    Actualizar a Premium
                  </Link>
                </Button>
              )}

              <div className="flex items-start gap-2 rounded-xl bg-muted/50 p-3">
                <Shield className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Inversión exclusiva: un solo inversor Premium captura el 100%.
                  Si la ventana expira sin inversión, la propiedad pasa al mercado estándar.
                </p>
              </div>
            </CardContent>
          </Card>

          {isPremium && (
            <Card className="rounded-2xl border-border/60">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <PremiumBadge variant="subtle" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Comisión reducida del 0.5% aplicada a inversiones Premium.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
