"use client";

import { cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import type { AdminModule } from "@/lib/admin/rbac/types";
import { useAdminAuth } from "@/contexts/admin-auth-context";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface PermissionGateProps {
  module: AdminModule;
  require?: "read" | "write";
  children: ReactNode;
  fallback?: ReactNode;
  /** When true, renders children disabled with tooltip instead of hiding */
  showDisabled?: boolean;
  disabledClassName?: string;
  tooltip?: string;
}

function withDisabledChild(children: ReactNode) {
  if (!isValidElement(children)) return children;

  const child = children as ReactElement<{ disabled?: boolean; className?: string }>;
  return cloneElement(child, {
    disabled: true,
    className: cn(child.props.className, "pointer-events-none"),
  });
}

export function PermissionGate({
  module,
  require = "write",
  children,
  fallback = null,
  showDisabled = false,
  disabledClassName,
  tooltip = "No tienes permisos para realizar esta acción",
}: PermissionGateProps) {
  const { canRead, canWrite } = useAdminAuth();
  const allowed = require === "write" ? canWrite(module) : canRead(module);

  if (allowed) return <>{children}</>;

  if (showDisabled) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              className={cn(
                "inline-flex cursor-not-allowed opacity-50",
                disabledClassName
              )}
              aria-disabled
            >
              {withDisabledChild(children)}
            </span>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs text-xs">
            {tooltip}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return <>{fallback}</>;
}
