"use client";

import { useState } from "react";
import { UserCheck, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { assignTicket } from "@/lib/retornos/store";
import { getAccounts } from "@/lib/admin/rbac/store";
import type { Retorno } from "@/lib/retornos/types";

interface AssignTicketPopoverProps {
  retorno: Retorno;
  currentAdminId: string;
  currentAdminName: string;
  onAssigned: () => void;
}

export function AssignTicketPopover({
  retorno,
  currentAdminId,
  currentAdminName,
  onAssigned,
}: AssignTicketPopoverProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  const accounts = getAccounts().filter((a) => a.active);

  async function handleAssign(adminId: string, adminName: string) {
    setLoading(adminId);
    await new Promise((r) => setTimeout(r, 400));
    assignTicket(retorno.id, adminId, adminName, currentAdminName);
    setLoading(null);
    setOpen(false);
    toast.success(`Ticket asignado a ${adminName}`);
    onAssigned();
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-xl gap-1.5">
                <UserCheck className="size-4" />
                Asignar
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-56 rounded-xl p-2">
              <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Asignar a
              </p>
              <button
                onClick={() => handleAssign(currentAdminId, currentAdminName)}
                disabled={!!loading}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm transition-colors hover:bg-muted",
                  loading === currentAdminId && "opacity-50"
                )}
              >
                {loading === currentAdminId ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Check className="size-4 text-emerald-600" />
                )}
                <span className="font-medium">Asignarme a mí</span>
              </button>
              <div className="my-1 h-px bg-border" />
              <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Otro administrador
              </p>
              {accounts
                .filter((a) => a.id !== currentAdminId)
                .map((a) => (
                  <button
                    key={a.id}
                    onClick={() => handleAssign(a.id, a.name)}
                    disabled={!!loading}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm transition-colors hover:bg-muted",
                      loading === a.id && "opacity-50"
                    )}
                  >
                    {loading === a.id ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <div className="flex size-4 items-center justify-center rounded-full bg-muted text-[9px] font-bold">
                        {a.name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm">{a.name}</p>
                      <p className="truncate text-[10px] text-muted-foreground">{a.email}</p>
                    </div>
                  </button>
                ))}
            </PopoverContent>
          </Popover>
        </TooltipTrigger>
        <TooltipContent>Asignar ticket a un administrador</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
