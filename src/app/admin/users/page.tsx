"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Ban,
  MessageSquare,
  Eye,
  Crown,
  Mail,
  Shield,
  MoreHorizontal,
  UserCheck,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserProfileSheet } from "@/components/admin/UserProfileSheet";
import { DmUserDialog } from "@/components/admin/DmUserDialog";
import { adminUsers } from "@/lib/admin/mock-data";
import { formatCurrency } from "@/lib/admin/formatters";
import type { AdminUser } from "@/lib/admin/types";

const providerIcons = {
  google: "G",
  email: "@",
  apple: "",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(adminUsers);
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [providerFilter, setProviderFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [dmOpen, setDmOpen] = useState(false);
  const [blockDialog, setBlockDialog] = useState<AdminUser | null>(null);

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchTier = tierFilter === "all" || u.tier === tierFilter;
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    const matchProvider = providerFilter === "all" || u.provider === providerFilter;
    return matchSearch && matchTier && matchStatus && matchProvider;
  });

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

  const openProfile = (user: AdminUser) => {
    setSelectedUser(user);
    setProfileOpen(true);
  };

  const openDm = (user: AdminUser) => {
    setSelectedUser(user);
    setDmOpen(true);
  };

  const stats = {
    total: users.length,
    premium: users.filter((u) => u.tier === "premium").length,
    blocked: users.filter((u) => u.status === "blocked").length,
    verified: users.filter((u) => u.verified).length,
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Gestión de usuarios</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {filtered.length} usuarios · {stats.premium} premium · {stats.verified} verificados
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total usuarios", value: stats.total, icon: UserCheck, color: "text-blue-600 bg-blue-50" },
          { label: "Premium", value: stats.premium, icon: Crown, color: "text-amber-600 bg-amber-50" },
          { label: "Verificados", value: stats.verified, icon: Shield, color: "text-green-600 bg-green-50" },
          { label: "Bloqueados", value: stats.blocked, icon: Ban, color: "text-red-600 bg-red-50" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="rounded-2xl border-border/60 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{s.label}</p>
                  <p className="text-xl font-bold mt-0.5">{s.value}</p>
                </div>
                <div className={`size-9 rounded-xl flex items-center justify-center ${s.color.split(" ")[1]}`}>
                  <s.icon className={`size-4 ${s.color.split(" ")[0]}`} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl"
          />
        </div>
        <Select value={tierFilter} onValueChange={setTierFilter}>
          <SelectTrigger className="w-full sm:w-36 rounded-xl">
            <Filter className="size-3.5 mr-1 text-muted-foreground" />
            <SelectValue placeholder="Plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los planes</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
            <SelectItem value="standard">Standard</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-36 rounded-xl">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Activos</SelectItem>
            <SelectItem value="blocked">Bloqueados</SelectItem>
          </SelectContent>
        </Select>
        <Select value={providerFilter} onValueChange={setProviderFilter}>
          <SelectTrigger className="w-full sm:w-40 rounded-xl">
            <SelectValue placeholder="Proveedor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="google">Google</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="apple">Apple</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="rounded-2xl border-border/60 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="pl-4">Usuario</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Proveedor</TableHead>
              <TableHead>Invertido</TableHead>
              <TableHead>Ganancias</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="pr-4 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((u) => (
              <TableRow key={u.id} className="group">
                <TableCell className="pl-4">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-secondary shrink-0">
                      {u.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-medium truncate">{u.name}</p>
                        {u.verified && <Shield className="size-3 text-green-600 shrink-0" />}
                      </div>
                      <p className="text-[10px] text-muted-foreground truncate">{u.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={u.tier === "premium" ? "default" : "outline"} className="text-[10px]">
                    {u.tier === "premium" && <Crown className="size-3 mr-0.5" />}
                    {u.tier === "premium" ? "Premium" : "Standard"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-muted-foreground capitalize flex items-center gap-1">
                    <span className="size-5 rounded bg-muted flex items-center justify-center text-[10px] font-bold">
                      {providerIcons[u.provider]}
                    </span>
                    {u.provider}
                  </span>
                </TableCell>
                <TableCell className="font-medium text-sm">{formatCurrency(u.totalInvested)}</TableCell>
                <TableCell className="text-sm text-green-600 font-medium">{formatCurrency(u.totalGains)}</TableCell>
                <TableCell>
                  <Badge variant={u.status === "active" ? "outline" : "destructive"} className="text-[10px]">
                    {u.status === "active" ? "Activo" : "Bloqueado"}
                  </Badge>
                </TableCell>
                <TableCell className="pr-4">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="rounded-lg"
                      title="Ver perfil"
                      onClick={() => openProfile(u)}
                    >
                      <Eye className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="rounded-lg"
                      title="Enviar mensaje"
                      onClick={() => openDm(u)}
                    >
                      <MessageSquare className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="rounded-lg text-destructive hover:text-destructive"
                      title={u.status === "active" ? "Bloquear" : "Desbloquear"}
                      onClick={() => setBlockDialog(u)}
                    >
                      <Ban className="size-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" className="rounded-lg">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem onClick={() => openProfile(u)}>
                          <Eye className="size-4 mr-2" /> Ver perfil completo
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDm(u)}>
                          <Mail className="size-4 mr-2" /> Enviar mensaje directo
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setBlockDialog(u)}
                        >
                          <Ban className="size-4 mr-2" />
                          {u.status === "active" ? "Bloquear usuario" : "Desbloquear usuario"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <UserProfileSheet
        user={selectedUser}
        open={profileOpen}
        onOpenChange={setProfileOpen}
      />

      <DmUserDialog user={selectedUser} open={dmOpen} onOpenChange={setDmOpen} />

      <AlertDialog open={!!blockDialog} onOpenChange={() => setBlockDialog(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {blockDialog?.status === "active" ? "¿Bloquear usuario?" : "¿Desbloquear usuario?"}
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
    </div>
  );
}
