import Link from "next/link";
import { ArrowRight, ShieldAlert } from "lucide-react";
import { LegalPageLayout } from "@/components/landing/LegalPageLayout";
import { LegalPageHero } from "@/components/landing/legal/LegalPageHero";
import { OpportunityCard } from "@/components/landing/OpportunityCard";
import { Button } from "@/components/ui/button";
import { BRAND_NAME } from "@/lib/brand";
import {
  openOpportunities,
  upcomingOpportunities,
} from "@/lib/landing/opportunities";

export const metadata = {
  title: `Propiedades en remate judicial | ${BRAND_NAME}`,
  description:
    "Catálogo público de oportunidades de inversión en remates judiciales: precio base, retorno estimado, inversión mínima y plazo de cada operación.",
};

/**
 * Public catalogue — second review, finding 4.
 *
 * "Propiedades" in the main menu did not open a catalogue: it redirected to
 * account creation, so a visitor could not see what the platform actually
 * offers before handing over their data. Every published opportunity is now
 * readable here, in the same summary card used on the landing, and the
 * account is only required for the actions that commit the reader: investing,
 * the full file and the complete judicial record.
 */
export default function PropiedadesPage() {
  const open = openOpportunities();
  const upcoming = upcomingOpportunities();

  return (
    <LegalPageLayout>
      <LegalPageHero
        badge="Propiedades"
        badgeIcon="Building2"
        title="Todas las oportunidades"
        description="Precio base, retorno estimado, inversión mínima y plazo de cada operación. Puedes revisarlas completas sin crear una cuenta."
        breadcrumbs={[{ label: "Inicio", href: "/" }, { label: "Propiedades" }]}
      />

      {/* Disponibles ahora */}
      <section id="disponibles" className="py-14 sm:py-16">
        <div className="mx-auto max-w-[1400px] section-padding">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="type-h2 text-foreground">Disponibles ahora</h2>
              <p className="mt-2 type-lead text-muted-foreground">
                {open.length} operaciones reuniendo capital en este momento.
              </p>
            </div>
            <Link
              href="/#simulador"
              className="type-body font-semibold text-primary hover:underline"
            >
              Simula una inversión
            </Link>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {open.map((o, i) => (
              <OpportunityCard key={o.id} opportunity={o} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Próximamente — separate block, never mixed with the open ones */}
      {upcoming.length > 0 && (
        <section id="proximamente" className="bg-muted/40 py-14 sm:py-16">
          <div className="mx-auto max-w-[1400px] section-padding">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="type-h2 text-foreground">Próximamente</h2>
                <p className="mt-2 type-lead text-muted-foreground">
                  Operaciones anunciadas que todavía no aceptan aportes.
                </p>
              </div>
              <Link
                href="/premium"
                className="type-body font-semibold text-primary hover:underline"
              >
                Las cuentas Premium las ven antes
              </Link>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((o, i) => (
                <OpportunityCard key={o.id} opportunity={o} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Risk, once, before the account CTA */}
      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-4xl section-padding">
          <div className="flex flex-col items-start gap-5 rounded-3xl border border-primary/20 bg-primary/5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="flex items-start gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-card text-primary ring-1 ring-primary/20">
                <ShieldAlert className="size-5" />
              </span>
              <div>
                <h2 className="type-h3 text-foreground">
                  Toda decisión tiene un riesgo
                </h2>
                <p className="mt-1.5 type-body text-pretty text-muted-foreground">
                  Los retornos publicados son estimaciones referenciales y los
                  plazos dependen de procesos judiciales que no controlamos.
                </p>
              </div>
            </div>
            <Button
              asChild
              variant="outline"
              className="h-11 shrink-0 rounded-full border-primary/40 bg-card px-6 font-semibold text-primary hover:bg-primary/10 hover:text-primary"
            >
              <Link href="/politica-de-riesgos">
                Conoce los riesgos
                <ArrowRight className="ml-1.5 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </LegalPageLayout>
  );
}
