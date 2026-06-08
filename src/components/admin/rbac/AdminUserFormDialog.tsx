"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AdminAccount, AdminRole } from "@/lib/admin/rbac/types";

interface AdminUserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roles: AdminRole[];
  account?: AdminAccount | null;
  onSave: (data: {
    name: string;
    email: string;
    password: string;
    roleId: string;
    active: boolean;
  }) => void;
  canAssignSuperAdmin?: boolean;
}

export function AdminUserFormDialog({
  open,
  onOpenChange,
  roles,
  account,
  onSave,
  canAssignSuperAdmin = false,
}: AdminUserFormDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("");
  const [active, setActive] = useState(true);

  const availableRoles = roles.filter(
    (r) => canAssignSuperAdmin || r.id !== "role-super-admin"
  );

  useEffect(() => {
    if (open) {
      setName(account?.name ?? "");
      setEmail(account?.email ?? "");
      setPassword("");
      setRoleId(account?.roleId ?? availableRoles[0]?.id ?? "");
      setActive(account?.active ?? true);
    }
  }, [open, account, availableRoles]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Nombre y correo son obligatorios");
      return;
    }
    if (!account && !password) {
      toast.error("La contraseña es obligatoria para nuevos usuarios");
      return;
    }
    if (!roleId) {
      toast.error("Selecciona un rol");
      return;
    }
    onSave({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password || account?.password || "",
      roleId,
      active,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-1.5rem)] sm:max-w-md rounded-2xl p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>{account ? "Editar administrador" : "Nuevo administrador"}</DialogTitle>
          <DialogDescription>
            {account
              ? "Actualiza los datos y el rol asignado"
              : "Invita a un miembro del equipo al backoffice"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="admin-name">Nombre completo</Label>
            <Input
              id="admin-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Juan Pérez"
              className="rounded-xl"
              disabled={account?.isSuperAdmin && !canAssignSuperAdmin}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="admin-email">Correo corporativo</Label>
            <Input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@remata.com"
              className="rounded-xl"
              disabled={!!account}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="admin-pass">
              {account ? "Nueva contraseña (opcional)" : "Contraseña temporal"}
            </Label>
            <Input
              id="admin-pass"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Rol asignado</Label>
            <Select
              value={roleId}
              onValueChange={setRoleId}
              disabled={!!account?.isSuperAdmin}
            >
              <SelectTrigger className="w-full rounded-xl">
                <SelectValue placeholder="Seleccionar rol" />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    <span className="flex items-center gap-2">
                      <span
                        className="size-2 rounded-full"
                        style={{ backgroundColor: role.color }}
                      />
                      {role.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {account && !account.isSuperAdmin && (
            <div className="flex items-center justify-between rounded-xl border border-border/60 p-3">
              <div>
                <p className="text-sm font-medium">Cuenta activa</p>
                <p className="text-xs text-muted-foreground">
                  Desactivar impide el acceso al panel
                </p>
              </div>
              <Switch checked={active} onCheckedChange={setActive} />
            </div>
          )}
          <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:gap-0">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto rounded-xl"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" className="w-full sm:w-auto rounded-xl">
              {account ? "Guardar cambios" : "Crear administrador"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
