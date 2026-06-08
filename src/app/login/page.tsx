"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Crown, User } from "lucide-react";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEMO_USERS } from "@/lib/premium/mock-data";

const DEMO_ACCOUNTS = [
  {
    email: "premium@remata.com",
    label: "Usuario Premium",
    description: "Acceso a inversiones exclusivas al 100%",
    icon: Crown,
    accent: "from-amber-500 to-amber-600 text-white",
  },
  {
    email: "standard@remata.com",
    label: "Usuario Estándar",
    description: "Acceso al mercado regular de propiedades",
    icon: User,
    accent: "from-[#163300] to-[#2d5a1a] text-[#9FE870]",
  },
];

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const loginEmail = email.toLowerCase().trim();
    const user = DEMO_USERS[loginEmail as keyof typeof DEMO_USERS];

    try {
      if (user) {
        localStorage.setItem("remata-demo-user-v1", JSON.stringify(user));
      } else {
        localStorage.setItem(
          "remata-demo-user-v1",
          JSON.stringify(DEMO_USERS["standard@remata.com"])
        );
      }
    } catch {
      /* ignore */
    }

    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1200);
  };

  const quickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("demo1234");
    setLoading(true);

    const user = DEMO_USERS[demoEmail as keyof typeof DEMO_USERS];
    try {
      localStorage.setItem("remata-demo-user-v1", JSON.stringify(user));
    } catch {
      /* ignore */
    }

    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 800);
  };

  return (
    <AuthSplitLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Bienvenido de vuelta</h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Ingresa tu correo y contraseña para continuar.
          </p>
        </div>

        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Cuentas demo
          </p>
          <div className="grid gap-2">
            {DEMO_ACCOUNTS.map((account) => (
              <button
                key={account.email}
                type="button"
                onClick={() => quickLogin(account.email)}
                disabled={loading}
                className="flex items-center gap-3 rounded-xl border border-border/80 p-3 text-left hover:border-primary/40 hover:bg-muted/30 transition-all group"
              >
                <div
                  className={`size-9 rounded-lg bg-gradient-to-br ${account.accent} flex items-center justify-center shrink-0`}
                >
                  <account.icon className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{account.label}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{account.email}</p>
                </div>
                <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </button>
            ))}
          </div>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/60" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-3 text-xs text-muted-foreground">o con tu correo</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              Correo electrónico
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="premium@remata.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 rounded-xl border-border/80 bg-muted/30 text-sm"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Contraseña
              </Label>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
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
                className="h-11 rounded-xl border-border/80 bg-muted/30 text-sm pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm mt-2 group"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="size-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                Iniciando sesión...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                Iniciar sesión
                <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="font-semibold text-primary hover:text-primary/80 transition-colors">
            Regístrate gratis
          </Link>
        </p>

        <p className="mt-4 text-center text-xs text-muted-foreground leading-relaxed">
          Al ingresar, aceptas nuestros{" "}
          <Link href="#" className="underline hover:text-foreground">Términos de uso</Link>{" "}
          y{" "}
          <Link href="#" className="underline hover:text-foreground">Política de privacidad</Link>
        </p>
      </motion.div>
    </AuthSplitLayout>
  );
}
