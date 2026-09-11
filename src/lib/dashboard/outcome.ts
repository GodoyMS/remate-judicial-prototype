import type { InvestmentOutcome } from "./types";

export type OutcomeTone = "success" | "destructive" | "muted";

/**
 * Traduce un `InvestmentOutcome` a la etiqueta que ve el usuario. Los
 * colores dejan de asumir positivo (WP-4.3): `success` solo para ganancia
 * realizada, `destructive` para pérdida, `muted` para capital devuelto.
 */
export function describeOutcome(outcome: InvestmentOutcome): {
  label: string;
  tone: OutcomeTone;
} {
  switch (outcome.kind) {
    case "estimated":
      return { label: `Retorno estimado: ${outcome.roi}%`, tone: outcome.roi >= 0 ? "success" : "destructive" };
    case "revised":
      return { label: `Estimación actualizada: ${outcome.roi}%`, tone: outcome.roi >= 0 ? "success" : "destructive" };
    case "settled":
      if (outcome.roi > 0) return { label: `Resultado final: +${outcome.roi}%`, tone: "success" };
      if (outcome.roi < 0) return { label: `Resultado final: ${outcome.roi}%`, tone: "destructive" };
      return { label: "Sin retorno generado", tone: "muted" };
    case "capital_returned":
      return { label: "Capital devuelto", tone: "muted" };
    case "extended":
      return { label: "Plazo extendido", tone: "muted" };
  }
}

/** ROI a usar para cálculos de monto estimado; `null` si el resultado no es un porcentaje. */
export function getOutcomeRoi(outcome: InvestmentOutcome): number | null {
  switch (outcome.kind) {
    case "estimated":
    case "revised":
    case "settled":
      return outcome.roi;
    case "capital_returned":
      return 0;
    case "extended":
      return null;
  }
}

export function getOutcomeReturnAmount(outcome: InvestmentOutcome, principal: number): number {
  const roi = getOutcomeRoi(outcome);
  if (roi === null) return 0;
  return Math.round(principal * (roi / 100));
}
