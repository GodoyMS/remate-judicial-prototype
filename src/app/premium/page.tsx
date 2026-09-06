import Link from "next/link";
import { ArrowRight, Check, Crown, Users } from "lucide-react";
import { LegalPageLayout } from "@/components/landing/LegalPageLayout";
import { LegalPageHero } from "@/components/landing/legal/LegalPageHero";
import { LegalCTA } from "@/components/landing/legal/LegalCTA";
import { BRAND_NAME } from "@/lib/brand";
import { formatMoney } from "@/lib/currency";

export const metadata = {
  title: `Premium | ${BRAND_NAME}`,
  description:
    "La modalidad Premium permite tomar individualmente el 100% del capital de una oportunidad, con requisitos de acceso y acompañamiento dedicado.",
};

/**
 * Premium — second review, finding 29.
 *
 * The public site presented only the collective mode, so Premium appeared for
 * the first time inside the product. This page states what it is and what it
 * requires. It deliberately does not advertise a higher return as the
 * differentiator: an access tier that sells yield is a promise nobody can
 * keep, and the underlying operations carry the same judicial risk.
 */

const REQUIREMENTS = [
  {
    title: "Capacidad para el capital completo",
    desc: "La operación no se reparte: necesitas cubrir el 100% del capital requerido, que varía en cada oportunidad.",
  },
  {
    title: "Verificación reforzada",
    desc: "Además del KYC estándar, se solicita declaración de origen de fondos y la documentación que exige la normativa de prevención de lavado de activos.",
  },
  {
    title: "Decisión dentro de una ventana acotada",
    desc: "Las oportunidades Premium se presentan antes de abrirse al capital colectivo. Esa exclusividad dura un plazo definido; vencido, la operación pasa a la modalidad estándar.",
  },
  {
    title: "Cuenta con historial o entrevista previa",
    desc: "Se accede con al menos una operación liquidada en la plataforma, o tras una conversación con el equipo de inversiones.",
  },
];

const COMPARISON = [
  {
    dimension: "Cómo participas",
    standard: "Junto a otros inversionistas, desde el mínimo de cada operación",
    premium: "Individualmente, con el 100% del capital de la operación",
  },
  {
    dimension: "Cuándo ves la oportunidad",
    standard: "Cuando la operación abre al público",
    premium: "Antes de su apertura, durante la ventana de exclusividad",
  },
  {
    dimension: "Acompañamiento",
    standard: "Soporte de la plataforma y documentación en tu cuenta",
    premium: "Asesor asignado durante todo el ciclo de la operación",
  },
  {
    dimension: "Riesgo",
    standard: "El de cada operación, compartido en proporción a tu aporte",
    premium: "El mismo riesgo judicial, concentrado en una sola operación",
  },
];

export default function PremiumPage() {
  return (
    <LegalPageLayout>
      <LegalPageHero
        badge="Premium"
        badgeIcon="ShieldCheck"
        title="Tomar la operación completa"
        description="Premium no promete un retorno mayor: cambia cómo participas. Accedes individualmente al capital total de una oportunidad, antes de que se abra al resto."
        breadcrumbs={[{ label: "Inicio", href: "/" }, { label: "Premium" }]}
      />

      {/* What it is */}
      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-4xl section-padding">
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-7">
              <span className="flex size-10 items-center justify-center rounded-xl bg-muted text-primary">
                <Users className="size-5" />
              </span>
              <h2 className="type-h3 mt-4 text-foreground">Estándar</h2>
              <p className="mt-2 type-body text-muted-foreground">
                Participas colectivamente desde el mínimo de cada oportunidad
                —{formatMoney(500)} en las operaciones en soles— y puedes
                distribuir tu capital entre varias operaciones.
              </p>
              <Link
                href="/propiedades"
                className="type-body mt-5 inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
              >
                Ver oportunidades abiertas
                <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="rounded-3xl border border-primary/30 bg-primary/5 p-6 ring-1 ring-primary/15 sm:p-7">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Crown className="size-5" />
              </span>
              <h2 className="type-h3 mt-4 text-foreground">Premium</h2>
              <p className="mt-2 type-body text-muted-foreground">
                Accedes individualmente al 100% del capital requerido de
                oportunidades Premium, con acompañamiento dedicado y antes de
                que la operación se abra al capital colectivo.
              </p>
              <Link
                href="/contacto"
                className="type-body mt-5 inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
              >
                Hablar con el equipo de inversiones
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="bg-muted/40 py-14 sm:py-16">
        <div className="mx-auto max-w-4xl section-padding">
          <h2 className="type-h2 text-foreground">Requisitos reales de acceso</h2>
          <p className="mt-3 type-lead text-muted-foreground">
            Premium no se activa por pagar una suscripción. Estos son los
            cuatro requisitos.
          </p>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {REQUIREMENTS.map((req) => (
              <li
                key={req.title}
                className="rounded-2xl border border-border bg-card p-5 sm:p-6"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  <div>
                    <h3 className="text-base font-bold tracking-tight text-foreground">
                      {req.title}
                    </h3>
                    <p className="mt-1.5 text-pretty text-sm leading-relaxed text-muted-foreground">
                      {req.desc}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-4xl section-padding">
          <h2 className="type-h2 text-foreground">
            En qué se diferencian, exactamente
          </h2>

          <div className="mt-8 flex flex-col gap-3">
            {COMPARISON.map((row) => (
              <div
                key={row.dimension}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <p className="type-label text-muted-foreground">
                  {row.dimension}
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-border/70 bg-muted/50 p-4">
                    <p className="type-caption font-semibold text-muted-foreground">
                      Estándar
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-foreground/80">
                      {row.standard}
                    </p>
                  </div>
                  <div className="rounded-xl border border-primary/25 bg-primary/5 p-4">
                    <p className="type-caption font-semibold text-primary">
                      Premium
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-foreground">
                      {row.premium}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 rounded-2xl border border-border bg-muted/40 p-5 type-caption text-muted-foreground">
            Concentrar el capital en una sola operación aumenta la exposición a
            lo que ocurra en ese expediente concreto. Antes de decidir, revisa
            la{" "}
            <Link
              href="/politica-de-riesgos"
              className="font-medium text-primary underline underline-offset-2"
            >
              política de riesgos
            </Link>{" "}
            y las{" "}
            <Link
              href="/tarifas"
              className="font-medium text-primary underline underline-offset-2"
            >
              comisiones aplicables
            </Link>
            .
          </p>
        </div>
      </section>

      <LegalCTA
        title="¿Te interesa acceder a Premium?"
        description="El equipo de inversiones revisa contigo los requisitos y las oportunidades en preparación."
        primaryLabel="Hablar con el equipo"
        primaryHref="/contacto"
        secondaryLabel="Ver oportunidades abiertas"
        secondaryHref="/propiedades"
      />
    </LegalPageLayout>
  );
}
