import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { LegalPageLayout } from "@/components/landing/LegalPageLayout";
import { TeamSection } from "@/components/landing/TeamSection";
import { Button } from "@/components/ui/button";
import { OriginBanner, OriginHero } from "@/components/landing/nosotros/OriginHero";
import { ProblemFound } from "@/components/landing/nosotros/ProblemFound";
import { AnotherWay } from "@/components/landing/nosotros/AnotherWay";
import { WorkTimeline } from "@/components/landing/nosotros/WorkTimeline";
import { ForYouCTA } from "@/components/landing/nosotros/ForYouCTA";
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

export default function NosotrosPage() {
  return (
    <LegalPageLayout flushTop>
      <OriginHero />
      <OriginBanner />
      <ProblemFound />
      <AnotherWay />
      <WorkTimeline />
      <TeamSection members={teamMembers} />

      <section className="bg-background py-16 sm:py-20">
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
                <Link href="/contacto">Hablar con el equipo</Link>
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

      <ForYouCTA />
    </LegalPageLayout>
  );
}
