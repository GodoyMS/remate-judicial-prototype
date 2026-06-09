"use client";

import { use, useState, useEffect } from "react";
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
  Banknote,
  Landmark,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { AdminPropertyGallery } from "@/components/admin/AdminPropertyGallery";
import { getAdminPremiumPropertyById } from "@/lib/admin/premium-mock-data";
import { CurrencyBadge } from "@/components/shared/CurrencyBadge";
import { formatCurrency, formatDate } from "@/lib/admin/formatters";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  getPendingInvestmentsForProperty,
  getPremiumPropertyOverride,
  updatePendingPremiumInvestment,
  setPremiumPropertyOverride,
  type PendingPremiumInvestment,
} from "@/lib/app-store";
import type { AdminProperty } from "@/lib/admin/types";

export default function AdminPremiumPropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const baseProperty = getAdminPremiumPropertyById(id);

  const [pendingInvestments, setPendingInvestments] = useState<PendingPremiumInvestment[]>([]);
  const [propertyOverride, setPropertyOverrideState] = useState<{
    premiumStatus: AdminProperty["premiumStatus"];
    caughtByUserName?: string;
  } | null>(null);
  const [rejectTarget, setRejectTarget] = useState<PendingPremiumInvestment | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    const investments = getPendingInvestmentsForProperty(id).filter(
      (i) => i.status === "pending_verification"
    );
    setPendingInvestments(investments);
    // Check for approved investment override
    const override = getPremiumPropertyOverride(id);
    if (override) setPropertyOverrideState(override);
  }, [id]);

  if (!baseProperty) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-semibold">Propiedad no encontrada</p>
        <Button asChild variant="link" className="mt-2">
          <Link href="/admin/premium-properties">Volver</Link>
        </Button>
      </div>
    );
  }

  const effectivePremiumStatus =
    (propertyOverride?.premiumStatus ?? baseProperty.premiumStatus) as AdminProperty["premiumStatus"];
  const effectiveCaughtByUserName =
    propertyOverride?.caughtByUserName ?? baseProperty.caughtByUserName;

  const isCaught = effectivePremiumStatus === "caught";
  const isAvailable = effectivePremiumStatus === "available";
  const isConverted = effectivePremiumStatus === "converted";
  const estimatedReturn = baseProperty.totalInvestment * (baseProperty.premiumRoi ?? 0) / 100;

  const handleApproveInvestment = (inv: PendingPremiumInvestment) => {
    updatePendingPremiumInvestment(inv.id, {
      status: "approved",
      resolvedAt: new Date().toISOString(),
    });
    setPremiumPropertyOverride({
      propertyId: id,
      premiumStatus: "caught",
      caughtByUserId: inv.userId,
      caughtByUserName: inv.userName,
      caughtAt: new Date().toISOString(),
    });
    setPendingInvestments([]);
    setPropertyOverrideState({ premiumStatus: "caught", caughtByUserName: inv.userName });
    toast.success(`Inversión de ${inv.userName} aprobada`, {
      description: `Propiedad marcada como Capturada. Inversión: Activa.`,
    });
  };

  const handleRejectInvestment = () => {
    if (!rejectTarget || !rejectReason.trim()) return;
    updatePendingPremiumInvestment(rejectTarget.id, {
      status: "rejected",
      rejectionReason: rejectReason.trim(),
      resolvedAt: new Date().toISOString(),
    });
    setPendingInvestments((prev) => prev.filter((i) => i.id !== rejectTarget.id));
    toast.success(`Inversión rechazada`, {
      description: `La propiedad vuelve a estar disponible para otros inversores Premium.`,
    });
    setRejectTarget(null);
    setRejectReason("");
  };

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
              <h1 className="text-xl font-bold truncate">{baseProperty.title}</h1>
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
              {isAvailable && pendingInvestments.length > 0 && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <Clock className="size-3 mr-1" />
                  En verificación
                </Badge>
              )}
              {isAvailable && pendingInvestments.length === 0 && (
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
              <CurrencyBadge currency={baseProperty.currency} />
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="size-3.5 shrink-0" />
              {baseProperty.address}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl">
            Editar
          </Button>
          {isAvailable && pendingInvestments.length === 0 && (
            <Button className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white">
              <Bell className="size-4 mr-2" />
              Notificar Premium
            </Button>
          )}
        </div>
      </header>

      {/* ─── Pending investment verification banner ─── */}
      {pendingInvestments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="size-10 rounded-xl bg-blue-500 flex items-center justify-center">
              <AlertCircle className="size-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-900">
                Inversión pendiente de verificación
              </p>
              <p className="text-xs text-blue-700">
                Revisa el comprobante y aprueba o rechaza la inversión
              </p>
            </div>
          </div>

          {pendingInvestments.map((inv) => (
            <div
              key={inv.id}
              className="rounded-xl bg-white border border-blue-100 p-5 space-y-4"
            >
              <div className="grid md:grid-cols-2 gap-6">
                {/* Investor info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <User className="size-4 text-blue-600" />
                    Datos del inversor
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-full bg-blue-100 flex items-center justify-center text-base font-bold text-blue-700">
                      {inv.userName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-base font-bold">{inv.userName}</p>
                      <p className="text-xs text-muted-foreground">Usuario Premium</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="size-3.5" />
                      <span className="truncate">{inv.userEmail}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="size-3.5" />
                      <span>
                        Enviado:{" "}
                        {new Intl.DateTimeFormat("es-PE", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }).format(new Date(inv.submittedAt))}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Investment & payment details */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Wallet className="size-4 text-blue-600" />
                    Detalle del pago
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monto</span>
                      <span className="font-bold">
                        {formatCurrency(inv.amount, inv.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Percent className="size-3.5" />
                        Participación
                      </span>
                      <span className="font-bold text-amber-700">100%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <TrendingUp className="size-3.5" />
                        Retorno estimado
                      </span>
                      <span className="font-bold text-emerald-600">
                        {formatCurrency(inv.estimatedReturn, inv.currency)}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Método</span>
                      <span className="flex items-center gap-1 font-medium">
                        {inv.paymentMethod === "transfer" ? (
                          <><Banknote className="size-3.5" /> Transferencia bancaria</>
                        ) : (
                          <><Landmark className="size-3.5" /> Depósito en cuenta</>
                        )}
                      </span>
                    </div>
                    {inv.paymentMethod === "transfer" && (
                      <>
                        {inv.transferNumber && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">N° transferencia</span>
                            <span className="font-mono text-xs">{inv.transferNumber}</span>
                          </div>
                        )}
                        {inv.originAccountNumber && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Cuenta origen</span>
                            <span className="font-mono text-xs">{inv.originAccountNumber}</span>
                          </div>
                        )}
                      </>
                    )}
                    {inv.paymentMethod === "deposit" && (
                      <>
                        {inv.voucherNumber && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">N° voucher</span>
                            <span className="font-mono text-xs">{inv.voucherNumber}</span>
                          </div>
                        )}
                        {inv.operationNumber && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">N° operación</span>
                            <span className="font-mono text-xs">{inv.operationNumber}</span>
                          </div>
                        )}
                        {inv.voucherDate && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Fecha voucher</span>
                            <span>{inv.voucherDate}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-blue-100">
                <Button
                  className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => handleApproveInvestment(inv)}
                >
                  <CheckCircle2 className="size-4 mr-2" />
                  Aprobar inversión — marcar como Capturada
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => { setRejectTarget(inv); setRejectReason(""); }}
                >
                  <XCircle className="size-4 mr-2" />
                  Rechazar
                </Button>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* ─── Caught investor banner (after approval or static data) ─── */}
      {isCaught && pendingInvestments.length === 0 && (
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
                  {(effectiveCaughtByUserName ?? "")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-base font-bold">{effectiveCaughtByUserName}</p>
                  <p className="text-xs text-muted-foreground">Usuario Premium verificado</p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="size-3.5" />
                  <span className="truncate">
                    {baseProperty.caughtByUserId === "premium-demo"
                      ? "premium@remata.com"
                      : "inversor@mail.com"}
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
                    {baseProperty.caughtAt
                      ? formatDate(baseProperty.caughtAt.split("T")[0])
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
                    {formatCurrency(baseProperty.totalInvestment, baseProperty.currency)}
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
                  <span className="font-bold text-amber-700">{baseProperty.premiumRoi}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Retorno estimado</span>
                  <span className="font-bold text-emerald-600">
                    {formatCurrency(estimatedReturn, baseProperty.currency)}
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
          <AdminPropertyGallery images={baseProperty.images} title={baseProperty.title} />

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">Descripción</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {baseProperty.description}
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
              <p className="text-3xl font-bold">{baseProperty.premiumRoi}%</p>
              <p className={cn("text-xs mt-1", isAvailable ? "text-white/70" : "text-muted-foreground")}>
                Estándar: {baseProperty.roi}%
              </p>
            </div>
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Valor total</span>
                <span className="font-semibold">
                  {formatCurrency(baseProperty.totalInvestment, baseProperty.currency)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Inversores</span>
                <span className="font-semibold">
                  {isCaught ? "1 (100%)" : "0"}
                </span>
              </div>
              {baseProperty.premiumDeadline && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Vence premium</span>
                  <span>{formatDate(baseProperty.premiumDeadline.split("T")[0])}</span>
                </div>
              )}
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Notificar Premium</span>
                <Switch checked={baseProperty.notifyPremiumUsers} />
              </div>
            </CardContent>
          </Card>

          {isAvailable && pendingInvestments.length === 0 && (
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
                  disponible en el mercado estándar con ROI del {baseProperty.roi}%.
                </p>
                <Button asChild variant="outline" className="rounded-xl w-full mt-3">
                  <Link href={`/admin/properties/${baseProperty.id}`}>
                    Ver en propiedades estándar
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Reject investment dialog */}
      <AlertDialog
        open={!!rejectTarget}
        onOpenChange={(open) => { if (!open) { setRejectTarget(null); setRejectReason(""); } }}
      >
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Rechazar inversión Premium</AlertDialogTitle>
            <AlertDialogDescription>
              La inversión de <strong>{rejectTarget?.userName}</strong> será rechazada y la
              propiedad volverá a estar disponible para inversores Premium.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="pb-0">
            <Input
              placeholder="Motivo del rechazo..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl bg-red-600 hover:bg-red-700"
              disabled={!rejectReason.trim()}
              onClick={handleRejectInvestment}
            >
              Rechazar inversión
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
