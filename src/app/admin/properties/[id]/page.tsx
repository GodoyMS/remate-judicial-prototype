"use client";

import { use, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  TrendingUp,
  Users,
  Calendar,
  Star,
  Edit,
  Bell,
  CheckCircle2,
  Clock,
  Ban,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RegisterInvestmentPanel } from "@/components/admin/RegisterInvestmentPanel";
import {
  getPropertyById,
  getInvestmentsByProperty,
} from "@/lib/admin/mock-data";
import { formatCurrency, formatDate } from "@/lib/admin/formatters";
import type { AdminUser } from "@/lib/admin/types";

export default function AdminPropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const property = getPropertyById(id);
  const [investments, setInvestments] = useState(getInvestmentsByProperty(id));
  const [raisedAmount, setRaisedAmount] = useState(property?.raisedAmount ?? 0);
  const [featured, setFeatured] = useState(property?.featured ?? false);
  const [published, setPublished] = useState(property?.published ?? false);

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

  const progress = Math.round((raisedAmount / property.totalInvestment) * 100);
  const remaining = property.totalInvestment - raisedAmount;
  const uniqueInvestors = [...new Set(investments.map((i) => i.userId))];

  const handleInvestmentRegistered = (amount: number, user: AdminUser) => {
    setRaisedAmount((prev) => prev + amount);
    setInvestments((prev) => [
      {
        id: `new-${Date.now()}`,
        propertyId: id,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        amount,
        date: new Date().toISOString().split("T")[0],
        status: "confirmed",
      },
      ...prev,
    ]);
  };

  const statusIcon = {
    confirmed: CheckCircle2,
    pending: Clock,
    cancelled: Ban,
  };

  const statusColor = {
    confirmed: "text-green-600 bg-green-50",
    pending: "text-amber-600 bg-amber-50",
    cancelled: "text-red-600 bg-red-50",
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Button asChild variant="ghost" size="icon-sm" className="rounded-xl">
          <Link href="/admin/properties">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-bold truncate">{property.title}</h2>
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
          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
            <MapPin className="size-3" />
            {property.address}
          </p>
        </div>
        <Button variant="outline" className="rounded-xl shrink-0" onClick={() => toast.info("Editor de propiedad próximamente")}>
          <Edit className="size-4 mr-1" />
          Editar
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="rounded-2xl border-border/60 overflow-hidden">
              <div className="relative aspect-[21/9]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div>
                    <p className="text-white/80 text-xs">{property.region} · {property.province} · {property.district}</p>
                    <p className="text-white text-2xl font-bold mt-1">{formatCurrency(property.totalInvestment)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 text-sm font-bold flex items-center gap-1 justify-end">
                      <TrendingUp className="size-4" />+{property.roi}% ROI
                    </p>
                  </div>
                </div>
              </div>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground leading-relaxed">{property.description}</p>
                <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-border/60">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase">Publicación</p>
                    <p className="text-sm font-medium flex items-center gap-1 mt-1">
                      <Calendar className="size-3.5" />
                      {formatDate(property.publishDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase">Inversores</p>
                    <p className="text-sm font-medium flex items-center gap-1 mt-1">
                      <Users className="size-3.5" />
                      {uniqueInvestors.length} únicos
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase">Creada</p>
                    <p className="text-sm font-medium mt-1">{formatDate(property.createdAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <Card className="rounded-2xl border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Meta de inversión vs. logrado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-foreground">{formatCurrency(raisedAmount)}</p>
                  <p className="text-sm text-muted-foreground">de {formatCurrency(property.totalInvestment)} meta</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">{progress}%</p>
                  <p className="text-xs text-muted-foreground">completado</p>
                </div>
              </div>
              <Progress value={progress} className="h-3" />
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="rounded-xl bg-muted/40 p-3 text-center">
                  <p className="text-[10px] text-muted-foreground">Recaudado</p>
                  <p className="text-sm font-bold text-green-600">{formatCurrency(raisedAmount)}</p>
                </div>
                <div className="rounded-xl bg-muted/40 p-3 text-center">
                  <p className="text-[10px] text-muted-foreground">Disponible</p>
                  <p className="text-sm font-bold">{formatCurrency(remaining)}</p>
                </div>
                <div className="rounded-xl bg-muted/40 p-3 text-center">
                  <p className="text-[10px] text-muted-foreground">Inversiones</p>
                  <p className="text-sm font-bold">{investments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="investments">
            <TabsList className="rounded-xl">
              <TabsTrigger value="investments" className="rounded-lg">Inversiones ({investments.length})</TabsTrigger>
              <TabsTrigger value="investors" className="rounded-lg">Inversores ({uniqueInvestors.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="investments" className="mt-4">
              <Card className="rounded-2xl border-border/60 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="pl-4">Inversor</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead className="pr-4">Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {investments.map((inv) => {
                      const Icon = statusIcon[inv.status];
                      return (
                        <TableRow key={inv.id}>
                          <TableCell className="pl-4">
                            <div>
                              <p className="text-sm font-medium">{inv.userName}</p>
                              <p className="text-[10px] text-muted-foreground">{inv.userEmail}</p>
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold">{formatCurrency(inv.amount)}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{formatDate(inv.date)}</TableCell>
                          <TableCell className="pr-4">
                            <span className={`inline-flex items-center gap-1 text-[10px] font-medium rounded-full px-2 py-0.5 ${statusColor[inv.status]}`}>
                              <Icon className="size-3" />
                              {inv.status === "confirmed" ? "Confirmada" : inv.status === "pending" ? "Pendiente" : "Cancelada"}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            <TabsContent value="investors" className="mt-4">
              <div className="grid sm:grid-cols-2 gap-3">
                {uniqueInvestors.map((userId) => {
                  const userInvs = investments.filter((i) => i.userId === userId);
                  const total = userInvs.reduce((sum, i) => sum + i.amount, 0);
                  const name = userInvs[0]?.userName ?? "";
                  return (
                    <Card key={userId} className="rounded-xl border-border/60">
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-secondary shrink-0">
                          {name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{name}</p>
                          <p className="text-xs text-muted-foreground">{userInvs.length} inversión(es)</p>
                        </div>
                        <p className="text-sm font-bold shrink-0">{formatCurrency(total)}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <RegisterInvestmentPanel
            propertyTitle={property.title}
            remainingAmount={remaining}
            onInvestmentRegistered={handleInvestmentRegistered}
          />

          <Card className="rounded-2xl border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Controles rápidos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="size-4 text-amber-500" />
                  <span className="text-sm">Destacada</span>
                </div>
                <Switch
                  checked={featured}
                  onCheckedChange={(v) => {
                    setFeatured(v);
                    toast.success(v ? "Marcada como destacada" : "Quitada de destacados");
                  }}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-green-600" />
                  <span className="text-sm">Publicada</span>
                </div>
                <Switch
                  checked={published}
                  onCheckedChange={(v) => {
                    setPublished(v);
                    toast.success(v ? "Propiedad publicada" : "Propiedad despublicada");
                  }}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="size-4 text-secondary" />
                  <span className="text-sm">Notificar usuarios</span>
                </div>
                <Switch defaultChecked={property.notifyUsers} onCheckedChange={() => toast.success("Preferencia de notificación actualizada")} />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Ubicación</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl bg-muted/40 aspect-video flex flex-col items-center justify-center gap-2">
                <MapPin className="size-8 text-muted-foreground/40" />
                <p className="text-xs text-muted-foreground text-center px-4">{property.address}</p>
                <p className="text-[10px] text-muted-foreground/60">
                  {property.lat}, {property.lng}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
