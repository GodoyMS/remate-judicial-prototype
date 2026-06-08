"use client";

import { ADMIN_MODULES, type AdminModule, type ModulePermissions, type PermissionLevel } from "@/lib/admin/rbac/types";
import { MODULE_LABELS, PERMISSION_LABELS } from "@/lib/admin/rbac/constants";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface PermissionMatrixProps {
  permissions: ModulePermissions;
  onChange: (permissions: ModulePermissions) => void;
  disabled?: boolean;
  compact?: boolean;
}

const LEVELS: PermissionLevel[] = ["none", "read", "write"];

export function PermissionMatrix({
  permissions,
  onChange,
  disabled = false,
  compact = false,
}: PermissionMatrixProps) {
  const handleChange = (module: AdminModule, level: PermissionLevel) => {
    onChange({ ...permissions, [module]: level });
  };

  return (
    <div className={cn("space-y-2", compact && "space-y-1.5")}>
      <div className="grid grid-cols-[1fr_auto_auto_auto] gap-2 items-center px-1 pb-1 border-b border-border/40">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Módulo
        </span>
        {LEVELS.map((level) => (
          <span
            key={level}
            className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground text-center w-20"
          >
            {level === "none" ? "—" : level === "read" ? "Lectura" : "Total"}
          </span>
        ))}
      </div>
      {ADMIN_MODULES.map((module) => (
        <div
          key={module}
          className={cn(
            "grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_auto_auto_auto] gap-2 items-center rounded-xl px-2 py-2 hover:bg-muted/30 transition-colors",
            compact && "py-1.5"
          )}
        >
          <Label className="text-sm font-medium">{MODULE_LABELS[module]}</Label>
          <div className="sm:hidden">
            <Select
              value={permissions[module]}
              onValueChange={(v) => handleChange(module, v as PermissionLevel)}
              disabled={disabled}
            >
              <SelectTrigger className="w-full rounded-lg h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LEVELS.map((level) => (
                  <SelectItem key={level} value={level}>
                    {PERMISSION_LABELS[level]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="hidden sm:contents">
            {LEVELS.map((level) => (
              <button
                key={level}
                type="button"
                disabled={disabled}
                onClick={() => handleChange(module, level)}
                className={cn(
                  "w-20 h-8 rounded-lg text-xs font-medium transition-all border",
                  permissions[module] === level
                    ? level === "write"
                      ? "bg-emerald-100 border-emerald-300 text-emerald-800"
                      : level === "read"
                        ? "bg-sky-100 border-sky-300 text-sky-800"
                        : "bg-muted border-border text-muted-foreground"
                    : "bg-transparent border-transparent text-muted-foreground hover:bg-muted/50",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                {level === "none" ? "—" : level === "read" ? "Ver" : "Todo"}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
