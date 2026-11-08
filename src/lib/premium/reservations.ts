import type { PropertyCurrency } from "@/lib/currency";
import { createLocalStore } from "./local-store";
import { limaDateFromToday, isPast } from "./dates";
import { canRequestReservation, complianceStore, getComplianceFor, isFullyVerified } from "./compliance";

/* ─────────────────────────────────────────────────────────────────────────
   Una operación Premium es una RESERVA, no un checkout.

   Disponible → Solicitud en revisión → Reservada / No aprobada
             → Aporte en custodia → En proceso → Liquidada

   - Enviar la solicitud no mueve dinero.
   - "Aporte confirmado" (en custodia) ≠ "operación formalizada": la
     formalización es un hito del proceso, posterior al aporte.
   - Se admiten aportes parciales dentro del plazo de la reserva; cada uno
     se concilia por separado.
   - Una oportunidad solo puede tener una reserva activa (concurrencia).
   ───────────────────────────────────────────────────────────────────────── */

export type ReservationStatus =
  | "requested"
  | "rejected"
  | "withdrawn"
  | "reserved"
  | "expired"
  | "in_custody"
  | "in_process"
  | "settled";

export const RESERVATION_STATUS_LABELS: Record<ReservationStatus, string> = {
  requested: "Solicitud en revisión",
  rejected: "No aprobada",
  withdrawn: "Solicitud retirada",
  reserved: "Reservada",
  expired: "Reserva vencida",
  in_custody: "Aporte en custodia",
  in_process: "En proceso",
  settled: "Liquidada",
};

export type StatusTone = "info" | "warning" | "primary" | "success" | "muted" | "danger";

export const RESERVATION_STATUS_TONE: Record<ReservationStatus, StatusTone> = {
  requested: "info",
  rejected: "danger",
  withdrawn: "muted",
  reserved: "warning",
  expired: "muted",
  in_custody: "primary",
  in_process: "primary",
  settled: "success",
};

export const ACTIVE_STATUSES: ReservationStatus[] = [
  "requested",
  "reserved",
  "in_custody",
  "in_process",
];

export const CLOSED_STATUSES: ReservationStatus[] = ["rejected", "withdrawn", "expired", "settled"];

/** Pasos del seguimiento, en el orden en que los vive el inversionista. */
export const TRACK_STEPS = [
  { id: "requested", label: "Solicitud", hint: "Revisión de cuenta y expediente" },
  { id: "reserved", label: "Reservada", hint: "Firma y aporte" },
  { id: "in_custody", label: "Aporte en custodia", hint: "Fondos conciliados" },
  { id: "in_process", label: "En proceso", hint: "Subasta, adjudicación y salida" },
  { id: "settled", label: "Liquidada", hint: "Capital y ganancia abonados" },
] as const;

export function getTrackStepIndex(status: ReservationStatus): number {
  switch (status) {
    case "requested":
    case "rejected":
    case "withdrawn":
      return 0;
    case "reserved":
    case "expired":
      return 1;
    case "in_custody":
      return 2;
    case "in_process":
      return 3;
    case "settled":
      return 4;
  }
}

export type OperationStage = "subasta" | "adjudicacion" | "formalizacion" | "venta";

export const OPERATION_STAGES: { id: OperationStage; label: string; description: string }[] = [
  { id: "subasta", label: "Subasta", description: "Participación en el remate judicial con tu capital en custodia." },
  { id: "adjudicacion", label: "Adjudicación", description: "El juzgado adjudica el inmueble y emite la resolución." },
  { id: "formalizacion", label: "Formalización", description: "Inscripción registral, entrega y saneamiento del inmueble." },
  { id: "venta", label: "Salida", description: "Comercialización del inmueble para liquidar la operación." },
];

export type FundingPlan = "single" | "staged";

export const FUNDING_PLAN_LABELS: Record<FundingPlan, string> = {
  single: "Un solo aporte",
  staged: "Aportes parciales",
};

export type ContributionStatus = "in_review" | "confirmed" | "rejected";

export const CONTRIBUTION_STATUS_LABELS: Record<ContributionStatus, string> = {
  in_review: "En conciliación",
  confirmed: "Confirmado",
  rejected: "Observado",
};

export interface Contribution {
  id: string;
  amount: number;
  operationNumber: string;
  transferDate: string;
  fileName?: string;
  status: ContributionStatus;
  registeredAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export type DocumentStatus = "approved" | "in_review" | "to_sign" | "confirmed";

export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
  approved: "Aprobado",
  in_review: "En revisión",
  to_sign: "Para firmar",
  confirmed: "Confirmado",
};

export interface ReservationDocument {
  id: string;
  title: string;
  description: string;
  status: DocumentStatus;
  date: string;
  version: number;
}

export interface ReservationEvent {
  id: string;
  at: string;
  title: string;
  detail?: string;
}

export interface Settlement {
  capitalReturned: number;
  gain: number;
  settledAt: string;
}

export interface PremiumReservation {
  id: string;
  code: string;
  propertyId: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  currency: PropertyCurrency;
  status: ReservationStatus;
  fundingPlan: FundingPlan;
  requestedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
  /** Hasta cuándo debe completarse el aporte (solo en "reserved"). */
  reservedUntil?: string;
  contributions: Contribution[];
  stage?: OperationStage;
  stageHistory: { stage: OperationStage; at: string }[];
  settlement?: Settlement;
  documents: ReservationDocument[];
  events: ReservationEvent[];
}

/* ── Derivados ───────────────────────────────────────────────────────── */

export function getFunds(r: PremiumReservation) {
  const confirmed = r.contributions
    .filter((c) => c.status === "confirmed")
    .reduce((s, c) => s + c.amount, 0);
  const inReview = r.contributions
    .filter((c) => c.status === "in_review")
    .reduce((s, c) => s + c.amount, 0);
  const pending = Math.max(0, r.amount - confirmed - inReview);
  return {
    confirmed,
    inReview,
    pending,
    confirmedPct: r.amount ? Math.round((confirmed / r.amount) * 100) : 0,
    inReviewPct: r.amount ? Math.round((inReview / r.amount) * 100) : 0,
  };
}

export function isActive(r: PremiumReservation): boolean {
  return ACTIVE_STATUSES.includes(r.status);
}

export function getContractDocument(r: PremiumReservation): ReservationDocument | undefined {
  return r.documents.find((d) => d.id.endsWith("-contract"));
}

export function needsSignature(r: PremiumReservation): boolean {
  return r.status === "reserved" && getContractDocument(r)?.status === "to_sign";
}

/** Capital efectivamente comprometido (solo aportes confirmados). */
export function committedCapital(r: PremiumReservation): number {
  if (r.status === "settled") return 0;
  return getFunds(r).confirmed;
}

/** Avance 0–1 de la operación para el indicador de Inicio. */
export function getOperationProgress(r: PremiumReservation): number {
  if (r.status === "settled") return 1;
  if (r.status === "in_process" && r.stage) {
    const i = OPERATION_STAGES.findIndex((s) => s.id === r.stage);
    return 0.4 + (0.55 * (i + 1)) / OPERATION_STAGES.length;
  }
  if (r.status === "in_custody") return 0.4;
  if (r.status === "reserved") return 0.1 + 0.25 * (getFunds(r).confirmed / r.amount);
  return 0.05;
}

/* ── Semilla ─────────────────────────────────────────────────────────── */

const ev = (id: string, daysAgo: number, title: string, detail?: string, hour = 10): ReservationEvent => ({
  id,
  at: limaDateFromToday(-daysAgo, hour),
  title,
  detail,
});

function seed(): PremiumReservation[] {
  return [
    {
      id: "res-0412",
      code: "RES-2026-0412",
      propertyId: "pp-103",
      userId: "premium-demo",
      userName: "Valentina Ríos",
      userEmail: "premium@rematto.com",
      amount: 520000,
      currency: "PEN",
      status: "in_process",
      fundingPlan: "staged",
      requestedAt: limaDateFromToday(-48, 11),
      reviewedAt: limaDateFromToday(-47, 16),
      contributions: [
        {
          id: "c-0412-1",
          amount: 300000,
          operationNumber: "00418273",
          transferDate: limaDateFromToday(-46, 10),
          fileName: "transferencia-bcp-300000.pdf",
          status: "confirmed",
          registeredAt: limaDateFromToday(-46, 11),
          reviewedAt: limaDateFromToday(-45, 15),
        },
        {
          id: "c-0412-2",
          amount: 220000,
          operationNumber: "00420911",
          transferDate: limaDateFromToday(-44, 9),
          fileName: "transferencia-bcp-220000.pdf",
          status: "confirmed",
          registeredAt: limaDateFromToday(-44, 10),
          reviewedAt: limaDateFromToday(-43, 12),
        },
      ],
      stage: "adjudicacion",
      stageHistory: [
        { stage: "subasta", at: limaDateFromToday(-40, 10) },
        { stage: "adjudicacion", at: limaDateFromToday(-12, 12) },
      ],
      documents: [
        { id: "res-0412-request", title: "Solicitud de reserva", description: "Resumen de condiciones aceptadas", status: "confirmed", date: limaDateFromToday(-48, 11), version: 1 },
        { id: "res-0412-contract", title: "Contrato de reserva", description: "Firmado electrónicamente", status: "confirmed", date: limaDateFromToday(-47, 18), version: 1 },
        { id: "res-0412-custody", title: "Constancia de custodia", description: "Aporte total conciliado", status: "confirmed", date: limaDateFromToday(-43, 12), version: 1 },
        { id: "res-0412-legal", title: "Informe legal · adjudicación", description: "Resolución de adjudicación y siguientes pasos", status: "approved", date: limaDateFromToday(-1, 9), version: 2 },
      ],
      events: [
        ev("e7", 1, "Nueva versión del informe legal", "v2 disponible en documentos", 9),
        ev("e6", 12, "Inmueble adjudicado", "Resolución del 4° Juzgado Civil de Lima", 12),
        ev("e5", 40, "Inicio del proceso", "Participación en subasta"),
        ev("e4", 43, "Aporte completo en custodia", "S/ 520,000 conciliados", 12),
        ev("e3", 45, "Aporte confirmado", "S/ 300,000 conciliados", 15),
        ev("e2", 47, "Reserva aprobada", "Plazo de aporte: 5 días hábiles", 16),
        ev("e1", 48, "Solicitud enviada"),
      ],
    },
    {
      id: "res-0436",
      code: "RES-2026-0436",
      propertyId: "pp-106",
      userId: "premium-demo",
      userName: "Valentina Ríos",
      userEmail: "premium@rematto.com",
      amount: 640000,
      currency: "USD",
      status: "reserved",
      fundingPlan: "staged",
      requestedAt: limaDateFromToday(-3, 10),
      reviewedAt: limaDateFromToday(-2, 15),
      reservedUntil: limaDateFromToday(3, 18),
      contributions: [
        {
          id: "c-0436-1",
          amount: 250000,
          operationNumber: "77310245",
          transferDate: limaDateFromToday(-1, 10),
          fileName: "transferencia-usd-250000.pdf",
          status: "confirmed",
          registeredAt: limaDateFromToday(-1, 11),
          reviewedAt: limaDateFromToday(-1, 17),
        },
        {
          id: "c-0436-2",
          amount: 100000,
          operationNumber: "77312980",
          transferDate: limaDateFromToday(0, 9),
          fileName: "transferencia-usd-100000.pdf",
          status: "in_review",
          registeredAt: limaDateFromToday(0, 9),
        },
      ],
      stageHistory: [],
      documents: [
        { id: "res-0436-request", title: "Solicitud de reserva", description: "Resumen de condiciones aceptadas", status: "confirmed", date: limaDateFromToday(-3, 10), version: 1 },
        { id: "res-0436-contract", title: "Contrato de reserva", description: "Firmado electrónicamente", status: "confirmed", date: limaDateFromToday(-2, 17), version: 1 },
        { id: "res-0436-receipt-c-0436-1", title: "Constancia de transferencia", description: "Op. 77310245", status: "confirmed", date: limaDateFromToday(-1, 11), version: 1 },
        { id: "res-0436-receipt-c-0436-2", title: "Constancia de transferencia", description: "Op. 77312980", status: "in_review", date: limaDateFromToday(0, 9), version: 1 },
        { id: "res-0436-schedule", title: "Anexo: cronograma de aportes", description: "Fechas y montos de tus aportes parciales", status: "to_sign", date: limaDateFromToday(0, 10), version: 1 },
      ],
      events: [
        ev("f5", 0, "Anexo de cronograma listo para firmar", undefined, 10),
        ev("f4", 0, "Aporte registrado", "USD 100,000 en conciliación", 9),
        ev("f3", 1, "Aporte confirmado", "USD 250,000 conciliados", 17),
        ev("f2b", 2, "Contrato de reserva firmado", undefined, 17),
        ev("f2", 2, "Reserva aprobada", "Completa el aporte dentro del plazo", 15),
        ev("f1", 3, "Solicitud enviada"),
      ],
    },
    {
      id: "res-0301",
      code: "RES-2025-0301",
      propertyId: "pp-107",
      userId: "premium-demo",
      userName: "Valentina Ríos",
      userEmail: "premium@rematto.com",
      amount: 410000,
      currency: "PEN",
      status: "settled",
      fundingPlan: "single",
      requestedAt: limaDateFromToday(-420, 10),
      reviewedAt: limaDateFromToday(-419, 12),
      contributions: [
        {
          id: "c-0301-1",
          amount: 410000,
          operationNumber: "00311802",
          transferDate: limaDateFromToday(-417, 10),
          status: "confirmed",
          registeredAt: limaDateFromToday(-417, 11),
          reviewedAt: limaDateFromToday(-416, 12),
        },
      ],
      stage: "venta",
      stageHistory: [
        { stage: "subasta", at: limaDateFromToday(-410, 10) },
        { stage: "adjudicacion", at: limaDateFromToday(-360, 10) },
        { stage: "formalizacion", at: limaDateFromToday(-300, 10) },
        { stage: "venta", at: limaDateFromToday(-150, 10) },
      ],
      settlement: { capitalReturned: 410000, gain: 61500, settledAt: limaDateFromToday(-28, 12) },
      documents: [
        { id: "res-0301-contract", title: "Contrato de reserva", description: "Firmado electrónicamente", status: "confirmed", date: limaDateFromToday(-419, 18), version: 1 },
        { id: "res-0301-settlement", title: "Liquidación final", description: "Capital devuelto y ganancia neta", status: "confirmed", date: limaDateFromToday(-28, 12), version: 1 },
      ],
      events: [
        ev("g4", 28, "Operación liquidada", "Capital y ganancia abonados a BCP ···4821", 12),
        ev("g3", 360, "Inmueble adjudicado"),
        ev("g2", 416, "Aporte completo en custodia"),
        ev("g1", 420, "Solicitud enviada"),
      ],
    },
    {
      id: "res-0440",
      code: "RES-2026-0440",
      propertyId: "pp-102",
      userId: "u2",
      userName: "María Vargas",
      userEmail: "maria.vargas@correo.pe",
      amount: 1450000,
      currency: "USD",
      status: "requested",
      fundingPlan: "single",
      requestedAt: limaDateFromToday(0, 8),
      contributions: [],
      stageHistory: [],
      documents: [
        { id: "res-0440-request", title: "Solicitud de reserva", description: "Resumen de condiciones aceptadas", status: "confirmed", date: limaDateFromToday(0, 8), version: 1 },
      ],
      events: [ev("h1", 0, "Solicitud enviada", undefined, 8)],
    },
  ];
}

export const reservationStore = createLocalStore<PremiumReservation[]>(
  "rematto-premium-reservations-v1",
  seed
);

export function useReservations(): PremiumReservation[] {
  return reservationStore.useValue();
}

export function getActiveReservationForProperty(
  all: PremiumReservation[],
  propertyId: string
): PremiumReservation | undefined {
  return all.find((r) => r.propertyId === propertyId && isActive(r));
}

/* ── Mutaciones ("backend" del prototipo) ────────────────────────────────
   Cada una valida en el servidor simulado, no solo en la UI: un botón
   oculto no es autorización (hallazgo crítico #1 de la auditoría Premium). */

export type Result<T = PremiumReservation> =
  | { ok: true; value: T }
  | { ok: false; code: "not_premium" | "compliance" | "unavailable" | "window_closed" | "invalid" | "not_found"; message: string };

const nowIso = () => new Date().toISOString();
const newId = (p: string) => `${p}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

function update(id: string, fn: (r: PremiumReservation) => PremiumReservation): PremiumReservation | undefined {
  let updated: PremiumReservation | undefined;
  reservationStore.set((all) =>
    all.map((r) => {
      if (r.id !== id) return r;
      updated = fn(r);
      return updated;
    })
  );
  return updated;
}

function event(title: string, detail?: string): ReservationEvent {
  return { id: newId("ev"), at: nowIso(), title, detail };
}

export function requestReservation(input: {
  user: { id: string; name: string; email: string; tier: string };
  property: { id: string; totalValue: number; currency: PropertyCurrency; premiumDeadline: string };
  fundingPlan: FundingPlan;
}): Result {
  const { user, property } = input;
  if (user.tier !== "premium") {
    return { ok: false, code: "not_premium", message: "Las solicitudes de reserva requieren una cuenta Premium activa." };
  }
  const compliance = getComplianceFor(complianceStore.get(), user.id);
  if (!canRequestReservation(compliance)) {
    return { ok: false, code: "compliance", message: "Completa tu verificación reforzada antes de enviar la solicitud." };
  }
  if (isPast(property.premiumDeadline)) {
    return { ok: false, code: "window_closed", message: "La ventana Premium de esta oportunidad ya cerró." };
  }
  const all = reservationStore.get();
  if (getActiveReservationForProperty(all, property.id)) {
    return {
      ok: false,
      code: "unavailable",
      message: "Otro inversionista envió una solicitud antes. Si no se aprueba, la oportunidad volverá a estar disponible.",
    };
  }
  const seq = String(441 + all.length).padStart(4, "0");
  const id = newId("res");
  const at = nowIso();
  const reservation: PremiumReservation = {
    id,
    code: `RES-${new Date().getFullYear()}-${seq}`,
    propertyId: property.id,
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    amount: property.totalValue,
    currency: property.currency,
    status: "requested",
    fundingPlan: input.fundingPlan,
    requestedAt: at,
    contributions: [],
    stageHistory: [],
    documents: [
      { id: `${id}-request`, title: "Solicitud de reserva", description: "Resumen de condiciones aceptadas", status: "confirmed", date: at, version: 1 },
    ],
    events: [{ id: newId("ev"), at, title: "Solicitud enviada", detail: "En revisión por el equipo Premium" }],
  };
  reservationStore.set((prev) => [reservation, ...prev]);
  return { ok: true, value: reservation };
}

export function withdrawRequest(id: string, userId: string): Result {
  const r = reservationStore.get().find((x) => x.id === id);
  if (!r || r.userId !== userId) return { ok: false, code: "not_found", message: "Solicitud no encontrada." };
  if (r.status !== "requested") return { ok: false, code: "invalid", message: "Solo puedes retirar una solicitud en revisión." };
  const value = update(id, (x) => ({
    ...x,
    status: "withdrawn",
    events: [event("Solicitud retirada", "La oportunidad vuelve a estar disponible"), ...x.events],
  }))!;
  return { ok: true, value };
}

/** Admin: aprueba la solicitud. Exige verificación reforzada completa. */
export function approveRequest(id: string, paymentWindowDays = 5): Result {
  const r = reservationStore.get().find((x) => x.id === id);
  if (!r) return { ok: false, code: "not_found", message: "Solicitud no encontrada." };
  if (r.status !== "requested") return { ok: false, code: "invalid", message: "La solicitud ya fue resuelta." };
  if (!isFullyVerified(getComplianceFor(complianceStore.get(), r.userId))) {
    return { ok: false, code: "compliance", message: "Valida el origen de fondos del inversionista antes de aprobar." };
  }
  const at = nowIso();
  const value = update(id, (x) => ({
    ...x,
    status: "reserved",
    reviewedAt: at,
    reservedUntil: limaDateFromToday(paymentWindowDays, 18),
    documents: [
      ...x.documents,
      { id: `${x.id}-contract`, title: "Contrato de reserva", description: "Plazo, aporte y condiciones de devolución", status: "to_sign", date: at, version: 1 },
    ],
    events: [event("Reserva aprobada", "Firma el contrato y completa el aporte dentro del plazo"), ...x.events],
  }))!;
  return { ok: true, value };
}

export function rejectRequest(id: string, reason: string): Result {
  const r = reservationStore.get().find((x) => x.id === id);
  if (!r) return { ok: false, code: "not_found", message: "Solicitud no encontrada." };
  if (r.status !== "requested") return { ok: false, code: "invalid", message: "La solicitud ya fue resuelta." };
  const value = update(id, (x) => ({
    ...x,
    status: "rejected",
    reviewedAt: nowIso(),
    rejectionReason: reason,
    events: [event("Solicitud no aprobada", reason), ...x.events],
  }))!;
  return { ok: true, value };
}

export function signDocument(id: string, docId: string): Result {
  const r = reservationStore.get().find((x) => x.id === id);
  const doc = r?.documents.find((d) => d.id === docId);
  if (!r || !doc) return { ok: false, code: "not_found", message: "Documento no encontrado." };
  if (doc.status !== "to_sign") return { ok: false, code: "invalid", message: "Este documento ya fue firmado." };
  const value = update(id, (x) => ({
    ...x,
    documents: x.documents.map((d) =>
      d.id === docId ? { ...d, status: "confirmed", description: "Firmado electrónicamente", date: nowIso() } : d
    ),
    events: [event(`${doc.title} firmado`), ...x.events],
  }))!;
  return { ok: true, value };
}

export function registerContribution(
  id: string,
  input: { amount: number; operationNumber: string; transferDate: string; fileName?: string }
): Result {
  const r = reservationStore.get().find((x) => x.id === id);
  if (!r) return { ok: false, code: "not_found", message: "Reserva no encontrada." };
  if (r.status !== "reserved") return { ok: false, code: "invalid", message: "Esta reserva no admite aportes en este momento." };
  if (needsSignature(r)) return { ok: false, code: "invalid", message: "Firma el contrato de reserva antes de registrar aportes." };
  const { pending } = getFunds(r);
  if (!(input.amount > 0) || input.amount > pending) {
    return { ok: false, code: "invalid", message: "El monto debe ser mayor a 0 y no superar el saldo pendiente." };
  }
  if (r.fundingPlan === "single" && input.amount !== pending) {
    return { ok: false, code: "invalid", message: "Elegiste un solo aporte: registra el monto total pendiente." };
  }
  const contribution: Contribution = {
    id: newId("c"),
    amount: input.amount,
    operationNumber: input.operationNumber,
    transferDate: input.transferDate,
    fileName: input.fileName,
    status: "in_review",
    registeredAt: nowIso(),
  };
  const value = update(id, (x) => ({
    ...x,
    contributions: [...x.contributions, contribution],
    documents: [
      ...x.documents,
      {
        id: `${x.id}-receipt-${contribution.id}`,
        title: "Constancia de transferencia",
        description: `Op. ${contribution.operationNumber}`,
        status: "in_review",
        date: contribution.registeredAt,
        version: 1,
      },
    ],
    events: [event("Aporte registrado", "En conciliación con el banco"), ...x.events],
  }))!;
  return { ok: true, value };
}

/** Admin: concilia un aporte. Al completarse el 100% pasa a custodia. */
export function reviewContribution(id: string, contributionId: string, approve: boolean, reason?: string): Result {
  const r = reservationStore.get().find((x) => x.id === id);
  if (!r) return { ok: false, code: "not_found", message: "Reserva no encontrada." };
  const value = update(id, (x) => {
    const contributions = x.contributions.map((c) =>
      c.id === contributionId
        ? { ...c, status: (approve ? "confirmed" : "rejected") as ContributionStatus, reviewedAt: nowIso(), rejectionReason: approve ? undefined : reason }
        : c
    );
    const documents = x.documents.map((d) =>
      d.id === `${x.id}-receipt-${contributionId}`
        ? { ...d, status: (approve ? "confirmed" : "in_review") as DocumentStatus }
        : d
    );
    const next = { ...x, contributions, documents };
    const funds = getFunds(next);
    const complete = funds.confirmed >= x.amount;
    return {
      ...next,
      status: complete ? "in_custody" : x.status,
      reservedUntil: complete ? undefined : x.reservedUntil,
      documents: complete
        ? [...documents, { id: `${x.id}-custody`, title: "Constancia de custodia", description: "Aporte total conciliado", status: "confirmed" as DocumentStatus, date: nowIso(), version: 1 }]
        : documents,
      events: [
        ...(complete ? [event("Aporte completo en custodia", "La operación puede iniciar")] : []),
        approve ? event("Aporte confirmado") : event("Aporte observado", reason),
        ...x.events,
      ],
    };
  })!;
  return { ok: true, value };
}

/** Admin: avanza la operación. Desde custodia inicia en "subasta". */
export function advanceOperation(id: string): Result {
  const r = reservationStore.get().find((x) => x.id === id);
  if (!r) return { ok: false, code: "not_found", message: "Reserva no encontrada." };
  if (r.status !== "in_custody" && r.status !== "in_process") {
    return { ok: false, code: "invalid", message: "La operación aún no tiene el aporte completo en custodia." };
  }
  const currentIdx = r.stage ? OPERATION_STAGES.findIndex((s) => s.id === r.stage) : -1;
  if (r.status === "in_process" && currentIdx === OPERATION_STAGES.length - 1) {
    return { ok: false, code: "invalid", message: "La operación está en su última etapa: regístrala como liquidada." };
  }
  const nextStage = OPERATION_STAGES[r.status === "in_custody" ? 0 : currentIdx + 1];
  const value = update(id, (x) => ({
    ...x,
    status: "in_process",
    stage: nextStage.id,
    stageHistory: [...x.stageHistory, { stage: nextStage.id, at: nowIso() }],
    events: [event(r.status === "in_custody" ? "Inicio del proceso" : `Nueva etapa: ${nextStage.label}`, nextStage.description), ...x.events],
  }))!;
  return { ok: true, value };
}

export function settleOperation(id: string, gain: number): Result {
  const r = reservationStore.get().find((x) => x.id === id);
  if (!r) return { ok: false, code: "not_found", message: "Reserva no encontrada." };
  if (r.status !== "in_process") return { ok: false, code: "invalid", message: "Solo se liquidan operaciones en proceso." };
  const at = nowIso();
  const value = update(id, (x) => ({
    ...x,
    status: "settled",
    settlement: { capitalReturned: x.amount, gain, settledAt: at },
    documents: [...x.documents, { id: `${x.id}-settlement`, title: "Liquidación final", description: "Capital devuelto y ganancia neta", status: "confirmed", date: at, version: 1 }],
    events: [event("Operación liquidada", "Capital y ganancia abonados a tu cuenta verificada"), ...x.events],
  }))!;
  return { ok: true, value };
}

/** Utilidad de demo: restablece reservas y verificación a la semilla. */
export function resetPremiumDemo() {
  reservationStore.reset();
  complianceStore.reset();
}
