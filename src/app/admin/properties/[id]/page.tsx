"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  Edit,
  MapPin,
  Star,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { PropertyInvestmentsSection } from "@/components/admin/PropertyInvestmentsSection";
import { EditPropertySheet } from "@/components/admin/EditPropertySheet";
import { AdminPropertyGallery } from "@/components/admin/AdminPropertyGallery";
import { PropertyLocationMap } from "@/components/admin/PropertyLocationMap";
import {
  getPropertyById,
  getInvestmentsByProperty,
} from "@/lib/admin/mock-data";
import { getAdminPropertyImages } from "@/lib/admin/properties";
import type { AdminProperty } from "@/lib/admin/types";
import { CurrencyBadge } from "@/components/shared/CurrencyBadge";
import { formatCurrency, formatDate } from "@/lib/admin/formatters";
import {
  countUniqueInvestors,
  filterInvestmentsByTab,
  sumConfirmedAmount,
} from "@/lib/admin/investments";
import type { PropertyInvestment } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

export default function AdminPropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [property, setProperty] = useState<AdminProperty | null>(() =>
    getPropertyById(id) ?? null
  );
  const [editOpen, setEditOpen] = useState(false);
  const [investments, setInvestments] = useState<PropertyInvestment[]>(() =>
    getInvestmentsByProperty(id)
  );
  const [featured, setFeatured] = useState(property?.featured ?? false);
  const [published, setPublished] = useState(property?.published ?? false);

  const confirmedAmount = useMemo(
    () => sumConfirmedAmount(investments),
    [investments]
  );
  const pendingCount = useMemo(
    () => filterInvestmentsByTab(investments, "pending").length,
    [investments]
  );
  const uniqueInvestors = useMemo(
    () => countUniqueInvestors(investments),
    [investments]
  );

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-semibold">Propiedad no encontrada</p>
        <Button asChild variant="link" className="mt-2">
          <Link href="/admin/properties">Volver a propiedades</Link>
        </Button>
      </div>
    );
  }

  const progress = Math.round((confirmedAmount / property.totalInvestment) * 100);
  const remaining = Math.max(0, property.totalInvestment - confirmedAmount);
  const propertyImages = getAdminPropertyImages(property);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3 min-w-0">
          <Button asChild variant="ghost" size="icon-sm" className="rounded-xl shrink-0 mt-0.5">
            <Link href="/admin/properties">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold truncate">{property.title}</h1>
              <CurrencyBadge currency={property.currency} />
              {featured && (
                <Badge className="text-[10px]">
                  <Star className="size-3 mr-0.5 fill-current" />
                  Destacada
                </Badge>
              )}
              <Badge variant={published ? "default" : "outline"} className="text-[10px]">
                {published ? "Publicada" : "Borrador"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="size-3.5 shrink-0" />
              <span className="truncate">
                {property.district}, {property.province} · {property.address}
              </span>
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          className="rounded-xl shrink-0 self-start"
          onClick={() => setEditOpen(true)}
        >
          <Edit className="size-4 mr-1" />
          Editar propiedad
        </Button>
      </header>

      <EditPropertySheet
        property={property}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSave={(updated) => {
          setProperty(updated);
          setFeatured(updated.featured);
          setPublished(updated.published);
        }}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard
          icon={Wallet}
          label="Meta de inversión"
          value={formatCurrency(property.totalInvestment, property.currency)}
          sub={`${progress}% recaudado`}
        />
        <KpiCard
          icon={CheckCircle2}
          iconClass="text-emerald-600"
          label="Confirmado"
          value={formatCurrency(confirmedAmount, property.currency)}
          sub={`${formatCurrency(remaining, property.currency)} disponible`}
        />
        <KpiCard
          icon={Clock}
          iconClass={pendingCount > 0 ? "text-amber-600" : undefined}
          label="Verificación pendiente"
          value={String(pendingCount)}
          sub={pendingCount > 0 ? "Requiere acción" : "Al día"}
        />
        <KpiCard
          icon={Users}
          label="Inversores"
          value={String(uniqueInvestors)}
          sub={`${filterInvestmentsByTab(investments, "confirmed").length} inversiones`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(300px,360px)_1fr] gap-6 items-start">
        <motion.aside
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4 lg:sticky lg:top-4"
        >
          <Card className="rounded-2xl border-border/60 overflow-hidden">
            <AdminPropertyGallery
              images={propertyImages}
              title={property.title}
              overlay={
                <>
                  <p className="text-white/80 text-[10px]">
                    {property.region} · ROI proyectado
                  </p>
                  <p className="text-white text-lg font-bold mt-0.5 flex items-center gap-1.5">
                    <TrendingUp className="size-4 text-green-400" />
                    +{property.roi}%
                  </p>
                  <p className="text-white/80 text-[10px] mt-1">
                    Publicada {formatDate(property.publishDate)}
                  </p>
                </>
              }
            />
            <CardContent className="p-4 space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                {property.description}
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Progreso de captación</span>
                  <span className="font-semibold text-emerald-600">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <StatPill label="Recaudado" value={formatCurrency(confirmedAmount, property.currency)} highlight />
                <StatPill label="Disponible" value={formatCurrency(remaining, property.currency)} />
                <StatPill
                  label="Creada"
                  value={formatDate(property.createdAt)}
                  icon={Calendar}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Controles de publicación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ControlRow
                icon={Star}
                iconClass="text-amber-500"
                label="Destacada"
                control={
                  <Switch
                    checked={featured}
                    onCheckedChange={(v) => {
                      setFeatured(v);
                      toast.success(v ? "Marcada como destacada" : "Quitada de destacados");
                    }}
                  />
                }
              />
              <Separator />
              <ControlRow
                icon={CheckCircle2}
                iconClass="text-green-600"
                label="Publicada"
                control={
                  <Switch
                    checked={published}
                    onCheckedChange={(v) => {
                      setPublished(v);
                      toast.success(v ? "Propiedad publicada" : "Propiedad despublicada");
                    }}
                  />
                }
              />
              <Separator />
              <ControlRow
                icon={Bell}
                iconClass="text-secondary"
                label="Notificar usuarios"
                control={
                  <Switch
                    defaultChecked={property.notifyUsers}
                    onCheckedChange={() =>
                      toast.success("Preferencia de notificación actualizada")
                    }
                  />
                }
              />
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Ubicación</CardTitle>
            </CardHeader>
            <CardContent>
              <PropertyLocationMap
                lat={property.lat}
                lng={property.lng}
                address={property.address}
                readOnly
              />
            </CardContent>
          </Card>
        </motion.aside>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="min-w-0"
        >
          <PropertyInvestmentsSection
            investments={investments}
            onInvestmentsChange={setInvestments}
          />
        </motion.div>
      </div>
    </div>
  );
}

function KpiCard({
  icon: Icon,
  iconClass,
  label,
  value,
  sub,
}: {
  icon: typeof Wallet;
  iconClass?: string;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <Card className="rounded-2xl border-border/60">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Icon className={cn("size-4 text-muted-foreground", iconClass)} />
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
        </div>
        <p className="text-lg sm:text-xl font-bold tabular-nums">{value}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>
      </CardContent>
    </Card>
  );
}

function StatPill({
  label,
  value,
  highlight,
  icon: Icon,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  icon?: typeof Calendar;
}) {
  return (
    <div className="rounded-xl bg-muted/40 px-3 py-2.5 flex items-center justify-between gap-2">
      <p className="text-[10px] text-muted-foreground uppercase">{label}</p>
      <p
        className={cn(
          "text-sm font-bold flex items-center gap-1 shrink-0",
          highlight && "text-emerald-600"
        )}
      >
        {Icon && <Icon className="size-3.5" />}
        {value}
      </p>
    </div>
  );
}

function ControlRow({
  icon: Icon,
  iconClass,
  label,
  control,
}: {
  icon: typeof Star;
  iconClass?: string;
  label: string;
  control: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Icon className={cn("size-4", iconClass)} />
        <span className="text-sm">{label}</span>
      </div>
      {control}
    </div>
  );
}
