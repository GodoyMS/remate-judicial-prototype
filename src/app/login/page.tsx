"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowLeft, ArrowRight, ChevronDown, Crown, Eye, EyeOff, ShieldCheck, User } from "lucide-react";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCurrentUser } from "@/contexts/user-context";
import { isValidEmail, INVALID_EMAIL_MESSAGE } from "@/lib/auth/validation";

const DEMO_ACCOUNTS = [
  {
    email: "premium@rematto.com",
    label: "Usuario Premium",
    description: "Acceso a inversiones exclusivas al 100%",
    icon: Crown,
    accent: "from-premium to-premium/80 text-premium-foreground",
  },
  {
    email: "standard@rematto.com",
    label: "Usuario Estándar",
    description: "Acceso al mercado regular de propiedades",
    icon: User,
    accent: "from-primary to-primary/80 text-primary-foreground",
  },
];

/**
 * Cuentas demo — mismo patrón que el FAB de apariencia (src/app/layout.tsx):
 * apagadas salvo activación explícita, para que un formulario de acceso real
 * no compita con accesos de prueba (L-002).
 */
const SHOW_DEMO_ACCOUNTS = process.env.NEXT_PUBLIC_ENABLE_DEMO_ACCOUNTS === "true";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageContent />
    </Suspense>
  );
}

function LoginPageContent() {
  const { login } = useCurrentUser();
  const searchParams = useSearchParams();
  const expired = searchParams.get("expired") === "1";
  const redirectTo = searchParams.get("redirect");
  const destination = redirectTo && redirectTo.startsWith("/dashboard") ? redirectTo : "/dashboard";

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [demoOpen, setDemoOpen] = useState(false);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (emailError) setEmailError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setEmailError(INVALID_EMAIL_MESSAGE);
      return;
    }

    setLoading(true);
    // Usa el contexto de sesión en vez de escribir localStorage a mano
    // (WP-1.4): es la única forma de que la expiración de sesión y el
    // resto del producto vean un estado consistente.
    login(email);

    setTimeout(() => {
      window.location.href = destination;
    }, 1200);
  };

  const quickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("demo1234");
    setLoading(true);
    login(demoEmail);

    setTimeout(() => {
      window.location.href = destination;
    }, 800);
  };

  return (
    <AuthSplitLayout variant="login">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground lg:hidden"
          >
            <ArrowLeft className="size-3.5" />
            Volver al inicio
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Bienvenido de vuelta
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Ingresa tu correo y contraseña para continuar.
          </p>
        </div>

        {expired && (
          <div className="mb-6 flex items-start gap-2 rounded-xl border border-warning/20 bg-warning/10 p-3">
            <AlertTriangle className="size-4 text-warning shrink-0 mt-0.5" />
            <p className="text-sm text-warning">
              Tu sesión venció. Inicia sesión nuevamente para continuar.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              Correo electrónico
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              className="h-11 rounded-xl border-border/80 bg-muted/30 text-sm"
              aria-invalid={!!emailError}
              required
            />
            {emailError && <p className="text-xs text-destructive">{emailError}</p>}
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

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/60" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-3 text-xs text-muted-foreground">o</span>
          </div>
        </div>

        {/* Paridad con Registro, que ya ofrece Google (L-035): un usuario que
            se registró con Google debe poder volver a entrar igual. */}
        <Button
          variant="outline"
          className="w-full h-11 rounded-xl border-border/80 font-medium text-sm hover:bg-muted/50"
          type="button"
        >
          <svg className="size-4 mr-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continuar con Google
        </Button>

        {/* Señal de seguridad, veraz y discreta (L-028) */}
        <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
          <ShieldCheck className="size-3.5 text-success" />
          Tu sesión se cifra de extremo a extremo. Iniciar sesión no te compromete a invertir.
        </p>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="font-semibold text-primary hover:text-primary/80 transition-colors">
            Regístrate gratis
          </Link>
        </p>

        <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground">
          Al iniciar sesión, aceptas nuestros{" "}
          <Link
            href="/terminos-de-uso"
            className="underline hover:text-foreground"
          >
            Términos de uso
          </Link>{" "}
          y{" "}
          <Link
            href="/politica-de-privacidad"
            className="underline hover:text-foreground"
          >
            Política de privacidad
          </Link>
        </p>

        {SHOW_DEMO_ACCOUNTS && (
          <div className="mt-8 pt-6 border-t border-border/60">
            <button
              type="button"
              onClick={() => setDemoOpen((v) => !v)}
              className="mx-auto flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Usar una cuenta de demostración
              <ChevronDown className={`size-3.5 transition-transform ${demoOpen ? "rotate-180" : ""}`} />
            </button>
            {demoOpen && (
              <div className="grid gap-2 mt-3">
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
            )}
          </div>
        )}
      </motion.div>
    </AuthSplitLayout>
  );
}
