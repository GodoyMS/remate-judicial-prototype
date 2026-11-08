import type { PremiumProperty } from "./types";
import type { PremiumReservation } from "./reservations";
import { getActiveReservationForProperty } from "./reservations";
import { isPast } from "./dates";

/**
 * Qué ve un inversionista de una oportunidad Premium. Se deriva de la
 * ventana y de las reservas; nunca se guarda (una sola fuente de verdad).
 *
 * - available   → ventana abierta y sin reserva activa.
 * - mine        → tengo una reserva activa (solicitud, reservada, custodia, proceso).
 * - held        → otro inversionista tiene una solicitud o reserva: "En reserva".
 *                 Puede liberarse, por eso se sigue mostrando (sin nombres).
 * - taken       → otro inversionista ya aportó: se retira de la vista (privacidad).
 * - collective  → la ventana cerró sin reserva: pasó a participación colectiva.
 */
export type Availability =
  | { kind: "available" }
  | { kind: "mine"; reservation: PremiumReservation }
  | { kind: "held" }
  | { kind: "taken" }
  | { kind: "collective" };

export function getAvailability(
  property: PremiumProperty,
  reservations: PremiumReservation[],
  userId: string,
  now = Date.now()
): Availability {
  const active = getActiveReservationForProperty(reservations, property.id);
  if (active) {
    if (active.userId === userId) return { kind: "mine", reservation: active };
    return active.status === "requested" || active.status === "reserved"
      ? { kind: "held" }
      : { kind: "taken" };
  }
  if (property.status === "converted" || isPast(property.premiumDeadline, now)) {
    return { kind: "collective" };
  }
  return { kind: "available" };
}

export const AVAILABILITY_LABELS: Record<Availability["kind"], string> = {
  available: "Disponible",
  mine: "Tu reserva",
  held: "En reserva",
  taken: "No disponible",
  collective: "Pasó a colectiva",
};
