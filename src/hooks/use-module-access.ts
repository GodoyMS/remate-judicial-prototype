"use client";

import { useAdminAuth } from "@/contexts/admin-auth-context";
import type { AdminModule } from "@/lib/admin/rbac/types";

export function useModuleAccess(module: AdminModule) {
  const { canRead, canWrite, getPermission, isSuperAdmin } = useAdminAuth();
  return {
    canRead: canRead(module),
    canWrite: canWrite(module),
    isReadOnly: canRead(module) && !canWrite(module),
    permission: getPermission(module),
    isSuperAdmin,
  };
}
