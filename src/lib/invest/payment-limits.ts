import type { PropertyCurrency } from "@/lib/currency";
import type { PaymentMethodId } from "./payment-validation";

export interface PaymentMethodLimits {
  id: PaymentMethodId;
  maxPerTransaction: Partial<Record<PropertyCurrency, number>>;
  allowsPartial: boolean;
  note: string; // por qué existe el límite, en lenguaje de usuario
}

/**
 * Techos reales por canal. Yape y tarjeta están acotados por el
 * procesador/emisor; la transferencia bancaria es el canal habilitado para
 * operaciones de alto valor (WP-0.2d, cierra P-024/P-026/P-027/P-028/P-030).
 */
export const PAYMENT_METHOD_LIMITS: PaymentMethodLimits[] = [
  {
    id: "yape",
    maxPerTransaction: { PEN: 500 },
    allowsPartial: true,
    note: "Yape limita las operaciones entre personas a S/ 500 por transacción.",
  },
  {
    id: "card",
    maxPerTransaction: { PEN: 15000, USD: 4000 },
    allowsPartial: true,
    note: "Tu banco emisor puede reducir este máximo según tu línea disponible.",
  },
  {
    id: "deposit",
    maxPerTransaction: { PEN: 50000, USD: 15000 },
    allowsPartial: true,
    note: "Los depósitos en ventanilla o agente están sujetos al límite diario de tu agencia.",
  },
  {
    id: "transfer",
    maxPerTransaction: {},
    allowsPartial: true,
    note: "Sin techo: es el canal habilitado para operaciones de alto valor.",
  },
];

export function getPaymentMethodLimit(id: PaymentMethodId): PaymentMethodLimits | undefined {
  return PAYMENT_METHOD_LIMITS.find((m) => m.id === id);
}

/** `undefined` = sin techo definido para esa moneda (ej. transferencia). */
export function getMaxForCurrency(
  id: PaymentMethodId,
  currency: PropertyCurrency
): number | undefined {
  return getPaymentMethodLimit(id)?.maxPerTransaction[currency];
}

export function methodCoversAmount(
  id: PaymentMethodId,
  currency: PropertyCurrency,
  amount: number
): boolean {
  const max = getMaxForCurrency(id, currency);
  return max === undefined || amount <= max;
}
