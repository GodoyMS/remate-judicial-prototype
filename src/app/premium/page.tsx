import Link from "next/link";
import { ArrowRight, Check, ChevronRight, Crown, Users } from "lucide-react";
import { LegalPageLayout } from "@/components/landing/LegalPageLayout";
import { Button } from "@/components/ui/button";
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
      {/* Hero — primario sólido; la insignia usa el color premium sólido. */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-4xl section-padding py-20 text-center sm:py-24">
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex items-center justify-center gap-1.5 text-sm text-primary-foreground/70"
          >
            <Link href="/" className="transition-colors hover:text-primary-foreground">
              Inicio
            </Link>
            <ChevronRight className="size-3.5" />
            <span className="font-medium text-primary-foreground">Premium</span>
          </nav>
          <span className="inline-flex items-center gap-2 rounded-full bg-premium px-4 py-1.5 text-premium-foreground shadow-sm">
            <Crown className="size-3.5" />
            <span className="text-xs font-semibold uppercase tracking-widest">Premium</span>
          </span>
          <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Tomar la operación completa
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-primary-foreground/80">
            Premium no promete un retorno mayor: cambia cómo participas. Accedes
            individualmente al capital total de una oportunidad, antes de que se
            abra al resto.
          </p>
        </div>
      </section>

      {/* What it is */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl section-padding">
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
            <div className="flex flex-col rounded-3xl border border-border/60 bg-card p-7 shadow-sm transition-shadow duration-300 hover:shadow-md">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-muted text-foreground/70">
                <Users className="size-5" />
              </span>
              <h2 className="mt-5 text-xl font-bold tracking-tight text-foreground">Estándar</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                Participas colectivamente desde el mínimo de cada oportunidad
                —{formatMoney(500)} en las operaciones en soles— y puedes
                distribuir tu capital entre varias operaciones.
              </p>
              <Link
                href="/propiedades"
                className="group mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
              >
                Ver oportunidades abiertas
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="flex flex-col rounded-3xl border border-primary/20 bg-primary/5 p-7 shadow-sm transition-shadow duration-300 hover:shadow-md">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm shadow-primary/30">
                <Crown className="size-5" />
              </span>
              <h2 className="mt-5 text-xl font-bold tracking-tight text-foreground">Premium</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                Accedes individualmente al 100% del capital requerido de
                oportunidades Premium, con acompañamiento dedicado y antes de
                que la operación se abra al capital colectivo.
              </p>
              <Link
                href="/contacto"
                className="group mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
              >
                Hablar con el equipo de inversiones
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements — banda primaria sólida con tarjetas translúcidas. */}
      <section className="bg-primary py-16 text-primary-foreground sm:py-20">
        <div className="mx-auto max-w-4xl section-padding">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Requisitos reales de acceso
          </h2>
          <p className="mt-3 text-lg text-primary-foreground/75">
            Premium no se activa por pagar una suscripción. Estos son los
            cuatro requisitos.
          </p>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {REQUIREMENTS.map((req) => (
              <li
                key={req.title}
                className="rounded-2xl bg-primary-foreground/10 p-6 ring-1 ring-primary-foreground/15 transition-colors duration-300 hover:bg-primary-foreground/15"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary-foreground text-primary">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold tracking-tight">{req.title}</h3>
                    <p className="mt-1.5 text-pretty text-sm leading-relaxed text-primary-foreground/75">
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
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl section-padding">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            En qué se diferencian, exactamente
          </h2>

          <div className="mt-10 flex flex-col gap-3">
            {COMPARISON.map((row) => (
              <div
                key={row.dimension}
                className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm sm:p-6"
              >
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {row.dimension}
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-muted/60 p-4">
                    <p className="text-xs font-semibold text-muted-foreground">Estándar</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-foreground/80">
                      {row.standard}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-primary/5 p-4 ring-1 ring-primary/15">
                    <p className="text-xs font-semibold text-primary">Premium</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-foreground">
                      {row.premium}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 rounded-2xl bg-muted/50 p-5 text-sm leading-relaxed text-muted-foreground">
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

      {/* CTA — inverso: oscuro en modo claro, claro en modo oscuro. */}
      <section className="bg-foreground py-20 text-background sm:py-24">
        <div className="mx-auto max-w-2xl section-padding text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            ¿Te interesa acceder a Premium?
          </h2>
          <p className="mt-4 text-lg text-background/70">
            El equipo de inversiones revisa contigo los requisitos y las
            oportunidades en preparación.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              asChild
              className="group h-12 rounded-full bg-primary px-8 font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/contacto">
                Hablar con el equipo
                <ArrowRight className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button
              size="lg"
              asChild
              className="h-12 rounded-full bg-background/10 px-8 font-semibold text-background ring-1 ring-background/20 hover:bg-background/15"
            >
              <Link href="/propiedades">Ver oportunidades abiertas</Link>
            </Button>
          </div>
        </div>
      </section>
    </LegalPageLayout>
  );
}
