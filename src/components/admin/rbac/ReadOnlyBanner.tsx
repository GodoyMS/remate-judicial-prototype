"use client";

import { Eye } from "lucide-react";
import type { AdminModule } from "@/lib/admin/rbac/types";
import { MODULE_LABELS } from "@/lib/admin/rbac/constants";
import { useAdminAuth } from "@/contexts/admin-auth-context";

interface ReadOnlyBannerProps {
  module: AdminModule;
}

export function ReadOnlyBanner({ module }: ReadOnlyBannerProps) {
  const { canWrite, isSuperAdmin } = useAdminAuth();

  if (isSuperAdmin || canWrite(module)) return null;

  return (
    <div className="mb-6 flex items-start gap-3 rounded-2xl border border-sky-200 bg-gradient-to-r from-sky-50 to-blue-50/50 px-4 py-3.5">
      <div className="size-9 rounded-xl bg-sky-100 flex items-center justify-center shrink-0">
        <Eye className="size-4 text-sky-600" />
      </div>
      <div>
        <p className="text-sm font-semibold text-sky-900">Modo solo lectura</p>
        <p className="text-xs text-sky-700/80 mt-0.5 leading-relaxed">
          Tienes acceso de consulta a <strong>{MODULE_LABELS[module]}</strong>.
          Las acciones de edición, creación y eliminación están deshabilitadas.
        </p>
      </div>
    </div>
  );
}
