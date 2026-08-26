import Link from "next/link";
import { LegalPageLayout } from "@/components/landing/LegalPageLayout";
import { LegalPageHero } from "@/components/landing/legal/LegalPageHero";
import { LegalContentBlock } from "@/components/landing/legal/LegalContentBlock";
import { LegalCTA } from "@/components/landing/legal/LegalCTA";
import { BRAND_NAME } from "@/lib/brand";

export const metadata = {
  title: `Política de riesgos | ${BRAND_NAME}`,
  description:
    "Qué puede salir mal al invertir en remates judiciales, qué ocurre con tu capital en cada escenario y cuánto puede demorar. Sin letra chica.",
};

/**
 * Audit findings RM-018, RM-027 and RM-032.
 *
 * The landing described the favourable path only, and the footer asked the
 * user to "read our risk policy" without linking one. Someone weighing a
 * meaningful ticket evaluates the downside first: every adverse scenario the
 * auditors listed gets its own row here, each one answering the same three
 * questions — what happens to my money, how long it takes, what I have to do.
 */
type Scenario = {
  id: string;
  title: string;
  what: string;
  capital: string;
  timing: string;
  likelihood: "Frecuente" | "Ocasional" | "Poco frecuente";
};

const scenarios: Scenario[] = [
  {
    id: "pool",
    title: "El pool no se completa",
    what: "No se reúne el monto necesario para participar en la subasta antes del cierre de la convocatoria.",
    capital:
      "Se devuelve el 100% de tu aporte, sin comisión. No se cobra ningún cargo por una operación que no llegó a ejecutarse.",
    timing: "Devolución en un máximo de 5 días hábiles desde el cierre.",
    likelihood: "Ocasional",
  },
  {
    id: "no-adjudicacion",
    title: "La subasta no se adjudica a nuestro pool",
    what: "Otro postor ofrece un monto superior al techo definido para la operación y la propiedad se adjudica a un tercero.",
    capital:
      "Se devuelve el 100% de tu aporte. El techo de puja se fija antes de abrir el pool y no se sube durante el remate.",
    timing: "Devolución en un máximo de 10 días hábiles desde el acto de remate.",
    likelihood: "Frecuente",
  },
  {
    id: "suspension",
    title: "El proceso judicial se suspende",
    what: "El juzgado suspende, reprograma o anula el remate — por ejemplo, si el deudor paga, aparece una tercería o se apela una resolución.",
    capital:
      "Tu capital permanece íntegro en la cuenta de custodia. Puedes esperar a la reprogramación o solicitar la devolución.",
    timing:
      "Una reprogramación suele añadir entre 1 y 6 meses. La devolución, si la solicitas, toma hasta 10 días hábiles.",
    likelihood: "Ocasional",
  },
  {
    id: "posesion",
    title: "La entrega de la posesión se demora",
    what: "La propiedad se adjudica, pero el lanzamiento u ocupación efectiva requiere trámite judicial adicional.",
    capital:
      "Tu participación sigue vigente y respaldada por el título de adjudicación. No pierdes capital, pero el retorno se posterga.",
    timing:
      "Añade típicamente entre 3 y 12 meses al plazo estimado original del proyecto.",
    likelihood: "Frecuente",
  },
  {
    id: "venta-lenta",
    title: "La venta posterior demora más de lo estimado",
    what: "El inmueble se adjudica y se pone en venta, pero el mercado tarda en absorberlo.",
    capital:
      "El capital permanece invertido en el activo. El retorno anualizado baja porque el mismo margen se reparte en más meses.",
    timing:
      "Los plazos publicados son estimaciones. Una demora de 6 a 12 meses sobre el plazo objetivo es un escenario realista.",
    likelihood: "Frecuente",
  },
  {
    id: "venta-baja",
    title: "La venta se cierra por debajo de lo esperado",
    what: "El precio de venta final es inferior al valor estimado al abrir la operación.",
    capital:
      "El retorno es menor al proyectado y puede ser negativo: es posible recuperar menos de lo aportado. La pérdida se reparte a prorrata entre todos los participantes del pool.",
    timing: "Se liquida junto con el cierre de la operación.",
    likelihood: "Ocasional",
  },
  {
    id: "cargas",
    title: "Aparecen cargas o vicios ocultos",
    what: "Se detecta una carga, gravamen u ocupación no advertida en el estudio de títulos previo.",
    capital:
      "Puede reducir el valor recuperable o exigir gasto legal adicional, que se descuenta del resultado de la operación.",
    likelihood: "Poco frecuente",
    timing: "Depende del trámite; puede extender la operación varios meses.",
  },
  {
    id: "liquidez",
    title: "Necesitas tu dinero antes de tiempo",
    what: "Tu situación cambia y requieres liquidez antes del cierre natural de la operación.",
    capital:
      "Esta es una inversión ilíquida: una vez adjudicada la propiedad, no existe hoy un mercado secundario para vender tu participación. Invierte solo capital que no vayas a necesitar durante el plazo estimado.",
    timing:
      "No hay retiro anticipado garantizado. Antes de la adjudicación sí puedes solicitar la devolución de tu aporte.",
    likelihood: "Ocasional",
  },
];

const likelihoodTone: Record<Scenario["likelihood"], string> = {
  Frecuente: "bg-warning/20 text-foreground ring-warning/40",
  Ocasional: "bg-primary/10 text-primary ring-primary/25",
  "Poco frecuente": "bg-muted text-muted-foreground ring-border",
};

export default function PoliticaDeRiesgosPage() {
  return (
    <LegalPageLayout>
      <LegalPageHero
        badge="Riesgos"
        badgeIcon="AlertTriangle"
        title="Qué pasa si las cosas no salen como esperabas"
        description="Invertir en remates judiciales puede hacerte perder parte o la totalidad de tu capital. Esta página explica, escenario por escenario, qué ocurre con tu dinero y cuánto puede demorar."
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Política de riesgos" },
        ]}
      />

      {/* Headline warning — stated before any mitigation */}
      <section className="border-b border-border bg-card py-12">
        <div className="mx-auto max-w-3xl section-padding">
          <div className="rounded-2xl border border-warning/30 bg-warning/8 p-6 sm:p-8">
            <p className="type-label text-foreground/70">
              Lo esencial en tres líneas
            </p>
            <ul className="mt-4 space-y-3 type-body text-foreground">
              <li>
                <strong>Puedes perder dinero.</strong> El retorno no está
                garantizado y ningún resultado pasado asegura uno futuro.
              </li>
              <li>
                <strong>Es una inversión a plazo e ilíquida.</strong> No hay
                retiro anticipado garantizado una vez adjudicada la propiedad.
              </li>
              <li>
                <strong>Los plazos son estimados.</strong> Dependen de tiempos
                judiciales que no controlamos y suelen extenderse.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Scenario table */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl section-padding">
          <h2 className="type-h2 text-foreground">Escenarios adversos</h2>
          <p className="mt-3 type-lead text-muted-foreground">
            Ocho situaciones reales que pueden darse en una operación, con lo
            que ocurre con tu capital y con los tiempos en cada una.
          </p>

          <div className="mt-10 space-y-4">
            {scenarios.map((scenario) => (
              <article
                key={scenario.id}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-7"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h3 className="type-h3 text-foreground">{scenario.title}</h3>
                  <span
                    className={`type-label shrink-0 rounded-full px-3 py-1 ring-1 ${likelihoodTone[scenario.likelihood]}`}
                  >
                    {scenario.likelihood}
                  </span>
                </div>
                <p className="mt-3 type-body text-muted-foreground">
                  {scenario.what}
                </p>

                <dl className="mt-5 grid gap-4 border-t border-border/70 pt-5 sm:grid-cols-2">
                  <div>
                    <dt className="type-label text-muted-foreground">
                      Qué pasa con tu capital
                    </dt>
                    <dd className="mt-1.5 type-body text-foreground">
                      {scenario.capital}
                    </dd>
                  </div>
                  <div>
                    <dt className="type-label text-muted-foreground">
                      Qué pasa con los plazos
                    </dt>
                    <dd className="mt-1.5 type-body text-foreground">
                      {scenario.timing}
                    </dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl section-padding space-y-6">
          <LegalContentBlock
            icon="Wallet"
            title="Dónde está tu dinero en cada etapa"
            index={0}
          >
            <ul>
              <li>
                <strong>Antes de la subasta:</strong> tu aporte permanece en una
                cuenta de custodia separada del patrimonio de {BRAND_NAME}, sin
                aplicarse a ninguna operación hasta que el pool se cierra.
              </li>
              <li>
                <strong>Durante el remate:</strong> el monto queda comprometido
                como respaldo de la puja, hasta el techo definido públicamente
                al abrir la operación.
              </li>
              <li>
                <strong>Tras la adjudicación:</strong> tu capital está
                representado en la participación sobre el inmueble adjudicado y
                sujeto al resultado de su venta posterior.
              </li>
              <li>
                <strong>Al cierre:</strong> se descuentan gastos y comisiones —
                detallados en{" "}
                <Link href="/tarifas" className="font-medium text-primary underline">
                  Tarifas
                </Link>{" "}
                — y el saldo se transfiere a tu cuenta bancaria.
              </li>
            </ul>
          </LegalContentBlock>

          <LegalContentBlock
            icon="TrendingDown"
            title="Cómo leer las cifras de rentabilidad"
            index={1}
          >
            <p>
              Todo porcentaje publicado en la plataforma es una{" "}
              <strong>estimación referencial</strong>, calculada sobre el valor
              comercial estimado del inmueble y un plazo objetivo de venta. No
              es una promesa ni un rendimiento garantizado.
            </p>
            <ul>
              <li>
                El retorno real depende del precio de venta final y del tiempo
                que tome cerrarla.
              </li>
              <li>
                Los promedios históricos describen operaciones ya cerradas y no
                anticipan el comportamiento de las operaciones abiertas.
              </li>
              <li>
                El retorno se presenta antes de impuestos. La retención aplicable
                depende de tu situación tributaria.
              </li>
            </ul>
          </LegalContentBlock>

          <LegalContentBlock
            icon="HeartHandshake"
            title="Cómo decidir si esta inversión es para ti"
            index={2}
          >
            <p>Este producto probablemente no te conviene si:</p>
            <ul>
              <li>Podrías necesitar ese dinero dentro de los próximos 24 meses.</li>
              <li>
                Es la totalidad o la mayor parte de tus ahorros disponibles.
              </li>
              <li>Una pérdida parcial afectaría tus obligaciones cotidianas.</li>
            </ul>
            <p>
              Si tienes dudas antes de decidir, escríbenos o agenda una llamada
              desde{" "}
              <Link href="/contacto" className="font-medium text-primary underline">
                Contacto
              </Link>
              . Crear una cuenta no te obliga a invertir.
            </p>
          </LegalContentBlock>
        </div>
      </section>

      <LegalCTA
        title="¿Tienes dudas sobre los riesgos?"
        description="Habla con nuestro equipo antes de invertir. Resolvemos escenarios concretos con números reales de operaciones cerradas."
        primaryLabel="Hablar con el equipo"
        primaryHref="/contacto"
        secondaryLabel="Ver preguntas frecuentes"
        secondaryHref="/preguntas-frecuentes"
      />
    </LegalPageLayout>
  );
}
