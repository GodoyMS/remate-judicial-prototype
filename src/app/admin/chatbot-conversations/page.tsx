"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bot,
  MessageSquare,
  Users,
  TrendingUp,
  Clock,
  Mail,
  Tag,
  ChevronLeft,
  Sparkles,
  Inbox,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChatbotConversationThread } from "@/components/admin/ChatbotConversationThread";
import { getLastUserMessagePreview } from "@/lib/chatbot-conversations/topics";
import { formatDateTime } from "@/lib/admin/formatters";
import type { ChatbotConversation } from "@/lib/admin/types";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const topicColors: Record<string, string> = {
  Inversiones: "bg-emerald-50 text-emerald-700 border-emerald-200",
  KYC: "bg-blue-50 text-blue-700 border-blue-200",
  Regulación: "bg-violet-50 text-violet-700 border-violet-200",
  Pagos: "bg-amber-50 text-amber-700 border-amber-200",
  Propiedades: "bg-cyan-50 text-cyan-700 border-cyan-200",
  Riesgos: "bg-red-50 text-red-700 border-red-200",
  Proceso: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Soporte: "bg-orange-50 text-orange-700 border-orange-200",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function relativeTime(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Ahora";
  if (mins < 60) return `Hace ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Hace ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `Hace ${days}d`;
  return formatDateTime(date).split(",")[0];
}

export default function AdminChatbotConversationsPage() {
  const isMobile = useIsMobile();
  const [conversations, setConversations] = useState<ChatbotConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "completed">(
    "all"
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileShowThread, setMobileShowThread] = useState(false);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/chatbot-conversations");
      const data = (await res.json()) as { conversations: ChatbotConversation[] };
      setConversations(data.conversations ?? []);
    } catch {
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 15000);
    return () => clearInterval(interval);
  }, [fetchConversations]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return conversations.filter((c) => {
      const matchSearch =
        !q ||
        c.userName.toLowerCase().includes(q) ||
        c.userEmail.toLowerCase().includes(q) ||
        c.topics.some((t) => t.toLowerCase().includes(q)) ||
        getLastUserMessagePreview(c.messages).toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || c.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [conversations, search, statusFilter]);

  const selected = useMemo(
    () => conversations.find((c) => c.id === selectedId) ?? null,
    [conversations, selectedId]
  );

  useEffect(() => {
    if (!selectedId && filtered.length > 0 && !isMobile) {
      setSelectedId(filtered[0].id);
    }
  }, [filtered, selectedId, isMobile]);

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const todayCount = conversations.filter(
      (c) => new Date(c.startedAt).toDateString() === today
    ).length;
    const activeCount = conversations.filter((c) => c.status === "active").length;
    const avgMessages =
      conversations.length > 0
        ? Math.round(
            conversations.reduce((sum, c) => sum + c.messages.length, 0) /
              conversations.length
          )
        : 0;
    const topTopics = conversations
      .flatMap((c) => c.topics)
      .reduce<Record<string, number>>((acc, t) => {
        acc[t] = (acc[t] ?? 0) + 1;
        return acc;
      }, {});
    const leadingTopic = Object.entries(topTopics).sort((a, b) => b[1] - a[1])[0];

    return { todayCount, activeCount, avgMessages, leadingTopic };
  }, [conversations]);

  const selectConversation = (id: string) => {
    setSelectedId(id);
    if (isMobile) setMobileShowThread(true);
  };

  const backToList = () => {
    setMobileShowThread(false);
  };

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Insights del cliente
            </p>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Conversaciones del chatbot
              </h2>
              {stats.activeCount > 0 && (
                <Badge className="rounded-lg bg-[#163300] text-[#9FE870] hover:bg-[#163300]/90">
                  {stats.activeCount} activas
                </Badge>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Historial de consultas del asistente Remata AI en la landing page
            </p>
          </div>
        </div>
      </motion.div>

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          {
            label: "Total",
            value: String(conversations.length),
            sub: "conversaciones",
            icon: MessageSquare,
            accent: "text-[#163300] bg-[#9FE870]/20",
          },
          {
            label: "Hoy",
            value: String(stats.todayCount),
            sub: "nuevas sesiones",
            icon: TrendingUp,
            accent: "text-emerald-600 bg-emerald-50",
          },
          {
            label: "Activas",
            value: String(stats.activeCount),
            sub: "en curso",
            icon: Clock,
            accent: "text-amber-600 bg-amber-50",
          },
          {
            label: "Promedio",
            value: String(stats.avgMessages),
            sub: "msgs / conversación",
            icon: Users,
            accent: "text-violet-600 bg-violet-50",
          },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="rounded-xl border border-border/60 bg-background px-4 py-3"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-[10px] uppercase tracking-wide text-muted-foreground">
                  {s.label}
                </p>
                <p className="mt-0.5 text-lg font-bold text-foreground">{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.sub}</p>
              </div>
              <div
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-lg",
                  s.accent.split(" ")[1]
                )}
              >
                <s.icon className={cn("size-4", s.accent.split(" ")[0])} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {stats.leadingTopic && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 flex items-center gap-2 rounded-xl border border-[#9FE870]/30 bg-[#9FE870]/10 px-4 py-2.5"
        >
          <Sparkles className="size-4 shrink-0 text-[#163300]" />
          <p className="text-xs text-[#163300]">
            Tema más consultado:{" "}
            <span className="font-semibold">{stats.leadingTopic[0]}</span> (
            {stats.leadingTopic[1]} conversaciones)
          </p>
        </motion.div>
      )}

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-background shadow-sm">
        <div
          className={cn(
            "grid min-h-[min(72vh,640px)]",
            isMobile ? "grid-cols-1" : "grid-cols-[minmax(300px,360px)_1fr]"
          )}
        >
          {/* Conversation list */}
          <div
            className={cn(
              "flex flex-col border-border/60",
              !isMobile && "border-r",
              isMobile && mobileShowThread && "hidden"
            )}
          >
            <div className="shrink-0 space-y-3 border-b border-border/40 bg-muted/15 p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, correo o tema..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-10 rounded-xl border-border/80 bg-background pl-9"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(v) =>
                  setStatusFilter(v as "all" | "active" | "completed")
                }
              >
                <SelectTrigger className="w-full rounded-xl">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="active">Activas</SelectItem>
                  <SelectItem value="completed">Completadas</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[10px] text-muted-foreground">
                {filtered.length} de {conversations.length} conversaciones
              </p>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center gap-2 py-16 text-muted-foreground">
                  <Bot className="size-8 animate-pulse opacity-40" />
                  <p className="text-sm">Cargando conversaciones...</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-16 text-center px-4">
                  <Inbox className="size-10 text-muted-foreground/30" />
                  <p className="text-sm font-medium text-foreground">
                    Sin conversaciones
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Las consultas del chatbot en la landing aparecerán aquí
                  </p>
                </div>
              ) : (
                filtered.map((conv) => {
                  const isSelected = conv.id === selectedId;
                  const preview = getLastUserMessagePreview(conv.messages);

                  return (
                    <button
                      key={conv.id}
                      type="button"
                      onClick={() => selectConversation(conv.id)}
                      className={cn(
                        "flex w-full gap-3 border-b border-border/30 px-4 py-3.5 text-left transition-colors hover:bg-muted/30",
                        isSelected && "bg-[#9FE870]/10 hover:bg-[#9FE870]/15",
                        conv.status === "active" && !isSelected && "border-l-[3px] border-l-[#9FE870]"
                      )}
                    >
                      <div
                        className={cn(
                          "flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                          isSelected
                            ? "bg-[#163300] text-[#9FE870]"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {getInitials(conv.userName)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {conv.userName}
                          </p>
                          <span className="shrink-0 text-[10px] text-muted-foreground">
                            {relativeTime(conv.lastMessageAt)}
                          </span>
                        </div>
                        <p className="truncate text-[11px] text-muted-foreground">
                          {conv.userEmail}
                        </p>
                        <p className="mt-1 line-clamp-2 text-xs text-foreground/80">
                          {preview}
                        </p>
                        {conv.topics.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {conv.topics.slice(0, 2).map((topic) => (
                              <span
                                key={topic}
                                className={cn(
                                  "inline-flex items-center rounded-md border px-1.5 py-0.5 text-[9px] font-semibold",
                                  topicColors[topic] ??
                                    "bg-muted text-muted-foreground border-border"
                                )}
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Thread panel */}
          <div
            className={cn(
              "flex flex-col bg-[#FAFBF9]",
              isMobile && !mobileShowThread && "hidden"
            )}
          >
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-full flex-col"
                >
                  <div className="shrink-0 border-b border-border/60 bg-white px-4 py-4 sm:px-6">
                    {isMobile && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mb-3 -ml-2 rounded-xl"
                        onClick={backToList}
                      >
                        <ChevronLeft className="mr-1 size-4" />
                        Volver
                      </Button>
                    )}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-2xl bg-[#163300] text-sm font-bold text-[#9FE870]">
                          {getInitials(selected.userName)}
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-foreground">
                            {selected.userName}
                          </h3>
                          <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                            <Mail className="size-3" />
                            {selected.userEmail}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <Badge
                          variant="outline"
                          className={cn(
                            "rounded-lg text-[10px]",
                            selected.status === "active"
                              ? "border-[#9FE870]/50 bg-[#9FE870]/15 text-[#163300]"
                              : "border-border text-muted-foreground"
                          )}
                        >
                          {selected.status === "active" ? "Activa" : "Completada"}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {formatDateTime(selected.startedAt)}
                        </span>
                      </div>
                    </div>

                    {selected.topics.length > 0 && (
                      <div className="mt-3 flex flex-wrap items-center gap-1.5">
                        <Tag className="size-3 text-muted-foreground" />
                        {selected.topics.map((topic) => (
                          <span
                            key={topic}
                            className={cn(
                              "inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold",
                              topicColors[topic] ??
                                "bg-muted text-muted-foreground border-border"
                            )}
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <ChatbotConversationThread
                    conversation={selected}
                    className="min-h-0 flex-1"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center"
                >
                  <div className="flex size-16 items-center justify-center rounded-2xl bg-[#163300]/10">
                    <Bot className="size-8 text-[#163300]" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-foreground">
                      Selecciona una conversación
                    </p>
                    <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                      Explora las dudas y necesidades de los visitantes que
                      interactuaron con Remata AI
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
