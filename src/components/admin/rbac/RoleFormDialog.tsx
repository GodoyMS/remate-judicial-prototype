"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PermissionMatrix } from "./PermissionMatrix";
import { createEmptyPermissions } from "@/lib/admin/rbac/constants";
import type { AdminRole, ModulePermissions } from "@/lib/admin/rbac/types";

interface RoleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: AdminRole | null;
  onSave: (data: {
    name: string;
    description: string;
    color: string;
    permissions: ModulePermissions;
  }) => void;
}

const ROLE_COLORS = ["#2563eb", "#7c3aed", "#0891b2", "#d97706", "#dc2626", "#059669"];

export function RoleFormDialog({
  open,
  onOpenChange,
  role,
  onSave,
}: RoleFormDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(ROLE_COLORS[0]);
  const [permissions, setPermissions] = useState<ModulePermissions>(createEmptyPermissions());

  useEffect(() => {
    if (open) {
      setName(role?.name ?? "");
      setDescription(role?.description ?? "");
      setColor(role?.color ?? ROLE_COLORS[0]);
      setPermissions(role?.permissions ?? createEmptyPermissions());
    }
  }, [open, role]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("El nombre del rol es obligatorio");
      return;
    }
    const hasAny = Object.values(permissions).some((p) => p !== "none");
    if (!hasAny) {
      toast.error("Asigna al menos un permiso al rol");
      return;
    }
    onSave({ name: name.trim(), description: description.trim(), color, permissions });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle>{role ? "Editar rol" : "Crear nuevo rol"}</DialogTitle>
          <DialogDescription>
            Define permisos por módulo. Cada módulo puede ser sin acceso, solo lectura o acceso completo.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="role-name">Nombre del rol</Label>
              <Input
                id="role-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Operaciones"
                className="rounded-xl"
                disabled={role?.isSystem}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Color identificador</Label>
              <div className="flex gap-2">
                {ROLE_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className="size-8 rounded-full border-2 transition-transform hover:scale-110"
                    style={{
                      backgroundColor: c,
                      borderColor: color === c ? "var(--foreground)" : "transparent",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="role-desc">Descripción</Label>
            <Textarea
              id="role-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe las responsabilidades de este rol..."
              className="rounded-xl resize-none"
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label>Matriz de permisos</Label>
            <div className="rounded-xl border border-border/60 p-3 bg-muted/20">
              <PermissionMatrix
                permissions={permissions}
                onChange={setPermissions}
                disabled={role?.isSystem}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" className="rounded-xl" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="rounded-xl" disabled={role?.isSystem}>
              {role ? "Guardar cambios" : "Crear rol"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
