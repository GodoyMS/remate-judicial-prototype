"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, X } from "lucide-react";
import { BRAND_NAME } from "@/lib/brand";

/**
 * "¿Para quién es Rematto?" — second review, finding 20.
 *
 * The site said clearly when *not* to invest, but never defined the investor
 * it is designed for, which left the reader to guess whether the product was
 * meant for them. The criteria are concrete and checkable against their own
 * situation, and the "no es para ti" column keeps the honesty of the risk
 * page instead of replacing it with a sales filter.
 */

const FIT = [
  "Buscas diversificar en activos inmobiliarios alternativos, además de lo que ya tienes.",
  "Puedes mantener el capital invertido durante 12 a 24 meses o más, sin necesitarlo antes.",
  "Entiendes que el retorno no está garantizado y depende del precio de venta y de plazos judiciales.",
];

const NOT_FIT = [
  "Necesitas disponer del dinero en el corto plazo: no hay mercado secundario para vender tu participación.",
  "Buscas un rendimiento fijo o garantizado, como el de un depósito a plazo.",
  "Vas a invertir un capital que no puedes permitirte perder, total o parcialmente.",
];

export function ForWhom() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="para-quien"
      data-nav-tone="light"
      className="relative overflow-hidden bg-background py-16 sm:py-20"
    >
      <div className="relative mx-auto max-w-[1400px] section-padding">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="type-h2 text-balance text-foreground">
            ¿Para quién es <span className="text-primary">{BRAND_NAME}</span>?
          </h2>
          <p className="mt-4 type-lead text-pretty text-muted-foreground">
            Este tipo de inversión encaja con un perfil concreto. Vale la pena
            comprobarlo antes de seguir.
          </p>
        </motion.div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45 }}
            className="rounded-3xl border border-primary/25 bg-primary/5 p-6 sm:p-7"
          >
            <h3 className="type-h3 text-foreground">Es para ti si…</h3>
            <ul className="mt-5 flex flex-col gap-4">
              {FIT.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  <span className="text-pretty text-sm leading-relaxed text-foreground/85">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: reduceMotion ? 0 : 0.07 }}
            className="rounded-3xl border border-border/70 bg-card p-6 sm:p-7"
          >
            <h3 className="type-h3 text-foreground">No es para ti si…</h3>
            <ul className="mt-5 flex flex-col gap-4">
              {NOT_FIT.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <X className="size-3" strokeWidth={3} />
                  </span>
                  <span className="text-pretty text-sm leading-relaxed text-muted-foreground">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              href="/politica-de-riesgos#cuando-no-invertir"
              className="type-body mt-6 inline-flex w-fit items-center gap-1.5 font-semibold text-primary hover:underline"
            >
              Cuándo no invertir aquí
              <ArrowRight className="size-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
