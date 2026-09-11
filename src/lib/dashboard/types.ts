import type { PropertyCurrency } from "@/lib/currency";

export type InvestmentStatus = "active" | "completed" | "pending" | "cancelled";
export type PropertyStatus = "Activo" | "Próximo" | "Cerrado";

export interface LiveInvestment {
  id: string;
  obfuscatedName: string;
  amount: number;
  timeAgo: string;
}

/**
 * Dónde está el proceso judicial. Independiente del estado del pago
 * (`UserInvestment.status`) y de la disponibilidad comercial de la
 * oportunidad (`DashboardProperty.status`).
 */
export type ProcessStage =
  | "subasta" // convocada o en curso
  | "adjudicacion" // adjudicada, pendiente de formalizar
  | "formalizacion" // actos notariales / registrales
  | "venta" // en comercialización
  | "liquidacion"; // retorno en distribución

export const PROCESS_STAGE_ORDER: ProcessStage[] = [
  "subasta",
  "adjudicacion",
  "formalizacion",
  "venta",
  "liquidacion",
];

export const PROCESS_STAGE_LABELS: Record<ProcessStage, string> = {
  subasta: "Subasta",
  adjudicacion: "Adjudicación",
  formalizacion: "Formalización",
  venta: "Venta",
  liquidacion: "Retorno",
};

export interface ProcessMilestone {
  stage: ProcessStage;
  reachedAt: string | null; // null = todavía no alcanzado
  expectedAt: string | null;
  note?: string;
}

/** Resultado de una inversión. El ROI deja de ser siempre positivo. */
export type InvestmentOutcome =
  | { kind: "estimated"; roi: number } // proyección vigente
  | { kind: "revised"; roi: number; previousRoi: number; revisedAt: string }
  | { kind: "settled"; roi: number } // resultado final, puede ser 0 o negativo
  | { kind: "capital_returned" } // devuelto sin ganancia
  | { kind: "extended"; newExpectedAt: string }; // plazo extendido

export interface JudicialRecord {
  expediente: string; // p. ej. "01234-2025-0-1801-JR-CI-07"
  juzgado: string;
  etapa: string;
  lastReviewedAt: string;
  sourceUrl?: string; // enlace público verificable si existe
}

export interface VerificationReport {
  verifiedAt: string;
  scope: string[]; // qué se revisó, en lenguaje llano
  documents: { label: string; url: string }[];
}

export interface RoiBasis {
  assumptions: { label: string; value: string }[]; // tasación, precio de salida, plazo…
  costs: { label: string; amount: number }[]; // comisión, notarial, registral, impuestos
  grossRoi: number;
  netRoi: number;
}

export interface DashboardProperty {
  id: number;
  name: string;
  address: string;
  type: string;
  area: string;
  price: number;
  minInvestment: number;
  roi: number;
  deadline: string;
  deadlineDays: number;
  status: PropertyStatus;
  district: string;
  region: string;
  description: string;
  img: string;
  images: string[];
  badge: string;
  badgeStyle: string;
  investors: number;
  raisedAmount: number;
  totalInvestment: number;
  currency: PropertyCurrency;
  liveInvestments: LiveInvestment[];
  judicial: JudicialRecord;
  verification: VerificationReport;
  roiBasis: RoiBasis;
}

export interface UserInvestment {
  id: string;
  certificateId: string;
  propertyId: number;
  amount: number;
  currency: PropertyCurrency;
  roi: number;
  datePaid: string;
  expectedRoiDate: string;
  daysUntilRoi: number;
  status: InvestmentStatus;
  paymentMethod: string;
  outcome: InvestmentOutcome;
  stage: ProcessStage;
  timeline: ProcessMilestone[];
}
