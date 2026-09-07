import Link from "next/link";
import { LegalPageLayout } from "@/components/landing/LegalPageLayout";
import { LegalPageHero } from "@/components/landing/legal/LegalPageHero";
import { LegalCTA } from "@/components/landing/legal/LegalCTA";
import { OfficialSourcesVerifyCard } from "@/components/landing/legal/OfficialSourcesVerifyCard";
import { CustodyBeforeAuctionCard } from "@/components/landing/legal/CustodyBeforeAuctionCard";
import { BRAND_NAME } from "@/lib/brand";import { cn } from "@/lib/utils";
export const metadata = {
  title: `El proceso de inversión, etapa por etapa | ${BRAND_NAME}`,
  description:
    "Qué ocurre entre que inviertes y que recibes tu retorno: subasta, adjudicación, inscripción, venta y liquidación, con plazos reales.",
};

/**
 * Audit finding RM-029.
 *
 * The public explanation jumped from "invierte desde S/ 500" straight to
 * "recibe tus retornos", hiding the months of judicial process in between —
 * which reads as a promise of speed the process cannot keep. Each stage below
 * carries an honest duration and states plainly what can go wrong in it.
 */
type InvestmentDisclosure = {
  title: string;
  subtitle: string;
  rows: string[][];
  pendingLabel: string;
};

type Stage = {
  phase: string;
  title: string;
  duration: string;
  what: string;
  yours: string;
  risk?: string;
  showOfficialSources?: boolean;
  investmentDisclosure?: InvestmentDisclosure;
};

function InvestmentDisclosureGrid({
  disclosure,
}: {
  disclosure: InvestmentDisclosure;
}) {
  const [row1 = [], row2 = []] = disclosure.rows;

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-sky-200 bg-[#eef6ff] px-4 py-5 sm:px-6 sm:py-6">
      <h4 className="text-base font-bold leading-snug text-foreground">
        {disclosure.title}
      </h4>
      <p className="mt-1 text-sm text-muted-foreground">{disclosure.subtitle}</p>

      <div className="mt-5 hidden sm:block">
        <div className="grid grid-cols-4 divide-x divide-sky-200/90">
          {row1.map((label, index) => (
            <div
              key={label}
              className={cn(
                "min-w-0 px-4",
                index === 0 && "pl-0",
                index === row1.length - 1 && "pr-0"
              )}
            >
              <p className="text-sm font-semibold leading-snug text-foreground">{label}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {disclosure.pendingLabel}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-3">
          {row2.map((label, index) => (
            <div
              key={label}
              className={cn(
                "min-w-0 px-4",
                index > 0 && "border-l border-sky-200/90",
                index === 0 && "pl-0"
              )}
            >
              <p className="text-sm font-semibold leading-snug text-foreground">{label}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {disclosure.pendingLabel}
              </p>
            </div>
          ))}
          <div aria-hidden className="hidden sm:block" />
        </div>
      </div>

      <div className="mt-5 space-y-4 sm:hidden">
        {[...row1, ...row2].map((label) => (
          <div
            key={label}
            className="border-b border-sky-200/90 pb-4 last:border-b-0 last:pb-0"
          >
            <p className="text-sm leading-snug text-foreground">{label}</p>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              {disclosure.pendingLabel}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

const stages: Stage[] = [
  {
    phase: "Antes de invertir",
    title: "Selección y auditoría del expediente",
    duration: "2 a 4 semanas · antes de que la veas publicada",
    what: `Rastreamos convocatorias de remate, revisamos el expediente judicial, verificamos cargas y gravámenes en SUNARP, evaluamos el estado de ocupación del inmueble y estimamos su valor comercial. Definimos el techo de puja.`,
    yours: "Nada todavía. La operación aparece en la plataforma solo si supera esta revisión.",
    showOfficialSources: true,
  },
  {
    phase: "Antes de invertir",
    title: "Apertura del capital colectivo",
    duration: "1 a 3 semanas",
    what: "La operación se publica con su expediente, su precio base, el techo de puja y el capital objetivo. Los inversionistas aportan hasta completar el capital colectivo de la operación.",
    yours: "Eliges el monto y confirmas tu participación. Tu aporte queda en cuenta de custodia, sin aplicarse aún.",
    risk: "Si el capital colectivo no se completa antes del cierre, se devuelve el 100% del aporte sin comisión.",
  },
  {
    phase: "El remate",
    title: "Acto de remate",
    duration: "1 día · fecha fijada por el juzgado",
    what: "Se participa en la subasta pública hasta el techo comprometido. Ese techo no se sube durante el acto.",
    yours: "Sigues el resultado desde tu panel el mismo día.",
    risk: "Si otro postor supera el techo, la propiedad se adjudica a un tercero y se devuelve el 100% del aporte.",
  },
  {
    phase: "El remate",
    title: "Adjudicación y pago del saldo",
    duration: "3 a 10 días hábiles",
    what: "Ganado el remate, se paga el saldo del precio dentro del plazo legal y el juzgado emite el auto de adjudicación.",
    yours:
      "Antes de invertir, revisas y aceptas el documento que define la estructura jurídica de tu participación, tus derechos y la forma de cálculo.",
    investmentDisclosure: {
      title: "Qué recibes cuando inviertes",
      subtitle: "Información obligatoria antes de invertir",
      pendingLabel: "Por definir y validar legalmente",
      rows: [
        [
          "Titular registral en SUNARP",
          "Documento que firmas o recibes",
          "Derecho económico o real",
          "Cálculo de tu porcentaje",
        ],
        [
          "Quién puede disponer o vender el inmueble",
          `Qué ocurre si ${BRAND_NAME} deja de operar`,
          "Documento que acredita tu derecho",
        ],
      ],
    },
    risk: "El proceso puede suspenderse por apelación, tercería o pago del deudor. En ese caso tu capital sigue íntegro y puedes esperar o pedir la devolución.",
  },
  {
    phase: "Después del remate",
    title: "Inscripción y saneamiento",
    duration: "1 a 3 meses",
    what: "Se inscribe la transferencia en SUNARP y se regularizan pendientes registrales, tributarios o de servicios.",
    yours: "Recibes la constancia de inscripción en tu panel.",
  },
  {
    phase: "Después del remate",
    title: "Entrega de la posesión",
    duration: "Inmediata a 12 meses",
    what: "Si el inmueble está desocupado, la toma de posesión es inmediata. Si está ocupado, requiere un lanzamiento judicial cuyo plazo depende del juzgado.",
    yours: "Nada de tu parte. Es la etapa con mayor variabilidad de todo el ciclo.",
    risk: "Esta es la causa más común de que una operación exceda su plazo estimado.",
  },
  {
    phase: "El retorno",
    title: "Puesta en venta y comercialización",
    duration: "3 a 12 meses",
    what: "El inmueble se acondiciona si hace falta y sale al mercado al valor comercial estimado.",
    yours: "Ves el avance de la comercialización y las ofertas recibidas.",
    risk: "Si el mercado tarda en absorberlo, el retorno anualizado baja. Si se cierra por debajo del valor estimado, el retorno puede ser menor al proyectado o negativo.",
  },
  {
    phase: "El retorno",
    title: "Liquidación y transferencia",
    duration: "5 a 15 días hábiles desde la venta",
    what: "Se descuentan gastos, impuestos y comisiones, y el saldo se reparte a prorrata entre los participantes de la operación.",
    yours: "Recibes la transferencia a tu cuenta bancaria y el detalle de la liquidación para tu declaración anual.",
  },
];

const phaseOrder = [
  "Antes de invertir",
  "El remate",
  "Después del remate",
  "El retorno",
];

export default function ProcesoDeInversionPage() {
  return (
    <LegalPageLayout>
      <LegalPageHero
        badge="Proceso"
        badgeIcon="Route"
        title="Qué pasa entre que inviertes y que cobras"
        description="Un remate judicial no se resuelve en minutos. Estas son las nueve etapas del ciclo completo, con los plazos que realmente toma cada una."
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Proceso de inversión" },
        ]}
      />

 

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl section-padding">
          {phaseOrder.map((phase) => (
            <div key={phase} className="mb-12 last:mb-0">
              <h2 className="type-label mb-5 text-primary">{phase}</h2>
              <ol className="space-y-4">
                {stages
                  .filter((stage) => stage.phase === phase)
                  .map((stage) => (
                    <li
                      key={stage.title}
                      className="rounded-2xl border border-border bg-card p-6 shadow-sm"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="type-h3 text-foreground">
                          {stage.title}
                        </h3>
                        <span className="type-caption rounded-full bg-muted px-3 py-1 text-muted-foreground">
                          {stage.duration}
                        </span>
                      </div>
                      <p className="mt-3 type-body text-muted-foreground">
                        {stage.what}
                      </p>
                      <p className="mt-3 type-body text-foreground">
                        <span className="font-semibold">Tu parte: </span>
                        {stage.yours}
                      </p>
                      {stage.showOfficialSources && (
                        <OfficialSourcesVerifyCard
                          variant="nested"
                          className="mt-4"
                        />
                      )}
                      {stage.investmentDisclosure && (
                        <InvestmentDisclosureGrid
                          disclosure={stage.investmentDisclosure}
                        />
                      )}
                      {stage.risk && (
                        <p
                          className={cn(
                            "mt-4 rounded-xl border p-4 text-sm leading-relaxed text-foreground",
                            stage.investmentDisclosure
                              ? "border-amber-200/90 bg-[#fff8ef]"
                              : "border-warning/30 bg-warning/8 type-caption"
                          )}
                        >
                          <span className="font-semibold">
                            Si algo sale distinto:{" "}
                          </span>
                          {stage.risk}
                        </p>
                      )}
                    </li>
                  ))}
                {phase === "Antes de invertir" && <CustodyBeforeAuctionCard />}
              </ol>
            </div>
          ))}

          <div className="rounded-2xl border border-border bg-muted/40 p-6">
            <p className="type-body text-muted-foreground">
              Los escenarios adversos de cada etapa están desarrollados en la{" "}
              <Link
                href="/politica-de-riesgos"
                className="font-medium text-primary underline"
              >
                política de riesgos
              </Link>
              , y las comisiones que se descuentan al liquidar, en{" "}
              <Link href="/tarifas" className="font-medium text-primary underline">
                Tarifas
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <LegalCTA
        title="Crear tu cuenta no te obliga a invertir"
        description="Regístrate para ver el detalle completo de las operaciones abiertas, con expediente, plazos y comisiones, y decide después."
        primaryLabel="Crear cuenta gratis"
        primaryHref="/register"
        secondaryLabel="Hablar con el equipo"
        secondaryHref="/contacto"
      />
    </LegalPageLayout>
  );
}
