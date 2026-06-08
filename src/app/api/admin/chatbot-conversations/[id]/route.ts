import { NextResponse } from "next/server";
import {
  getConversationById,
  markConversationRead,
} from "@/lib/chatbot-conversations/store";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const conversation = getConversationById(id);

  if (!conversation) {
    return NextResponse.json(
      { error: "Conversación no encontrada" },
      { status: 404 }
    );
  }

  return NextResponse.json({ conversation });
}

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const conversation = getConversationById(id);

  if (!conversation) {
    return NextResponse.json(
      { error: "Conversación no encontrada" },
      { status: 404 }
    );
  }

  markConversationRead(id);
  const updated = getConversationById(id);
  return NextResponse.json({ conversation: updated });
}
