"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Crown,
  Shield,
  UserCheck,
  Users,
  Clock,
  XCircle,
  CheckCircle2,
  FileWarning,
  Mail,
  MessageSquareText,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminFiltersShell } from "@/components/admin/AdminFiltersShell";
import { UserProfileSheet } from "@/components/admin/UserProfileSheet";
import { UserRowActions } from "@/components/admin/UserRowActions";
import { UserTierBadge } from "@/components/admin/UserTierBadge";
import { UserTierDialog } from "@/components/admin/UserTierDialog";
import { DmUserDialog } from "@/components/admin/DmUserDialog";
import {
  UsersFiltersContent,
  defaultUsersFilters,
  countUsersActiveFilters,
  type UsersFilterState,
} from "@/components/admin/UsersFiltersContent";
import { VerificationDetailSheet } from "@/components/admin/VerificationDetailSheet";
import {
  VerificationActionDialog,
  type VerificationDialogMode,
} from "@/components/admin/VerificationActionDialog";
import { VerificationRowActions } from "@/components/admin/VerificationRowActions";
import { VerificationStatusBadge } from "@/components/admin/VerificationStatusBadge";
import { AdminMessageDialog } from "@/components/admin/AdminMessageDialog";
import { TablePagination } from "@/components/ui/table-pagination";
import { matchesMulti } from "@/lib/admin/filters";
import {
  adminUsers,
  documentTypeLabels,
  getVerificationFullName,
  identityVerifications,
} from "@/lib/admin/mock-data";
import { formatCurrency } from "@/lib/admin/formatters";
import type {
  AdminUser,
  IdentityVerification,
  LoginProvider,
  UserStatus,
  UserTier,
  VerificationActivity,
  VerificationActivityType,
} from "@/lib/admin/types";
import {
  getUpgradeRequests,
  updateUpgradeRequest,
  setTierOverride,
  type PremiumUpgradeRequest,
} from "@/lib/app-store";
import { usePagination } from "@/hooks/use-pagination";
import { ReadOnlyBanner } from "@/components/admin/rbac/ReadOnlyBanner";
import { useModuleAccess } from "@/hooks/use-module-access";
import { cn } from "@/lib/utils";

const providerIcons: Record<LoginProvider, string> = {
  google: "G",
  email: "@",
  apple: "",
};

const statusConfig: Record<
  UserStatus,
  { label: string; rowBorder: string; badge: string }
> = {
  active: {
    label: "Activo",
    rowBorder: "border-l-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  blocked: {
    label: "Bloqueado",
    rowBorder: "border-l-red-400",
    badge: "bg-red-50 text-red-600 border-red-200",
  },
};

function formatDateTime(date: string) {
  return new Intl.DateTimeFormat("es-PE", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function newActivity(
  verificationId: string,
  type: VerificationActivityType,
  message: string,
  adminNote?: string
): VerificationActivity {
  return {
    id: `va-${verificationId}-${Date.now()}`,
    verificationId,
    type,
    message,
    date: new Date().toISOString(),
    adminNote,
  };
}

function matchesVerificationSearch(v: IdentityVerification, q: string) {
  const name = getVerificationFullName(v).toLowerCase();
  return (
    name.includes(q) ||
    v.email.toLowerCase().includes(q) ||
    v.documentNumber.includes(q)
  );
}

export default function AdminUsersPage() {
  const { isReadOnly } = useModuleAccess("users");
  const [users, setUsers] = useState<AdminUser[]>(adminUsers);
  const [verifications, setVerifications] =
    useState<IdentityVerification[]>(identityVerifications);
  const [upgradeRequests, setUpgradeRequests] = useState<PremiumUpgradeRequest[]>(() =>
    getUpgradeRequests()
  );
  const [activeTab, setActiveTab] = useState("clientes");
  const [upgradeRejectDialog, setUpgradeRejectDialog] =
    useState<PremiumUpgradeRequest | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<UsersFilterState>(defaultUsersFilters);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [dmOpen, setDmOpen] = useState(false);
  const [blockDialog, setBlockDialog] = useState<AdminUser | null>(null);
  const [tierDialog, setTierDialog] = useState<AdminUser | null>(null);

  const [selectedVerification, setSelectedVerification] =
    useState<IdentityVerification | null>(null);
  const [verificationSheetOpen, setVerificationSheetOpen] = useState(false);
  const [actionDialog, setActionDialog] = useState<{
    verification: IdentityVerification;
    mode: VerificationDialogMode;
  } | null>(null);
  const [messageDialog, setMessageDialog] = useState<{
    verification: IdentityVerification;
    kind: "rejection" | "resolicit";
  } | null>(null);

  const pendientes = useMemo(
    () =>
      verifications.filter(
        (v) => v.status === "pending" || v.status === "resolicitado"
      ),
    [verifications]
  );

  const rechazados = useMemo(
    () => verifications.filter((v) => v.status === "rejected"),
    [verifications]
  );

  const filteredClientes = useMemo(
    () =>
      users.filter((u) => {
        const q = search.toLowerCase();
        const matchSearch =
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q);
        const matchTier = matchesMulti(filters.tiers, u.tier);
        const matchStatus = matchesMulti(filters.statuses, u.status);
        const matchProvider = matchesMulti(filters.providers, u.provider);
        return matchSearch && matchTier && matchStatus && matchProvider;
      }),
    [users, search, filters]
  );

  const filteredPendientes = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return pendientes;
    return pendientes.filter((v) => matchesVerificationSearch(v, q));
  }, [pendientes, search]);

  const filteredRechazados = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return rechazados;
    return rechazados.filter((v) => matchesVerificationSearch(v, q));
  }, [rechazados, search]);

  const pendingUpgradeRequests = useMemo(
    () => upgradeRequests.filter((r) => r.status === "pending"),
    [upgradeRequests]
  );

  const activeFiltersCount = countUsersActiveFilters(filters);

  const handleApproveUpgrade = (req: PremiumUpgradeRequest) => {
    const now = new Date().toISOString();
    updateUpgradeRequest(req.id, { status: "approved", resolvedAt: now });
    setTierOverride(req.userId, "premium");
    // Also update in the local users list if found
    setUsers((prev) =>
      prev.map((u) => (u.id === req.userId ? { ...u, tier: "premium" } : u))
    );
    setUpgradeRequests(getUpgradeRequests());
        toast.success(`${req.userName} ahora es Premium`, {
      description: "El tier fue actualizado. El usuario lo verá al recargar.",
    });
  };

  const handleRejectUpgrade = (req: PremiumUpgradeRequest) => {
    if (!rejectReason.trim()) return;
    const now = new Date().toISOString();
    updateUpgradeRequest(req.id, {
      status: "rejected",
      resolvedAt: now,
      rejectionReason: rejectReason.trim(),
    });
    setUpgradeRequests(getUpgradeRequests());
    setUpgradeRejectDialog(null);
    setRejectReason("");
        toast.success(`Solicitud de ${req.userName} rechazada`);
  };

  const [pageSize, setPageSize] = useState(8);

  const clientesPagination = usePagination(filteredClientes, {
    pageSize,
    resetDeps: [search, filters, pageSize],
  });
  const pendientesPagination = usePagination(filteredPendientes, {
    pageSize,
    resetDeps: [search, pageSize],
  });
  const rechazadosPagination = usePagination(filteredRechazados, {
    pageSize,
    resetDeps: [search, pageSize],
  });
  const upgradesPagination = usePagination(pendingUpgradeRequests, {
    pageSize,
    resetDeps: [pageSize, upgradeRequests],
  });

  const activePagination =
    activeTab === "clientes"
      ? clientesPagination
      : activeTab === "pendientes"
        ? pendientesPagination
        : activeTab === "upgrades"
          ? upgradesPagination
          : rechazadosPagination;

  const { page, setPage, totalPages, rangeStart, rangeEnd, totalItems } =
    activePagination;

  const stats = useMemo(
    () => ({
      total: users.length,
      premium: users.filter((u) => u.tier === "premium").length,
      pendientes: pendientes.length,
      rechazados: rechazados.length,
      upgradesPending: pendingUpgradeRequests.length,
    }),
    [users, pendientes, rechazados, pendingUpgradeRequests]
  );

  const clearFilters = () => setFilters(defaultUsersFilters);

  const syncSelectedVerification = (updated: IdentityVerification) => {
    setVerifications((prev) =>
      prev.map((v) => (v.id === updated.id ? updated : v))
    );
    setSelectedVerification(updated);
  };

  const handleAccept = (v: IdentityVerification) => {
    const name = getVerificationFullName(v);
    const newUser: AdminUser = {
      id: `u-${v.id}`,
      name,
      email: v.email,
      tier: "standard",
      provider: v.provider,
      totalInvested: 0,
      totalGains: 0,
      status: "active",
      joinedAt: new Date().toISOString().slice(0, 10),
      phone: v.phone,
      dni: v.documentNumber,
      verified: true,
      lastActive: new Date().toISOString(),
    };

    const updated: IdentityVerification = {
      ...v,
      activityLog: [
        ...v.activityLog,
        newActivity(v.id, "accepted", "Verificación de identidad aprobada"),
      ],
    };

    setUsers((prev) => [newUser, ...prev]);
    setVerifications((prev) => prev.filter((item) => item.id !== v.id));
    setVerificationSheetOpen(false);
    setSelectedVerification(null);
    toast.success(`${name} ahora es cliente`, {
      description: "KYC aprobado · visible en la pestaña Clientes",
    });
    if (selectedVerification?.id === v.id) {
      setSelectedVerification(updated);
    }
    setActiveTab("clientes");
  };

  const handleReject = (v: IdentityVerification, message: string) => {
    const updated: IdentityVerification = {
      ...v,
      status: "rejected",
      rejectionReason: message,
      activityLog: [
        ...v.activityLog,
        newActivity(
          v.id,
          "rejected",
          "Verificación de identidad rechazada",
          message
        ),
      ],
    };
    syncSelectedVerification(updated);
    setActionDialog(null);
    toast.success("Verificación rechazada", {
      description: `Notificación enviada a ${v.email}`,
    });
    setActiveTab("rechazados");
  };

  const handleResolicitar = (v: IdentityVerification, message: string) => {
    const updated: IdentityVerification = {
      ...v,
      status: "resolicitado",
      resolicitReason: message,
      submittedAt: new Date().toISOString(),
      activityLog: [
        ...v.activityLog,
        newActivity(
          v.id,
          "resolicitado",
          "Se solicitó nueva verificación de identidad",
          message
        ),
      ],
    };
    syncSelectedVerification(updated);
    setActionDialog(null);
    toast.success("Nueva verificación solicitada", {
      description: `Instrucciones enviadas a ${v.email}`,
    });
  };

  const openVerificationSheet = (v: IdentityVerification) => {
    setSelectedVerification(v);
    setVerificationSheetOpen(true);
  };

  const handleBlock = (user: AdminUser) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id
          ? { ...u, status: u.status === "active" ? "blocked" : "active" }
          : u
      )
    );
    toast.success(
      user.status === "active"
        ? `${user.name} ha sido bloqueado`
        : `${user.name} ha sido desbloqueado`
    );
    setBlockDialog(null);
  };

  const openTierDialog = (user: AdminUser) => setTierDialog(user);

  const handleTierChange = (
    user: AdminUser,
    newTier: UserTier,
    notify: boolean
  ) => {
    const updatedUser = { ...user, tier: newTier };
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? updatedUser : u))
    );
    if (selectedUser?.id === user.id) setSelectedUser(updatedUser);
    toast.success(
      newTier === "premium"
        ? `${user.name} ahora es usuario Premium`
        : `${user.name} volvió al plan Standard`,
      {
        description: notify
          ? "Se envió la notificación por correo"
          : "Cambio aplicado sin notificación",
      }
    );
    setTierDialog(null);
  };

  const openProfile = (user: AdminUser) => {
    setSelectedUser(user);
    setProfileOpen(true);
  };

  const openDm = (user: AdminUser) => {
    setSelectedUser(user);
    setDmOpen(true);
  };

  const searchPlaceholder =
    activeTab === "clientes"
      ? "Buscar por nombre o email..."
      : "Buscar por nombre, email o documento...";

  return (
    <TooltipProvider delayDuration={250}>
      <div className="w-full">
        <ReadOnlyBanner module="users" />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
            Base de usuarios
          </p>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Gestión de usuarios
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Clientes activos, verificaciones pendientes y solicitudes rechazadas
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            {
              label: "Clientes",
              value: String(stats.total),
              sub: "KYC aprobado",
              icon: Users,
              accent: "text-blue-600 bg-blue-50",
            },
            {
              label: "Pendientes",
              value: String(stats.pendientes),
              sub: "por revisar",
              icon: Clock,
              accent: "text-amber-600 bg-amber-50",
            },
            {
              label: "Rechazados",
              value: String(stats.rechazados),
              sub: "verificación denegada",
              icon: XCircle,
              accent: "text-red-600 bg-red-50",
            },
            {
              label: "Premium",
              value: String(stats.premium),
              sub: "suscripción activa",
              icon: Crown,
              accent: "text-violet-600 bg-violet-50",
            },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-xl border border-border/60 bg-background px-4 py-3"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide truncate">
                    {s.label}
                  </p>
                  <p className="text-lg font-bold text-foreground mt-0.5">
                    {s.value}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{s.sub}</p>
                </div>
                <div
                  className={cn(
                    "size-9 rounded-lg flex items-center justify-center shrink-0",
                    s.accent.split(" ")[1]
                  )}
                >
                  <s.icon className={cn("size-4", s.accent.split(" ")[0])} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(v) => {
            setActiveTab(v);
            setPage(1);
          }}
          className="gap-4"
        >
          <TabsList
            variant="default"
          >
            <TabsTrigger
              value="clientes"
            >
              Clientes
              <span className="ml-1.5 text-[10px] tabular-nums text-muted-foreground">
                {users.length}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="pendientes"
            >
              Pendientes
              {pendientes.length > 0 && (
                <span className="ml-1.5 inline-flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white px-1">
                  {pendientes.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="rechazados"
            >
              Rechazados
              <span className="ml-1.5 text-[10px] tabular-nums text-white bg-red-400  min-w-[18px] h-[18px] flex items-center justify-center rounded-full">
                {rechazados.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="upgrades">
              Solicitudes Premium
              {pendingUpgradeRequests.length > 0 && (
                <span className="ml-1.5 inline-flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white px-1">
                  {pendingUpgradeRequests.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <div className="rounded-xl border border-border/60 bg-white overflow-hidden">
            <div className="flex flex-row justify-between items-center gap-3 p-4 border-b border-border/40 bg-muted/15">
              <div className="relative flex-1 min-w-0 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder={searchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-10 rounded-xl border-border/80 bg-background w-full"
                />
              </div>
              {activeTab === "clientes" && (
                <AdminFiltersShell
                  activeCount={activeFiltersCount}
                  onClear={clearFilters}
                  title="Filtrar usuarios"
                  description="Combina plan, estado y proveedor"
                >
                  <UsersFiltersContent
                    filters={filters}
                    onChange={setFilters}
                  />
                </AdminFiltersShell>
              )}
            </div>

            <TabsContent value="clientes" className="mt-0">
              <UsersTable
                users={clientesPagination.paginatedItems}
                totalFiltered={filteredClientes.length}
                onClearFilters={clearFilters}
                onViewProfile={openProfile}
                onSendMessage={openDm}
                onToggleBlock={setBlockDialog}
                onManageTier={openTierDialog}
                readOnly={isReadOnly}
              />
            </TabsContent>

            <TabsContent value="pendientes" className="mt-0">
              <VerificationsTable
                items={pendientesPagination.paginatedItems}
                totalFiltered={filteredPendientes.length}
                variant="pendientes"
                onViewMessage={(v, kind) => setMessageDialog({ verification: v, kind })}
                onAccept={handleAccept}
                onReject={(v) =>
                  setActionDialog({ verification: v, mode: "reject" })
                }
                onResolicitar={(v) =>
                  setActionDialog({ verification: v, mode: "resolicitar" })
                }
                onViewMore={openVerificationSheet}
                readOnly={isReadOnly}
              />
            </TabsContent>

            <TabsContent value="rechazados" className="mt-0">
              <VerificationsTable
                items={rechazadosPagination.paginatedItems}
                totalFiltered={filteredRechazados.length}
                variant="rechazados"
                onViewMessage={(v, kind) => setMessageDialog({ verification: v, kind })}
                onViewMore={openVerificationSheet}
              />
            </TabsContent>

            <TabsContent value="upgrades" className="mt-0">
              <UpgradeRequestsTable
                items={upgradesPagination.paginatedItems}
                onApprove={handleApproveUpgrade}
                onReject={(r) => { setUpgradeRejectDialog(r); setRejectReason(""); }}
                readOnly={isReadOnly}
              />
            </TabsContent>

            <TablePagination
              page={page}
              totalPages={totalPages}
              totalItems={totalItems}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          </div>
        </Tabs>

        <UserProfileSheet
          user={selectedUser}
          open={profileOpen}
          onOpenChange={setProfileOpen}
          onManageTier={openTierDialog}
          onBlockUser={setBlockDialog}
        />

        <DmUserDialog user={selectedUser} open={dmOpen} onOpenChange={setDmOpen} />

        <UserTierDialog
          user={tierDialog}
          open={!!tierDialog}
          onOpenChange={(open) => !open && setTierDialog(null)}
          onConfirm={handleTierChange}
        />

        <VerificationDetailSheet
          verification={selectedVerification}
          open={verificationSheetOpen}
          onOpenChange={setVerificationSheetOpen}
          onAccept={
            selectedVerification?.status !== "rejected" ? handleAccept : undefined
          }
          onReject={
            selectedVerification?.status !== "rejected"
              ? (v) => setActionDialog({ verification: v, mode: "reject" })
              : undefined
          }
          onResolicitar={
            selectedVerification?.status !== "rejected"
              ? (v) => setActionDialog({ verification: v, mode: "resolicitar" })
              : undefined
          }
          onViewAdminMessage={(v, kind) =>
            setMessageDialog({ verification: v, kind })
          }
        />

        <VerificationActionDialog
          verification={actionDialog?.verification ?? null}
          mode={actionDialog?.mode ?? null}
          open={!!actionDialog}
          onOpenChange={(open) => !open && setActionDialog(null)}
          onConfirm={(v, message) => {
            if (actionDialog?.mode === "reject") handleReject(v, message);
            else handleResolicitar(v, message);
          }}
        />

        <AdminMessageDialog
          verification={messageDialog?.verification ?? null}
          kind={messageDialog?.kind ?? null}
          open={!!messageDialog}
          onOpenChange={(open) => !open && setMessageDialog(null)}
        />

        <AlertDialog open={!!blockDialog} onOpenChange={() => setBlockDialog(null)}>
          <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>
                {blockDialog?.status === "active"
                  ? "¿Bloquear usuario?"
                  : "¿Desbloquear usuario?"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {blockDialog?.status === "active"
                  ? `${blockDialog.name} no podrá acceder a la plataforma ni realizar inversiones.`
                  : `${blockDialog?.name} recuperará el acceso completo a la plataforma.`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
              <AlertDialogAction
                className="rounded-xl"
                onClick={() => blockDialog && handleBlock(blockDialog)}
              >
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Upgrade rejection dialog */}
        <AlertDialog
          open={!!upgradeRejectDialog}
          onOpenChange={(open) => { if (!open) { setUpgradeRejectDialog(null); setRejectReason(""); } }}
        >
          <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Rechazar solicitud Premium</AlertDialogTitle>
              <AlertDialogDescription>
                Explica por qué se rechaza la solicitud de{" "}
                <strong>{upgradeRejectDialog?.userName}</strong>. El usuario podrá volver a solicitarlo.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="px-0 pb-0">
              <Input
                placeholder="Motivo del rechazo..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
              <AlertDialogAction
                className="rounded-xl bg-red-600 hover:bg-red-700"
                disabled={!rejectReason.trim()}
                onClick={() => upgradeRejectDialog && handleRejectUpgrade(upgradeRejectDialog)}
              >
                Rechazar solicitud
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
}

function UsersTable({
  users,
  totalFiltered,
  onClearFilters,
  onViewProfile,
  onSendMessage,
  onToggleBlock,
  onManageTier,
  readOnly = false,
}: {
  users: AdminUser[];
  totalFiltered: number;
  onClearFilters: () => void;
  onViewProfile: (u: AdminUser) => void;
  onSendMessage: (u: AdminUser) => void;
  onToggleBlock: (u: AdminUser) => void;
  onManageTier: (u: AdminUser) => void;
  readOnly?: boolean;
}) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40 border-b border-border/60">
            <TableHead className="pl-4 min-w-[200px] text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Usuario
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Plan
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden md:table-cell">
              Proveedor
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Invertido
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden sm:table-cell">
              Ganancias
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Estado
            </TableHead>
            <TableHead className="pr-4 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => {
            const cfg = statusConfig[u.status];
            return (
              <TableRow
                key={u.id}
                className={cn(
                  "group border-l-[3px] hover:bg-muted/25 transition-colors",
                  cfg.rowBorder
                )}
              >
                <TableCell className="pl-4 py-3">
                  <div className="flex items-center gap-3 min-w-[180px]">
                    <div className="size-10 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary shrink-0 ring-2 ring-background">
                      {u.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-medium truncate max-w-[160px]">
                          {u.name}
                        </p>
                        {u.verified && (
                          <Shield className="size-3 text-emerald-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground truncate max-w-[180px]">
                        {u.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <UserTierBadge user={u} onManage={onManageTier} />
                </TableCell>
                <TableCell className="py-3 hidden md:table-cell">
                  <span className="text-xs text-muted-foreground capitalize inline-flex items-center gap-1.5">
                    <span className="size-6 rounded-md bg-muted flex items-center justify-center text-[10px] font-bold">
                      {providerIcons[u.provider]}
                    </span>
                    {u.provider}
                  </span>
                </TableCell>
                <TableCell className="py-3 whitespace-nowrap">
                  <p className="text-sm font-semibold tabular-nums">
                    {formatCurrency(u.totalInvested)}
                  </p>
                </TableCell>
                <TableCell className="py-3 whitespace-nowrap hidden sm:table-cell">
                  <p className="text-sm font-semibold text-emerald-600 tabular-nums">
                    {formatCurrency(u.totalGains)}
                  </p>
                </TableCell>
                <TableCell className="py-3">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold",
                      cfg.badge
                    )}
                  >
                    {cfg.label}
                  </span>
                </TableCell>
                <TableCell className="pr-4 py-3">
                  <div className="flex justify-end">
                    <UserRowActions
                      user={u}
                      onViewProfile={onViewProfile}
                      onSendMessage={onSendMessage}
                      onToggleBlock={onToggleBlock}
                      readOnly={readOnly}
                    />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
          {totalFiltered === 0 && (
            <EmptyRow
              colSpan={7}
              title="Sin clientes"
              description="Ajusta los filtros de búsqueda"
              onClear={onClearFilters}
            />
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function VerificationsTable({
  items,
  totalFiltered,
  variant,
  onViewMessage,
  onAccept,
  onReject,
  onResolicitar,
  onViewMore,
  readOnly = false,
}: {
  items: IdentityVerification[];
  totalFiltered: number;
  variant: "pendientes" | "rechazados";
  onViewMessage: (
    v: IdentityVerification,
    kind: "rejection" | "resolicit"
  ) => void;
  onAccept?: (v: IdentityVerification) => void;
  onReject?: (v: IdentityVerification) => void;
  onResolicitar?: (v: IdentityVerification) => void;
  onViewMore: (v: IdentityVerification) => void;
  readOnly?: boolean;
}) {
  const isRejectedTab = variant === "rechazados";

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40 border-b border-border/60">
            <TableHead className="pl-4 min-w-[200px] text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Solicitante
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Documento
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden md:table-cell">
              Celular
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden sm:table-cell">
              {isRejectedTab ? "Rechazado" : "Enviado"}
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Estado
            </TableHead>
            {!isRejectedTab && (
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden lg:table-cell">
                Nota admin
              </TableHead>
            )}
            {isRejectedTab && (
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden lg:table-cell">
                Motivo
              </TableHead>
            )}
            <TableHead className="pr-4 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground min-w-[200px]">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((v) => {
            const name = getVerificationFullName(v);
            const borderColor =
              v.status === "resolicitado"
                ? "border-l-sky-500"
                : v.status === "rejected"
                  ? "border-l-red-400"
                  : "border-l-amber-400";

            return (
              <TableRow
                key={v.id}
                className={cn(
                  "group border-l-[3px] hover:bg-muted/25 transition-colors",
                  borderColor
                )}
              >
                <TableCell className="pl-4 py-3">
                  <div className="flex items-center gap-3 min-w-[180px]">
                    <div className="size-10 rounded-full bg-amber-500/15 flex items-center justify-center text-xs font-bold text-amber-800 shrink-0">
                      {v.firstName[0]}
                      {v.lastName[0]?.[0] ?? ""}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate max-w-[160px]">
                        {name}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate max-w-[180px] flex items-center gap-1">
                        <Mail className="size-3 shrink-0" />
                        {v.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <p className="text-sm font-medium">
                    {documentTypeLabels[v.documentType]}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-mono">
                    {v.documentNumber}
                  </p>
                </TableCell>
                <TableCell className="py-3 hidden md:table-cell text-sm text-muted-foreground">
                  {v.phone}
                </TableCell>
                <TableCell className="py-3 hidden sm:table-cell text-xs text-muted-foreground whitespace-nowrap">
                  {formatDateTime(v.submittedAt)}
                </TableCell>
                <TableCell className="py-3">
                  <VerificationStatusBadge status={v.status} />
                </TableCell>
                {!isRejectedTab && (
                  <TableCell className="py-3 hidden lg:table-cell max-w-[200px]">
                    {v.status === "resolicitado" && v.resolicitReason ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto py-1 px-2 text-xs text-sky-700 hover:text-sky-800 hover:bg-sky-50 rounded-lg justify-start font-normal"
                        onClick={() => onViewMessage(v, "resolicit")}
                      >
                        <MessageSquareText className="size-3.5 mr-1.5 shrink-0" />
                        <span className="truncate max-w-[140px]">
                          Ver mensaje enviado
                        </span>
                      </Button>
                    ) : (
                      <span className="text-[10px] text-muted-foreground">—</span>
                    )}
                  </TableCell>
                )}
                {isRejectedTab && (
                  <TableCell className="py-3 hidden lg:table-cell">
                    {v.rejectionReason ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto py-1 px-2 text-xs text-red-700 hover:text-red-800 hover:bg-red-50 rounded-lg justify-start font-normal"
                        onClick={() => onViewMessage(v, "rejection")}
                      >
                        <FileWarning className="size-3.5 mr-1.5 shrink-0" />
                        Ver motivo de rechazo
                      </Button>
                    ) : (
                      <span className="text-[10px] text-muted-foreground">—</span>
                    )}
                  </TableCell>
                )}
                <TableCell className="pr-4 py-3">
                  <div className="flex justify-end">
                    <VerificationRowActions
                      verification={v}
                      showAccept={!isRejectedTab}
                      showReject={!isRejectedTab}
                      showResolicitar={!isRejectedTab}
                      onAccept={onAccept}
                      onReject={onReject}
                      onResolicitar={onResolicitar}
                      onViewMore={onViewMore}
                      readOnly={readOnly}
                    />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
          {totalFiltered === 0 && (
            <EmptyRow
              colSpan={isRejectedTab ? 7 : 7}
              title={
                isRejectedTab
                  ? "Sin verificaciones rechazadas"
                  : "Sin verificaciones pendientes"
              }
              description={
                isRejectedTab
                  ? "Las solicitudes rechazadas aparecerán aquí"
                  : "Las nuevas solicitudes desde /verification aparecerán aquí"
              }
            />
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function EmptyRow({
  colSpan,
  title,
  description,
  onClear,
}: {
  colSpan: number;
  title: string;
  description: string;
  onClear?: () => void;
}) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="py-16 text-center">
        <UserCheck className="size-8 text-muted-foreground/30 mx-auto mb-2" />
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
        {onClear && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            className="rounded-xl mt-3"
          >
            Limpiar filtros
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}

function UpgradeRequestsTable({
  items,
  onApprove,
  onReject,
  readOnly = false,
}: {
  items: PremiumUpgradeRequest[];
  onApprove: (r: PremiumUpgradeRequest) => void;
  onReject: (r: PremiumUpgradeRequest) => void;
  readOnly?: boolean;
}) {
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <Crown className="size-8 text-muted-foreground/30 mx-auto mb-2" />
        <p className="text-sm font-medium text-foreground">Sin solicitudes pendientes</p>
        <p className="text-xs text-muted-foreground mt-1">
          Cuando un usuario solicite upgrade, aparecerá aquí
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border/60">
      {items.map((req) => {
        const isExpanded = expandedId === req.id;
        const initials = req.userName
          .split(" ")
          .slice(0, 2)
          .map((n) => n[0])
          .join("");
        const submittedDate = new Intl.DateTimeFormat("es-PE", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date(req.submittedAt));

        return (
          <div key={req.id} className="p-4">
            {/* Summary row */}
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-full bg-amber-100 flex items-center justify-center text-sm font-bold text-amber-800 shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-foreground">{req.userName}</p>
                  <span className="text-xs text-muted-foreground">{req.userEmail}</span>
                </div>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground flex-wrap">
                  <span>Solicitado: {submittedDate}</span>
                  <span>Invertido: {formatCurrency(req.totalInvested, "PEN")}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-lg text-xs h-8"
                  onClick={() => setExpandedId(isExpanded ? null : req.id)}
                >
                  {isExpanded ? "Ocultar" : "Ver perfil"}
                </Button>
                {!readOnly && (
                  <>
                    <Button
                      size="sm"
                      className="rounded-lg h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                      onClick={() => onApprove(req)}
                    >
                      <CheckCircle2 className="size-3.5 mr-1" />
                      Aprobar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-lg h-8 text-red-600 border-red-200 hover:bg-red-50 text-xs"
                      onClick={() => onReject(req)}
                    >
                      <XCircle className="size-3.5 mr-1" />
                      Rechazar
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Expanded profile details */}
            {isExpanded && (
              <div className="mt-4 ml-14 rounded-xl border border-amber-200 bg-amber-50/40 p-4 grid sm:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Información del usuario
                  </p>
                  <div className="flex items-center gap-2">
                    <Mail className="size-3.5 text-muted-foreground shrink-0" />
                    <span className="truncate">{req.userEmail}</span>
                  </div>
                  {req.userPhone && (
                    <div className="flex items-center gap-2">
                      <FileWarning className="size-3.5 text-muted-foreground shrink-0" />
                      <span>{req.userPhone}</span>
                    </div>
                  )}
                  {req.userDni && (
                    <div className="flex items-center gap-2">
                      <Shield className="size-3.5 text-muted-foreground shrink-0" />
                      <span>DNI: {req.userDni}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Actividad de inversión
                  </p>
                  <div className="rounded-lg bg-white border border-amber-100 p-3">
                    <p className="text-xs text-muted-foreground">Total invertido</p>
                    <p className="text-lg font-bold text-foreground">
                      {formatCurrency(req.totalInvested, "PEN")}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Al aprobar, el usuario será promovido a Premium de inmediato.
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
