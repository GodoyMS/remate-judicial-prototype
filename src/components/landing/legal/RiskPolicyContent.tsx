"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Clock,
  CircleDollarSign,
  Undo2,
  type LucideIcon,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { BRAND_NAME } from "@/lib/brand";
import { cn } from "@/lib/utils";

/**
 * Política de riesgos.
 *
 * This page is read by someone who is nervous, usually on a phone, looking for
 * one specific answer. The previous version gave them eight long cards with
 * four paragraphs each and a wall of supporting prose below — everything
 * expanded at once, nothing scannable, the answer they wanted buried at an
 * unknown scroll depth.
 *
 * So the structure is now: three sentences that state the whole truth up front,
 * then a filterable accordion where every row is a question in the reader's own
 * words and every open row answers exactly three things — what happens, what
 * happens to my money, how long it takes. Nothing else on the page competes.
 * One outcome per row, colour-coded, so the shape of the answer is visible
 * before reading a word of it.
 */

type Outcome = "refund" | "delay" | "loss";

type RiskItem = {
  id: string;
  /** Phrased as the reader would ask it. */
  question: string;
  what: string;
  capital: string;
  timing: string;
  outcome: Outcome;
};

const OUTCOME: Record<
  Outcome,
  { label: string; icon: LucideIcon; chip: string; dot: string }
> = {
  refund: {
    label: "Recuperas tu capital",
    icon: Undo2,
    chip: "bg-success/10 text-success ring-success/25",
    dot: "bg-success",
  },
  delay: {
    label: "Se alarga el plazo",
    icon: Clock,
    chip: "bg-warning/15 text-foreground ring-warning/35",
    dot: "bg-warning",
  },
  loss: {
    label: "Puedes perder dinero",
    icon: CircleDollarSign,
    chip: "bg-destructive/10 text-destructive ring-destructive/25",
    dot: "bg-destructive",
  },
};

const RISKS: RiskItem[] = [
  {
    id: "pool",
    question: "¿Y si no se reúne el monto necesario?",
    what: "El capital objetivo no se completa antes de que cierre la convocatoria, así que la operación no llega a ejecutarse.",
    capital:
      "Se devuelve el 100% de tu aporte, sin comisión. No cobramos por operaciones que no se ejecutaron.",
    timing: "Máximo 5 días hábiles desde el cierre de la convocatoria.",
    outcome: "refund",
  },
  {
    id: "no-adjudicacion",
    question: "¿Y si otro postor gana la subasta?",
    what: "Otro participante ofrece más que el techo de puja fijado para la operación. Ese techo se define antes de abrir el pool y no se sube durante el remate.",
    capital: "Se devuelve el 100% de tu aporte, sin comisión.",
    timing: "Máximo 10 días hábiles desde el acto de remate.",
    outcome: "refund",
  },
  {
    id: "suspension",
    question: "¿Y si el juzgado suspende el remate?",
    what: "El proceso puede suspenderse, reprogramarse o anularse: si el deudor paga la deuda, si aparece una tercería o si se apela una resolución.",
    capital:
      "Tu capital sigue íntegro en la cuenta de custodia. Puedes esperar a la reprogramación o pedir la devolución.",
    timing:
      "Una reprogramación suele añadir de 1 a 6 meses. Si pides la devolución, hasta 10 días hábiles.",
    outcome: "delay",
  },
  {
    id: "posesion",
    question: "¿Y si el inmueble está ocupado?",
    what: "La propiedad se adjudica, pero tomar posesión requiere un lanzamiento judicial adicional cuyo plazo depende del juzgado.",
    capital:
      "No pierdes capital: tu participación sigue vigente y respaldada por el título de adjudicación. El retorno se posterga.",
    timing: "Suele añadir de 3 a 12 meses al plazo estimado original.",
    outcome: "delay",
  },
  {
    id: "venta-lenta",
    question: "¿Y si la venta demora más de lo previsto?",
    what: "El inmueble se adjudica y sale al mercado, pero tarda en encontrar comprador.",
    capital:
      "El capital sigue invertido en el activo. El retorno anualizado baja, porque el mismo margen se reparte entre más meses.",
    timing:
      "Los plazos publicados son estimaciones. Una demora de 6 a 12 meses sobre el objetivo es un escenario realista.",
    outcome: "delay",
  },
  {
    id: "venta-baja",
    question: "¿Y si se vende por menos de lo esperado?",
    what: "El precio de venta final resulta inferior al valor estimado cuando se abrió la operación.",
    capital:
      "El retorno es menor al proyectado y puede ser negativo: es posible recuperar menos de lo que aportaste. El resultado se reparte a prorrata entre todos los participantes.",
    timing: "Se liquida junto con el cierre de la operación.",
    outcome: "loss",
  },
  {
    id: "cargas",
    question: "¿Y si aparece una carga que nadie vio?",
    what: "Se detecta un gravamen, una ocupación o un vicio no advertido en el estudio de títulos previo.",
    capital:
      "Puede reducir el valor recuperable o exigir gasto legal adicional, que se descuenta del resultado de la operación.",
    timing: "Depende del trámite; puede extender la operación varios meses.",
    outcome: "loss",
  },
  {
    id: "liquidez",
    question: "¿Y si necesito mi dinero antes de tiempo?",
    what: "Tu situación cambia y requieres liquidez antes del cierre natural de la operación.",
    capital:
      "Antes de la adjudicación puedes pedir la devolución de tu aporte. Después no: es una inversión ilíquida y hoy no existe un mercado secundario donde vender tu participación.",
    timing:
      "No hay retiro anticipado garantizado una vez adjudicada la propiedad.",
    outcome: "loss",
  },
];

const FILTERS = [
  { id: "all", label: "Todos" },
  { id: "refund", label: "Recuperas tu capital" },
  { id: "delay", label: "Se alarga el plazo" },
  { id: "loss", label: "Puedes perder dinero" },
] as const;

export function RiskPolicyContent() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const visible =
    filter === "all" ? RISKS : RISKS.filter((r) => r.outcome === filter);

  return (
    <>
      {/* ── The whole truth, in three lines, before anything else ── */}
      <section className="border-b border-border bg-muted/40 py-14 sm:py-20">
        <div className="mx-auto max-w-2xl section-padding">
          <span className="type-label inline-flex items-center gap-2 rounded-full bg-warning/15 px-3 py-1.5 text-foreground ring-1 ring-warning/30">
            <AlertTriangle className="size-3.5" />
            Política de riesgos
          </span>

          <h1 className="type-display mt-6 text-balance text-foreground">
            Qué pasa si las cosas{" "}
            <span className="text-primary">no salen bien</span>
          </h1>

          <ul className="mt-8 space-y-3">
            {[
              "Puedes perder dinero. El retorno no está garantizado y ningún resultado pasado asegura uno futuro.",
              "No puedes retirar cuando quieras. Una vez adjudicada la propiedad, la inversión es ilíquida.",
              "Los plazos son estimados. Dependen de tiempos judiciales que no controlamos y suelen extenderse.",
            ].map((line) => {
              const [lead, ...rest] = line.split(". ");
              return (
                <li key={line} className="flex gap-3">
                  <span
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                    aria-hidden
                  />
                  <p className="type-body text-muted-foreground">
                    <strong className="font-semibold text-foreground">
                      {lead}.
                    </strong>{" "}
                    {rest.join(". ")}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ── The eight questions ── */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-2xl section-padding">
          <h2 className="type-h3 text-foreground">
            Ocho situaciones, y qué pasa en cada una
          </h2>
          <p className="type-body mt-2 text-muted-foreground">
            Toca una pregunta para ver la respuesta.
          </p>

          {/* Filter by outcome — lets a reader jump straight to the answers
              that would actually cost them money. */}
          <div
            className="mt-6 flex flex-wrap gap-2"
            role="group"
            aria-label="Filtrar por resultado"
          >
            {FILTERS.map((f) => {
              const isActive = filter === f.id;
              const count =
                f.id === "all"
                  ? RISKS.length
                  : RISKS.filter((r) => r.outcome === f.id).length;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  aria-pressed={isActive}
                  className={cn(
                    "cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    isActive
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  )}
                >
                  {f.label}
                  <span className="ml-1.5 opacity-60">{count}</span>
                </button>
              );
            })}
          </div>

          <Accordion
            type="single"
            collapsible
            className="mt-6 overflow-hidden rounded-2xl border border-border bg-card"
          >
            {visible.map((risk) => {
              const outcome = OUTCOME[risk.outcome];
              const OutcomeIcon = outcome.icon;

              return (
                <AccordionItem
                  key={risk.id}
                  value={risk.id}
                  className="border-border px-5 sm:px-6"
                >
                  <AccordionTrigger className="gap-4 py-5 text-left hover:no-underline">
                    <span className="flex min-w-0 items-center gap-3">
                      <span
                        className={cn(
                          "size-2 shrink-0 rounded-full",
                          outcome.dot
                        )}
                        aria-hidden
                      />
                      <span className="type-body font-semibold text-foreground">
                        {risk.question}
                      </span>
                    </span>
                  </AccordionTrigger>

                  <AccordionContent className="pb-6">
                    <span
                      className={cn(
                        "type-label inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 ring-1",
                        outcome.chip
                      )}
                    >
                      <OutcomeIcon className="size-3" />
                      {outcome.label}
                    </span>

                    <p className="type-body mt-4 text-muted-foreground">
                      {risk.what}
                    </p>

                    <dl className="mt-5 space-y-4 border-t border-border pt-4">
                      <div>
                        <dt className="type-label text-muted-foreground">
                          Tu capital
                        </dt>
                        <dd className="type-body mt-1 text-foreground">
                          {risk.capital}
                        </dd>
                      </div>
                      <div>
                        <dt className="type-label text-muted-foreground">
                          Los plazos
                        </dt>
                        <dd className="type-body mt-1 text-foreground">
                          {risk.timing}
                        </dd>
                      </div>
                    </dl>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </section>

      {/* ── Two short closers, then out ── */}
      <section className="border-t border-border bg-muted/40 py-14 sm:py-20">
        <div className="mx-auto max-w-2xl section-padding">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="type-h3 text-foreground">
                Cómo leer los porcentajes
              </h3>
              <p className="type-body mt-3 text-muted-foreground">
                Todo retorno publicado es una estimación referencial sobre el
                valor comercial estimado del inmueble y un plazo objetivo de
                venta. No es una promesa. Se presenta antes de impuestos, y los
                promedios históricos describen operaciones ya cerradas.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="type-h3 text-foreground">
                Cuándo no invertir aquí
              </h3>
              <ul className="type-body mt-3 space-y-2 text-muted-foreground">
                <li>· Si podrías necesitar ese dinero en los próximos 24 meses.</li>
                <li>· Si es la mayor parte de tus ahorros disponibles.</li>
                <li>· Si una pérdida parcial afectaría tus obligaciones.</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-6 text-center sm:flex-row sm:justify-between sm:text-left">
            <p className="type-body text-muted-foreground">
              ¿Te queda una duda que no está aquí? Pregúntanos antes de
              invertir — crear una cuenta en {BRAND_NAME} no te obliga a nada.
            </p>
            <Button asChild className="shrink-0 rounded-full font-semibold">
              <Link href="/contacto">
                Hablar con el equipo
                <ArrowRight className="ml-1.5 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
