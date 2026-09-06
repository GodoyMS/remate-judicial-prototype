import Link from "next/link";
import { LegalPageLayout } from "@/components/landing/LegalPageLayout";
import { LegalPageHero } from "@/components/landing/legal/LegalPageHero";
import { LegalContentBlock } from "@/components/landing/legal/LegalContentBlock";
import { LegalCTA } from "@/components/landing/legal/LegalCTA";
import { BRAND_NAME } from "@/lib/brand";

export const metadata = {
  title: `Tarifas y comisiones | ${BRAND_NAME}`,
  description:
    "Todas las comisiones, gastos y costos asociados a invertir en remates judiciales, y el momento exacto en que se aplican.",
};

/**
 * Audit finding RM-005: the footer offered "Tarifas" but the link went back
 * to the landing. Somebody who cannot see what a platform charges will not
 * move money through it, so the whole fee schedule lives here — including
 * the charges that are not ours.
 */
/**
 * Second review, findings 31 and 37.
 *
 * · 37 — the condition was welded to the value ("8% sobre la ganancia · cero
 *   si no hay ganancia"), so the reader had to parse a price and a rule out
 *   of one string. Every fee is now concept · rate, then when it applies,
 *   then the condition as its own helper line.
 * · 31 — the schedule was a 600px-wide table inside a horizontal scroller, so
 *   on a phone the third column simply fell off the screen. It is now one
 *   list that renders as cards below `md` and as a table from `md` up, with
 *   no horizontal scrolling at any width.
 */
type Fee = {
  concept: string;
  /** The rate or price itself. */
  amount: string;
  when: string;
  note: string;
  /** The rule that decides whether it is charged at all. */
  condition?: string;
};

const platformFees: Fee[] = [
  {
    concept: "Apertura de cuenta y verificación",
    amount: "Sin costo",
    when: "—",
    note: "Registrarte, verificar tu identidad y explorar operaciones no tiene ningún costo.",
  },
  {
    concept: "Comisión de estructuración",
    amount: "1,5% del monto invertido",
    when: "Al completarse el capital colectivo, antes de la subasta",
    note: "Cubre el estudio de títulos, la auditoría legal del expediente y la estructuración de la operación.",
    condition:
      "No se cobra si el capital no se completa o si la subasta no se adjudica.",
  },
  {
    concept: "Comisión de éxito",
    amount: "8% de la ganancia",
    when: "Al liquidar la operación",
    note: "Se aplica únicamente sobre el retorno positivo, nunca sobre el capital aportado.",
    condition: "No se cobra si no existe ganancia.",
  },
  {
    concept: "Gestión anual del activo",
    amount: "0,5% anual sobre el capital",
    when: "Prorrateado al liquidar",
    note: "Administración del inmueble adjudicado mientras dura el proceso de venta.",
  },
  {
    concept: "Transferencia de retornos",
    amount: "Sin costo",
    when: "—",
    note: "Una transferencia por operación liquidada a una cuenta bancaria peruana en la misma moneda.",
  },
  {
    concept: "Devolución por operación no ejecutada",
    amount: "Sin costo",
    when: "—",
    note: "Si el capital colectivo no se completa o la subasta no se adjudica, se devuelve el 100% del aporte.",
  },
];

const thirdPartyCosts: Fee[] = [
  {
    concept: "Aranceles y tasas judiciales",
    amount: "Según arancel vigente",
    when: "Durante el proceso de remate",
    note: "Fijados por el Poder Judicial. Se prorratean entre los participantes de la operación y se descuentan del resultado.",
  },
  {
    concept: "Gastos notariales y registrales",
    amount: "Según tarifario",
    when: "Al inscribir la adjudicación",
    note: "SUNARP y notaría. Se informan en el detalle de cada operación antes de invertir.",
  },
  {
    concept: "Impuesto a la renta",
    amount: "Según tu situación tributaria",
    when: "Al percibir el retorno",
    note: "Retención de ley cuando corresponde. Emitimos el certificado para tu declaración anual ante SUNAT.",
  },
  {
    concept: "Alcabala y gastos de transferencia",
    amount: "Variable",
    when: "En la compraventa posterior",
    note: "Se descuentan del precio de venta antes de calcular el resultado de la operación.",
  },
];

function FeeTable({ title, fees }: { title: string; fees: Fee[] }) {
  return (
    <div>
      <h2 className="type-h2 text-foreground">{title}</h2>

      {/* Column headers only exist where there are columns (md and up). */}
      <div className="mt-6 hidden border-b border-border pb-3 md:grid md:grid-cols-[minmax(0,1.7fr)_minmax(0,0.8fr)_minmax(0,0.9fr)] md:gap-6">
        {["Concepto", "Cuánto", "Cuándo se aplica"].map((header) => (
          <p key={header} className="type-label text-muted-foreground">
            {header}
          </p>
        ))}
      </div>

      <ul className="mt-4 flex flex-col gap-4 md:mt-0 md:gap-0">
        {fees.map((fee) => (
          <li
            key={fee.concept}
            className={[
              "rounded-2xl border border-border bg-card p-5",
              "md:grid md:grid-cols-[minmax(0,1.7fr)_minmax(0,0.8fr)_minmax(0,0.9fr)] md:items-start md:gap-6",
              "md:rounded-none md:border-0 md:border-b md:border-border/70 md:bg-transparent md:p-0 md:py-5",
            ].join(" ")}
          >
            <div className="min-w-0">
              <p className="type-body font-semibold text-foreground">
                {fee.concept}
              </p>
              <p className="mt-1.5 type-caption text-pretty text-muted-foreground">
                {fee.note}
              </p>
            </div>

            {/* On phones the rate sits on its own row with its label, so it
                never has to compete with the concept for width. */}
            <div className="mt-4 flex items-baseline justify-between gap-3 border-t border-border/60 pt-3 md:mt-0 md:block md:border-0 md:pt-0">
              <span className="type-caption text-muted-foreground md:hidden">
                Cuánto
              </span>
              <span className="type-body text-right font-bold text-primary md:text-left">
                {fee.amount}
              </span>
            </div>

            <div className="mt-2 flex items-baseline justify-between gap-3 md:mt-0 md:block">
              <span className="type-caption text-muted-foreground md:hidden">
                Cuándo se aplica
              </span>
              <span className="type-caption text-right text-muted-foreground md:text-left">
                {fee.when}
              </span>
            </div>

            {/* The condition, separated from the value (finding 37). */}
            {fee.condition && (
              <p className="mt-3 rounded-lg bg-muted px-3 py-2 type-caption text-muted-foreground md:col-span-3 md:mt-3 md:bg-transparent md:px-0 md:py-0">
                {fee.condition}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function TarifasPage() {
  return (
    <LegalPageLayout>
      <LegalPageHero
        badge="Tarifas"
        badgeIcon="Receipt"
        title="Lo que cobramos, y cuándo"
        description="Sin cargos por registrarte ni por explorar. Cobramos cuando la operación avanza, y la comisión de éxito solo si hay ganancia."
        breadcrumbs={[{ label: "Inicio", href: "/" }, { label: "Tarifas" }]}
      />

      <section className="border-b border-border bg-card py-12">
        <div className="mx-auto max-w-3xl section-padding">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { value: "S/ 0", label: "Por registrarte y explorar" },
              { value: "1,5%", label: "Al invertir, una sola vez" },
              { value: "8%", label: "Sobre la ganancia, solo si la hay" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-border bg-muted/40 p-5 text-center"
              >
                <p className="type-metric text-primary">{item.value}</p>
                <p className="mt-2 type-caption text-muted-foreground">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl section-padding space-y-16">
          <FeeTable title="Comisiones de la plataforma" fees={platformFees} />
          <FeeTable
            title="Costos de terceros que se descuentan"
            fees={thirdPartyCosts}
          />
        </div>
      </section>

      <section className="bg-muted/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl section-padding space-y-6">
          <LegalContentBlock
            icon="Coins"
            title="Un ejemplo con números"
            index={0}
          >
            <p>
              Inviertes <strong>S/ 5,000</strong> en una operación que se
              adjudica y se vende con un margen bruto del 20% en 14 meses.
            </p>
            <ul>
              <li>Comisión de estructuración (1,5%): S/ 75, al completarse el capital colectivo.</li>
              <li>Gestión del activo (0,5% anual, 14 meses): S/ 29.</li>
              <li>Ganancia bruta atribuible: S/ 1,000.</li>
              <li>Comisión de éxito (8% de S/ 1,000): S/ 80.</li>
              <li>
                <strong>Recibes S/ 5,816</strong> antes de impuestos, más los
                gastos de terceros que correspondan a la operación.
              </li>
            </ul>
            <p>
              Es un ejemplo ilustrativo, no una proyección. Los resultados reales
              dependen del precio de venta y del plazo; consulta la{" "}
              <Link
                href="/politica-de-riesgos"
                className="font-medium text-primary underline"
              >
                política de riesgos
              </Link>
              .
            </p>
          </LegalContentBlock>

          <LegalContentBlock
            icon="BadgeCheck"
            title="Lo que nunca cobramos"
            index={1}
          >
            <ul>
              <li>Cargos por mantenimiento de cuenta.</li>
              <li>Penalidades por no invertir tras registrarte.</li>
              <li>Comisión sobre operaciones que no llegaron a ejecutarse.</li>
              <li>Comisión de éxito cuando la operación cierra en pérdida.</li>
            </ul>
            <p>
              Toda comisión aplicable a una operación concreta se muestra en su
              ficha antes de confirmar la inversión.
            </p>
          </LegalContentBlock>
        </div>
      </section>

      <LegalCTA
        title="¿Dudas sobre alguna comisión?"
        description="Te explicamos con números tu caso concreto antes de que inviertas un sol."
        primaryLabel="Hablar con el equipo"
        primaryHref="/contacto"
        secondaryLabel="Ver preguntas frecuentes"
        secondaryHref="/preguntas-frecuentes"
      />
    </LegalPageLayout>
  );
}
