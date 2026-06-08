import { Clock, Shield, Phone } from "lucide-react";
import { LegalPageLayout } from "@/components/landing/LegalPageLayout";
import { LegalPageHero } from "@/components/landing/legal/LegalPageHero";
import { ComplaintForm } from "@/components/landing/legal/ComplaintForm";

export const metadata = {
  title: "Libro de reclamaciones | Remata",
  description:
    "Presenta tu reclamo, queja o sugerencia a través del Libro de Reclamaciones virtual de Remata.",
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
    desc: "También puedes llamar al (01) 700-REMATA o escribir a soporte@remata.pe",
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

      <section className="border-b border-[#163300]/8 bg-white py-10">
        <div className="mx-auto max-w-3xl section-padding">
          <div className="grid gap-4 sm:grid-cols-3">
            {infoCards.map((card) => (
              <div
                key={card.title}
                className="rounded-xl border border-[#163300]/8 bg-[#F5F9F2]/50 p-4 text-center"
              >
                <card.icon className="mx-auto mb-2 size-5 text-[#163300]/60" />
                <h3 className="text-sm font-semibold text-[#163300]">{card.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-[#163300]/55">{card.desc}</p>
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
