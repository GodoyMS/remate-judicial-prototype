"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  BarChart3,
  Building2,
  Crown,
  MessageSquareQuote,
  FileWarning,
  Bot,
  Users,
  Bell,
  Settings,
  KeyRound,
  Ban,
  Eye,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import {
  ADMIN_MODULES,
  type AdminModule,
  type ModulePermissions,
  type PermissionLevel,
} from "@/lib/admin/rbac/types";
import {
  MODULE_DESCRIPTIONS,
  MODULE_LABELS,
  PERMISSION_COLORS,
  PERMISSION_LABELS,
} from "@/lib/admin/rbac/constants";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PermissionMatrixProps {
  permissions: ModulePermissions;
  onChange: (permissions: ModulePermissions) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

const MODULE_ICONS: Record<AdminModule, LucideIcon> = {
  dashboard: LayoutDashboard,
  analytics: BarChart3,
  properties: Building2,
  premium_properties: Crown,
  testimonials: MessageSquareQuote,
  complaints: FileWarning,
  chatbot: Bot,
  users: Users,
  notifications: Bell,
  settings: Settings,
  access: KeyRound,
};

interface LevelMeta {
  value: PermissionLevel;
  label: string;
  icon: LucideIcon;
  /** Background of the sliding indicator when this level is active. */
  activeBg: string;
  /** Icon tint for the small summary dots / presets. */
  accent: string;
}

const LEVELS: LevelMeta[] = [
  { value: "none", label: "Sin acceso", icon: Ban, activeBg: "bg-slate-400", accent: "text-slate-500" },
  { value: "read", label: "Lectura", icon: Eye, activeBg: "bg-sky-500", accent: "text-sky-600" },
  { value: "write", label: "Total", icon: ShieldCheck, activeBg: "bg-emerald-500", accent: "text-emerald-600" },
];

const PRESETS: { level: PermissionLevel; label: string }[] = [
  { level: "none", label: "Limpiar" },
  { level: "read", label: "Todo lectura" },
  { level: "write", label: "Acceso total" },
];

export function PermissionMatrix({
  permissions,
  onChange,
  disabled = false,
  readOnly = false,
}: PermissionMatrixProps) {
  const isInteractive = !disabled && !readOnly;

  const counts = useMemo(() => {
    const acc: Record<PermissionLevel, number> = { none: 0, read: 0, write: 0 };
    for (const mod of ADMIN_MODULES) acc[permissions[mod]] += 1;
    return acc;
  }, [permissions]);

  const setLevel = (module: AdminModule, level: PermissionLevel) => {
    if (!isInteractive) return;
    if (permissions[module] === level) return;
    onChange({ ...permissions, [module]: level });
  };

  const applyToAll = (level: PermissionLevel) => {
    if (!isInteractive) return;
    const next = { ...permissions };
    for (const mod of ADMIN_MODULES) next[mod] = level;
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {isInteractive && (
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl bg-muted/40 px-2.5 py-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground pr-0.5">
            <Sparkles className="size-3 text-violet-500" />
            Aplicar a todos
          </span>
          {PRESETS.map((preset) => (
            <button
              key={preset.level}
              type="button"
              onClick={() => applyToAll(preset.level)}
              className="rounded-lg border border-border/60 bg-background px-2.5 py-1 text-[11px] font-medium text-foreground/80 transition-colors hover:border-border hover:bg-muted hover:text-foreground"
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-1.5">
        {ADMIN_MODULES.map((module) => {
          const Icon = MODULE_ICONS[module];
          const currentLevel = permissions[module];

          return (
            <div
              key={module}
              className={cn(
                "flex flex-col gap-2.5 rounded-xl border border-border/50 bg-background/70 p-3 transition-colors",
                "sm:flex-row sm:items-center sm:justify-between sm:gap-4",
                isInteractive && "hover:border-border hover:bg-background"
              )}
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <div
                  className={cn(
                    "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                    currentLevel === "write" && "bg-emerald-100 text-emerald-600",
                    currentLevel === "read" && "bg-sky-100 text-sky-600",
                    currentLevel === "none" && "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-tight text-foreground">
                    {MODULE_LABELS[module]}
                  </p>
                  <p className="text-[11px] leading-snug text-muted-foreground line-clamp-2">
                    {MODULE_DESCRIPTIONS[module]}
                  </p>
                </div>
              </div>

              {readOnly ? (
                <div className="shrink-0 sm:w-[300px] sm:text-right">
                  <Badge
                    variant="outline"
                    className={cn("text-[10px]", PERMISSION_COLORS[currentLevel])}
                  >
                    {PERMISSION_LABELS[currentLevel]}
                  </Badge>
                </div>
              ) : (
                <div className="relative grid shrink-0 grid-cols-3 gap-1 rounded-xl bg-muted/60 p-1 sm:w-[300px]">
                  {LEVELS.map((level) => {
                    const active = currentLevel === level.value;
                    const LevelIcon = level.icon;
                    return (
                      <button
                        key={level.value}
                        type="button"
                        disabled={!isInteractive}
                        onClick={() => setLevel(module, level.value)}
                        aria-pressed={active}
                        className={cn(
                          "relative flex min-h-8 items-center justify-center gap-1.5 rounded-lg px-1.5 text-xs font-medium transition-colors",
                          active ? "text-white" : "text-muted-foreground hover:text-foreground",
                          !isInteractive && "cursor-not-allowed"
                        )}
                      >
                        {active && (
                          <motion.span
                            layoutId={`seg-${module}`}
                            className={cn("absolute inset-0 rounded-lg shadow-sm", level.activeBg)}
                            transition={{ type: "spring", stiffness: 520, damping: 38 }}
                          />
                        )}
                        <LevelIcon className="relative z-10 size-3.5" />
                        <span className="relative z-10">{level.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1 px-1 pt-0.5">
        {LEVELS.map((level) => (
          <span
            key={level.value}
            className="inline-flex items-center gap-1 text-[11px] text-muted-foreground"
          >
            <level.icon className={cn("size-3", level.accent)} />
            <span className="tabular-nums font-medium text-foreground/80">
              {counts[level.value]}
            </span>
            {level.label.toLowerCase()}
          </span>
        ))}
      </div>
    </div>
  );
}
