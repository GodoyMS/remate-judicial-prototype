"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Building2,
  Lock,
  Scale,
  type LucideIcon,
} from "lucide-react";
import { LANDING_PHOTOS } from "@/lib/landing/media";

const HIGHLIGHTS: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: Building2,
    title: "Empresa Peruana",
    description:
      "Constituida en Perú, comprometida con el desarrollo del mercado",
  },
  {
    icon: Scale,
    title: "Cumplimiento normativo",
    description:
      "Operamos bajo la normativa vigente y asesoría legal especializada",
  },
  {
    icon: Lock,
    title: "Protección de datos",
    description:
      "Tu información está segura con los más altos estándares",
  },
];

export function TransparentPlatformSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      data-nav-tone="light"
      className="relative overflow-hidden bg-background py-16 sm:py-20 lg:py-24 scroll-mt-24"
    >
      <div className="relative mx-auto max-w-[1400px] section-padding">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-16">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            className="relative min-h-[320px] overflow-hidden rounded-[1.75rem] sm:min-h-[440px]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LANDING_PHOTOS.companyOffice}
              alt="Oficina corporativa de la empresa"
              className="absolute inset-0 size-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div
              className="absolute inset-0 bg-linear-to-t from-foreground/45 via-transparent to-transparent"
              aria-hidden
            />
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.08 }}
          >
            <h2 className="type-h2 text-balance text-foreground">
              Una plataforma transparente y regulada
            </h2>

            <ul className="mt-8 grid gap-3">
              {HIGHLIGHTS.map((item) => {
                const Icon = item.icon;
                return (
                  <li
                    key={item.title}
                    className="flex items-start gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-sm"
                  >
                    <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-4.5" strokeWidth={2.1} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold leading-snug text-foreground">
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
