"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Building2,
  Clock3,
  FileText,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BRAND_LEGAL_NAME,
  BRAND_REGISTRY,
  BRAND_RUC,
  CONTACT,
} from "@/lib/brand";

type CompanyField = {
  icon: typeof Building2;
  label: string;
  value: string;
  highlight: boolean;
  link?: { href: string; label: string };
};

const FIELDS: CompanyField[] = [
  {
    icon: Building2,
    label: "Razón social",
    value: BRAND_LEGAL_NAME,
    highlight: true,
  },
  {
    icon: MapPin,
    label: "Domicilio fiscal",
    value: CONTACT.address,
    highlight: false,
  },
  {
    icon: Clock3,
    label: "Atención",
    value: CONTACT.hours,
    highlight: false,
  },
  {
    icon: ShieldCheck,
    label: "RUC",
    value: BRAND_RUC,
    highlight: true,
    link: {
      href: BRAND_REGISTRY.sunatUrl,
      label: "Verificar RUC en SUNAT",
    },
  },
  {
    icon: FileText,
    label: "Inscripción registral / Partida",
    value: "Información por confirmar",
    highlight: false,
    link: {
      href: BRAND_REGISTRY.sunarpUrl,
      label: "Consultar en SUNARP",
    },
  },
];

export function CompanyDataSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-muted/30 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl section-padding">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-2xl border border-primary/20 bg-card shadow-md ring-1 ring-primary/10"
        >
          <div className="border-b border-primary/15 bg-linear-to-r from-primary/10 via-primary/5 to-transparent px-6 py-5 sm:px-8">
            <p className="type-label text-primary">Información legal</p>
            <h2 className="mt-1 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Datos de la empresa
            </h2>
          </div>

          <dl className="grid gap-4 p-6 sm:grid-cols-2 sm:gap-5 sm:p-8">
            {FIELDS.map((field, i) => {
              const Icon = field.icon;
              return (
                <motion.div
                  key={field.label}
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{
                    duration: 0.35,
                    delay: reduceMotion ? 0 : i * 0.05,
                  }}
                  className={
                    field.highlight
                      ? "rounded-xl border border-primary/20 bg-primary/5 p-4"
                      : "rounded-xl border border-border/60 bg-muted/30 p-4"
                  }
                >
                  <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
                    <span
                      className={
                        field.highlight
                          ? "flex size-7 items-center justify-center rounded-lg bg-primary/15 text-primary"
                          : "flex size-7 items-center justify-center rounded-lg bg-muted text-muted-foreground"
                      }
                    >
                      <Icon className="size-3.5" strokeWidth={2.2} />
                    </span>
                    {field.label}
                  </dt>
                  <dd className="mt-2.5 text-base leading-relaxed text-foreground">
                    {field.value}
                  </dd>
                  {field.link ? (
                    <dd className="mt-2">
                      <a
                        href={field.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                      >
                        {field.link.label}
                        <ArrowUpRight className="size-3.5" aria-hidden />
                      </a>
                    </dd>
                  ) : null}
                </motion.div>
              );
            })}
          </dl>

          <div className="flex flex-col gap-3 border-t border-border/80 bg-muted/20 px-6 py-6 sm:flex-row sm:px-8">
            <Button asChild className="h-11 rounded-full px-6 font-semibold">
              <Link href="/contacto">Hablar con el equipo</Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              className="h-11 rounded-full bg-background px-6 font-semibold text-foreground hover:bg-background/80"
            >
              <Link href="/cumplimiento-regulatorio">Ver marco regulatorio</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
