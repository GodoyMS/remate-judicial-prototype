import { NextResponse } from "next/server";
import { resolveChatProviderConfig } from "@/lib/chat/config";
import { buildChatSystemPrompt } from "@/lib/chat/prompt";

export const runtime = "nodejs";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequestBody {
  messages?: ChatMessage[];
}

const OFF_TOPIC_KEYWORDS = [
  "programar",
  "código",
  "python",
  "javascript",
  "receta",
  "fútbol",
  "partido",
  "clima",
  "tiempo en",
  "quien es",
  "presidente de",
];

function isLikelyOffTopic(message: string): boolean {
  const normalized = message.toLowerCase().trim();
  if (normalized.length < 3) return true;

  const remataKeywords = [
    "remata",
    "invers",
    "remate",
    "subasta",
    "propiedad",
    "kyc",
    "registr",
    "retorno",
    "roi",
    "judicial",
    "invertir",
    "cuenta",
    "pago",
    "yape",
    "transfer",
    "legal",
    "regul",
    "sbs",
    "sunarp",
    "dni",
    "soles",
    "dólar",
    "dolar",
    "whatsapp",
    "soporte",
    "departamento",
    "casa",
    "penthouse",
    "miraflores",
    "san isidro",
    "legítim",
    "legitim",
    "estafa",
    "confianza",
    "seguro",
    "riesgo",
    "comisión",
    "tarifa",
  ];

  if (remataKeywords.some((kw) => normalized.includes(kw))) return false;
  if (OFF_TOPIC_KEYWORDS.some((kw) => normalized.includes(kw))) return true;

  return false;
}

export async function POST(request: Request) {
  try {
    const config = resolveChatProviderConfig();

    if (!config) {
      return NextResponse.json(
        {
          error:
            "Chatbot no configurado. Define CHATBOT_API_KEY (o OPENAI_API_KEY / DEEPSEEK_API_KEY) y opcionalmente CHATBOT_PROVIDER.",
        },
        { status: 503 }
      );
    }

    const body = (await request.json()) as ChatRequestBody;
    const messages = body.messages ?? [];

    if (messages.length === 0) {
      return NextResponse.json(
        { error: "Se requiere al menos un mensaje." },
        { status: 400 }
      );
    }

    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");

    if (!lastUserMessage?.content?.trim()) {
      return NextResponse.json(
        { error: "El mensaje del usuario no puede estar vacío." },
        { status: 400 }
      );
    }

    if (isLikelyOffTopic(lastUserMessage.content)) {
      return NextResponse.json({
        message:
          "Solo puedo ayudarte con preguntas sobre **Remata** y nuestras inversiones en remates judiciales. ¿Tienes alguna duda sobre la plataforma, cómo invertir, regulación o nuestras propiedades?",
        offTopic: true,
      });
    }

    const systemPrompt = buildChatSystemPrompt();

    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        ],
        temperature: 0.4,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Chat API error:", response.status, errorText);
      return NextResponse.json(
        {
          error:
            "No pudimos procesar tu consulta en este momento. Intenta de nuevo o contáctanos por WhatsApp.",
        },
        { status: 502 }
      );
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const assistantMessage =
      data.choices?.[0]?.message?.content?.trim() ??
      "No pude generar una respuesta. Por favor intenta de nuevo.";

    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    console.error("Chat route error:", error);
    return NextResponse.json(
      {
        error:
          "Error interno del asistente. Por favor intenta más tarde o escríbenos por WhatsApp.",
      },
      { status: 500 }
    );
  }
}
