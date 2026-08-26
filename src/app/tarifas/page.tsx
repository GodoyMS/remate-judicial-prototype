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
type Fee = {
  concept: string;
  amount: string;
  when: string;
  note: string;
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
    when: "Al cerrarse el pool, antes de la subasta",
    note: "Cubre el estudio de títulos, la auditoría legal del expediente y la estructuración de la operación. Si el pool no se cierra o la subasta no se adjudica, no se cobra.",
  },
  {
    concept: "Comisión de éxito",
    amount: "8% sobre la ganancia",
    when: "Al liquidar la operación",
    note: "Se aplica únicamente sobre el retorno positivo, nunca sobre el capital. Si la operación no genera ganancia, esta comisión es cero.",
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
    note: "Si el pool no se completa o la subasta no se adjudica, se devuelve el 100% del aporte.",
  },
];

const thirdPartyCosts: Fee[] = [
  {
    concept: "Aranceles y tasas judiciales",
    amount: "Según arancel vigente",
    when: "Durante el proceso de remate",
    note: "Fijados por el Poder Judicial. Se prorratean entre los participantes del pool y se descuentan del resultado.",
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
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-150 border-separate border-spacing-0 text-left">
          <thead>
            <tr>
              {["Concepto", "Cuánto", "Cuándo se aplica"].map((header) => (
                <th
                  key={header}
                  className="type-label border-b border-border pb-3 text-muted-foreground"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fees.map((fee) => (
              <tr key={fee.concept} className="align-top">
                <td className="border-b border-border/70 py-5 pr-6">
                  <p className="type-body font-semibold text-foreground">
                    {fee.concept}
                  </p>
                  <p className="mt-1.5 type-caption text-muted-foreground">
                    {fee.note}
                  </p>
                </td>
                <td className="border-b border-border/70 py-5 pr-6">
                  <span className="type-body font-bold whitespace-nowrap text-primary">
                    {fee.amount}
                  </span>
                </td>
                <td className="border-b border-border/70 py-5 type-caption text-muted-foreground">
                  {fee.when}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
              <li>Comisión de estructuración (1,5%): S/ 75, al cerrarse el pool.</li>
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
