"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PermissionMatrix } from "./PermissionMatrix";
import { createEmptyPermissions, isProtectedRole } from "@/lib/admin/rbac/constants";
import type { AdminRole, ModulePermissions } from "@/lib/admin/rbac/types";

interface RoleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: AdminRole | null;
  /** Whether the current admin may edit roles (full access to the access module). */
  canEdit?: boolean;
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
  canEdit = true,
  onSave,
}: RoleFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-1.5rem)] sm:max-w-2xl max-h-[min(90vh,48rem)] overflow-y-auto rounded-2xl p-4 sm:p-6">
        {/* Keying on the role id (or "new") gives the form a fresh state each
            time it opens for a different role — no effect-based syncing needed. */}
        <RoleForm
          key={role?.id ?? "new"}
          role={role ?? null}
          canEdit={canEdit}
          onSave={onSave}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

interface RoleFormProps {
  role: AdminRole | null;
  canEdit: boolean;
  onSave: RoleFormDialogProps["onSave"];
  onClose: () => void;
}

function RoleForm({ role, canEdit, onSave, onClose }: RoleFormProps) {
  const [name, setName] = useState(role?.name ?? "");
  const [description, setDescription] = useState(role?.description ?? "");
  const [color, setColor] = useState(role?.color ?? ROLE_COLORS[0]);
  const [permissions, setPermissions] = useState<ModulePermissions>(
    role?.permissions ?? createEmptyPermissions()
  );

  // The Super Admin role is the only one that can never be edited (it must keep
  // full access). Every other role can be edited by an admin with full access.
  const isProtected = isProtectedRole(role);
  const locked = isProtected || !canEdit;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (locked) {
      onClose();
      return;
    }
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
    onClose();
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex flex-wrap items-center gap-2">
          {locked ? "Permisos del rol" : role ? "Editar rol" : "Crear nuevo rol"}
          {role?.isSystem && (
            <Badge variant="outline" className="text-[9px] h-4 font-medium">
              <ShieldCheck className="size-2.5 mr-0.5" />
              Sistema
            </Badge>
          )}
          {isProtected && (
            <Badge variant="outline" className="text-[9px] h-4 font-medium border-violet-200 bg-violet-50 text-violet-700">
              <Lock className="size-2.5 mr-0.5" />
              Protegido
            </Badge>
          )}
        </DialogTitle>
        <DialogDescription>
          {isProtected
            ? "El rol Super Admin siempre conserva acceso total y no puede modificarse."
            : locked
              ? "No tienes permisos para editar roles. Estás viendo la configuración en modo lectura."
              : "Define el nivel de acceso por módulo. Cada módulo puede ser sin acceso, solo lectura o acceso total."}
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
              disabled={locked}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Color identificador</Label>
            <div className="flex flex-wrap gap-2">
              {ROLE_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  disabled={locked}
                  className="size-8 rounded-full border-2 transition-transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
            disabled={locked}
          />
        </div>
        <div className="space-y-2">
          <Label>Matriz de permisos</Label>
          <div className="rounded-xl border border-border/60 p-3 sm:p-3 bg-muted/20 overflow-hidden">
            <PermissionMatrix
              permissions={permissions}
              onChange={setPermissions}
              readOnly={locked}
            />
          </div>
        </div>
        <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:gap-0">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto rounded-xl"
            onClick={onClose}
          >
            {locked ? "Cerrar" : "Cancelar"}
          </Button>
          {!locked && (
            <Button type="submit" className="w-full sm:w-auto rounded-xl">
              {role ? "Guardar cambios" : "Crear rol"}
            </Button>
          )}
        </DialogFooter>
      </form>
    </>
  );
}
