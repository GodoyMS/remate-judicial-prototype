"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Bell,
  Lock,
  Key,
  Smartphone,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminPermissionsPanel } from "@/components/admin/rbac/AdminPermissionsPanel";
import { useAdminAuth } from "@/contexts/admin-auth-context";
import { getInitials } from "@/lib/admin/rbac/constants";
import { formatDate } from "@/lib/admin/formatters";

export default function AdminSettingsPage() {
  const { account, role, isSuperAdmin } = useAdminAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactor, setTwoFactor] = useState(account?.twoFactorEnabled ?? false);
  const [notifications, setNotifications] = useState({
    newInvestments: true,
    newUsers: true,
    propertyUpdates: false,
    systemAlerts: true,
    weeklyReport: true,
  });

  if (!account) return null;

  const handleSaveNotifications = () => {
    toast.success("Preferencias de notificación guardadas");
  };

  const handleToggle2FA = (enabled: boolean) => {
    setTwoFactor(enabled);
    toast.success(enabled ? "Autenticación 2FA activada" : "Autenticación 2FA desactivada");
  };

  return (
    <div className="w-full max-w-4xl mx-auto min-w-0">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">Configuración</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Administra tu cuenta, seguridad y preferencias del backoffice
        </p>
      </motion.div>

      <Tabs defaultValue="profile">
        <TabsList className="w-full sm:w-auto h-auto rounded-xl mb-6 p-1 bg-muted/50 overflow-x-auto flex flex-nowrap justify-start">
          <TabsTrigger value="profile" className="rounded-lg flex-1 sm:flex-none min-w-0 px-2.5 sm:px-3 text-xs sm:text-sm">
            Mi cuenta
          </TabsTrigger>
          <TabsTrigger value="permissions" className="rounded-lg flex-1 sm:flex-none min-w-0 px-2.5 sm:px-3 text-xs sm:text-sm">
            Mis permisos
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg flex-1 sm:flex-none min-w-0 px-2.5 sm:px-3 text-xs sm:text-sm">
            Notificaciones
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg flex-1 sm:flex-none min-w-0 px-2.5 sm:px-3 text-xs sm:text-sm">
            Seguridad
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="rounded-2xl border-border/60">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="size-16 rounded-2xl bg-secondary flex items-center justify-center text-xl font-bold text-secondary-foreground">
                  {getInitials(account.name)}
                </div>
                <div>
                  <CardTitle>{account.name}</CardTitle>
                  <CardDescription>{account.email}</CardDescription>
                  <Badge className="mt-2 text-[10px]">
                    <Shield className="size-3 mr-0.5" />
                    {isSuperAdmin ? "Super Admin" : role?.name ?? "Administrador"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="admin-name">Nombre completo</Label>
                  <Input id="admin-name" defaultValue={account.name} className="rounded-xl" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="admin-email">Correo corporativo</Label>
                  <Input id="admin-email" defaultValue={account.email} className="rounded-xl" disabled />
                </div>
              </div>
              <div className="rounded-xl bg-muted/40 p-4 flex items-center gap-3">
                <CheckCircle2 className="size-5 text-green-600 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Último acceso</p>
                  <p className="text-xs text-muted-foreground">{formatDate(account.lastLogin)} · Lima, PE</p>
                </div>
              </div>
              <Button className="rounded-xl" onClick={() => toast.success("Perfil actualizado")}>
                Guardar cambios
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions">
          <AdminPermissionsPanel />
          {!isSuperAdmin && (
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Los permisos son asignados por un Super Admin desde{" "}
              <span className="font-medium text-foreground">Gestión de accesos</span>.
            </p>
          )}
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="rounded-2xl border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="size-4" />
                Preferencias de notificaciones
              </CardTitle>
              <CardDescription>
                Configura qué alertas recibes en el panel y por correo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              {[
                { key: "newInvestments" as const, label: "Nuevas inversiones", desc: "Cuando un usuario invierte en una propiedad" },
                { key: "newUsers" as const, label: "Nuevos registros", desc: "Cuando se registra un nuevo inversor" },
                { key: "propertyUpdates" as const, label: "Actualizaciones de propiedades", desc: "Cambios en propiedades que gestionas" },
                { key: "systemAlerts" as const, label: "Alertas del sistema", desc: "Errores, mantenimiento y avisos críticos" },
                { key: "weeklyReport" as const, label: "Reporte semanal", desc: "Resumen de KPIs cada lunes por email" },
              ].map((item, i, arr) => (
                <div key={item.key}>
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch
                      checked={notifications[item.key]}
                      onCheckedChange={(v) =>
                        setNotifications((prev) => ({ ...prev, [item.key]: v }))
                      }
                    />
                  </div>
                  {i < arr.length - 1 && <Separator />}
                </div>
              ))}
              <Button className="rounded-xl mt-4" onClick={handleSaveNotifications}>
                Guardar preferencias
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <div className="space-y-6">
            <Card className="rounded-2xl border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Lock className="size-4" />
                  Seguridad de la cuenta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center justify-between rounded-xl border border-border/60 p-4">
                  <div className="flex items-center gap-3">
                    <Smartphone className="size-5 text-secondary" />
                    <div>
                      <p className="text-sm font-medium">Autenticación de dos factores (2FA)</p>
                      <p className="text-xs text-muted-foreground">Protege tu cuenta con verificación adicional</p>
                    </div>
                  </div>
                  <Switch checked={twoFactor} onCheckedChange={handleToggle2FA} />
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label>Cambiar contraseña</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Contraseña actual"
                      className="pl-9 rounded-xl"
                    />
                  </div>
                  <Input type="password" placeholder="Nueva contraseña" className="rounded-xl" />
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirmar nueva contraseña"
                      className="rounded-xl pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                  <Button variant="outline" className="rounded-xl" onClick={() => toast.success("Contraseña actualizada")}>
                    Actualizar contraseña
                  </Button>
                </div>

                <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 flex items-start gap-3">
                  <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">Sesiones activas</p>
                    <p className="text-xs text-amber-700 mt-0.5">Tienes 2 sesiones activas. Cierra sesiones no reconocidas.</p>
                    <Button variant="link" className="text-xs text-amber-800 p-0 h-auto mt-1" onClick={() => toast.info("Sesiones cerradas")}>
                      Cerrar otras sesiones
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
