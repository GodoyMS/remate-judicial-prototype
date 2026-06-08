"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  MessageCircle,
  Send,
  Sparkles,
  X,
  Minus,
  Maximize2,
  Loader2,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  isValidEmail,
  isValidName,
  parseMessageContent,
} from "@/lib/chat/message-format";
import { SUGGESTED_QUESTIONS } from "@/lib/chat/platform-context";
import { getOrCreateChatSessionId } from "@/lib/chatbot-conversations/session";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  isOnboarding?: boolean;
  offTopic?: boolean;
}

type OnboardingStep = "name" | "email" | "complete";

interface UserProfile {
  name: string;
  email: string;
}

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "¡Hola! Soy **Remata AI**, tu asistente sobre inversiones en remates judiciales.\n\nAntes de empezar, ¿cómo te llamas?",
  createdAt: new Date().toISOString(),
  isOnboarding: true,
};

function formatMessageContent(content: string) {
  const nodes = parseMessageContent(content);

  return nodes.map((node, i) => {
    switch (node.type) {
      case "bold":
        return (
          <strong key={i} className="font-semibold text-foreground">
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

function TypingIndicator() {
  return (
    <div className="flex items-start gap-2.5">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#163300] ring-2 ring-[#9FE870]/30">
        <Bot className="size-4 text-[#9FE870]" />
      </div>
      <div className="rounded-2xl rounded-tl-md border border-border/60 bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="size-2 rounded-full bg-[#163300]/40"
              animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function QuickReplyChips({
  questions,
  onSelect,
  disabled,
}: {
  questions: readonly string[];
  onSelect: (question: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-wrap justify-end gap-2">
      {questions.map((question) => (
        <button
          key={question}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(question)}
          className="max-w-[90%] rounded-2xl rounded-tr-md border border-[#163300]/15 bg-white px-3 py-2 text-left text-xs font-medium text-[#163300] shadow-sm transition-all hover:border-[#9FE870]/50 hover:bg-[#9FE870]/10 active:scale-[0.98] disabled:opacity-50"
        >
          {question}
        </button>
      ))}
    </div>
  );
}

export function PlatformChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>("name");
  const userProfileRef = useRef<UserProfile | null>(null);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const sessionIdRef = useRef<string>("");
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    sessionIdRef.current = getOrCreateChatSessionId();
  }, []);

  const updateUserProfile = useCallback((profile: UserProfile) => {
    userProfileRef.current = profile;
  }, []);

  const syncConversation = useCallback(
    (nextMessages: ChatMessage[]) => {
      const profile = userProfileRef.current;
      if (!profile?.name || !profile?.email || !sessionIdRef.current) return;

      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
      syncTimeoutRef.current = setTimeout(() => {
        fetch("/api/chatbot-conversations/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: sessionIdRef.current,
            userName: profile.name,
            userEmail: profile.email,
            messages: nextMessages.map((m) => ({
              id: m.id,
              role: m.role,
              content: m.content,
              createdAt: m.createdAt,
              isOnboarding: m.isOnboarding,
              offTopic: m.offTopic,
            })),
          }),
        }).catch(() => {});
      }, 600);
    },
    []
  );

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, showQuickReplies, scrollToBottom]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setHasUnread(false);
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const appendAssistantMessage = useCallback(
    (content: string, extra?: Partial<ChatMessage>) => {
      setMessages((prev) => {
        const next = [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            role: "assistant" as const,
            content,
            createdAt: new Date().toISOString(),
            ...extra,
          },
        ];
        syncConversation(next);
        return next;
      });
    },
    [syncConversation]
  );

  const handleOnboarding = useCallback(
    (text: string): boolean => {
      if (onboardingStep === "name") {
        if (!isValidName(text)) {
        appendAssistantMessage(
          "Por favor, escribe tu nombre (mínimo 2 caracteres) para continuar.",
          { isOnboarding: true }
        );
          return true;
        }

        const name = text.trim();
        updateUserProfile({ name, email: "" });
        setOnboardingStep("email");
        appendAssistantMessage(
          `¡Encantado, **${name}**! ¿Cuál es tu correo electrónico?`,
          { isOnboarding: true }
        );
        return true;
      }

      if (onboardingStep === "email") {
        if (!isValidEmail(text)) {
          appendAssistantMessage(
            "Ese correo no parece válido. Escríbelo en formato ejemplo@correo.com",
            { isOnboarding: true }
          );
          return true;
        }

        const email = text.trim();
        const name = userProfileRef.current?.name ?? "";
        updateUserProfile({ name, email });
        setOnboardingStep("complete");
        appendAssistantMessage(
          `¡Perfecto! Ya puedo ayudarte con todo sobre Remata.\n\nEstas son algunas preguntas frecuentes — elige una o escribe la tuya:`,
          { isOnboarding: true }
        );
        setShowQuickReplies(true);
        return true;
      }

      return false;
    },
    [appendAssistantMessage, onboardingStep, updateUserProfile]
  );

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const isOnboarding =
      onboardingStep === "name" || onboardingStep === "email";

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
      isOnboarding,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setShowQuickReplies(false);

    if (handleOnboarding(trimmed)) {
      syncConversation(nextMessages);
      return;
    }

    const profile = userProfileRef.current;
    if (!profile?.name || !profile?.email) {
      appendAssistantMessage(
        "Antes de continuar, necesito tu nombre y correo. ¿Cómo te llamas?"
      );
      setOnboardingStep("name");
      return;
    }

    setIsLoading(true);

    try {
      const history = nextMessages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history,
          userProfile: profile,
        }),
      });

      const data = (await response.json()) as {
        message?: string;
        error?: string;
        offTopic?: boolean;
      };

      const assistantContent =
        data.message ??
        data.error ??
        "No pude procesar tu consulta. Intenta de nuevo.";

      setMessages((prev) => {
        const next = [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            role: "assistant" as const,
            content: assistantContent,
            createdAt: new Date().toISOString(),
            offTopic: data.offTopic,
          },
        ];
        syncConversation(next);
        return next;
      });

      if (!isOpen || isMinimized) setHasUnread(true);
    } catch {
      setMessages((prev) => {
        const next = [
          ...prev,
          {
            id: `error-${Date.now()}`,
            role: "assistant" as const,
            content:
              "Hubo un problema de conexión. Verifica tu internet e intenta de nuevo.",
            createdAt: new Date().toISOString(),
          },
        ];
        syncConversation(next);
        return next;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const openChat = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setHasUnread(false);
  };

  const toggleMinimized = () => {
    setIsMinimized((prev) => !prev);
  };

  const inputPlaceholder =
    onboardingStep === "name"
      ? "Escribe tu nombre..."
      : onboardingStep === "email"
        ? "Escribe tu correo electrónico..."
        : "Escribe tu pregunta sobre Remata...";

  return (
    <>
      {/* Floating launcher */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <button
              type="button"
              onClick={openChat}
              aria-label="Abrir asistente Remata"
              className="group relative flex size-16 items-center justify-center rounded-full bg-[#163300] text-white shadow-2xl shadow-[#163300]/40 transition-transform hover:scale-105 active:scale-95"
            >
              <span className="absolute inset-0 rounded-full bg-[#9FE870]/30 animate-ping opacity-60" />
              <span className="absolute inset-0 rounded-full bg-linear-to-br from-[#9FE870]/20 to-transparent" />
              <MessageCircle className="relative size-7" />
              {hasUnread && (
                <span className="absolute -top-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold ring-2 ring-white">
                  1
                </span>
              )}
            </button>
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute right-full mr-3 top-1/2 -translate-y-1/2 hidden sm:block"
            >
              <div className="whitespace-nowrap rounded-xl border border-border/60 bg-white px-4 py-2 text-sm font-medium text-foreground shadow-lg">
                ¿Tienes dudas? Pregúntame
                <div className="absolute top-1/2 -right-1.5 size-3 -translate-y-1/2 rotate-45 border-r border-t border-border/60 bg-white" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            layout={false}
            className={cn(
              "fixed z-50 flex flex-col overflow-hidden border border-border/60 bg-white shadow-2xl shadow-black/20",
              "bottom-0 right-0 left-0 rounded-t-3xl sm:bottom-6 sm:left-auto sm:right-6 sm:w-[420px] sm:rounded-3xl",
              isMinimized ? "h-auto" : "h-[min(88vh,720px)] sm:h-[min(82vh,680px)]"
            )}
          >
            {/* Header */}
            <div className="relative shrink-0 overflow-hidden bg-[#163300] px-5 py-4">
              <div
                className="pointer-events-none absolute inset-0 opacity-30"
                aria-hidden
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, rgba(159,232,112,0.15) 1px, transparent 0)`,
                  backgroundSize: "20px 20px",
                }}
              />
              <div className="pointer-events-none absolute -top-10 -right-10 size-40 rounded-full bg-[#9FE870]/15 blur-2xl" />

              <div className="relative flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative flex size-11 items-center justify-center rounded-2xl bg-[#9FE870]/20 ring-2 ring-[#9FE870]/40">
                    <Bot className="size-5 text-[#9FE870]" />
                    <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-[#163300] bg-green-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">Remata AI</h3>
                      <span className="rounded-full bg-[#9FE870]/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#9FE870]">
                        En línea
                      </span>
                    </div>
                    <p className="text-xs text-white/60">
                      Asistente de inversiones · Remates judiciales
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={toggleMinimized}
                    className="flex size-8 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                    aria-label={isMinimized ? "Expandir chat" : "Minimizar chat"}
                  >
                    {isMinimized ? (
                      <Maximize2 className="size-4" />
                    ) : (
                      <Minus className="size-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex size-8 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                    aria-label="Cerrar chat"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>

              {!isMinimized && (
                <div className="relative mt-3 flex items-center gap-2 rounded-xl border border-[#9FE870]/20 bg-[#9FE870]/10 px-3 py-2">
                  <Shield className="size-3.5 shrink-0 text-[#9FE870]" />
                  <p className="text-[11px] leading-snug text-white/70">
                    Respuestas basadas en información oficial de Remata. Solo temas de la plataforma.
                  </p>
                </div>
              )}
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <ScrollArea className="min-h-0 flex-1">
                  <div className="flex flex-col gap-4 p-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          "flex gap-2.5",
                          message.role === "user" ? "flex-row-reverse" : "flex-row"
                        )}
                      >
                        {message.role === "assistant" && (
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#163300] ring-2 ring-[#9FE870]/20">
                            <Sparkles className="size-3.5 text-[#9FE870]" />
                          </div>
                        )}
                        <div
                          className={cn(
                            "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                            message.role === "user"
                              ? "rounded-tr-md bg-[#163300] text-white"
                              : "rounded-tl-md border border-border/50 bg-[#F5F9F2] text-foreground"
                          )}
                        >
                          {formatMessageContent(message.content)}
                        </div>
                      </motion.div>
                    ))}

                    {showQuickReplies && !isLoading && (
                      <QuickReplyChips
                        questions={SUGGESTED_QUESTIONS}
                        onSelect={sendMessage}
                      />
                    )}

                    {isLoading && <TypingIndicator />}
                    <div ref={bottomRef} aria-hidden />
                  </div>
                </ScrollArea>

                {/* Input */}
                <div className="shrink-0 border-t border-border/60 bg-white p-4">
                  <div className="flex items-end gap-2 rounded-2xl border border-border/80 bg-muted/30 p-2 focus-within:border-[#9FE870]/60 focus-within:ring-2 focus-within:ring-[#9FE870]/20">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={inputPlaceholder}
                      rows={1}
                      disabled={isLoading}
                      className="max-h-24 min-h-[40px] flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
                    />
                    <Button
                      type="button"
                      size="icon"
                      disabled={!input.trim() || isLoading}
                      onClick={() => sendMessage(input)}
                      className="size-10 shrink-0 rounded-xl bg-[#163300] text-[#9FE870] hover:bg-[#163300]/90 disabled:opacity-40"
                    >
                      {isLoading ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Send className="size-4" />
                      )}
                    </Button>
                  </div>
                  <p className="mt-2 text-center text-[10px] text-muted-foreground">
                    Solo respondo preguntas sobre Remata · Inversiones con riesgo
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
