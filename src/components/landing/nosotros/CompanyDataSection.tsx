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
import { cn } from "@/lib/utils";

type CompanyField = {
  icon: typeof Building2;
  label: string;
  value: string;
  highlight: boolean;
  tabular?: boolean;
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
    tabular: true,
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
    <section className="bg-linear-to-b from-muted/30 to-background py-16 sm:py-20">
      <div className="mx-auto max-w-4xl section-padding">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="marketing-card-shell shadow-md ring-primary/15"
        >
          <div className="marketing-card-inner overflow-hidden">
            <div className="border-b border-primary/15 bg-linear-to-r from-primary/12 via-primary/6 to-transparent px-6 py-6 sm:px-8">
              <h2 className="type-h2 text-balance text-foreground sm:text-2xl">
                Datos de la empresa
              </h2>
              <p className="mt-2 type-body max-w-2xl text-muted-foreground">
                Información legal verificable y enlaces a fuentes oficiales para
                que puedas comprobarla por tu cuenta.
              </p>
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
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={cn(
                      "rounded-xl border p-4 transition-colors duration-300",
                      field.highlight
                        ? "border-primary/25 bg-primary/5 shadow-sm ring-1 ring-primary/10"
                        : "border-border/70 bg-muted/25"
                    )}
                  >
                    <dt className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wide text-foreground/80">
                      <span
                        className={cn(
                          "flex size-8 items-center justify-center rounded-lg",
                          field.highlight
                            ? "bg-primary/15 text-primary"
                            : "bg-background text-muted-foreground ring-1 ring-border/60"
                        )}
                        aria-hidden
                      >
                        <Icon className="size-4" strokeWidth={2.2} />
                      </span>
                      {field.label}
                    </dt>
                    <dd
                      className={cn(
                        "mt-3 text-base leading-relaxed text-foreground",
                        field.tabular && "font-semibold tabular-nums tracking-wide"
                      )}
                    >
                      {field.value}
                    </dd>
                    {field.link ? (
                      <dd className="mt-3">
                        <a
                          href={field.link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-11 items-center gap-1 rounded-md text-sm font-semibold text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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

            <div className="flex flex-col gap-3 border-t border-border/80 bg-muted/15 px-6 py-6 sm:flex-row sm:px-8">
              <Button asChild className="h-11 rounded-full px-6 font-semibold">
                <Link href="/contacto">Hablar con el equipo</Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                className="h-11 rounded-full bg-background px-6 font-semibold text-foreground hover:bg-background/80"
              >
                <Link href="/cumplimiento-regulatorio">
                  Ver marco regulatorio
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
