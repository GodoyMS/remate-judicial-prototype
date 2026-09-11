import Link from "next/link";
import { ArrowLeft, Check, Gavel, ShieldCheck, FileText, Bell, TrendingUp } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { BRAND_LEGAL_NAME, BRAND_NAME } from "@/lib/brand";
import { formatMoney } from "@/lib/currency";
import { OnboardingThread, type OnboardingStage } from "@/components/auth/OnboardingThread";

/**
 * Auth side panel — second review, finding 42.
 *
 * The panel sold "retornos de hasta 22% anual" next to a testimonial implying
 * a 63% annualised return on a four-month operation. Neither claim survives
 * contact with the risk policy or the fee schedule, and both sat on the one
 * screen where a person is about to hand over their identity documents. The
 * panel now carries what the account actually gives (and what it does not
 * commit you to), plus a way back to the public site — because nothing here
 * should require an account to evaluate.
 *
 * WP-1.2 (cierra L-006, L-014, L-019): login y registro ya no comparten el
 * mismo mensaje. `variant` decide titular, recurso y si se muestra el hilo
 * conductor del onboarding.
 */
const acquisitionPromises = [
  `Participa desde ${formatMoney(500)}, según el mínimo de cada operación`,
  "Cada operación con su número de expediente y juzgado",
  "Sin costo por registrarte, verificarte ni explorar",
];

const returningUserBenefits = [
  { icon: TrendingUp, text: "Sigue el estado de cada una de tus inversiones" },
  { icon: FileText, text: "Accede a tus documentos y certificados en un solo lugar" },
  { icon: Bell, text: "Recibe actualizaciones de cada proceso judicial" },
];

interface AuthBrandingPanelProps {
  variant?: "login" | "register" | "verification";
}

export function AuthBrandingPanel({ variant = "register" }: AuthBrandingPanelProps) {
  const stage: OnboardingStage = variant === "verification" ? "verify" : "account";

  return (
    <div className="relative hidden w-[44%] flex-col justify-between overflow-hidden bg-secondary p-12 lg:flex">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-20 -top-40 size-[400px] rounded-full bg-accent/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-20 size-[300px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center">
          <Logo className="text-2xl text-primary" />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-secondary-foreground/70 transition-colors hover:text-secondary-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Volver al inicio
        </Link>
      </div>

      <div className="relative flex flex-col gap-8">
        {variant === "login" ? (
          <div>
            <h2 className="mb-4 text-4xl font-bold leading-tight text-secondary-foreground">
              Tus oportunidades,
              <br />
              siempre a la mano.
            </h2>
            <p className="leading-relaxed text-secondary-foreground/70">
              Ingresa para revisar el estado de tus inversiones y lo que Rematto
              gestiona por ti en cada proceso judicial.
            </p>
          </div>
        ) : (
          <div>
            <h2 className="mb-4 text-4xl font-bold leading-tight text-secondary-foreground">
              Un mercado que exigía
              <br />
              el inmueble completo,
              <br />
              abierto por partes.
            </h2>
            <p className="leading-relaxed text-secondary-foreground/70">
              Tu cuenta te da acceso al expediente, los plazos y las comisiones
              de cada operación abierta. Decides después, o no decides.
            </p>
          </div>
        )}

        {(variant === "register" || variant === "verification") && (
          <OnboardingThread current={stage} />
        )}

        {variant === "login" ? (
          <ul className="flex flex-col gap-3">
            {returningUserBenefits.map((b) => (
              <li key={b.text} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent/50 text-accent-foreground">
                  <b.icon className="size-3" strokeWidth={2.5} />
                </span>
                <span className="text-sm leading-relaxed text-secondary-foreground/80">
                  {b.text}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="flex flex-col gap-3">
            {acquisitionPromises.map((promise) => (
              <li key={promise} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent/50 text-accent-foreground">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                <span className="text-sm leading-relaxed text-secondary-foreground/80">
                  {promise}
                </span>
              </li>
            ))}
          </ul>
        )}

        {/* Everything here is public — the account is not the price of
            looking (finding 5). */}
        {variant !== "login" && (
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Gavel className="size-4 text-primary" />
              ¿Todavía estás evaluando?
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Puedes ver las oportunidades abiertas, simular una inversión y
              leer los riesgos sin crear una cuenta.
            </p>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold">
              <Link href="/propiedades" className="text-primary hover:underline">
                Ver propiedades
              </Link>
              <Link href="/#simulador" className="text-primary hover:underline">
                Simular una inversión
              </Link>
              <Link href="/contacto" className="text-primary hover:underline">
                Hablar con un asesor
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="relative flex flex-col gap-2">
        <p className="flex items-start gap-2 text-xs leading-relaxed text-secondary-foreground/70">
          <ShieldCheck className="mt-px size-3.5 shrink-0 text-primary" />
          <span>
            Invertir en remates judiciales conlleva riesgo de pérdida.{" "}
            <Link
              href="/politica-de-riesgos"
              className="font-medium text-secondary-foreground underline underline-offset-2"
            >
              Lee la política de riesgos
            </Link>
            .
          </span>
        </p>
        <p className="text-xs text-secondary-foreground/60">
          © {new Date().getFullYear()} {BRAND_LEGAL_NAME} · Lima, Perú ·{" "}
          {BRAND_NAME}
        </p>
      </div>
    </div>
  );
}
