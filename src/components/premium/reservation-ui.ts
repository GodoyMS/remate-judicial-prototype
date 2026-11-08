import type { Availability } from "@/lib/premium/availability";
import {
  OPERATION_STAGES,
  RESERVATION_STATUS_LABELS,
  RESERVATION_STATUS_TONE,
  getFunds,
  needsSignature,
  type PremiumReservation,
  type StatusTone,
} from "@/lib/premium/reservations";
import { formatCurrency } from "@/lib/currency";
import { formatLimaDate, formatLimaShort } from "@/lib/premium/dates";

/** Etiqueta + tono de la píldora de una oportunidad según lo que ve el usuario. */
export function availabilityPill(a: Availability): { label: string; tone: StatusTone } {
  switch (a.kind) {
    case "available":
      return { label: "Disponible", tone: "success" };
    case "held":
      return { label: "En reserva", tone: "muted" };
    case "taken":
      return { label: "No disponible", tone: "muted" };
    case "collective":
      return { label: "Pasó a colectiva", tone: "muted" };
    case "mine":
      return {
        label: RESERVATION_STATUS_LABELS[a.reservation.status],
        tone: RESERVATION_STATUS_TONE[a.reservation.status],
      };
  }
}

export function trackingHref(reservationId: string, tab?: "aportes" | "documentos") {
  return `/dashboard/my-investments/premium/${reservationId}${tab ? `?tab=${tab}` : ""}`;
}

/**
 * La siguiente cosa que pasa en una operación, en una frase. `actionable`
 * indica si depende del inversionista (y por tanto va a "Acciones").
 */
export function nextStepFor(r: PremiumReservation): { text: string; actionable: boolean } {
  const funds = getFunds(r);
  switch (r.status) {
    case "requested":
      return { text: "Revisando tu solicitud · respuesta en 1 día hábil", actionable: false };
    case "reserved":
      if (needsSignature(r)) return { text: "Firma el contrato de reserva", actionable: true };
      if (funds.pending > 0)
        return {
          text: `Transfiere ${formatCurrency(funds.pending, r.currency)}${r.reservedUntil ? ` antes del ${formatLimaShort(r.reservedUntil)}` : ""}`,
          actionable: true,
        };
      return { text: "Conciliando tu aporte con el banco", actionable: false };
    case "in_custody":
      return { text: "Aporte completo · preparando el inicio del proceso", actionable: false };
    case "in_process": {
      const stage = OPERATION_STAGES.find((s) => s.id === r.stage);
      return { text: `Etapa actual: ${stage?.label ?? "En proceso"}`, actionable: false };
    }
    case "settled":
      return { text: r.settlement ? `Liquidada el ${formatLimaDate(r.settlement.settledAt)}` : "Liquidada", actionable: false };
    case "rejected":
      return { text: "Solicitud no aprobada", actionable: false };
    case "withdrawn":
      return { text: "Solicitud retirada", actionable: false };
    case "expired":
      return { text: "La reserva venció sin aporte completo", actionable: false };
  }
}
