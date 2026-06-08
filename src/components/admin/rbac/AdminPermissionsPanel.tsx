"use client";

import { Shield, Lock, Eye, CheckCircle2, Ban } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ADMIN_MODULES,
  type AdminModule,
  type PermissionLevel,
} from "@/lib/admin/rbac/types";
import {
  MODULE_DESCRIPTIONS,
  MODULE_LABELS,
  PERMISSION_COLORS,
  PERMISSION_LABELS,
} from "@/lib/admin/rbac/constants";
import { useAdminAuth } from "@/contexts/admin-auth-context";
import { cn } from "@/lib/utils";

const PERMISSION_ICONS: Record<PermissionLevel, typeof Shield> = {
  none: Ban,
  read: Eye,
  write: CheckCircle2,
};

function PermissionBadge({ level }: { level: PermissionLevel }) {
  const Icon = PERMISSION_ICONS[level];
  return (
    <Badge
      variant="outline"
      className={cn("text-[10px] font-medium gap-1", PERMISSION_COLORS[level])}
    >
      <Icon className="size-2.5" />
      {PERMISSION_LABELS[level]}
    </Badge>
  );
}

interface AdminPermissionsPanelProps {
  compact?: boolean;
  showHeader?: boolean;
  className?: string;
}

export function AdminPermissionsPanel({
  compact = false,
  showHeader = true,
  className,
}: AdminPermissionsPanelProps) {
  const { account, role, isSuperAdmin, getPermission } = useAdminAuth();

  if (!account) return null;

  const visibleModules = ADMIN_MODULES.filter(
    (m) => isSuperAdmin || getPermission(m) !== "none"
  );

  const writeCount = ADMIN_MODULES.filter(
    (m) => getPermission(m) === "write"
  ).length;
  const readCount = ADMIN_MODULES.filter(
    (m) => getPermission(m) === "read"
  ).length;

  return (
    <Card className={cn("rounded-2xl border-border/60", className)}>
      {showHeader && (
        <CardHeader className={compact ? "pb-3" : undefined}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="size-4 text-secondary" />
                Mis permisos
              </CardTitle>
              <CardDescription className="mt-1">
                {isSuperAdmin
                  ? "Acceso total sin restricciones en toda la plataforma"
                  : `Rol asignado: ${role?.name ?? "Sin rol"}`}
              </CardDescription>
            </div>
            {isSuperAdmin ? (
              <Badge className="bg-violet-100 text-violet-700 border-violet-200 hover:bg-violet-100">
                <Lock className="size-3 mr-1" />
                Super Admin
              </Badge>
            ) : (
              <div className="flex gap-1.5 shrink-0">
                {writeCount > 0 && (
                  <Badge variant="outline" className={PERMISSION_COLORS.write}>
                    {writeCount} escritura
                  </Badge>
                )}
                {readCount > 0 && (
                  <Badge variant="outline" className={PERMISSION_COLORS.read}>
                    {readCount} lectura
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardHeader>
      )}
      <CardContent className={cn(!showHeader && "pt-6")}>
        <div
          className={cn(
            "grid gap-2",
            compact ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"
          )}
        >
          {(isSuperAdmin ? ADMIN_MODULES : visibleModules).map((module: AdminModule) => {
            const level = isSuperAdmin ? "write" : getPermission(module);
            return (
              <div
                key={module}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-xl border border-border/50 px-3.5 py-2.5 transition-colors",
                  level === "write" && "bg-emerald-50/30",
                  level === "read" && "bg-sky-50/30",
                  level === "none" && "opacity-40"
                )}
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {MODULE_LABELS[module]}
                  </p>
                  {!compact && (
                    <p className="text-[11px] text-muted-foreground truncate">
                      {MODULE_DESCRIPTIONS[module]}
                    </p>
                  )}
                </div>
                <PermissionBadge level={level} />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
