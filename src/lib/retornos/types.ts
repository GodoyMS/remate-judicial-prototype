import type { PropertyCurrency } from "@/lib/currency";

export type RetornoType = "roi_return" | "refund" | "goal_not_reached";

export type RetornoStatus = "confirmed" | "pending";

export type RetornoPaymentMethod = "card" | "bank_transfer";

export type TicketStatus = "flagged" | "in_review" | "resolved";

export type TicketReason =
  | "wrong_amount"
  | "not_received"
  | "wrong_property"
  | "processing_error"
  | "other";

export type TicketActivityType =
  | "created"
  | "flagged"
  | "assigned"
  | "in_review"
  | "resolved"
  | "reopened"
  | "admin_message"
  | "client_message";

export interface TicketAttachment {
  name: string;
  url: string;
  mimeType: string;
}

export interface TicketActivity {
  id: string;
  type: TicketActivityType;
  title: string;
  description?: string;
  attachments?: TicketAttachment[];
  byUser: string;
  byRole: "client" | "admin";
  createdAt: string;
}

export interface RetornoTicket {
  id: string;
  retornoId: string;
  status: TicketStatus;
  title: string;
  reason: TicketReason;
  description: string;
  attachments: TicketAttachment[];
  createdAt: string;
  assignedToId?: string;
  assignedToName?: string;
  assignedAt?: string;
  resolvedAt?: string;
  resolvedByName?: string;
  activity: TicketActivity[];
}

/** Etiqueta visible de cada categoría (WP-4.1): ganancia, capital y reembolso nunca se suman entre sí. */
export const RETORNO_CATEGORY_LABELS: Record<RetornoType, string> = {
  roi_return: "Ganancia",
  refund: "Reembolso",
  goal_not_reached: "Devolución de capital",
};

export interface Retorno {
  id: string;
  type: RetornoType;
  propertyId: string;
  propertyTitle: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  /** Parte de `amount` que es capital devuelto (sin ganancia). `amount = principalAmount + gainAmount`. */
  principalAmount: number;
  /** Parte de `amount` que es ganancia real. Solo esta porción alimenta "Retornos generados". */
  gainAmount: number;
  currency: PropertyCurrency;
  status: RetornoStatus;
  paymentMethod: RetornoPaymentMethod;
  // Card fields
  cardLastFour?: string;
  cardholderName?: string;
  // Bank transfer fields
  bankName?: string;
  accountHolder?: string;
  accountNumber?: string;
  transferReference?: string;
  transferProofUrl?: string;
  transferProofName?: string;
  createdAt: string;
  confirmedAt?: string;
  createdBy: string;
  notes?: string;
  ticket?: RetornoTicket;
}
