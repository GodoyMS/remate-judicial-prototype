export type NotificationCategory =
  | "investment"
  | "auction"
  | "payment"
  | "legal"
  | "system"
  | "alert"
  | "premium";

export interface AppNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  description: string;
  timeAgo: string;
  timestamp: number;
  read: boolean;
  href?: string;
  highlight?: string;
}

const now = Date.now();
const hour = 60 * 60 * 1000;
const day = 24 * hour;

export const PREMIUM_NOTIFICATIONS: AppNotification[] = [
  {
    id: "pn1",
    category: "premium",
    title: "Nueva oportunidad Premium — Penthouse Chorrillos",
    description:
      "Invierte el 100% y obtén un ROI del 48% antes de que pase al mercado estándar. Solo quedan 3 días para capturar esta propiedad.",
    timeAgo: "hace 5 min",
    timestamp: now - 5 * 60 * 1000,
    read: false,
    href: "/dashboard/premium-properties/pp-101",
    highlight: "ROI 48%",
  },
  {
    id: "pn2",
    category: "premium",
    title: "Ventana Premium abierta — San Borja",
    description:
      "Departamento Skyline disponible exclusivamente para usuarios Premium. Captura el 100% con retorno del 42%.",
    timeAgo: "hace 1 h",
    timestamp: now - hour,
    read: false,
    href: "/dashboard/premium-properties/pp-104",
    highlight: "7 días restantes",
  },
  {
    id: "pn3",
    category: "premium",
    title: "Propiedad capturada — Villa Asia",
    description:
      "La Villa de Lujo en Asia fue capturada por otro inversor Premium. Explora otras oportunidades disponibles.",
    timeAgo: "hace 2 días",
    timestamp: now - 2 * day,
    read: true,
    href: "/dashboard/premium-properties/pp-102",
    highlight: "Capturada",
  },
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: "n1",
    category: "auction",
    title: "Subasta por cerrar — Dept. San Isidro",
    description:
      "La subasta de Av. Javier Prado Este 1240 cierra en 8 horas. Tu posición actual es #3 entre 23 inversionistas.",
    timeAgo: "hace 12 min",
    timestamp: now - 12 * 60 * 1000,
    read: false,
    href: "/dashboard/properties/1",
    highlight: "8h restantes",
  },
  {
    id: "n2",
    category: "payment",
    title: "Depósito acreditado exitosamente",
    description:
      "Tu transferencia de S/ 3,500 fue confirmada y asignada a Casa Los Olivos. Recibirás actualizaciones del proceso legal.",
    timeAgo: "hace 45 min",
    timestamp: now - 45 * 60 * 1000,
    read: false,
    href: "/dashboard/my-investments",
    highlight: "S/ 3,500",
  },
  {
    id: "n3",
    category: "investment",
    title: "Nueva oportunidad en tu zona",
    description:
      "Se publicó un departamento en Miraflores con ROI estimado del 24% y entrada desde S/ 500. Alta demanda detectada.",
    timeAgo: "hace 2 h",
    timestamp: now - 2 * hour,
    read: false,
    href: "/dashboard/properties",
    highlight: "ROI 24%",
  },
  {
    id: "n4",
    category: "legal",
    title: "Actualización del expediente judicial",
    description:
      "El juzgado 12° Civil de Lima aprobó la segunda instancia para tu inversión en La Molina. Siguiente paso: remate programado.",
    timeAgo: "hace 5 h",
    timestamp: now - 5 * hour,
    read: false,
    href: "/dashboard/my-investments",
  },
  {
    id: "n5",
    category: "alert",
    title: "Precio base actualizado",
    description:
      "El precio base de Local Comercial Barranco bajó un 8%. Revisa si conviene aumentar tu participación antes del cierre.",
    timeAgo: "ayer",
    timestamp: now - day,
    read: true,
    href: "/dashboard/properties",
    highlight: "-8%",
  },
  {
    id: "n6",
    category: "system",
    title: "Verificación KYC completada",
    description:
      "Tu identidad fue verificada correctamente. Ya puedes invertir sin límites y retirar fondos a tu cuenta bancaria vinculada.",
    timeAgo: "ayer",
    timestamp: now - day - 2 * hour,
    read: true,
    href: "/dashboard/account",
  },
  {
    id: "n7",
    category: "investment",
    title: "Retorno acreditado en tu wallet",
    description:
      "Se acreditó S/ 847 de retorno por la subasta finalizada en Surco. El monto ya está disponible para reinvertir.",
    timeAgo: "hace 2 días",
    timestamp: now - 2 * day,
    read: true,
    href: "/dashboard/my-investments",
    highlight: "S/ 847",
  },
  {
    id: "n8",
    category: "auction",
    title: "Ganaste la subasta — Casa Los Olivos",
    description:
      "Felicitaciones. Tu oferta fue la ganadora. Revisa los próximos pasos legales y el calendario de escrituración.",
    timeAgo: "hace 3 días",
    timestamp: now - 3 * day,
    read: true,
    href: "/dashboard/my-investments",
  },
  {
    id: "n9",
    category: "payment",
    title: "Comprobante pendiente de revisión",
    description:
      "Subiste un voucher Yape por S/ 1,200. Nuestro equipo lo está validando; te avisaremos en menos de 24 horas.",
    timeAgo: "hace 4 días",
    timestamp: now - 4 * day,
    read: true,
    href: "/dashboard/invest",
  },
  {
    id: "n10",
    category: "system",
    title: "Nueva función: alertas de precio",
    description:
      "Activa alertas personalizadas desde Mi cuenta → Notificaciones y no te pierdas cambios en propiedades de interés.",
    timeAgo: "hace 1 semana",
    timestamp: now - 7 * day,
    read: true,
    href: "/dashboard/account?section=notifications",
  },
  // Cobertura de eventos (WP-5.3, cierra E-044): antes casi todas las
  // notificaciones eran de oportunidad y ganancia. Estas cubren el resto
  // del ciclo de vida de una inversión, incluyendo escenarios adversos.
  {
    id: "n11",
    category: "alert",
    title: "Estimación de ROI actualizada — Casa en La Molina",
    description:
      "El retorno estimado pasó de 18% a 16% tras una revisión del expediente. Consulta el detalle en tu inversión.",
    timeAgo: "hace 6 días",
    timestamp: now - 6 * day,
    read: true,
    href: "/dashboard/my-investments",
    highlight: "18% → 16%",
  },
  {
    id: "n12",
    category: "alert",
    title: "Plazo extendido — Oficina en San Borja",
    description:
      "El proceso judicial demoró más de lo previsto. La nueva fecha estimada de retorno es en 4 meses.",
    timeAgo: "hace 1 semana",
    timestamp: now - 7 * day - 2 * hour,
    read: true,
    href: "/dashboard/my-investments",
  },
  {
    id: "n13",
    category: "auction",
    title: "Subasta suspendida — Local Comercial Barranco",
    description:
      "El juzgado suspendió temporalmente la subasta por un incidente procesal. Te avisaremos cuando se reprograme.",
    timeAgo: "hace 9 días",
    timestamp: now - 9 * day,
    read: true,
    href: "/dashboard/properties",
  },
  {
    id: "n14",
    category: "payment",
    title: "Devolución de capital procesada",
    description:
      "Se acreditó la devolución de capital de tu inversión en Departamento en Barranco. Revisa el detalle en Retornos.",
    timeAgo: "hace 10 días",
    timestamp: now - 10 * day,
    read: true,
    href: "/dashboard/retornos",
  },
  {
    id: "n15",
    category: "legal",
    title: "Documento requerido para tu verificación",
    description:
      "Necesitamos una copia adicional de tu DNI por el reverso. Súbela desde Mi cuenta para no interrumpir tus inversiones.",
    timeAgo: "hace 11 días",
    timestamp: now - 11 * day,
    read: true,
    href: "/dashboard/account?section=security",
  },
  {
    id: "n16",
    category: "legal",
    title: "Cambio de estado legal — Departamento en San Isidro",
    description:
      "El expediente pasó de \"Subasta convocada\" a \"Adjudicación, pendiente de formalizar\".",
    timeAgo: "hace 12 días",
    timestamp: now - 12 * day,
    read: true,
    href: "/dashboard/properties/1",
  },
  {
    id: "n17",
    category: "payment",
    title: "Reembolso procesado",
    description:
      "Tu reembolso por un error de pago fue acreditado a tu método de origen. Revisa el detalle en Retornos.",
    timeAgo: "hace 13 días",
    timestamp: now - 13 * day,
    read: true,
    href: "/dashboard/retornos",
  },
];

export const CATEGORY_META: Record<
  NotificationCategory,
  { label: string; iconName: string; color: string; bg: string }
> = {
  investment: {
    label: "Inversión",
    iconName: "TrendingUp",
    color: "text-success",
    bg: "bg-success/10 border-success/20",
  },
  auction: {
    label: "Subasta",
    iconName: "Gavel",
    color: "text-accent-foreground",
    bg: "bg-accent border-accent",
  },
  payment: {
    label: "Pago",
    iconName: "Wallet",
    color: "text-info",
    bg: "bg-info/10 border-info/20",
  },
  legal: {
    label: "Legal",
    iconName: "Scale",
    color: "text-warning",
    bg: "bg-warning/10 border-warning/20",
  },
  system: {
    label: "Sistema",
    iconName: "Sparkles",
    color: "text-muted-foreground",
    bg: "bg-muted border-border",
  },
  alert: {
    label: "Alerta",
    iconName: "Zap",
    color: "text-warning",
    bg: "bg-warning/10 border-warning/20",
  },
  premium: {
    label: "Premium",
    iconName: "Crown",
    color: "text-premium",
    bg: "bg-premium/10 border-premium/20",
  },
};

export function formatNotificationDate(timestamp: number): string {
  const diff = now - timestamp;
  if (diff < day) return "Hoy";
  if (diff < 2 * day) return "Ayer";
  if (diff < 7 * day) return "Esta semana";
  return "Anteriores";
}
