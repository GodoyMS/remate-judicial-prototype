/**
 * Fechas de la experiencia Premium, ancladas a la hora de Lima.
 *
 * Las ventanas de exclusividad y los plazos de aporte son compromisos con
 * hora exacta ("cierra el 10 nov., 18:00"). Para que servidor y navegador
 * rendericen exactamente el mismo texto —y no haya desajustes de
 * hidratación cuando el servidor corre en UTC—, todo se calcula y se formatea
 * en la zona America/Lima.
 */

export const LIMA_TZ = "America/Lima";
const LIMA_OFFSET = "-05:00"; // Perú no aplica horario de verano.

function limaToday(): { y: number; m: number; d: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: LIMA_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  return { y: get("year"), m: get("month"), d: get("day") };
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * ISO con offset de Lima para "hoy + `days`" a la hora indicada.
 * Las semillas del prototipo usan esto para que las ventanas sigan abiertas
 * sin importar cuándo se abra el demo.
 */
export function limaDateFromToday(days: number, hour = 18, minute = 0): string {
  const { y, m, d } = limaToday();
  const base = new Date(Date.UTC(y, m - 1, d + days));
  return `${base.getUTCFullYear()}-${pad(base.getUTCMonth() + 1)}-${pad(
    base.getUTCDate()
  )}T${pad(hour)}:${pad(minute)}:00${LIMA_OFFSET}`;
}

/** "10 nov. 2026, 18:00" */
export function formatLimaDateTime(iso: string): string {
  return new Intl.DateTimeFormat("es-PE", {
    timeZone: LIMA_TZ,
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}

/** "10 nov. 2026" */
export function formatLimaDate(iso: string): string {
  return new Intl.DateTimeFormat("es-PE", {
    timeZone: LIMA_TZ,
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

/** "10 nov., 18:00" — para filas densas donde el año es obvio. */
export function formatLimaShort(iso: string): string {
  return new Intl.DateTimeFormat("es-PE", {
    timeZone: LIMA_TZ,
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}

export function isPast(iso: string, now = Date.now()): boolean {
  return new Date(iso).getTime() <= now;
}

/** Horas restantes hasta `iso` (negativo si ya pasó). */
export function hoursUntil(iso: string, now = Date.now()): number {
  return (new Date(iso).getTime() - now) / 3_600_000;
}

/** "2 d 4 h", "5 h 12 min", "18 min" */
export function formatRemaining(iso: string, now = Date.now()): string {
  const diff = new Date(iso).getTime() - now;
  if (diff <= 0) return "0 min";
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  if (days > 0) return `${days} d ${hours} h`;
  if (hours > 0) return `${hours} h ${minutes} min`;
  return `${minutes} min`;
}
