import { dashboardProperties } from "@/lib/dashboard/mock-data";
import type { PropertyCurrency } from "@/lib/currency";

/**
 * One source of truth for every opportunity the public surfaces show.
 *
 * Second review, findings 6, 7, 27 and 28:
 *
 * · 7 / 28 — "Subastas abiertas ahora" and the simulator both listed
 *   Penthouse Miraflores, which the same page labels "Próximo". Availability
 *   is now a typed field (`open` | `upcoming`) and each surface asks for the
 *   set it is entitled to show: the simulator and the "open now" grid take
 *   `openOpportunities()`, upcoming ones appear in their own block.
 * · 6 — "Ver esta oportunidad" sent everyone to /register regardless of which
 *   card they clicked. Each opportunity now carries a slug and resolves to a
 *   public detail page.
 * · 27 — the card's "podrías recibir" and the simulator's net result were
 *   computed by two different formulas, so the same operation showed two
 *   different numbers. Both now call `simulate()` below.
 */

/* ── Fee schedule — mirrors /tarifas, and is the only copy of it ────────── */

export const FEES = {
  /** One-off, on the invested capital, when the pool closes. */
  structuring: 0.015,
  /** Annual, on capital, prorated over the holding period. */
  management: 0.005,
  /** On the gain only, and only when the gain is positive. */
  success: 0.08,
} as const;

/* ── Reference scenarios ────────────────────────────────────────────────── */

export type ScenarioTone = "adverse" | "base" | "favourable";

export type Scenario = {
  id: string;
  label: string;
  caption: string;
  /** Multiplier applied to the published annual return. Negative = a loss. */
  factor: number;
  months: number;
  tone: ScenarioTone;
};

/**
 * Three *reference* outcomes, not an exhaustive map of what can happen
 * (finding 8). The risk policy documents eight adverse situations and every
 * intermediate result between them; these three exist to show how term and
 * return move together.
 */
export const SCENARIOS: Scenario[] = [
  {
    id: "adverse",
    label: "Adverso",
    caption: "Venta por debajo de lo estimado y con demora",
    factor: -0.35,
    months: 22,
    tone: "adverse",
  },
  {
    id: "base",
    label: "Esperado",
    caption: "La operación se comporta como fue modelada",
    factor: 1,
    months: 14,
    tone: "base",
  },
  {
    id: "favourable",
    label: "Favorable",
    caption: "Inmueble desocupado y venta antes de lo previsto",
    factor: 1.25,
    months: 12,
    tone: "favourable",
  },
];

export const BASE_SCENARIO = SCENARIOS.find((s) => s.id === "base")!;

export type SimulationResult = {
  scenario: Scenario;
  grossGain: number;
  structuringFee: number;
  managementFee: number;
  successFee: number;
  fees: number;
  net: number;
  netGain: number;
  annualised: number;
};

export function simulate(
  amount: number,
  annualRoi: number,
  scenario: Scenario = BASE_SCENARIO
): SimulationResult {
  const years = scenario.months / 12;
  const grossGain = amount * (annualRoi / 100) * years * scenario.factor;

  const structuringFee = amount * FEES.structuring;
  const managementFee = amount * FEES.management * years;
  const successFee = grossGain > 0 ? grossGain * FEES.success : 0;
  const fees = structuringFee + managementFee + successFee;

  const net = amount + grossGain - fees;
  const netGain = net - amount;

  return {
    scenario,
    grossGain,
    structuringFee,
    managementFee,
    successFee,
    fees,
    net,
    netGain,
    annualised: amount > 0 ? (netGain / amount / years) * 100 : 0,
  };
}

/* ── Opportunities ──────────────────────────────────────────────────────── */

export type OpportunityAvailability = "open" | "upcoming";

export type LandingOpportunity = {
  id: number;
  slug: string;
  name: string;
  address: string;
  district: string;
  region: string;
  type: string;
  area: string;
  currency: PropertyCurrency;
  /** Judicial base price of the property. */
  basePrice: number;
  /** Capital the operation needs to raise. */
  target: number;
  raised: number;
  /** 0–100, rounded. */
  fundedPct: number;
  investors: number;
  minTicket: number;
  /** Published annual estimate, referential. */
  roi: number;
  deadline: string;
  deadlineDays: number;
  availability: OpportunityAvailability;
  statusLabel: string;
  image: string;
  images: string[];
  description: string;
  /** Plain-language "why this one", one line. */
  rationale: string;
  expediente: string;
  court: string;
  /** Occupancy — the single biggest driver of how long an operation runs. */
  occupancy: string;
  /** The two or three risks that matter most for this specific operation. */
  risks: string[];
};

/** Court record per operation, so a reader can contrast it in the public source. */
const RECORDS: Record<
  number,
  { expediente: string; court: string; occupancy: string }
> = {
  1: {
    expediente: "2023-1420-LIMA",
    court: "1er Juzgado Civil de Lima",
    occupancy: "Ocupado por el ejecutado · lanzamiento judicial pendiente",
  },
  2: {
    expediente: "2022-0987-LIMA",
    court: "5to Juzgado Civil de Lima",
    occupancy: "Desocupado · posesión inmediata tras la inscripción",
  },
  3: {
    expediente: "2023-1847-LIMA",
    court: "3er Juzgado Civil de Lima",
    occupancy: "Ocupado por terceros · en evaluación",
  },
  4: {
    expediente: "2024-0311-LIMA",
    court: "2do Juzgado Civil de Lima",
    occupancy: "Desocupado · posesión inmediata tras la inscripción",
  },
  5: {
    expediente: "2023-2210-LIMA",
    court: "4to Juzgado Civil de Lima",
    occupancy: "Ocupado por el ejecutado · lanzamiento judicial pendiente",
  },
  6: {
    expediente: "2024-0562-LIMA",
    court: "6to Juzgado Civil de Lima",
    occupancy: "En verificación",
  },
};

const RATIONALE: Record<number, string> = {
  1: "Precio base por debajo del valor comercial de la zona, en un distrito con alta rotación de venta.",
  2: "Inmueble desocupado: sin lanzamiento judicial pendiente, la puesta en venta puede iniciar antes.",
  3: "Expediente en etapa avanzada y sin cargas registrales observadas en el estudio de títulos.",
  4: "Activo comercial con demanda estable de arrendamiento en el eje financiero de San Borja.",
  5: "Zona consolidada con obra pública en ejecución y buena absorción del mercado residencial.",
  6: "Terreno con habilitación urbana vigente y sin cargas observadas al cierre del estudio.",
};

const RISKS: Record<number, string[]> = {
  1: [
    "El inmueble está ocupado: la entrega de posesión requiere un lanzamiento judicial y es la causa más común de que una operación exceda su plazo.",
    "El precio de venta final puede quedar por debajo del valor comercial estimado, reduciendo o anulando el retorno.",
  ],
  2: [
    "Otro postor puede superar el techo de puja definido para la operación; en ese caso se devuelve el 100% del aporte.",
    "El plazo de comercialización de una casa de este ticket suele ser mayor que el de un departamento.",
  ],
  3: [
    "La ocupación por terceros está en evaluación y puede añadir meses al ciclo.",
    "La operación se denomina en dólares: el tipo de cambio afecta el resultado en soles.",
  ],
  4: [
    "El mercado de oficinas tiene una absorción más lenta que el residencial.",
    "El retorno depende del precio de venta final, que no está garantizado.",
  ],
  5: [
    "El inmueble está ocupado: la entrega de posesión requiere un lanzamiento judicial.",
    "El proceso puede suspenderse si el deudor paga la deuda o aparece una tercería.",
  ],
  6: [
    "La operación aún no abre: los datos publicados son preliminares y pueden variar.",
    "El retorno estimado no está garantizado y depende del precio de venta final.",
  ],
};

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const landingOpportunities: LandingOpportunity[] = dashboardProperties.map(
  (property) => {
    const record = RECORDS[property.id];
    const target = property.totalInvestment || property.price;
    const raised = property.raisedAmount;

    return {
      id: property.id,
      slug: slugify(property.name),
      name: property.name,
      address: property.address,
      district: property.district,
      region: property.region,
      type: property.type,
      area: property.area,
      currency: property.currency as PropertyCurrency,
      basePrice: property.price,
      target,
      raised,
      fundedPct: target > 0 ? Math.round((raised / target) * 100) : 0,
      investors: property.investors,
      minTicket: property.minInvestment,
      roi: property.roi,
      deadline: property.deadline,
      deadlineDays: property.deadlineDays,
      availability: property.status === "Activo" ? "open" : "upcoming",
      statusLabel: property.status === "Activo" ? "Subasta abierta" : "Próximamente",
      image: property.img,
      images: property.images,
      description: property.description,
      rationale: RATIONALE[property.id] ?? "",
      expediente: record?.expediente ?? "En verificación",
      court: record?.court ?? "Por asignar",
      occupancy: record?.occupancy ?? "En verificación",
      risks: RISKS[property.id] ?? [],
    };
  }
);

/** Operations accepting capital right now — the only ones a CTA may act on. */
export function openOpportunities(): LandingOpportunity[] {
  return landingOpportunities.filter((o) => o.availability === "open");
}

/** Announced but not yet open. Never mixed into an "open now" list. */
export function upcomingOpportunities(): LandingOpportunity[] {
  return landingOpportunities.filter((o) => o.availability === "upcoming");
}

export function getOpportunityBySlug(
  slug: string
): LandingOpportunity | undefined {
  return landingOpportunities.find((o) => o.slug === slug);
}

/** Illustrative ticket used wherever a "what would this mean for me" figure appears. */
export const SAMPLE_TICKET = 500;
