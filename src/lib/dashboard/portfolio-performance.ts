/**
 * Rendimiento acumulado del portafolio, mes a mes (mock). En producción
 * vendría de la valorización periódica de cada inversión; aquí es una serie
 * fija de los últimos 12 meses para alimentar el gráfico de Inicio.
 */
export interface PortfolioPerformancePoint {
  month: string; // etiqueta corta, p. ej. "Ene"
  value: number; // rendimiento acumulado en %
}

export const PORTFOLIO_PERFORMANCE: PortfolioPerformancePoint[] = [
  { month: "Nov", value: -2.1 },
  { month: "Dic", value: 0.4 },
  { month: "Ene", value: 1.2 },
  { month: "Feb", value: 3.8 },
  { month: "Mar", value: 5.1 },
  { month: "Abr", value: 4.3 },
  { month: "May", value: 6.0 },
  { month: "Jun", value: 9.4 },
  { month: "Jul", value: 12.8 },
  { month: "Ago", value: 15.6 },
  { month: "Sep", value: 19.9 },
  { month: "Oct", value: 22.7 },
];

export const PERFORMANCE_RANGES = [
  { value: "3", label: "Últimos 3 meses" },
  { value: "6", label: "Últimos 6 meses" },
  { value: "12", label: "Últimos 12 meses" },
] as const;

export type PerformanceRange = (typeof PERFORMANCE_RANGES)[number]["value"];

export function getPerformanceSeries(range: PerformanceRange): PortfolioPerformancePoint[] {
  return PORTFOLIO_PERFORMANCE.slice(-Number(range));
}

export function formatSignedPercent(value: number): string {
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}${Math.abs(value).toFixed(1)}%`;
}
