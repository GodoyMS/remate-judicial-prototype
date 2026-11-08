"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Crown, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { AdminPropertyGallery } from "@/components/admin/AdminPropertyGallery";
import { PremiumReservationsPanel } from "@/components/admin/PremiumReservationsPanel";
import { StatusPill } from "@/components/premium/StatusPill";
import { availabilityPill } from "@/components/premium/reservation-ui";
import { CurrencyBadge } from "@/components/shared/CurrencyBadge";
import { getAdminPremiumPropertyById } from "@/lib/admin/premium-mock-data";
import { getPremiumPropertyById } from "@/lib/premium/mock-data";
import { getAvailability } from "@/lib/premium/availability";
import { useReservations } from "@/lib/premium/reservations";
import { formatLimaDateTime } from "@/lib/premium/dates";
import { formatCurrency } from "@/lib/admin/formatters";

export default function AdminPremiumPropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const baseProperty = getAdminPremiumPropertyById(id);
  const premium = getPremiumPropertyById(id);
  const reservations = useReservations();

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

  // Vista de admin: la disponibilidad se mira "desde fuera" (sin usuario).
  const availability = premium ? getAvailability(premium, reservations, "__admin__") : null;
  const pill = availability
    ? availability.kind === "held" || availability.kind === "taken"
      ? { label: availability.kind === "held" ? "Con solicitud o reserva" : "Financiada", tone: "primary" as const }
      : availabilityPill(availability)
    : null;
  const deadline = premium?.premiumDeadline ?? baseProperty.premiumDeadline;

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-6 pb-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <Button asChild variant="ghost" size="icon-sm" className="mt-0.5 shrink-0 rounded-xl">
            <Link href="/admin/premium-properties" aria-label="Volver">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-xl font-bold">{baseProperty.title}</h1>
              <Badge className="border-0 bg-premium/15 text-premium">
                <Crown className="mr-1 size-3" />
                Premium
              </Badge>
              {pill && <StatusPill tone={pill.tone} size="xs">{pill.label}</StatusPill>}
              <CurrencyBadge currency={baseProperty.currency} />
            </div>
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="size-3.5 shrink-0" />
              {baseProperty.address}
            </p>
          </div>
        </div>
        <Button variant="outline" className="rounded-xl">
          Editar
        </Button>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <PremiumReservationsPanel propertyId={id} />
          <AdminPropertyGallery images={baseProperty.images} title={baseProperty.title} />
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">Descripción</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">{premium?.description ?? baseProperty.description}</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="rounded-2xl">
            <CardContent className="space-y-3 p-4">
              <div>
                <p className="text-xs text-muted-foreground">Capital requerido (100%)</p>
                <p className="text-2xl font-bold tabular-nums">{formatCurrency(baseProperty.totalInvestment, baseProperty.currency)}</p>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Retorno neto estimado</span>
                <span className="font-semibold">{premium?.roiBasis.netRoi ?? baseProperty.premiumRoi}%</span>
              </div>
              {deadline && (
                <div className="flex justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">Cierre de ventana</span>
                  <span className="text-right">{formatLimaDateTime(deadline)}</span>
                </div>
              )}
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Notificar a usuarios Premium</span>
                <Switch defaultChecked={baseProperty.notifyPremiumUsers} aria-label="Notificar a usuarios Premium" />
              </div>
            </CardContent>
          </Card>
          {availability?.kind === "available" && (
            <Card className="rounded-2xl">
              <CardContent className="space-y-2 p-4">
                <p className="text-sm font-semibold">Ventana abierta</p>
                <Button variant="outline" className="w-full rounded-xl">Extender ventana</Button>
                <Button variant="outline" className="w-full rounded-xl text-destructive hover:text-destructive">
                  Pasar a inversión colectiva
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
