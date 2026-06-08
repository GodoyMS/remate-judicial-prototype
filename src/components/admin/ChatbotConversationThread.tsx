"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Bot, Sparkles, User, AlertCircle } from "lucide-react";
import type { ChatbotConversation } from "@/lib/admin/types";
import { formatDateTime } from "@/lib/admin/formatters";
import { parseMessageContent } from "@/lib/chat/message-format";
import { cn } from "@/lib/utils";

function formatMessageContent(content: string) {
  const nodes = parseMessageContent(content);
  return nodes.map((node, i) => {
    switch (node.type) {
      case "bold":
        return (
          <strong key={i} className="font-semibold">
            {node.value}
          </strong>
        );
      case "link":
        return (
          <a
            key={i}
            href={node.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[#163300] underline decoration-[#9FE870]/60 underline-offset-2 hover:text-[#163300]/80"
          >
            {node.label}
          </a>
        );
      case "break":
        return <br key={i} />;
      default:
        return <span key={i}>{node.value}</span>;
    }
  });
}

interface ChatbotConversationThreadProps {
  conversation: ChatbotConversation;
  className?: string;
}

export function ChatbotConversationThread({
  conversation,
  className,
}: ChatbotConversationThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [conversation.id, conversation.messages.length]);

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          {conversation.messages.map((message, index) => {
            const isUser = message.role === "user";
            const showDateDivider =
              index === 0 ||
              new Date(message.createdAt).toDateString() !==
                new Date(
                  conversation.messages[index - 1].createdAt
                ).toDateString();

            return (
              <div key={message.id}>
                {showDateDivider && (
                  <div className="my-4 flex items-center gap-3">
                    <div className="h-px flex-1 bg-border/60" />
                    <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      {formatDateTime(message.createdAt).split(",")[0]}
                    </span>
                    <div className="h-px flex-1 bg-border/60" />
                  </div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.02, 0.3) }}
                  className={cn(
                    "flex gap-2.5",
                    isUser ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full",
                      isUser
                        ? "bg-muted ring-2 ring-border/40"
                        : "bg-[#163300] ring-2 ring-[#9FE870]/25"
                    )}
                  >
                    {isUser ? (
                      <User className="size-3.5 text-muted-foreground" />
                    ) : (
                      <Sparkles className="size-3.5 text-[#9FE870]" />
                    )}
                  </div>

                  <div
                    className={cn(
                      "flex max-w-[82%] flex-col gap-1",
                      isUser ? "items-end" : "items-start"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-medium text-muted-foreground">
                        {isUser ? conversation.userName : "Remata AI"}
                      </span>
                      {message.isOnboarding && (
                        <span className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[9px] font-semibold text-blue-600">
                          Onboarding
                        </span>
                      )}
                      {message.offTopic && (
                        <span className="flex items-center gap-0.5 rounded-md bg-amber-50 px-1.5 py-0.5 text-[9px] font-semibold text-amber-600">
                          <AlertCircle className="size-2.5" />
                          Off-topic
                        </span>
                      )}
                    </div>

                    <div
                      className={cn(
                        "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                        isUser
                          ? "rounded-tr-md bg-[#163300] text-white"
                          : "rounded-tl-md border border-border/50 bg-[#F5F9F2] text-foreground"
                      )}
                    >
                      {formatMessageContent(message.content)}
                    </div>

                    <span className="text-[10px] text-muted-foreground/70">
                      {new Intl.DateTimeFormat("es-PE", {
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(new Date(message.createdAt))}
                    </span>
                  </div>
                </motion.div>
              </div>
            );
          })}
          <div ref={bottomRef} aria-hidden />
        </div>
      </div>

      <div className="shrink-0 border-t border-border/60 bg-muted/20 px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-2xl items-center gap-2 text-[11px] text-muted-foreground">
          <Bot className="size-3.5 shrink-0 text-[#163300]" />
          <span>
            {conversation.messages.filter((m) => m.role === "user").length} mensajes
            del usuario · {conversation.messages.length} mensajes en total
          </span>
        </div>
      </div>
    </div>
  );
}
