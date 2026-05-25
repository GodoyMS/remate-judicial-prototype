"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Bell,
  Lock,
  UserPlus,
  Mail,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { currentAdmin } from "@/lib/admin/mock-data";
import { formatDate } from "@/lib/admin/formatters";

const existingAdmins = [
  { name: "Valentina Ríos", email: "admin@remata.pe", role: "super_admin", active: true },
  { name: "Carlos Admin", email: "carlos.admin@remata.pe", role: "admin", active: true },
  { name: "María Ops", email: "maria.ops@remata.pe", role: "moderator", active: false },
];

export default function AdminSettingsPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactor, setTwoFactor] = useState(currentAdmin.twoFactorEnabled);
  const [notifications, setNotifications] = useState({
    newInvestments: true,
    newUsers: true,
    propertyUpdates: false,
    systemAlerts: true,
    weeklyReport: true,
  });
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    role: "admin",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSaveNotifications = () => {
    toast.success("Preferencias de notificación guardadas");
  };

  const handleToggle2FA = (enabled: boolean) => {
    setTwoFactor(enabled);
    toast.success(enabled ? "Autenticación 2FA activada" : "Autenticación 2FA desactivada");
  };

  const handleRegisterAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Administrador registrado", {
        description: `Invitación enviada a ${newAdmin.email}`,
      });
      setNewAdmin({ name: "", email: "", role: "admin", password: "" });
    }, 1500);
  };

  const roleLabels = {
    super_admin: "Super Admin",
    admin: "Administrador",
    moderator: "Moderador",
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Configuración</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Administra tu cuenta, seguridad y equipo de backoffice
        </p>
      </motion.div>

      <Tabs defaultValue="profile">
        <TabsList className="rounded-xl mb-6">
          <TabsTrigger value="profile" className="rounded-lg">Mi cuenta</TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg">Notificaciones</TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg">Seguridad</TabsTrigger>
          <TabsTrigger value="team" className="rounded-lg">Equipo admin</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="rounded-2xl border-border/60">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="size-16 rounded-2xl bg-secondary flex items-center justify-center text-xl font-bold text-secondary-foreground">
                  VR
                </div>
                <div>
                  <CardTitle>{currentAdmin.name}</CardTitle>
                  <CardDescription>{currentAdmin.email}</CardDescription>
                  <Badge className="mt-2 text-[10px]">
                    <Shield className="size-3 mr-0.5" />
                    {roleLabels[currentAdmin.role]}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="admin-name">Nombre completo</Label>
                  <Input id="admin-name" defaultValue={currentAdmin.name} className="rounded-xl" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="admin-email">Correo corporativo</Label>
                  <Input id="admin-email" defaultValue={currentAdmin.email} className="rounded-xl" />
                </div>
              </div>
              <div className="rounded-xl bg-muted/40 p-4 flex items-center gap-3">
                <CheckCircle2 className="size-5 text-green-600 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Último acceso</p>
                  <p className="text-xs text-muted-foreground">{formatDate(currentAdmin.lastLogin)} · Lima, PE</p>
                </div>
              </div>
              <Button className="rounded-xl" onClick={() => toast.success("Perfil actualizado")}>
                Guardar cambios
              </Button>
            </CardContent>
          </Card>
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

        <TabsContent value="team">
          <div className="space-y-6">
            <Card className="rounded-2xl border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <UserPlus className="size-4" />
                  Registrar nuevo administrador
                </CardTitle>
                <CardDescription>
                  Invita a un miembro del equipo al panel de backoffice
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegisterAdmin} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="new-name">Nombre completo</Label>
                      <Input
                        id="new-name"
                        placeholder="Ej. Juan Pérez"
                        value={newAdmin.name}
                        onChange={(e) => setNewAdmin((p) => ({ ...p, name: e.target.value }))}
                        required
                        className="rounded-xl"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="new-email">Correo corporativo</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          id="new-email"
                          type="email"
                          placeholder="admin@remata.pe"
                          value={newAdmin.email}
                          onChange={(e) => setNewAdmin((p) => ({ ...p, email: e.target.value }))}
                          required
                          className="pl-9 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <Label>Rol</Label>
                      <Select
                        value={newAdmin.role}
                        onValueChange={(v) => setNewAdmin((p) => ({ ...p, role: v }))}
                      >
                        <SelectTrigger className="w-full rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrador</SelectItem>
                          <SelectItem value="moderator">Moderador</SelectItem>
                          <SelectItem value="super_admin">Super Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="new-pass">Contraseña temporal</Label>
                      <Input
                        id="new-pass"
                        type="password"
                        placeholder="••••••••"
                        value={newAdmin.password}
                        onChange={(e) => setNewAdmin((p) => ({ ...p, password: e.target.value }))}
                        required
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={loading} className="rounded-xl">
                    {loading ? "Registrando..." : "Registrar administrador"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/60">
              <CardHeader>
                <CardTitle className="text-base">Equipo actual</CardTitle>
                <CardDescription>{existingAdmins.length} administradores registrados</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {existingAdmins.map((admin) => (
                  <div
                    key={admin.email}
                    className="flex items-center gap-3 rounded-xl border border-border/60 p-3"
                  >
                    <div className="size-10 rounded-full bg-secondary/20 flex items-center justify-center text-sm font-bold text-secondary shrink-0">
                      {admin.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{admin.name}</p>
                      <p className="text-xs text-muted-foreground">{admin.email}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] shrink-0">
                      {roleLabels[admin.role as keyof typeof roleLabels]}
                    </Badge>
                    <Badge variant={admin.active ? "default" : "secondary"} className="text-[10px] shrink-0">
                      {admin.active ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
