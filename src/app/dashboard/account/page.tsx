"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Shield,
  Bell,
  ChevronRight,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const sections = [
  { id: "profile", label: "Perfil personal", icon: User },
  { id: "security", label: "Seguridad", icon: Lock },
  { id: "notifications", label: "Notificaciones", icon: Bell },
];

const VALID_SECTIONS = ["profile", "security", "notifications"] as const;

export default function AccountPage() {
  return (
    <Suspense>
      <AccountPageContent />
    </Suspense>
  );
}

function AccountPageContent() {
  const searchParams = useSearchParams();
  const [activeSection, setActiveSection] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const section = searchParams.get("section");
    if (section && VALID_SECTIONS.includes(section as (typeof VALID_SECTIONS)[number])) {
      setActiveSection(section);
    }
  }, [searchParams]);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Mi cuenta</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Gestiona tu perfil, seguridad y preferencias.
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Left: nav */}
        <div className="flex flex-col gap-2">
          {/* Profile summary */}
          <div className="rounded-2xl  bg-secondary/5 p-4 flex flex-col items-center gap-3 mb-2">
            <div className="size-16 rounded-full bg-primary flex items-center justify-center text-xl font-bold text-primary-foreground">
              AS
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">Ana Sofía Torres</p>
              <p className="text-xs text-muted-foreground">ana.torres@mail.com</p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-green-50 border border-green-200 px-2.5 py-1">
              <CheckCircle2 className="size-3 text-green-600" />
              <span className="text-[10px] font-medium text-green-700">Identidad verificada</span>
            </div>
          </div>

          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeSection === s.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <s.icon className="size-4 shrink-0" />
              <span className="flex-1 text-left">{s.label}</span>
              <ChevronRight className="size-3.5 opacity-50" />
            </button>
          ))}

          <Link
            href="/login"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all mt-2"
          >
            <LogOut className="size-4 shrink-0" />
            Cerrar sesión
          </Link>
        </div>

        {/* Right: content */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeSection === "profile" && (
              <div className="rounded-2xl  p-6 ">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-base font-semibold text-foreground">Datos personales</h3>
                  <div className="flex items-center gap-1.5 rounded-full bg-green-50 border border-green-200 px-3 py-1">
                    <Shield className="size-3 text-green-600" />
                    <span className="text-xs font-medium text-green-700">KYC completado</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-sm font-medium">Nombres</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          defaultValue="Ana Sofía"
                          className="h-11 pl-9 rounded-xl border-border/80 bg-muted/30 text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-sm font-medium">Apellidos</Label>
                      <Input
                        defaultValue="Torres Vega"
                        className="h-11 rounded-xl border-border/80 bg-muted/30 text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm font-medium">Correo electrónico</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        defaultValue="ana.torres@mail.com"
                        type="email"
                        className="h-11 pl-9 rounded-xl border-border/80 bg-muted/30 text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm font-medium">Celular</Label>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-2 h-11 px-3 rounded-xl border border-border/80 bg-muted/30 text-sm text-muted-foreground shrink-0">
                        🇵🇪 +51
                      </div>
                      <div className="relative flex-1">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          defaultValue="987 654 321"
                          className="h-11 pl-9 rounded-xl border-border/80 bg-muted/30 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Verification status */}
                  <div className="rounded-xl border border-border/60 bg-muted/30 p-4 flex flex-col gap-3">
                    <p className="text-sm font-semibold text-foreground">Estado de verificación</p>
                    {[
                      { label: "Correo verificado", done: true },
                      { label: "Celular verificado", done: true },
                      { label: "Identidad KYC", done: true },
                      { label: "Cuenta bancaria vinculada", done: false },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-2.5">
                        <div className={`size-5 rounded-full flex items-center justify-center ${item.done ? "bg-primary" : "bg-border"}`}>
                          {item.done ? (
                            <CheckCircle2 className="size-3 text-primary-foreground" />
                          ) : (
                            <div className="size-2 rounded-full bg-white/60" />
                          )}
                        </div>
                        <span className={`text-sm ${item.done ? "text-foreground" : "text-muted-foreground"}`}>
                          {item.label}
                        </span>
                        {!item.done && (
                          <button className="ml-auto text-xs font-medium text-primary hover:text-primary/80">
                            Completar
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={handleSave}
                    className={`w-fit rounded-xl font-semibold text-sm transition-all ${
                      saved ? "bg-green-600 text-white" : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                  >
                    {saved ? (
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="size-4" />
                        Guardado
                      </span>
                    ) : (
                      "Guardar cambios"
                    )}
                  </Button>
                </div>
              </div>
            )}

            {activeSection === "security" && (
              <div className="p-6 ">
                <h3 className="text-base font-semibold text-foreground mb-6">Seguridad de cuenta</h3>

                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-4 pb-5 border-b border-border/60">
                    <p className="text-sm font-semibold text-foreground">Cambiar contraseña</p>
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-1.5">
                        <Label className="text-sm font-medium">Contraseña actual</Label>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="h-11 rounded-xl border-border/80 bg-muted/30 text-sm pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          >
                            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label className="text-sm font-medium">Nueva contraseña</Label>
                        <Input type="password" placeholder="••••••••" className="h-11 rounded-xl border-border/80 bg-muted/30 text-sm" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label className="text-sm font-medium">Confirmar nueva contraseña</Label>
                        <Input type="password" placeholder="••••••••" className="h-11 rounded-xl border-border/80 bg-muted/30 text-sm" />
                      </div>
                      <Button className="w-fit rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm">
                        Actualizar contraseña
                      </Button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-foreground mb-3">Autenticación en dos pasos</p>
                    <div className="flex items-center justify-between p-4 rounded-xl border border-border/60 bg-muted/30">
                      <div>
                        <p className="text-sm font-medium text-foreground">Verificación por SMS</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Activada — +51 9** *** 321</p>
                      </div>
                      <div className="flex items-center gap-1.5 rounded-full bg-green-50 border border-green-200 px-2.5 py-1">
                        <div className="size-1.5 rounded-full bg-green-600" />
                        <span className="text-xs font-medium text-green-700">Activa</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "notifications" && (
              <div className="p-6 ">
                <h3 className="text-base font-semibold text-foreground mb-6">Preferencias de notificación</h3>

                <div className="flex flex-col gap-3">
                  {[
                    { label: "Nuevas subastas disponibles", sub: "Cuando se publiquen propiedades en tu zona de interés", on: true },
                    { label: "Estado de mis inversiones", sub: "Actualizaciones sobre el proceso legal de tus propiedades", on: true },
                    { label: "Retornos acreditados", sub: "Cuando se acredite un retorno en tu cuenta", on: true },
                    { label: "Noticias y artículos", sub: "Contenido educativo sobre inversiones inmobiliarias", on: false },
                    { label: "Alertas de precios", sub: "Cuando el precio base de una propiedad cambie", on: false },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 rounded-xl border border-border/60 hover:bg-muted/20 transition-colors"
                    >
                      <div className="flex-1 min-w-0 pr-4">
                        <p className="text-sm font-medium text-foreground">{item.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input type="checkbox" defaultChecked={item.on} className="sr-only peer" />
                        <div className="w-9 h-5 bg-muted peer-checked:bg-primary rounded-full transition-colors peer-focus:ring-2 peer-focus:ring-primary/30 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:size-4 after:transition-transform peer-checked:after:translate-x-4" />
                      </label>
                    </div>
                  ))}
                </div>

                <Button onClick={handleSave} className={`mt-5 rounded-xl font-semibold text-sm transition-all ${saved ? "bg-green-600 text-white" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}>
                  {saved ? <span className="flex items-center gap-2"><CheckCircle2 className="size-4" />Guardado</span> : "Guardar preferencias"}
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
