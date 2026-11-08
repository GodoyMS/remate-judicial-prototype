import { createLocalStore } from "./local-store";
import { limaDateFromToday } from "./dates";

/**
 * Verificación reforzada (KYC Premium).
 *
 * Una operación Premium compromete el 100% del capital de una oportunidad,
 * así que además del KYC estándar se exige origen de fondos vigente y una
 * cuenta bancaria verificada a nombre del titular (única cuenta a la que se
 * devuelve dinero). Las tres validaciones son de cuenta, no de operación.
 */

export type CheckStatus = "complete" | "in_review" | "action_required";

export const CHECK_STATUS_LABELS: Record<CheckStatus, string> = {
  complete: "Completa",
  in_review: "En revisión",
  action_required: "Acción requerida",
};

export type FundsOrigin =
  | "salary"
  | "business"
  | "property_sale"
  | "savings"
  | "inheritance"
  | "other";

export const FUNDS_ORIGIN_LABELS: Record<FundsOrigin, string> = {
  salary: "Ingresos laborales o profesionales",
  business: "Actividad empresarial",
  property_sale: "Venta de un inmueble",
  savings: "Ahorros e inversiones previas",
  inheritance: "Herencia o donación",
  other: "Otro origen",
};

export interface ComplianceProfile {
  userId: string;
  identity: { status: CheckStatus; verifiedAt?: string };
  sourceOfFunds: {
    status: CheckStatus;
    origin?: FundsOrigin;
    supportFileName?: string;
    submittedAt?: string;
    verifiedAt?: string;
    /** Por qué se pide acción (vencimiento, documento ilegible…). */
    reason?: string;
  };
  bankAccount: {
    status: CheckStatus;
    bank: string;
    holder: string;
    last4: string;
    currency: "PEN" | "USD" | "PEN/USD";
  };
}

function seed(): ComplianceProfile[] {
  return [
    {
      userId: "premium-demo",
      identity: { status: "complete", verifiedAt: limaDateFromToday(-210, 11) },
      sourceOfFunds: {
        status: "action_required",
        origin: "business",
        verifiedAt: limaDateFromToday(-372, 10),
        reason:
          "Tu declaración anual de origen de fondos venció. Actualízala para enviar nuevas solicitudes de reserva.",
      },
      bankAccount: {
        status: "complete",
        bank: "BCP",
        holder: "Valentina Ríos",
        last4: "4821",
        currency: "PEN/USD",
      },
    },
    {
      // Otra inversionista con una solicitud en revisión (Villa Asia): su
      // declaración está pendiente de validar desde el panel admin.
      userId: "u2",
      identity: { status: "complete", verifiedAt: limaDateFromToday(-160, 10) },
      sourceOfFunds: {
        status: "in_review",
        origin: "property_sale",
        supportFileName: "minuta-venta-inmueble.pdf",
        submittedAt: limaDateFromToday(0, 8),
      },
      bankAccount: { status: "complete", bank: "BBVA", holder: "María Vargas", last4: "0392", currency: "PEN/USD" },
    },
    {
      userId: "standard-demo",
      identity: { status: "complete", verifiedAt: limaDateFromToday(-90, 9) },
      sourceOfFunds: { status: "action_required", reason: "Aún no has declarado el origen de tus fondos." },
      bankAccount: {
        status: "complete",
        bank: "Interbank",
        holder: "Carlos Mendoza",
        last4: "1907",
        currency: "PEN",
      },
    },
  ];
}

export const complianceStore = createLocalStore<ComplianceProfile[]>(
  "rematto-premium-compliance-v1",
  seed
);

export function getComplianceFor(
  profiles: ComplianceProfile[],
  userId: string
): ComplianceProfile {
  return (
    profiles.find((p) => p.userId === userId) ?? {
      userId,
      identity: { status: "action_required" },
      sourceOfFunds: { status: "action_required", reason: "Aún no has declarado el origen de tus fondos." },
      bankAccount: { status: "action_required", bank: "—", holder: "—", last4: "—", currency: "PEN" },
    }
  );
}

export function useCompliance(userId: string): ComplianceProfile {
  return getComplianceFor(complianceStore.useValue(), userId);
}

/**
 * ¿Puede enviar una solicitud de reserva? El origen de fondos "en revisión"
 * no bloquea: se revisa junto con la solicitud. Lo que no hay es solicitud
 * sin declaración.
 */
export function canRequestReservation(profile: ComplianceProfile): boolean {
  return (
    profile.identity.status === "complete" &&
    profile.bankAccount.status === "complete" &&
    profile.sourceOfFunds.status !== "action_required"
  );
}

/** ¿Está todo validado? Requisito para aprobar una solicitud (lado admin). */
export function isFullyVerified(profile: ComplianceProfile): boolean {
  return (
    profile.identity.status === "complete" &&
    profile.bankAccount.status === "complete" &&
    profile.sourceOfFunds.status === "complete"
  );
}

function upsert(profile: ComplianceProfile) {
  complianceStore.set((all) => {
    const exists = all.some((p) => p.userId === profile.userId);
    return exists
      ? all.map((p) => (p.userId === profile.userId ? profile : p))
      : [...all, profile];
  });
}

export function submitSourceOfFunds(
  userId: string,
  input: { origin: FundsOrigin; supportFileName: string }
): ComplianceProfile {
  const current = getComplianceFor(complianceStore.get(), userId);
  const next: ComplianceProfile = {
    ...current,
    sourceOfFunds: {
      status: "in_review",
      origin: input.origin,
      supportFileName: input.supportFileName,
      submittedAt: new Date().toISOString(),
    },
  };
  upsert(next);
  return next;
}

/** Admin: valida (o devuelve) la declaración de origen de fondos. */
export function reviewSourceOfFunds(userId: string, approve: boolean, reason?: string) {
  const current = getComplianceFor(complianceStore.get(), userId);
  upsert({
    ...current,
    sourceOfFunds: approve
      ? { ...current.sourceOfFunds, status: "complete", verifiedAt: new Date().toISOString(), reason: undefined }
      : {
          ...current.sourceOfFunds,
          status: "action_required",
          reason: reason || "Necesitamos un sustento adicional del origen de tus fondos.",
        },
  });
}
