"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Shield, ArrowRight, Lock, User, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAdminAuth } from "@/contexts/admin-auth-context";

const DEMO_ACCOUNTS = [
  {
    email: "superadmin@remata.com",
    password: "superadmin1234",
    label: "Super Admin",
    description: "Acceso total sin restricciones",
    color: "border-violet-300/40 bg-violet-500/10 text-violet-200",
  },
  {
    email: "admin@remata.com",
    password: "admin1234",
    label: "Administrador",
    description: "Acceso completo a módulos operativos",
    color: "border-blue-300/40 bg-blue-500/10 text-blue-200",
  },
  {
    email: "analysist@remata.com",
    password: "analyst1234",
    label: "Analista",
    description: "Solo lectura en módulos asignados",
    color: "border-cyan-300/40 bg-cyan-500/10 text-cyan-200",
  },
];

export default function LoginAdminPage() {
  const { login } = useAdminAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const account = login(email, password);
      setLoading(false);

      if (!account) {
        toast.error("Credenciales inválidas", {
          description: "Verifica tu correo y contraseña e intenta de nuevo.",
        });
        return;
      }

      toast.success(`Bienvenido, ${account.name.split(" ")[0]}`, {
        description: account.isSuperAdmin
          ? "Acceso Super Admin — control total"
          : "Redirigiendo al panel de administración...",
      });

      window.location.href = "/admin";
    }, 800);
  };

  const fillDemo = (demo: (typeof DEMO_ACCOUNTS)[number]) => {
    setEmail(demo.email);
    setPassword(demo.password);
  };

  return (
    <div className="min-h-screen bg-sidebar flex items-center justify-center p-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 size-[500px] rounded-full bg-sidebar-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 size-[400px] rounded-full bg-sidebar-accent/30 blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center gap-3 mb-8"
        >
          <Link href="/" className="flex items-center gap-2.5">
            <div className="size-10 rounded-xl bg-sidebar-primary flex items-center justify-center">
              <Shield className="size-5 text-sidebar-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-sidebar-foreground">remata</span>
              <span className="text-[10px] text-sidebar-foreground/50 -mt-0.5">Panel de administración</span>
            </div>
          </Link>
          <Badge variant="outline" className="border-sidebar-primary/30 text-sidebar-primary bg-sidebar-primary/10">
            <Lock className="size-3 mr-1" />
            Acceso restringido
          </Badge>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="rounded-3xl border border-sidebar-border bg-sidebar-accent/50 shadow-2xl shadow-black/20 p-8 backdrop-blur-sm"
        >
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-sidebar-foreground tracking-tight">Iniciar sesión admin</h1>
            <p className="text-sm text-sidebar-foreground/60 mt-1.5">
              Accede al backoffice de Remata con tus credenciales de administrador.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-sidebar-foreground">
                Correo corporativo
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@remata.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-xl border-sidebar-border bg-sidebar/50 text-sidebar-foreground placeholder:text-sidebar-foreground/40 focus-visible:ring-sidebar-primary/30"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-sidebar-foreground">
                  Contraseña
                </Label>
                <Link
                  href="#"
                  className="text-xs font-medium text-sidebar-primary hover:text-sidebar-primary/80 transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 rounded-xl border-sidebar-border bg-sidebar/50 text-sidebar-foreground pr-10 placeholder:text-sidebar-foreground/40 focus-visible:ring-sidebar-primary/30"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-xl bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 font-semibold text-sm mt-2 group"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="size-4 border-2 border-sidebar-primary-foreground/40 border-t-sidebar-primary-foreground rounded-full animate-spin" />
                  Verificando acceso...
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  Acceder al panel
                  <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-sidebar-border/50">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="size-3.5 text-sidebar-primary" />
              <p className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider">
                Cuentas demo
              </p>
            </div>
            <div className="grid gap-2">
              {DEMO_ACCOUNTS.map((demo) => (
                <button
                  key={demo.email}
                  type="button"
                  onClick={() => fillDemo(demo)}
                  className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all hover:scale-[1.01] ${demo.color}`}
                >
                  <User className="size-4 shrink-0 opacity-70" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold">{demo.label}</p>
                    <p className="text-[10px] opacity-70 truncate">{demo.email}</p>
                  </div>
                  <span className="text-[10px] opacity-60 shrink-0">{demo.description}</span>
                </button>
              ))}
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-sidebar-foreground/40">
            Este panel es exclusivo para personal autorizado de Remata.
          </p>
        </motion.div>

        <p className="mt-6 text-center text-xs text-sidebar-foreground/30">
          <Link href="/login" className="underline hover:text-sidebar-foreground/60 transition-colors">
            ← Volver al portal de inversores
          </Link>
        </p>
      </div>
    </div>
  );
}
