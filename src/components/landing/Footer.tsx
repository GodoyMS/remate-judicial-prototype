"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Mail, MessageCircle, Phone } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import {
  BRAND_LEGAL_NAME,
  BRAND_NAME,
  CONTACT,
  MAILTO_SALES,
  WHATSAPP_URL,
} from "@/lib/brand";
import { cn } from "@/lib/utils";

/**
 * Footer — audit findings RM-005, RM-024, RM-031, RM-032 and RM-039.
 *
 * · RM-005 — "Tarifas" pointed at `#`, sending the reader back to the landing.
 *   It now resolves to the published fee schedule.
 * · RM-031 / RM-025 — "Contacto" was a bare `mailto:` buried in a link list.
 *   Contact is now its own block with WhatsApp, phone, email and opening
 *   hours, visible without opening anything.
 * · RM-032 — the risk warning asked the reader to read a risk policy that had
 *   no link. It links to it, and the wording is a link, not a footnote.
 * · RM-039 — on phones the five stacked blocks buried the links that matter.
 *   The three link columns collapse into accordions below `md`; contact and
 *   legal stay open, since those are what a hesitant reader is looking for.
 * · RM-024 — "Regulado por la SBS" removed. See the note in TrustSection: the
 *   claim cannot ship without the registration document to back it.
 */

const columns = [
  {
    title: "Plataforma",
    links: [
      { label: "Cómo funciona", href: "/#como-funciona" },
      { label: "Propiedades", href: "/#propiedades" },
      { label: "Proceso de inversión", href: "/proceso-de-inversion" },
      { label: "Tarifas", href: "/tarifas" },
      { label: "Nosotros", href: "/nosotros" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Política de riesgos", href: "/politica-de-riesgos" },
      { label: "Términos de uso", href: "/terminos-de-uso" },
      { label: "Política de privacidad", href: "/politica-de-privacidad" },
      { label: "Cumplimiento regulatorio", href: "/cumplimiento-regulatorio" },
      { label: "Libro de reclamaciones", href: "/libro-de-reclamaciones" },
    ],
  },
  {
    title: "Soporte",
    links: [
      { label: "Preguntas frecuentes", href: "/preguntas-frecuentes" },
      { label: "Contacto", href: "/contacto" },
      { label: "Libro de reclamaciones", href: "/libro-de-reclamaciones" },
      { label: "Cumplimiento AML & KYC", href: "/cumplimiento-regulatorio" },
    ],
  },
];

function LinkList({ links }: { links: { label: string; href: string }[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {links.map((l) => (
        <li key={l.label}>
          <Link
            href={l.href}
            className="text-sm text-background/70 transition-colors hover:text-background"
          >
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Collapsible on phones, always-open column from `md` up (RM-039). */
function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-background/10 py-4 md:border-0 md:py-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between text-left md:pointer-events-none md:mb-5 md:cursor-default"
      >
        <h4 className="type-label text-background/50">{title}</h4>
        <ChevronDown
          className={cn(
            "size-4 text-background/50 transition-transform md:hidden",
            open && "rotate-180"
          )}
          aria-hidden
        />
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300 md:max-h-none md:opacity-100",
          open ? "mt-4 max-h-96 opacity-100" : "max-h-0 opacity-0 md:mt-0"
        )}
      >
        <LinkList links={links} />
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer data-nav-tone="dark" className="bg-foreground text-background">
      <div className="mx-auto max-w-[1400px] section-padding py-14 sm:py-16">
        {/* Contact first — it is the thing a hesitant reader scrolls down for
            (RM-025, RM-031), so it does not hide behind an accordion. */}
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div className="flex flex-col gap-5">
            <Link href="/" className="flex w-fit items-center">
              <Logo className="text-2xl text-background" />
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-background/60">
              Inversión colectiva en inmuebles adjudicados en remates
              judiciales en Perú.
            </p>

            <div className="flex flex-col gap-2.5">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-fit items-center gap-2.5 text-sm text-background/80 transition-colors hover:text-background"
              >
                <MessageCircle className="size-4 shrink-0 text-primary" />
                WhatsApp {CONTACT.whatsappDisplay}
              </a>
              <a
                href={`tel:${CONTACT.phoneHref}`}
                className="flex w-fit items-center gap-2.5 text-sm text-background/80 transition-colors hover:text-background"
              >
                <Phone className="size-4 shrink-0 text-primary" />
                {CONTACT.phone}
              </a>
              <a
                href={MAILTO_SALES}
                className="flex w-fit items-center gap-2.5 text-sm text-background/80 transition-colors hover:text-background"
              >
                <Mail className="size-4 shrink-0 text-primary" />
                {CONTACT.salesEmail}
              </a>
              <p className="mt-1 text-xs text-background/50">
                {CONTACT.hours} · {CONTACT.address}
              </p>
            </div>
          </div>

          {/* Link columns — accordions on phones, plain columns from md */}
          <div className="grid gap-0 md:grid-cols-3 md:gap-10">
            {columns.map((col) => (
              <FooterColumn
                key={col.title}
                title={col.title}
                links={col.links}
              />
            ))}
          </div>
        </div>

        {/* Risk warning — a real link, not a suggestion to go looking (RM-032) */}
        <div className="mt-12 rounded-2xl border border-background/10 bg-background/5 p-5">
          <p className="text-xs leading-relaxed text-background/70">
            <strong className="font-semibold text-background">
              Advertencia de riesgo:
            </strong>{" "}
            invertir en remates judiciales conlleva riesgo de pérdida total o
            parcial del capital. Los retornos publicados son estimaciones
            referenciales y no constituyen una garantía de rendimiento. Los
            plazos dependen de procesos judiciales ajenos a {BRAND_NAME}. Antes
            de invertir, lee la{" "}
            <Link
              href="/politica-de-riesgos"
              className="font-semibold text-background underline underline-offset-2"
            >
              política de riesgos
            </Link>{" "}
            completa.
          </p>
        </div>

        {/* RM-010 — reserves the band the chat launcher and appearance control
            occupy, so nothing here ends up underneath them. */}
        <div className="floating-safe-bottom mt-8 flex flex-col items-center justify-between gap-3 border-t border-background/10 pt-8 sm:flex-row">
          <p className="text-xs text-background/40">
            © {new Date().getFullYear()} {BRAND_LEGAL_NAME} · Todos los
            derechos reservados.
          </p>
          <p className="text-xs text-background/40">Lima, Perú</p>
        </div>
      </div>
    </footer>
  );
}
