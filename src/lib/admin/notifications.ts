export type AdminNotificationCategory =
  | "identity"
  | "investment"
  | "milestone"
  | "property"
  | "user"
  | "payment"
  | "legal"
  | "alert"
  | "system";

export interface AdminNotification {
  id: string;
  category: AdminNotificationCategory;
  title: string;
  description: string;
  timeAgo: string;
  timestamp: number;
  read: boolean;
  href?: string;
  highlight?: string;
  priority?: "normal" | "high";
}

const now = Date.now();
const hour = 60 * 60 * 1000;
const day = 24 * hour;

export const INITIAL_ADMIN_NOTIFICATIONS: AdminNotification[] = [
  {
    id: "a1",
    category: "identity",
    title: "Nueva solicitud de identidad",
    description:
      "Pedro Herrera López envió su verificación KYC (DNI). Documentos en cola de revisión del equipo de cumplimiento.",
    timeAgo: "hace 8 min",
    timestamp: now - 8 * 60 * 1000,
    read: false,
    href: "/admin/users",
    highlight: "Pendiente",
    priority: "high",
  },
  {
    id: "a2",
    category: "investment",
    title: "Nuevas inversiones — Dept. San Isidro",
    description:
      "3 inversionistas aportaron S/ 15,400 en las últimas 2 horas. El proyecto alcanzó el 69.6% de su meta de financiamiento.",
    timeAgo: "hace 22 min",
    timestamp: now - 22 * 60 * 1000,
    read: false,
    href: "/admin/properties/1",
    highlight: "S/ 15,400",
    priority: "high",
  },
  {
    id: "a3",
    category: "milestone",
    title: "Meta alcanzada — Oficina San Borja",
    description:
      "La propiedad en Av. Angamos Oeste alcanzó el 100% de financiamiento con 19 inversionistas. Lista para iniciar proceso de remate.",
    timeAgo: "hace 1 h",
    timestamp: now - hour,
    read: false,
    href: "/admin/properties/4",
    highlight: "100%",
    priority: "high",
  },
  {
    id: "a4",
    category: "identity",
    title: "Nueva solicitud de identidad",
    description:
      "Jorge Villanueva Paz (Carnet de Extranjería) completó su registro y espera validación. Tiempo en cola: 4 horas.",
    timeAgo: "hace 1 h",
    timestamp: now - hour - 15 * 60 * 1000,
    read: false,
    href: "/admin/users",
    highlight: "CE",
  },
  {
    id: "a5",
    category: "payment",
    title: "Comprobante pendiente de validación",
    description:
      "Carlos Mendoza subió un voucher por S/ 8,200 para Casa La Molina. Requiere confirmación manual antes de acreditar la inversión.",
    timeAgo: "hace 2 h",
    timestamp: now - 2 * hour,
    read: false,
    href: "/admin/users",
    highlight: "S/ 8,200",
  },
  {
    id: "a6",
    category: "investment",
    title: "Nuevas inversiones — Casa La Molina",
    description:
      "María Elena Vargas invirtió S/ 10,000. Es la inversión individual más alta del día en esta propiedad.",
    timeAgo: "hace 3 h",
    timestamp: now - 3 * hour,
    read: false,
    href: "/admin/properties/2",
    highlight: "S/ 10,000",
  },
  {
    id: "a7",
    category: "user",
    title: "5 nuevos registros hoy",
    description:
      "Se registraron 5 usuarios en las últimas 24 horas. 2 ya completaron perfil y 1 inició verificación de identidad.",
    timeAgo: "hace 5 h",
    timestamp: now - 5 * hour,
    read: false,
    href: "/admin/users",
    highlight: "+5",
  },
  {
    id: "a8",
    category: "alert",
    title: "Propiedad sin actividad — Penthouse Miraflores",
    description:
      "El borrador lleva 7 días sin publicarse y solo tiene 12.5% de avance. Considera revisar precio base o activar notificaciones.",
    timeAgo: "hace 6 h",
    timestamp: now - 6 * hour,
    read: false,
    href: "/admin/properties/3",
    highlight: "Borrador",
    priority: "high",
  },
  {
    id: "a9",
    category: "legal",
    title: "Expediente judicial actualizado — Barranco",
    description:
      "El juzgado 8° Civil fijó fecha de remate para el 15 de junio. Actualiza el calendario y notifica a los 31 inversionistas.",
    timeAgo: "ayer",
    timestamp: now - day,
    read: true,
    href: "/admin/properties/5",
    highlight: "15 jun",
  },
  {
    id: "a10",
    category: "user",
    title: "Usuario suspendido — Roberto Silva",
    description:
      "Se bloqueó el acceso por actividad sospechosa detectada automáticamente. Revisa el historial antes de reactivar.",
    timeAgo: "ayer",
    timestamp: now - day - 3 * hour,
    read: true,
    href: "/admin/users",
  },
  {
    id: "a11",
    category: "property",
    title: "Propiedad publicada — Casa Surco",
    description:
      "Casa en Santiago de Surco pasó de borrador a publicada. ROI estimado 19% con entrada desde S/ 500.",
    timeAgo: "hace 2 días",
    timestamp: now - 2 * day,
    read: true,
    href: "/admin/properties/6",
    highlight: "Publicada",
  },
  {
    id: "a12",
    category: "identity",
    title: "Verificación reenviada — Camila Ríos",
    description:
      "La usuaria corrigió las fotos del DNI tras la resolicitud. Documentos listos para segunda revisión.",
    timeAgo: "hace 2 días",
    timestamp: now - 2 * day - 4 * hour,
    read: true,
    href: "/admin/users",
  },
  {
    id: "a13",
    category: "milestone",
    title: "75% alcanzado — Dept. San Isidro",
    description:
      "Faltan S/ 86,500 para cerrar la ronda. 23 inversionistas activos; ritmo de captación por encima del promedio.",
    timeAgo: "hace 3 días",
    timestamp: now - 3 * day,
    read: true,
    href: "/admin/properties/1",
    highlight: "75%",
  },
  {
    id: "a14",
    category: "system",
    title: "Resumen diario del backoffice",
    description:
      "Ayer: 1,247 usuarios activos, S/ 2.8M invertidos, 4 propiedades activas y S/ 42,800 en ingresos de comisión.",
    timeAgo: "hace 4 días",
    timestamp: now - 4 * day,
    read: true,
    href: "/admin",
  },
];

export const ADMIN_CATEGORY_META: Record<
  AdminNotificationCategory,
  { label: string; iconName: string; color: string; bg: string }
> = {
  identity: {
    label: "Identidad",
    iconName: "UserCheck",
    color: "text-chart-1",
    bg: "bg-chart-1/10 border-chart-1/20",
  },
  investment: {
    label: "Inversión",
    iconName: "TrendingUp",
    color: "text-success",
    bg: "bg-success/10 border-success/20",
  },
  milestone: {
    label: "Meta",
    iconName: "Target",
    color: "text-success",
    bg: "bg-success/10 border-success/20",
  },
  property: {
    label: "Propiedad",
    iconName: "Building2",
    color: "text-chart-2",
    bg: "bg-chart-2/10 border-chart-2/20",
  },
  user: {
    label: "Usuarios",
    iconName: "Users",
    color: "text-chart-3",
    bg: "bg-chart-3/10 border-chart-3/20",
  },
  payment: {
    label: "Pagos",
    iconName: "Wallet",
    color: "text-warning",
    bg: "bg-warning/10 border-warning/20",
  },
  legal: {
    label: "Legal",
    iconName: "Scale",
    color: "text-destructive",
    bg: "bg-destructive/10 border-destructive/20",
  },
  alert: {
    label: "Alerta",
    iconName: "Zap",
    color: "text-warning",
    bg: "bg-warning/10 border-warning/20",
  },
  system: {
    label: "Sistema",
    iconName: "Sparkles",
    color: "text-muted-foreground",
    bg: "bg-muted border-border",
  },
};

export function formatAdminNotificationDate(timestamp: number): string {
  const diff = now - timestamp;
  if (diff < day) return "Hoy";
  if (diff < 2 * day) return "Ayer";
  if (diff < 7 * day) return "Esta semana";
  return "Anteriores";
}
