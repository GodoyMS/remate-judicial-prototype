import { Quote } from "lucide-react";
import { LegalPageLayout } from "@/components/landing/LegalPageLayout";
import { Testimonials } from "@/components/landing/Testimonials";
import { BRAND_NAME } from "@/lib/brand";

export const metadata = {
  title: `Testimonios | ${BRAND_NAME}`,
  description: `Historias de inversionistas que participan en remates judiciales a través de ${BRAND_NAME}.`,
};

export default function TestimoniosPage() {
  return (
    <LegalPageLayout>
      <section className="relative overflow-hidden bg-background py-16 sm:py-20 lg:py-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          aria-hidden
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, color-mix(in oklch, var(--foreground) 5%, transparent) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative mx-auto max-w-[1400px] section-padding">
          <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5">
              <Quote className="size-3.5 text-primary" />
              <span className="type-label text-primary">Testimonios</span>
            </span>
            <h1 className="type-h2 mt-5 text-balance text-foreground">
              Lo que dicen nuestros inversores
            </h1>
            <p className="mt-4 type-lead text-pretty text-muted-foreground">
              Historias publicadas con autorización de cada inversionista.
            </p>
          </div>

          <Testimonials variant="all" />
        </div>
      </section>
    </LegalPageLayout>
  );
}
