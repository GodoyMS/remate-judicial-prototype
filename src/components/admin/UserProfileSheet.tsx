"use client";

import {
  Mail,
  Phone,
  Shield,
  Crown,
  TrendingUp,
  Wallet,
  Activity,
  Clock,
  Ban,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import type { AdminUser } from "@/lib/admin/types";
import { getActivitiesByUser, propertyInvestments } from "@/lib/admin/mock-data";
import { formatCurrency, formatDate } from "@/lib/admin/formatters";

interface UserProfileSheetProps {
  user: AdminUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const providerLabels = {
  google: "Google OAuth",
  email: "Correo electrónico",
  apple: "Apple ID",
};

export function UserProfileSheet({ user, open, onOpenChange }: UserProfileSheetProps) {
  if (!user) return null;

  const activities = getActivitiesByUser(user.id);
  const investments = propertyInvestments.filter((i) => i.userId === user.id);
  const roiPercent = user.totalInvested > 0
    ? Math.round((user.totalGains / user.totalInvested) * 100)
    : 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto p-0">
        <div className="bg-gradient-to-br from-secondary/10 to-accent/30 p-6 pb-4">
          <SheetHeader>
            <div className="flex items-start gap-4">
              <div className="size-14 rounded-2xl bg-secondary flex items-center justify-center text-lg font-bold text-secondary-foreground shrink-0">
                {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <SheetTitle className="text-lg">{user.name}</SheetTitle>
                <SheetDescription className="text-sm">{user.email}</SheetDescription>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <Badge variant={user.tier === "premium" ? "default" : "outline"} className="text-[10px]">
                    {user.tier === "premium" ? <Crown className="size-3 mr-0.5" /> : null}
                    {user.tier === "premium" ? "Premium" : "Standard"}
                  </Badge>
                  <Badge variant={user.status === "active" ? "outline" : "destructive"} className="text-[10px]">
                    {user.status === "active" ? "Activo" : "Bloqueado"}
                  </Badge>
                  {user.verified && (
                    <Badge variant="outline" className="text-[10px] text-green-700 border-green-200 bg-green-50">
                      <CheckCircle2 className="size-3 mr-0.5" />
                      Verificado
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </SheetHeader>
        </div>

        <Tabs defaultValue="overview" className="px-6 py-4">
          <TabsList className="w-full rounded-xl">
            <TabsTrigger value="overview" className="flex-1 rounded-lg text-xs">Resumen</TabsTrigger>
            <TabsTrigger value="investments" className="flex-1 rounded-lg text-xs">Inversiones</TabsTrigger>
            <TabsTrigger value="activity" className="flex-1 rounded-lg text-xs">Actividad</TabsTrigger>
            <TabsTrigger value="stats" className="flex-1 rounded-lg text-xs">Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border/60 p-3">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Total invertido</p>
                <p className="text-lg font-bold mt-1">{formatCurrency(user.totalInvested)}</p>
              </div>
              <div className="rounded-xl border border-border/60 p-3">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Ganancias</p>
                <p className="text-lg font-bold mt-1 text-green-600">{formatCurrency(user.totalGains)}</p>
              </div>
            </div>

            <div className="space-y-3">
              <InfoRow icon={Mail} label="Email" value={user.email} />
              <InfoRow icon={Phone} label="Teléfono" value={user.phone} />
              <InfoRow icon={Shield} label="DNI" value={user.dni} />
              <InfoRow icon={Shield} label="Proveedor" value={providerLabels[user.provider]} />
              <InfoRow icon={Clock} label="Registro" value={formatDate(user.joinedAt)} />
              <InfoRow icon={Activity} label="Última actividad" value={formatDate(user.lastActive)} />
            </div>
          </TabsContent>

          <TabsContent value="investments" className="mt-4 space-y-3">
            {investments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Sin inversiones registradas</p>
            ) : (
              investments.map((inv) => (
                <div key={inv.id} className="rounded-xl border border-border/60 p-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{formatCurrency(inv.amount)}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(inv.date)}</p>
                  </div>
                  <Badge variant={inv.status === "confirmed" ? "default" : "outline"} className="text-[10px]">
                    {inv.status === "confirmed" ? "Confirmada" : inv.status === "pending" ? "Pendiente" : "Cancelada"}
                  </Badge>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="activity" className="mt-4 space-y-2">
            {activities.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Sin actividad reciente</p>
            ) : (
              activities.map((a) => (
                <div key={a.id} className="flex items-start gap-3 py-2 border-b border-border/40 last:border-0">
                  <div className="size-7 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Activity className="size-3.5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-foreground">{a.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{formatDate(a.date)}</p>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="stats" className="mt-4 space-y-4">
            <div className="rounded-xl border border-border/60 p-4 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium flex items-center gap-1.5">
                    <TrendingUp className="size-4 text-green-600" />
                    Retorno acumulado
                  </span>
                  <span className="text-sm font-bold text-green-600">+{roiPercent}%</span>
                </div>
                <Progress value={Math.min(roiPercent, 100)} className="h-2" />
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <StatItem icon={Wallet} label="Inversiones" value={String(investments.length)} />
                <StatItem icon={TrendingUp} label="ROI promedio" value={`+${roiPercent}%`} />
                <StatItem icon={Crown} label="Plan" value={user.tier === "premium" ? "Premium" : "Standard"} />
                <StatItem icon={Ban} label="Estado" value={user.status === "active" ? "Activo" : "Bloqueado"} />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="px-6 pb-6 flex gap-2">
          <Button variant="outline" className="flex-1 rounded-xl" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
          <Button variant="destructive" className="flex-1 rounded-xl">
            {user.status === "active" ? "Bloquear usuario" : "Desbloquear"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="size-4 text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-muted-foreground">{label}</p>
        <p className="text-sm truncate">{value}</p>
      </div>
    </div>
  );
}

function StatItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="text-center">
      <Icon className="size-4 text-muted-foreground mx-auto mb-1" />
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}
