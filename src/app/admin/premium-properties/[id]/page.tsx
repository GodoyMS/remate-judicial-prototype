"use client";

import { use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Crown,
  MapPin,
  TrendingUp,
  User,
  Calendar,
  Bell,
  CheckCircle2,
  Percent,
  Wallet,
  Mail,
  Phone,
  Shield,
  Clock,
  ArrowRightLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { AdminPropertyGallery } from "@/components/admin/AdminPropertyGallery";
import { getAdminPremiumPropertyById } from "@/lib/admin/premium-mock-data";
import { CurrencyBadge } from "@/components/shared/CurrencyBadge";
import { formatCurrency, formatDate } from "@/lib/admin/formatters";
import { cn } from "@/lib/utils";

export default function AdminPremiumPropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const property = getAdminPremiumPropertyById(id);

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-semibold">Propiedad no encontrada</p>
        <Button asChild variant="link" className="mt-2">
          <Link href="/admin/premium-properties">Volver</Link>
        </Button>
      </div>
    );
  }

  const isCaught = property.premiumStatus === "caught";
  const isAvailable = property.premiumStatus === "available";
  const isConverted = property.premiumStatus === "converted";
  const estimatedReturn = property.totalInvestment * (property.premiumRoi ?? 0) / 100;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3 min-w-0">
          <Button asChild variant="ghost" size="icon-sm" className="rounded-xl shrink-0 mt-0.5">
            <Link href="/admin/premium-properties">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold truncate">{property.title}</h1>
              <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0">
                <Crown className="size-3 mr-1" />
                Premium
              </Badge>
              {isCaught && (
                <Badge className="bg-emerald-500 text-white border-0">
                  <CheckCircle2 className="size-3 mr-1" />
                  Capturada
                </Badge>
              )}
              {isAvailable && (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  <Clock className="size-3 mr-1" />
                  Disponible
                </Badge>
              )}
              {isConverted && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  <ArrowRightLeft className="size-3 mr-1" />
                  Convertida a estándar
                </Badge>
              )}
              <CurrencyBadge currency={property.currency} />
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="size-3.5 shrink-0" />
              {property.address}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl">
            Editar
          </Button>
          {isAvailable && (
            <Button className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white">
              <Bell className="size-4 mr-2" />
              Notificar Premium
            </Button>
          )}
        </div>
      </header>

      {isCaught && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="size-10 rounded-xl bg-emerald-500 flex items-center justify-center">
              <User className="size-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-900">Inversor único — Captura al 100%</p>
              <p className="text-xs text-emerald-700">Esta propiedad tiene un solo inversor Premium</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl bg-white border border-emerald-100 p-5 space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <User className="size-4 text-emerald-600" />
                Datos del inversor
              </h3>
              <div className="flex items-center gap-4">
                <div className="size-14 rounded-full bg-emerald-100 flex items-center justify-center text-lg font-bold text-emerald-700">
                  {property.caughtByUserName?.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-base font-bold">{property.caughtByUserName}</p>
                  <p className="text-xs text-muted-foreground">Usuario Premium verificado</p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="size-3.5" />
                  <span className="truncate">
                    {property.caughtByUserId === "premium-demo"
                      ? "premium@remata.com"
                      : "maria.vargas@mail.com"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="size-3.5" />
                  <span>+51 999 *** ***</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Shield className="size-3.5" />
                  <span>KYC verificado</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="size-3.5" />
                  <span>
                    {property.caughtAt
                      ? formatDate(property.caughtAt.split("T")[0])
                      : "—"}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white border border-emerald-100 p-5 space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Wallet className="size-4 text-emerald-600" />
                Detalle de inversión
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Monto invertido</span>
                  <span className="font-bold">
                    {formatCurrency(property.totalInvestment, property.currency)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Percent className="size-3.5" />
                    Participación
                  </span>
                  <span className="font-bold text-emerald-700">100%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="size-3.5" />
                    ROI Premium
                  </span>
                  <span className="font-bold text-amber-700">{property.premiumRoi}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Retorno estimado</span>
                  <span className="font-bold text-emerald-600">
                    {formatCurrency(estimatedReturn, property.currency)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Estado del pago</span>
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200" variant="outline">
                    Confirmado
                  </Badge>
                </div>
              </div>
              <Button className="w-full rounded-xl" variant="outline">
                Ver comprobante de pago
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AdminPropertyGallery images={property.images} title={property.title} />

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">Descripción</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {property.description}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className={cn(
            "rounded-2xl overflow-hidden",
            isAvailable && "border-amber-200"
          )}>
            <div className={cn(
              "p-4",
              isAvailable
                ? "bg-gradient-to-br from-amber-500 to-amber-600 text-white"
                : "bg-muted/30"
            )}>
              <p className={cn("text-xs mb-1", isAvailable ? "text-white/80" : "text-muted-foreground")}>
                ROI Premium
              </p>
              <p className="text-3xl font-bold">{property.premiumRoi}%</p>
              <p className={cn("text-xs mt-1", isAvailable ? "text-white/70" : "text-muted-foreground")}>
                Estándar: {property.roi}%
              </p>
            </div>
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Valor total</span>
                <span className="font-semibold">
                  {formatCurrency(property.totalInvestment, property.currency)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Inversores</span>
                <span className="font-semibold">
                  {isCaught ? "1 (100%)" : "0"}
                </span>
              </div>
              {property.premiumDeadline && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Vence premium</span>
                  <span>{formatDate(property.premiumDeadline.split("T")[0])}</span>
                </div>
              )}
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Notificar Premium</span>
                <Switch checked={property.notifyPremiumUsers} />
              </div>
            </CardContent>
          </Card>

          {isAvailable && (
            <Card className="rounded-2xl border-amber-200 bg-amber-50/30">
              <CardContent className="p-4">
                <p className="text-sm font-semibold text-amber-900 mb-2">Acciones disponibles</p>
                <div className="flex flex-col gap-2">
                  <Button className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white w-full">
                    <Bell className="size-4 mr-2" />
                    Enviar notificación Premium
                  </Button>
                  <Button variant="outline" className="rounded-xl w-full">
                    Extender ventana premium
                  </Button>
                  <Button variant="outline" className="rounded-xl w-full text-red-600 hover:text-red-700">
                    Convertir a estándar ahora
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {isConverted && (
            <Card className="rounded-2xl border-blue-200 bg-blue-50/30">
              <CardContent className="p-4">
                <p className="text-sm font-semibold text-blue-900 mb-1">Convertida a estándar</p>
                <p className="text-xs text-blue-700 leading-relaxed">
                  La ventana premium expiró sin inversor. La propiedad ahora está
                  disponible en el mercado estándar con ROI del {property.roi}%.
                </p>
                <Button asChild variant="outline" className="rounded-xl w-full mt-3">
                  <Link href={`/admin/properties/${property.id}`}>
                    Ver en propiedades estándar
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
