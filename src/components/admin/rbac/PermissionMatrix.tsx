"use client";

import { ADMIN_MODULES, type AdminModule, type ModulePermissions, type PermissionLevel } from "@/lib/admin/rbac/types";
import { MODULE_LABELS, PERMISSION_COLORS, PERMISSION_LABELS } from "@/lib/admin/rbac/constants";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface PermissionMatrixProps {
  permissions: ModulePermissions;
  onChange: (permissions: ModulePermissions) => void;
  disabled?: boolean;
  readOnly?: boolean;
  compact?: boolean;
}

const LEVELS: PermissionLevel[] = ["none", "read", "write"];

const LEVEL_SHORT: Record<PermissionLevel, string> = {
  none: "—",
  read: "Ver",
  write: "Todo",
};

export function PermissionMatrix({
  permissions,
  onChange,
  disabled = false,
  readOnly = false,
  compact = false,
}: PermissionMatrixProps) {
  const isInteractive = !disabled && !readOnly;

  const handleChange = (module: AdminModule, level: PermissionLevel) => {
    if (!isInteractive) return;
    onChange({ ...permissions, [module]: level });
  };

  return (
    <div className={cn("space-y-2", compact && "space-y-1.5")}>
      <div className="hidden sm:grid sm:grid-cols-[minmax(0,1fr)_repeat(3,minmax(4.5rem,1fr))] gap-2 items-center px-1 pb-1 border-b border-border/40">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Módulo
        </span>
        {LEVELS.map((level) => (
          <span
            key={level}
            className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground text-center"
          >
            {level === "none" ? "—" : level === "read" ? "Lectura" : "Total"}
          </span>
        ))}
      </div>

      {ADMIN_MODULES.map((module) => {
        const currentLevel = permissions[module];

        return (
          <div
            key={module}
            className={cn(
              "rounded-xl border border-border/50 bg-background/80 p-3 sm:border-0 sm:bg-transparent sm:p-0 sm:rounded-none",
              "sm:grid sm:grid-cols-[minmax(0,1fr)_repeat(3,minmax(4.5rem,1fr))] sm:gap-2 sm:items-center sm:px-2 sm:py-2 sm:hover:bg-muted/30 sm:transition-colors",
              compact && "sm:py-1.5"
            )}
          >
            <div className="flex items-center justify-between gap-3 sm:block sm:min-w-0">
              <Label className="text-sm font-medium leading-snug">{MODULE_LABELS[module]}</Label>
              {readOnly && (
                <Badge
                  variant="outline"
                  className={cn("text-[10px] shrink-0 sm:hidden", PERMISSION_COLORS[currentLevel])}
                >
                  {PERMISSION_LABELS[currentLevel]}
                </Badge>
              )}
            </div>

            {readOnly ? (
              <div className="hidden sm:flex sm:col-span-3 sm:justify-end">
                <Badge
                  variant="outline"
                  className={cn("text-[10px]", PERMISSION_COLORS[currentLevel])}
                >
                  {PERMISSION_LABELS[currentLevel]}
                </Badge>
              </div>
            ) : (
              <div className="mt-2.5 sm:mt-0 sm:col-span-3 grid grid-cols-3 gap-1.5 sm:contents">
                {LEVELS.map((level) => (
                  <button
                    key={level}
                    type="button"
                    disabled={!isInteractive}
                    onClick={() => handleChange(module, level)}
                    className={cn(
                      "min-h-9 rounded-lg text-xs font-medium transition-all border px-1",
                      permissions[module] === level
                        ? level === "write"
                          ? "bg-emerald-100 border-emerald-300 text-emerald-800"
                          : level === "read"
                            ? "bg-sky-100 border-sky-300 text-sky-800"
                            : "bg-muted border-border text-muted-foreground"
                        : "bg-transparent border-border/60 text-muted-foreground hover:bg-muted/50",
                      !isInteractive && "opacity-60 cursor-not-allowed hover:bg-transparent"
                    )}
                  >
                    <span className="sm:hidden">{PERMISSION_LABELS[level]}</span>
                    <span className="hidden sm:inline">{LEVEL_SHORT[level]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
