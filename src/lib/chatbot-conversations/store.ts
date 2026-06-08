import type {
  ChatbotConversation,
  ChatbotMessage,
} from "@/lib/admin/types";
import { inferTopicsFromMessages } from "./topics";

function msg(
  id: string,
  role: ChatbotMessage["role"],
  content: string,
  createdAt: string,
  extra?: Partial<ChatbotMessage>
): ChatbotMessage {
  return { id, role, content, createdAt, ...extra };
}

const initialConversations: ChatbotConversation[] = [
  {
    id: "chat-001",
    sessionId: "sess-demo-001",
    userName: "María Fernanda López",
    userEmail: "mfernanda.lopez@gmail.com",
    startedAt: "2026-06-08T09:12:00",
    lastMessageAt: "2026-06-08T09:18:00",
    status: "completed",
    source: "landing",
    topics: ["Inversiones", "Riesgos", "Proceso"],
    messages: [
      msg(
        "m1",
        "assistant",
        "¡Hola! Soy **Remata AI**, tu asistente sobre inversiones en remates judiciales.\n\nAntes de empezar, ¿cómo te llamas?",
        "2026-06-08T09:12:00",
        { isOnboarding: true }
      ),
      msg("m2", "user", "María Fernanda López", "2026-06-08T09:12:30", {
        isOnboarding: true,
      }),
      msg(
        "m3",
        "assistant",
        "¡Encantado, **María Fernanda López**! ¿Cuál es tu correo electrónico?",
        "2026-06-08T09:12:31",
        { isOnboarding: true }
      ),
      msg("m4", "user", "mfernanda.lopez@gmail.com", "2026-06-08T09:13:00", {
        isOnboarding: true,
      }),
      msg(
        "m5",
        "assistant",
        "¡Perfecto! Ya puedo ayudarte con todo sobre Remata.",
        "2026-06-08T09:13:01",
        { isOnboarding: true }
      ),
      msg(
        "m6",
        "user",
        "¿Cuál es el retorno promedio de las inversiones en remates?",
        "2026-06-08T09:14:00"
      ),
      msg(
        "m7",
        "assistant",
        "En Remata, los retornos históricos promedian entre **12% y 18% anual**, según el tipo de inmueble y el ciclo del remate. Cada propiedad muestra su ROI estimado antes de invertir. ¿Te gustaría saber cómo se calcula?",
        "2026-06-08T09:14:05"
      ),
      msg(
        "m8",
        "user",
        "¿Es seguro invertir? Me da miedo que sea estafa",
        "2026-06-08T09:16:00"
      ),
      msg(
        "m9",
        "assistant",
        "Es una pregunta muy válida. Remata opera bajo supervisión de la **SBS** y todos los remates son judiciales con respaldo legal. Puedes verificar cada propiedad en SUNARP. La inversión conlleva riesgo, pero no es una estafa — somos una plataforma regulada.",
        "2026-06-08T09:16:08"
      ),
      msg(
        "m10",
        "user",
        "¿Cuánto es el mínimo para empezar?",
        "2026-06-08T09:18:00"
      ),
      msg(
        "m11",
        "assistant",
        "Puedes invertir desde **S/ 500** en la mayoría de propiedades. Algunos proyectos premium tienen mínimos de S/ 1,000. Revisa el detalle de cada inmueble en la sección de propiedades.",
        "2026-06-08T09:18:00"
      ),
    ],
  },
  {
    id: "chat-002",
    sessionId: "sess-demo-002",
    userName: "Diego Ramírez",
    userEmail: "diego.ramirez@outlook.com",
    startedAt: "2026-06-07T16:45:00",
    lastMessageAt: "2026-06-07T16:52:00",
    status: "completed",
    source: "landing",
    topics: ["KYC", "Regulación"],
    messages: [
      msg(
        "m1",
        "assistant",
        "¡Hola! Soy **Remata AI**...",
        "2026-06-07T16:45:00",
        { isOnboarding: true }
      ),
      msg("m2", "user", "Diego Ramírez", "2026-06-07T16:45:20", {
        isOnboarding: true,
      }),
      msg("m3", "user", "diego.ramirez@outlook.com", "2026-06-07T16:46:00", {
        isOnboarding: true,
      }),
      msg(
        "m4",
        "user",
        "¿Qué documentos necesito para verificar mi identidad?",
        "2026-06-07T16:47:00"
      ),
      msg(
        "m5",
        "assistant",
        "Para el proceso **KYC** necesitas: DNI vigente (frente y reverso), una selfie sosteniendo tu documento, y completar tus datos personales. El proceso toma entre 24 y 48 horas hábiles.",
        "2026-06-07T16:47:06"
      ),
      msg(
        "m6",
        "user",
        "Mi DNI está vencido, ¿puedo usar pasaporte?",
        "2026-06-07T16:49:00"
      ),
      msg(
        "m7",
        "assistant",
        "Sí, aceptamos **pasaporte** o **carné de extranjería** como alternativa al DNI. Solo asegúrate de que el documento esté vigente y las fotos sean nítidas.",
        "2026-06-07T16:49:05"
      ),
      msg(
        "m8",
        "user",
        "¿Remata está regulado por alguna entidad?",
        "2026-06-07T16:52:00"
      ),
      msg(
        "m9",
        "assistant",
        "Sí. Operamos bajo el marco regulatorio de la **Superintendencia de Banca, Seguros y AFP (SBS)** y cumplimos normativas de prevención de lavado de activos.",
        "2026-06-07T16:52:00"
      ),
    ],
  },
  {
    id: "chat-003",
    sessionId: "sess-demo-003",
    userName: "Lucía Vargas",
    userEmail: "lucia.vargas@yahoo.com",
    startedAt: "2026-06-07T11:20:00",
    lastMessageAt: "2026-06-07T11:28:00",
    status: "completed",
    source: "landing",
    topics: ["Pagos", "Proceso"],
    messages: [
      msg("m1", "assistant", "¡Hola! Soy **Remata AI**...", "2026-06-07T11:20:00", {
        isOnboarding: true,
      }),
      msg("m2", "user", "Lucía Vargas", "2026-06-07T11:20:30", {
        isOnboarding: true,
      }),
      msg("m3", "user", "lucia.vargas@yahoo.com", "2026-06-07T11:21:00", {
        isOnboarding: true,
      }),
      msg(
        "m4",
        "user",
        "¿Puedo pagar con Yape o solo transferencia bancaria?",
        "2026-06-07T11:22:00"
      ),
      msg(
        "m5",
        "assistant",
        "Aceptamos **Yape**, transferencia bancaria, tarjeta de crédito/débito y depósito en ventanilla. Yape es el método más rápido — la confirmación suele ser en minutos.",
        "2026-06-07T11:22:05"
      ),
      msg(
        "m6",
        "user",
        "¿Cuánto demora confirmar una inversión por transferencia?",
        "2026-06-07T11:25:00"
      ),
      msg(
        "m7",
        "assistant",
        "Las transferencias se confirman en **1 a 3 días hábiles** después de validar el voucher. Te notificamos por correo y en la app cuando esté confirmada.",
        "2026-06-07T11:25:06"
      ),
      msg(
        "m8",
        "user",
        "¿Qué pasa si subo mal el comprobante?",
        "2026-06-07T11:28:00"
      ),
      msg(
        "m9",
        "assistant",
        "Puedes volver a subir el comprobante desde tu panel de inversiones. Si hay un problema, nuestro equipo te contactará por correo en 24 horas.",
        "2026-06-07T11:28:00"
      ),
    ],
  },
  {
    id: "chat-004",
    sessionId: "sess-demo-004",
    userName: "Andrés Castillo",
    userEmail: "andres.castillo@empresa.pe",
    startedAt: "2026-06-06T14:00:00",
    lastMessageAt: "2026-06-06T14:08:00",
    status: "completed",
    source: "landing",
    topics: ["Propiedades", "Inversiones"],
    messages: [
      msg("m1", "assistant", "¡Hola! Soy **Remata AI**...", "2026-06-06T14:00:00", {
        isOnboarding: true,
      }),
      msg("m2", "user", "Andrés Castillo", "2026-06-06T14:00:30", {
        isOnboarding: true,
      }),
      msg("m3", "user", "andres.castillo@empresa.pe", "2026-06-06T14:01:00", {
        isOnboarding: true,
      }),
      msg(
        "m4",
        "user",
        "¿Tienen propiedades en Miraflores o San Isidro?",
        "2026-06-06T14:02:00"
      ),
      msg(
        "m5",
        "assistant",
        "Sí, actualmente tenemos **3 propiedades en Miraflores** y **2 en San Isidro** con ROI estimado entre 14% y 17%. Puedes filtrar por distrito en la sección de propiedades.",
        "2026-06-06T14:02:06"
      ),
      msg(
        "m6",
        "user",
        "¿Puedo visitar el inmueble antes de invertir?",
        "2026-06-06T14:05:00"
      ),
      msg(
        "m7",
        "assistant",
        "En remates judiciales la visita presencial no siempre es posible por el estado procesal. Sin embargo, publicamos fotos, planos y ubicación exacta. Para dudas específicas, nuestro equipo puede coordinar una visita virtual.",
        "2026-06-06T14:05:08"
      ),
      msg(
        "m8",
        "user",
        "¿Cuántos inversores pueden participar en un mismo remate?",
        "2026-06-06T14:08:00"
      ),
      msg(
        "m9",
        "assistant",
        "Cada propiedad tiene un **monto objetivo** y múltiples inversores pueden participar hasta completarlo. El mínimo por persona varía según la propiedad.",
        "2026-06-06T14:08:00"
      ),
    ],
  },
  {
    id: "chat-005",
    sessionId: "sess-demo-005",
    userName: "Valeria Quispe",
    userEmail: "valeria.q@hotmail.com",
    startedAt: "2026-06-06T09:30:00",
    lastMessageAt: "2026-06-06T09:35:00",
    status: "active",
    source: "landing",
    topics: ["Soporte"],
    messages: [
      msg("m1", "assistant", "¡Hola! Soy **Remata AI**...", "2026-06-06T09:30:00", {
        isOnboarding: true,
      }),
      msg("m2", "user", "Valeria Quispe", "2026-06-06T09:30:30", {
        isOnboarding: true,
      }),
      msg("m3", "user", "valeria.q@hotmail.com", "2026-06-06T09:31:00", {
        isOnboarding: true,
      }),
      msg(
        "m4",
        "user",
        "¿Puedo hablar con un asesor humano?",
        "2026-06-06T09:32:00"
      ),
      msg(
        "m5",
        "assistant",
        "¡Claro! Puedes escribirnos por **WhatsApp al +51 999 888 777** de lunes a viernes, 9am–6pm. También puedes agendar una llamada desde tu panel una vez registrada.",
        "2026-06-06T09:32:05"
      ),
      msg(
        "m6",
        "user",
        "¿Tienen oficina física en Lima?",
        "2026-06-06T09:35:00"
      ),
      msg(
        "m7",
        "assistant",
        "Nuestra oficina está en **Av. Javier Prado Este 4200, San Borja**, piso 8. Atención con cita previa.",
        "2026-06-06T09:35:00"
      ),
    ],
  },
  {
    id: "chat-006",
    sessionId: "sess-demo-006",
    userName: "Ricardo Morales",
    userEmail: "rmorales@gmail.com",
    startedAt: "2026-06-05T18:15:00",
    lastMessageAt: "2026-06-05T18:17:00",
    status: "completed",
    source: "landing",
    topics: [],
    messages: [
      msg("m1", "assistant", "¡Hola! Soy **Remata AI**...", "2026-06-05T18:15:00", {
        isOnboarding: true,
      }),
      msg("m2", "user", "Ricardo Morales", "2026-06-05T18:15:30", {
        isOnboarding: true,
      }),
      msg("m3", "user", "rmorales@gmail.com", "2026-06-05T18:16:00", {
        isOnboarding: true,
      }),
      msg("m4", "user", "¿Quién ganó el partido de ayer?", "2026-06-05T18:17:00"),
      msg(
        "m5",
        "assistant",
        "Solo puedo ayudarte con preguntas sobre **Remata** y nuestras inversiones en remates judiciales.",
        "2026-06-05T18:17:00",
        { offTopic: true }
      ),
    ],
  },
];

let conversations: ChatbotConversation[] = [...initialConversations];

export function getConversations(): ChatbotConversation[] {
  return [...conversations].sort(
    (a, b) =>
      new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
  );
}

export function getConversationById(id: string): ChatbotConversation | undefined {
  return conversations.find((c) => c.id === id);
}

export function getConversationBySessionId(
  sessionId: string
): ChatbotConversation | undefined {
  return conversations.find((c) => c.sessionId === sessionId);
}

export interface SyncConversationInput {
  sessionId: string;
  userName: string;
  userEmail: string;
  messages: Array<{
    id: string;
    role: ChatbotMessage["role"];
    content: string;
    createdAt?: string;
    isOnboarding?: boolean;
    offTopic?: boolean;
  }>;
}

export function syncConversation(input: SyncConversationInput): ChatbotConversation {
  const now = new Date().toISOString();
  const existing = getConversationBySessionId(input.sessionId);

  const normalizedMessages: ChatbotMessage[] = input.messages.map((m) => ({
    id: m.id,
    role: m.role,
    content: m.content,
    createdAt: m.createdAt ?? now,
    isOnboarding: m.isOnboarding,
    offTopic: m.offTopic,
  }));

  const topics = inferTopicsFromMessages(normalizedMessages);
  const lastMessageAt =
    normalizedMessages[normalizedMessages.length - 1]?.createdAt ?? now;

  const userMessageCount = normalizedMessages.filter(
    (m) => m.role === "user" && !m.isOnboarding
  ).length;
  const status: ChatbotConversation["status"] =
    userMessageCount >= 3 ? "completed" : "active";

  if (existing) {
    const updated: ChatbotConversation = {
      ...existing,
      userName: input.userName,
      userEmail: input.userEmail,
      messages: normalizedMessages,
      lastMessageAt,
      topics: topics.length > 0 ? topics : existing.topics,
      status,
    };
    conversations = conversations.map((c) =>
      c.id === existing.id ? updated : c
    );
    return updated;
  }

  const created: ChatbotConversation = {
    id: `chat-${Date.now()}`,
    sessionId: input.sessionId,
    userName: input.userName,
    userEmail: input.userEmail,
    messages: normalizedMessages,
    startedAt: normalizedMessages[0]?.createdAt ?? now,
    lastMessageAt,
    status,
    topics,
    source: "landing",
  };

  conversations = [created, ...conversations];
  return created;
}

export function markConversationRead(id: string): void {
  const conv = getConversationById(id);
  if (!conv || conv.status !== "active") return;
  conversations = conversations.map((c) =>
    c.id === id ? { ...c, status: "completed" } : c
  );
}
