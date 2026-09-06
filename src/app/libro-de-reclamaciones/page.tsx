import { Clock, Shield, Phone } from "lucide-react";
import { BRAND_NAME, CONTACT } from "@/lib/brand";
import { LegalPageLayout } from "@/components/landing/LegalPageLayout";
import { LegalPageHero } from "@/components/landing/legal/LegalPageHero";
import { ComplaintForm } from "@/components/landing/legal/ComplaintForm";

export const metadata = {
  title: `Libro de reclamaciones | ${BRAND_NAME}`,
  description: `Presenta tu reclamo, queja o sugerencia a través del Libro de Reclamaciones virtual de ${BRAND_NAME}.`,
};

const infoCards = [
  {
    icon: Clock,
    title: "Plazo de respuesta",
    desc: "Máximo 15 días hábiles desde la presentación de tu reclamación.",
  },
  {
    icon: Shield,
    title: "Confidencialidad",
    desc: "Tu información es tratada con estricta confidencialidad conforme a nuestra política de privacidad.",
  },
  {
    icon: Phone,
    title: "Otros canales",
    /**
     * Finding 40 — this card published "(01) 700-REMATA", a number that
     * appears nowhere else and does not match the one in Contacto and the
     * footer. Escalating a complaint through a channel that does not exist is
     * the worst place to lose someone, so both values now come from the
     * single contact record.
     */
    desc: `También puedes llamar al ${CONTACT.phone} o escribir a ${CONTACT.supportEmail}`,
  },
];

export default function LibroDeReclamacionesPage() {
  return (
    <LegalPageLayout>
      <LegalPageHero
        badge="Atención al cliente"
        badgeIcon="BookOpen"
        title="Libro de reclamaciones"
        description="Tu voz importa. Registra tu reclamo, queja o sugerencia y nuestro equipo te responderá a la brevedad."
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Libro de reclamaciones" },
        ]}
      />

      <section className="border-b border-border bg-card py-10">
        <div className="mx-auto max-w-3xl section-padding">
          <div className="grid gap-4 sm:grid-cols-3">
            {infoCards.map((card) => (
              <div
                key={card.title}
                className="rounded-xl border border-border bg-muted/50 p-4 text-center"
              >
                <card.icon className="mx-auto mb-2 size-5 text-muted-foreground" />
                <h3 className="text-sm font-semibold text-foreground">{card.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl section-padding">
          <ComplaintForm />
        </div>
      </section>
    </LegalPageLayout>
  );
}
