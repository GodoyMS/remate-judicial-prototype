import Link from "next/link";
import { ArrowRight, Check, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/currency";

const STANDARD_BENEFITS = [
  "Accede a oportunidades verificadas, con expediente y evidencia",
  "Sigue tus inversiones y retornos desde tu cuenta",
  `Participa en conjunto con otros inversionistas desde ${formatCurrency(500, "PEN")}`,
];

const PREMIUM_BENEFITS = [
  "Financia el 100% de una oportunidad durante su ventana de exclusividad",
  "Oportunidades exclusivas antes que el mercado estándar",
  "Comisión reducida del 0.5%",
];

/**
 * Comparativa Estándar vs. Premium (E-026, E-027): la cuenta Estándar se
 * presenta con beneficios propios y Premium como modalidad adicional.
 */
export function AccountTiers() {
  return (
    <section aria-labelledby="home-tiers" className="rounded-3xl border border-border/60 bg-card p-2 shadow-sm">
      <h3 id="home-tiers" className="sr-only">
        Tu cuenta
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="rounded-2xl p-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
              Tu cuenta Estándar
            </span>
            <span className="dash-caption text-muted-foreground">Plan actual</span>
          </div>
          <ul className="mt-4 flex flex-col gap-2.5">
            {STANDARD_BENEFITS.map((b) => (
              <li key={b} className="flex items-start gap-2.5 dash-body text-foreground">
                <span className="size-5 rounded-full bg-primary/8 text-primary dark:bg-accent dark:text-accent-foreground flex items-center justify-center shrink-0 mt-px">
                  <Check className="size-3" strokeWidth={2.5} />
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl p-4 bg-premium/8 ring-1 ring-premium/20">
          <span className="inline-flex items-center gap-1 rounded-full bg-premium px-2.5 py-1 text-xs font-semibold text-premium-foreground">
            <Crown className="size-3" />
            Cuenta Premium
          </span>
          <ul className="mt-4 flex flex-col gap-2.5">
            {PREMIUM_BENEFITS.map((b) => (
              <li key={b} className="flex items-start gap-2.5 dash-body text-foreground">
                <span className="size-5 rounded-full bg-premium/15 text-premium flex items-center justify-center shrink-0 mt-px">
                  <Check className="size-3" strokeWidth={2.5} />
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Button asChild className="mt-2 h-11 w-full rounded-2xl">
        <Link href="/premium">
          Más información
          <ArrowRight />
        </Link>
      </Button>
    </section>
  );
}
