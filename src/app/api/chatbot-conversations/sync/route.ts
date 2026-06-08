import { NextResponse } from "next/server";
import { syncConversation } from "@/lib/chatbot-conversations/store";

export const runtime = "nodejs";

interface SyncBody {
  sessionId?: string;
  userName?: string;
  userEmail?: string;
  messages?: Array<{
    id: string;
    role: "user" | "assistant";
    content: string;
    createdAt?: string;
    isOnboarding?: boolean;
    offTopic?: boolean;
  }>;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SyncBody;

    if (!body.sessionId?.trim()) {
      return NextResponse.json(
        { error: "sessionId es requerido" },
        { status: 400 }
      );
    }

    if (!body.userName?.trim() || !body.userEmail?.trim()) {
      return NextResponse.json(
        { error: "Nombre y correo son requeridos" },
        { status: 400 }
      );
    }

    if (!body.messages?.length) {
      return NextResponse.json(
        { error: "Se requiere al menos un mensaje" },
        { status: 400 }
      );
    }

    const conversation = syncConversation({
      sessionId: body.sessionId.trim(),
      userName: body.userName.trim(),
      userEmail: body.userEmail.trim(),
      messages: body.messages,
    });

    return NextResponse.json({ conversation });
  } catch (error) {
    console.error("Chatbot sync error:", error);
    return NextResponse.json(
      { error: "Error al sincronizar conversación" },
      { status: 500 }
    );
  }
}
