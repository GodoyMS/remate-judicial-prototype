import { NextResponse } from "next/server";
import { getConversations } from "@/lib/chatbot-conversations/store";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.toLowerCase().trim() ?? "";

  let items = getConversations();

  if (q) {
    items = items.filter(
      (c) =>
        c.userName.toLowerCase().includes(q) ||
        c.userEmail.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.topics.some((t) => t.toLowerCase().includes(q)) ||
        c.messages.some((m) => m.content.toLowerCase().includes(q))
    );
  }

  return NextResponse.json({ conversations: items });
}
