"use client";

import { ShieldOff, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from "@/contexts/admin-auth-context";
import type { AdminModule } from "@/lib/admin/rbac/types";
import { MODULE_LABELS } from "@/lib/admin/rbac/constants";

interface AccessDeniedUIProps {
  module?: AdminModule | null;
}

export function AccessDeniedUI({ module }: AccessDeniedUIProps) {
  const { role } = useAdminAuth();
  const moduleLabel = module ? MODULE_LABELS[module] : null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="size-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-6">
        <ShieldOff className="size-8 text-destructive" />
      </div>
      <h2 className="text-xl font-bold text-foreground mb-2">Acceso no autorizado</h2>
      <p className="text-sm text-muted-foreground max-w-sm mb-1">
        {moduleLabel
          ? <>Tu rol <strong>{role?.name ?? "actual"}</strong> no tiene permiso para acceder a <strong>{moduleLabel}</strong>.</>
          : <>Tu rol <strong>{role?.name ?? "actual"}</strong> no tiene permiso para acceder a este módulo.</>
        }
      </p>
      <p className="text-xs text-muted-foreground max-w-xs mb-8">
        Si crees que esto es un error, contacta al Super Administrador para que revise los permisos de tu rol.
      </p>
      <Button asChild variant="outline" className="rounded-xl gap-2">
        <Link href="/admin">
          <ArrowLeft className="size-4" />
          Volver al Dashboard
        </Link>
      </Button>
    </div>
  );
}
