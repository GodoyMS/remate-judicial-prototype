import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Gavel,
  Scale,
  ShieldCheck,
  Users,
} from "lucide-react";
import { LegalPageLayout } from "@/components/landing/LegalPageLayout";
import { LegalPageHero } from "@/components/landing/legal/LegalPageHero";
import { LegalCTA } from "@/components/landing/legal/LegalCTA";
import { TeamSection } from "@/components/landing/TeamSection";
import { Button } from "@/components/ui/button";
import {
  BRAND_LEGAL_NAME,
  BRAND_NAME,
  BRAND_REGISTRY,
  BRAND_RUC,
  CONTACT,
} from "@/lib/brand";
import { teamMembers } from "@/lib/nosotros/team";

export const metadata = {
  title: `Nosotros | ${BRAND_NAME}`,
  description: `Quiénes están detrás de ${BRAND_NAME}, por qué existe la plataforma y qué papel cumple dentro de un remate judicial.`,
};

/**
 * Audit findings RM-033 and RM-020.
 *
 * "Nosotros" sat in the main menu pointing nowhere, and nothing on the site
 * answered the obvious objection: why go through a platform at all instead of
 * bidding at the auction directly. Both are answered here.
 */
const barriers = [
  {
    icon: Gavel,
    title: "Necesitas el monto completo, en efectivo",
    direct:
      "Un remate judicial exige un depósito obligatorio para participar (llamado oblaje), normalmente el 10% del valor de tasación, y pagar el saldo en pocos días hábiles. Para un inmueble de S/ 280,000, ese depósito y su saldo significan tener el monto entero disponible.",
    withUs: `En ${BRAND_NAME} el monto se reúne entre varios inversores. Tu ticket puede ser de S/ 500 y participas de la misma operación.`,
  },
  {
    icon: Scale,
    title: "Tienes que evaluar el expediente tú mismo",
    direct:
      "Hay que revisar cargas y gravámenes en SUNARP, verificar el estado del proceso, la ocupación del inmueble y posibles tercerías. Un error aquí cuesta el capital completo.",
    withUs:
      "Cada expediente pasa por un estudio de títulos y una auditoría legal antes de publicarse. Si no supera la revisión, no llega a la plataforma.",
  },
  {
    icon: Users,
    title: "Concentras todo tu capital en un solo inmueble",
    direct:
      "Comprar directo significa poner todo en una sola propiedad, en un solo distrito, con un solo desenlace posible.",
    withUs:
      "Con el mismo capital puedes participar en varias operaciones distintas y repartir el riesgo entre ellas.",
  },
  {
    icon: ShieldCheck,
    title: "Después de ganar el remate, el trabajo recién empieza",
    direct:
      "Inscripción de la adjudicación, lanzamiento si el inmueble está ocupado, saneamiento, mantenimiento y venta posterior. Meses de gestión.",
    withUs:
      "Ese proceso lo lleva el equipo y lo sigues desde tu panel, etapa por etapa, hasta la liquidación.",
  },
];

const principles = [
  {
    title: "Antes del optimismo, el riesgo",
    desc: "Publicamos los escenarios adversos con el mismo detalle que los favorables. Si una operación puede cerrar en pérdida, lo decimos antes de que inviertas.",
  },
  {
    title: "Cifras con origen verificable",
    desc: "Cada operación se identifica con su número de expediente y juzgado, de modo que puedas contrastar la información en la fuente pública.",
  },
  {
    title: "Nuestros intereses están alineados contigo",
    desc: "La comisión de éxito solo se cobra cuando la operación genera ganancia. Las demás comisiones y los costos de terceros están publicados, con el momento exacto en que se aplican.",
  },
];

export default function NosotrosPage() {
  return (
    <LegalPageLayout>
      <LegalPageHero
        badge="Nosotros"
        badgeIcon="Building2"
        title={`Por qué existe ${BRAND_NAME}`}
        description="Los remates judiciales llevan décadas siendo un mercado rentable y cerrado: hace falta capital, criterio legal y tiempo. Nuestro trabajo es abrirlo sin quitarle el rigor."
        breadcrumbs={[{ label: "Inicio", href: "/" }, { label: "Nosotros" }]}
      />

      <TeamSection members={teamMembers} />

      {/* The objection, answered head-on */}
      <section id="por-que-rematto" className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl section-padding">
          <h2 className="type-h2 text-foreground">
            ¿Y por qué no ir directo al remate?
          </h2>
          <p className="mt-3 max-w-2xl type-lead text-muted-foreground">
            Es una pregunta legítima, y la respuesta no es que sea imposible:
            cualquiera puede postular. Estas son las cuatro barreras reales, y
            qué cambia al participar con nosotros.
          </p>

          <div className="mt-10 space-y-4">
            {barriers.map((barrier) => (
              <article
                key={barrier.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-7"
              >
                <div className="flex items-start gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <barrier.icon className="size-5" />
                  </span>
                  <h3 className="type-h3 pt-2 text-foreground">
                    {barrier.title}
                  </h3>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-border/70 bg-muted/50 p-4">
                    <p className="type-label text-muted-foreground">
                      Por tu cuenta
                    </p>
                    <p className="mt-2 type-body text-muted-foreground">
                      {barrier.direct}
                    </p>
                  </div>
                  <div className="rounded-xl border border-primary/25 bg-primary/5 p-4">
                    <p className="type-label text-primary">
                      Con {BRAND_NAME}
                    </p>
                    <p className="mt-2 type-body text-foreground">
                      {barrier.withUs}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="bg-muted/40 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl section-padding">
          <h2 className="type-h2 text-foreground">Cómo trabajamos</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {principles.map((principle) => (
              <div
                key={principle.title}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <h3 className="type-h3 text-foreground">{principle.title}</h3>
                <p className="mt-2.5 type-body text-muted-foreground">
                  {principle.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company identity */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl section-padding">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Datos de la empresa
            </h2>

            <dl className="mt-6 grid gap-8 sm:grid-cols-2">
              <div className="space-y-6">
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Razón social
                  </dt>
                  <dd className="mt-1.5 text-base text-foreground">
                    {BRAND_LEGAL_NAME}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Domicilio fiscal
                  </dt>
                  <dd className="mt-1.5 text-base leading-relaxed text-foreground">
                    {CONTACT.address}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Atención
                  </dt>
                  <dd className="mt-1.5 text-base text-foreground">
                    {CONTACT.hours}
                  </dd>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    RUC
                  </dt>
                  <dd className="mt-1.5 text-base text-foreground">
                    {BRAND_RUC}
                  </dd>
                  <dd className="mt-2">
                    <a
                      href={BRAND_REGISTRY.sunatUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                    >
                      Verificar RUC en SUNAT
                      <ArrowUpRight className="size-3.5" aria-hidden />
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Inscripción registral / Partida
                  </dt>
                  <dd className="mt-1.5 text-base text-foreground">
                    Información por confirmar
                  </dd>
                  <dd className="mt-2">
                    <a
                      href={BRAND_REGISTRY.sunarpUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                    >
                      Consultar en SUNARP
                      <ArrowUpRight className="size-3.5" aria-hidden />
                    </a>
                  </dd>
                </div>
              </div>
            </dl>

            <div className="mt-6 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row">
              <Button asChild className="h-11 rounded-full px-6 font-semibold">
                <Link href="/contacto">
                  Hablar con el equipo
                  <ArrowRight className="ml-1.5 size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                className="h-11 rounded-full bg-muted px-6 font-semibold text-foreground hover:bg-muted/80"
              >
                <Link href="/cumplimiento-regulatorio">Ver marco regulatorio</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <LegalCTA
        title="Conoce el proceso completo"
        description="Desde que abrimos una operación hasta que el dinero vuelve a tu cuenta, etapa por etapa y con plazos reales."
        primaryLabel="Ver el proceso de inversión"
        primaryHref="/proceso-de-inversion"
        secondaryLabel="Leer la política de riesgos"
        secondaryHref="/politica-de-riesgos"
      />
    </LegalPageLayout>
  );
}
