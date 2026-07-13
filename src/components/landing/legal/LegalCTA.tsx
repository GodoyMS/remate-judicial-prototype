"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LegalCTAProps {
  title: string;
  description: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export function LegalCTA({
  title,
  description,
  primaryLabel = "Crear cuenta gratis",
  primaryHref = "/register",
  secondaryLabel = "Contactar soporte",
  secondaryHref = "/preguntas-frecuentes",
}: LegalCTAProps) {
  return (
    <section className="relative overflow-hidden bg-muted/40 py-20">
      <div className="pointer-events-none absolute inset-0 opacity-20" aria-hidden>
        <div className="absolute -left-20 top-0 size-96 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute -right-20 bottom-0 size-72 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl section-padding">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{description}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              asChild
              className="h-13 rounded-full bg-primary px-8 font-bold text-primary-foreground hover:bg-primary/90"
            >
              <Link href={primaryHref}>
                {primaryLabel}
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-13 rounded-full border-border bg-card px-8 font-semibold text-foreground hover:bg-muted"
            >
              <Link href={secondaryHref}>{secondaryLabel}</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
