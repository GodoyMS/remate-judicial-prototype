import { SCENARIOS, type ScenarioTone } from "@/lib/landing/opportunities";
import type { PremiumProperty } from "./types";

export interface PremiumScenario {
  id: string;
  label: string;
  caption: string;
  tone: ScenarioTone;
  /** Retorno neto de la operación completa (no anualizado), en %. */
  netRoi: number;
  netGain: number;
}

/**
 * Mismos tres escenarios y mismo vocabulario que el simulador público
 * (Adverso / Esperado / Favorable), aplicados al retorno neto de la
 * operación. La ficha nunca muestra solo el favorable (CONF-PREM-002).
 */
export function getPremiumScenarios(p: PremiumProperty): PremiumScenario[] {
  return SCENARIOS.map((s) => {
    const netRoi = Math.round(p.roiBasis.netRoi * s.factor * 10) / 10;
    return {
      id: s.id,
      label: s.label,
      caption: s.caption,
      tone: s.tone,
      netRoi,
      netGain: (p.totalValue * netRoi) / 100,
    };
  });
}

export function getEstimatedTerm(p: PremiumProperty): string | undefined {
  return p.roiBasis.assumptions.find((a) => a.label.toLowerCase().includes("plazo"))?.value;
}
