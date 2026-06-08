"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  UserPlus,
  Users,
  KeyRound,
  Plus,
  Pencil,
  Trash2,
  MoreHorizontal,
  Lock,
  Crown,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ReadOnlyBanner } from "@/components/admin/rbac/ReadOnlyBanner";
import { PermissionGate } from "@/components/admin/rbac/PermissionGate";
import { RoleFormDialog } from "@/components/admin/rbac/RoleFormDialog";
import { AdminUserFormDialog } from "@/components/admin/rbac/AdminUserFormDialog";
import { PermissionMatrix } from "@/components/admin/rbac/PermissionMatrix";
import { useAdminAuth } from "@/contexts/admin-auth-context";
import { getInitials, MODULE_LABELS, PERMISSION_COLORS, PERMISSION_LABELS } from "@/lib/admin/rbac/constants";
import { getAccounts, getRoles, saveAccounts, saveRoles } from "@/lib/admin/rbac/store";
import type { AdminAccount, AdminRole, ModulePermissions } from "@/lib/admin/rbac/types";
import { formatDate } from "@/lib/admin/formatters";
import { cn } from "@/lib/utils";

export default function AdminAccessPage() {
  const { canWrite, isSuperAdmin, refreshStore, roles: ctxRoles, accounts: ctxAccounts } = useAdminAuth();
  const canManage = canWrite("access");

  const [roles, setRoles] = useState<AdminRole[]>(ctxRoles);
  const [accounts, setAccounts] = useState<AdminAccount[]>(ctxAccounts);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<AdminRole | null>(null);
  const [editingAccount, setEditingAccount] = useState<AdminAccount | null>(null);
  const [deleteRole, setDeleteRole] = useState<AdminRole | null>(null);
  const [deleteAccount, setDeleteAccount] = useState<AdminAccount | null>(null);
  const [expandedRoleId, setExpandedRoleId] = useState<string | null>(null);

  const syncState = () => {
    const nextRoles = getRoles();
    const nextAccounts = getAccounts();
    setRoles(nextRoles);
    setAccounts(nextAccounts);
    refreshStore();
  };

  const roleMap = useMemo(
    () => Object.fromEntries(roles.map((r) => [r.id, r])),
    [roles]
  );

  const handleSaveRole = (data: {
    name: string;
    description: string;
    color: string;
    permissions: ModulePermissions;
  }) => {
    const now = new Date().toISOString();
    if (editingRole) {
      const updated = roles.map((r) =>
        r.id === editingRole.id
          ? { ...r, ...data, updatedAt: now }
          : r
      );
      saveRoles(updated);
      toast.success("Rol actualizado");
    } else {
      const newRole: AdminRole = {
        id: `role-${Date.now()}`,
        ...data,
        isSystem: false,
        createdAt: now,
        updatedAt: now,
      };
      saveRoles([...roles, newRole]);
      toast.success("Rol creado");
    }
    setEditingRole(null);
    syncState();
  };

  const handleDeleteRole = () => {
    if (!deleteRole) return;
    const inUse = accounts.some((a) => a.roleId === deleteRole.id);
    if (inUse) {
      toast.error("No se puede eliminar un rol con usuarios asignados");
      setDeleteRole(null);
      return;
    }
    saveRoles(roles.filter((r) => r.id !== deleteRole.id));
    toast.success("Rol eliminado");
    setDeleteRole(null);
    syncState();
  };

  const handleSaveAccount = (data: {
    name: string;
    email: string;
    password: string;
    roleId: string;
    active: boolean;
  }) => {
    const now = new Date().toISOString();
    if (editingAccount) {
      const updated = accounts.map((a) =>
        a.id === editingAccount.id
          ? {
              ...a,
              name: data.name,
              password: data.password || a.password,
              roleId: data.roleId,
              active: data.active,
            }
          : a
      );
      saveAccounts(updated);
      toast.success("Administrador actualizado");
    } else {
      const exists = accounts.some(
        (a) => a.email.toLowerCase() === data.email.toLowerCase()
      );
      if (exists) {
        toast.error("Ya existe un administrador con ese correo");
        return;
      }
      const newAccount: AdminAccount = {
        id: `acc-${Date.now()}`,
        name: data.name,
        email: data.email,
        password: data.password,
        roleId: data.roleId,
        isSuperAdmin: data.roleId === "role-super-admin",
        active: data.active,
        lastLogin: now,
        twoFactorEnabled: false,
        createdAt: now,
      };
      saveAccounts([...accounts, newAccount]);
      toast.success("Administrador creado", {
        description: `Acceso configurado para ${data.email}`,
      });
    }
    setEditingAccount(null);
    syncState();
  };

  const handleDeleteAccount = () => {
    if (!deleteAccount) return;
    if (deleteAccount.isSuperAdmin) {
      toast.error("No se puede eliminar una cuenta Super Admin");
      setDeleteAccount(null);
      return;
    }
    saveAccounts(accounts.filter((a) => a.id !== deleteAccount.id));
    toast.success("Administrador eliminado");
    setDeleteAccount(null);
    syncState();
  };

  const handleToggleActive = (account: AdminAccount) => {
    if (account.isSuperAdmin) {
      toast.error("No se puede desactivar Super Admin");
      return;
    }
    const updated = accounts.map((a) =>
      a.id === account.id ? { ...a, active: !a.active } : a
    );
    saveAccounts(updated);
    toast.success(account.active ? "Cuenta desactivada" : "Cuenta activada");
    syncState();
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="size-9 rounded-xl bg-violet-100 flex items-center justify-center">
                <KeyRound className="size-4 text-violet-600" />
              </div>
              <h2 className="text-2xl font-bold text-foreground tracking-tight">
                Gestión de accesos
              </h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">
              Administra roles, permisos por módulo y cuentas del equipo de backoffice
            </p>
          </div>
          {isSuperAdmin && (
            <Badge className="self-start bg-violet-100 text-violet-700 border-violet-200 hover:bg-violet-100">
              <Crown className="size-3 mr-1" />
              Control total
            </Badge>
          )}
        </div>
      </motion.div>

      <ReadOnlyBanner module="access" />

      <Tabs defaultValue="users">
        <TabsList className="rounded-xl mb-6">
          <TabsTrigger value="users" className="rounded-lg gap-1.5">
            <Users className="size-3.5" />
            Administradores
          </TabsTrigger>
          <TabsTrigger value="roles" className="rounded-lg gap-1.5">
            <Shield className="size-3.5" />
            Roles y permisos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {accounts.length} administradores registrados
            </p>
            <PermissionGate module="access" showDisabled>
              <Button
                className="rounded-xl gap-1.5"
                onClick={() => {
                  setEditingAccount(null);
                  setUserDialogOpen(true);
                }}
                disabled={!canManage}
              >
                <UserPlus className="size-4" />
                Nuevo administrador
              </Button>
            </PermissionGate>
          </div>

          <div className="grid gap-3">
            {accounts.map((account) => {
              const role = roleMap[account.roleId];
              return (
                <Card
                  key={account.id}
                  className={cn(
                    "rounded-2xl border-border/60 transition-all",
                    !account.active && "opacity-60"
                  )}
                >
                  <CardContent className="flex items-center gap-4 p-4">
                    <div
                      className="size-11 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                      style={{ backgroundColor: role?.color ?? "#64748b" }}
                    >
                      {getInitials(account.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold">{account.name}</p>
                        {account.isSuperAdmin && (
                          <Badge className="text-[9px] h-4 bg-violet-100 text-violet-700 border-violet-200">
                            <Lock className="size-2.5 mr-0.5" />
                            Super Admin
                          </Badge>
                        )}
                        <Badge
                          variant={account.active ? "default" : "secondary"}
                          className="text-[9px] h-4"
                        >
                          {account.active ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{account.email}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Rol: {role?.name ?? "—"} · Último acceso: {formatDate(account.lastLogin)}
                      </p>
                    </div>
                    <PermissionGate module="access" fallback={null}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-xl shrink-0">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl">
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingAccount(account);
                              setUserDialogOpen(true);
                            }}
                          >
                            <Pencil className="size-4" />
                            Editar
                          </DropdownMenuItem>
                          {!account.isSuperAdmin && (
                            <DropdownMenuItem onClick={() => handleToggleActive(account)}>
                              {account.active ? "Desactivar" : "Activar"}
                            </DropdownMenuItem>
                          )}
                          {!account.isSuperAdmin && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={() => setDeleteAccount(account)}
                              >
                                <Trash2 className="size-4" />
                                Eliminar
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </PermissionGate>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {roles.length} roles configurados
            </p>
            <PermissionGate module="access" showDisabled>
              <Button
                className="rounded-xl gap-1.5"
                onClick={() => {
                  setEditingRole(null);
                  setRoleDialogOpen(true);
                }}
                disabled={!canManage}
              >
                <Plus className="size-4" />
                Nuevo rol
              </Button>
            </PermissionGate>
          </div>

          <div className="grid gap-4">
            {roles.map((role) => {
              const userCount = accounts.filter((a) => a.roleId === role.id).length;
              const isExpanded = expandedRoleId === role.id;
              const writeModules = Object.entries(role.permissions).filter(
                ([, p]) => p === "write"
              ).length;
              const readModules = Object.entries(role.permissions).filter(
                ([, p]) => p === "read"
              ).length;

              return (
                <Card key={role.id} className="rounded-2xl border-border/60 overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="size-10 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${role.color}20` }}
                        >
                          <Shield className="size-4" style={{ color: role.color }} />
                        </div>
                        <div>
                          <CardTitle className="text-base flex items-center gap-2">
                            {role.name}
                            {role.isSystem && (
                              <Badge variant="outline" className="text-[9px] h-4">
                                Sistema
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="mt-0.5">
                            {role.description}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="outline" className="text-[10px]">
                          {userCount} usuario{userCount !== 1 ? "s" : ""}
                        </Badge>
                        <PermissionGate module="access" fallback={null}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="rounded-xl">
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-xl">
                              <DropdownMenuItem
                                onClick={() => {
                                  setEditingRole(role);
                                  setRoleDialogOpen(true);
                                }}
                              >
                                <Pencil className="size-4" />
                                {role.isSystem ? "Ver permisos" : "Editar"}
                              </DropdownMenuItem>
                              {!role.isSystem && (
                                <DropdownMenuItem
                                  variant="destructive"
                                  onClick={() => setDeleteRole(role)}
                                >
                                  <Trash2 className="size-4" />
                                  Eliminar
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </PermissionGate>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      {writeModules > 0 && (
                        <Badge variant="outline" className={PERMISSION_COLORS.write}>
                          {writeModules} módulos · escritura
                        </Badge>
                      )}
                      {readModules > 0 && (
                        <Badge variant="outline" className={PERMISSION_COLORS.read}>
                          {readModules} módulos · lectura
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <button
                      type="button"
                      onClick={() => setExpandedRoleId(isExpanded ? null : role.id)}
                      className="text-xs font-medium text-secondary hover:underline"
                    >
                      {isExpanded ? "Ocultar permisos" : "Ver matriz de permisos"}
                    </button>
                    {isExpanded && (
                      <div className="mt-3 rounded-xl border border-border/50 p-3 bg-muted/20">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {Object.entries(role.permissions).map(([mod, level]) =>
                            level !== "none" ? (
                              <div
                                key={mod}
                                className="flex items-center justify-between gap-2 rounded-lg bg-background px-2.5 py-1.5 border border-border/40"
                              >
                                <span className="text-xs font-medium truncate">
                                  {MODULE_LABELS[mod as keyof typeof MODULE_LABELS]}
                                </span>
                                <Badge
                                  variant="outline"
                                  className={cn("text-[9px] shrink-0", PERMISSION_COLORS[level])}
                                >
                                  {PERMISSION_LABELS[level]}
                                </Badge>
                              </div>
                            ) : null
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      <RoleFormDialog
        open={roleDialogOpen}
        onOpenChange={setRoleDialogOpen}
        role={editingRole}
        onSave={handleSaveRole}
      />

      <AdminUserFormDialog
        open={userDialogOpen}
        onOpenChange={setUserDialogOpen}
        roles={roles}
        account={editingAccount}
        onSave={handleSaveAccount}
        canAssignSuperAdmin={isSuperAdmin}
      />

      <AlertDialog open={!!deleteRole} onOpenChange={() => setDeleteRole(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar rol &quot;{deleteRole?.name}&quot;?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Los usuarios con este rol deberán ser reasignados primero.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction className="rounded-xl bg-destructive hover:bg-destructive/90" onClick={handleDeleteRole}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteAccount} onOpenChange={() => setDeleteAccount(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar a {deleteAccount?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              Se revocará el acceso de {deleteAccount?.email} al panel de administración.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction className="rounded-xl bg-destructive hover:bg-destructive/90" onClick={handleDeleteAccount}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
