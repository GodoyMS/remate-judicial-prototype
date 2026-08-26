import Link from "next/link";
import { Mail, MessageCircle, Phone, MapPin, Clock, ArrowRight } from "lucide-react";
import { LegalPageLayout } from "@/components/landing/LegalPageLayout";
import { LegalPageHero } from "@/components/landing/legal/LegalPageHero";
import { Button } from "@/components/ui/button";
import {
  BRAND_NAME,
  CONTACT,
  MAILTO_SALES,
  MAILTO_SUPPORT,
  WHATSAPP_URL,
} from "@/lib/brand";

export const metadata = {
  title: `Contacto | ${BRAND_NAME}`,
  description: `Habla con el equipo de ${BRAND_NAME} antes de invertir: WhatsApp, teléfono, correo y horario de atención.`,
};

/**
 * Audit findings RM-002, RM-025 and RM-031.
 *
 * "Contacto" existed in the footer as plain text with no destination, so an
 * investor weighing a large ticket had no way to reach a human before handing
 * over their data. Every channel here is reachable without an account.
 */
const channels = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: CONTACT.whatsappDisplay,
    detail: "La vía más rápida. Respondemos en horario de atención.",
    href: WHATSAPP_URL,
    external: true,
    primary: true,
  },
  {
    icon: Phone,
    label: "Teléfono",
    value: CONTACT.phone,
    detail: "Atención comercial y soporte.",
    href: `tel:${CONTACT.phoneHref}`,
    external: false,
    primary: false,
  },
  {
    icon: Mail,
    label: "Consultas de inversión",
    value: CONTACT.salesEmail,
    detail: "Para evaluar montos, plazos y operaciones concretas.",
    href: MAILTO_SALES,
    external: false,
    primary: false,
  },
  {
    icon: Mail,
    label: "Soporte de cuenta",
    value: CONTACT.supportEmail,
    detail: "Verificación, pagos y retornos de una cuenta existente.",
    href: MAILTO_SUPPORT,
    external: false,
    primary: false,
  },
];

export default function ContactoPage() {
  return (
    <LegalPageLayout>
      <LegalPageHero
        badge="Contacto"
        badgeIcon="Headset"
        title="Habla con una persona antes de invertir"
        description="No necesitas crear una cuenta para resolver tus dudas. Elige el canal que prefieras y te respondemos en horario de atención."
        breadcrumbs={[{ label: "Inicio", href: "/" }, { label: "Contacto" }]}
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl section-padding">
          <div className="grid gap-4 sm:grid-cols-2">
            {channels.map((channel) => (
              <a
                key={channel.label}
                href={channel.href}
                {...(channel.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className={`group flex flex-col gap-3 rounded-2xl border p-6 transition-all hover:-translate-y-0.5 hover:shadow-md ${
                  channel.primary
                    ? "border-primary/40 bg-primary/5 hover:border-primary/60"
                    : "border-border bg-card hover:border-primary/30"
                }`}
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <channel.icon className="size-5" />
                </span>
                <div>
                  <p className="type-label text-muted-foreground">
                    {channel.label}
                  </p>
                  <p className="mt-1 type-h3 text-foreground">{channel.value}</p>
                  <p className="mt-1.5 type-caption text-muted-foreground">
                    {channel.detail}
                  </p>
                </div>
              </a>
            ))}
          </div>

          {/* Hours + address */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-2xl border border-border bg-muted/40 p-5">
              <Clock className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <p className="type-label text-muted-foreground">
                  Horario de atención
                </p>
                <p className="mt-1 type-body text-foreground">{CONTACT.hours}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-border bg-muted/40 p-5">
              <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <p className="type-label text-muted-foreground">Oficina</p>
                <p className="mt-1 type-body text-foreground">
                  {CONTACT.address}
                </p>
              </div>
            </div>
          </div>

          {/* What to expect */}
          <div className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="type-h3 text-foreground">
              Qué puedes preguntarnos
            </h2>
            <ul className="mt-4 grid gap-2.5 type-body text-muted-foreground sm:grid-cols-2">
              <li>· Cómo funciona una operación de principio a fin</li>
              <li>· Qué pasa si una subasta no se adjudica</li>
              <li>· Comisiones y gastos aplicables a tu caso</li>
              <li>· Plazos reales de operaciones ya cerradas</li>
              <li>· Tratamiento tributario de los retornos</li>
              <li>· Montos y diversificación para tu perfil</li>
            </ul>
          </div>

          {/* Other routes */}
          <div className="mt-10 flex flex-col items-start gap-3 rounded-2xl border border-border bg-muted/40 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="type-h3 text-foreground">
                ¿Un reclamo formal?
              </p>
              <p className="mt-1 type-body text-muted-foreground">
                El Libro de Reclamaciones tiene su propio canal, con plazos de
                respuesta regulados por INDECOPI.
              </p>
            </div>
            <Button variant="outline" asChild className="shrink-0 rounded-full">
              <Link href="/libro-de-reclamaciones">
                Ir al libro
                <ArrowRight className="ml-1.5 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </LegalPageLayout>
  );
}
