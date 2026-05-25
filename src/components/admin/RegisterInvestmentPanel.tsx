"use client";

import { useState } from "react";
import { Search, UserPlus, DollarSign, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { adminUsers } from "@/lib/admin/mock-data";
import { formatCurrency } from "@/lib/admin/formatters";
import type { AdminUser } from "@/lib/admin/types";

interface RegisterInvestmentPanelProps {
  propertyTitle: string;
  remainingAmount: number;
  onInvestmentRegistered?: (amount: number, user: AdminUser) => void;
}

export function RegisterInvestmentPanel({
  propertyTitle,
  remainingAmount,
  onInvestmentRegistered,
}: RegisterInvestmentPanelProps) {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const filteredUsers = adminUsers
    .filter(
      (u) =>
        u.status === "active" &&
        (u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase()))
    )
    .slice(0, 5);

  const parsedAmount = parseFloat(amount) || 0;
  const isValid = selectedUser && parsedAmount >= 500 && parsedAmount <= remainingAmount;

  const handleRegister = () => {
    if (!selectedUser || !isValid) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Inversión registrada", {
        description: `${formatCurrency(parsedAmount)} de ${selectedUser.name} en ${propertyTitle}`,
      });
      onInvestmentRegistered?.(parsedAmount, selectedUser);
      setSelectedUser(null);
      setAmount("");
      setSearch("");
    }, 1200);
  };

  return (
    <Card className="rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-accent/20 to-background shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="size-9 rounded-xl bg-primary flex items-center justify-center">
            <UserPlus className="size-4 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-base">Registrar inversión manual</CardTitle>
            <CardDescription className="text-xs">
              Asigna capital de un inversor a esta propiedad
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-medium">Buscar inversor</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Nombre o correo del usuario..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedUser(null);
              }}
              className="pl-9 rounded-xl"
            />
          </div>
          {search && !selectedUser && (
            <div className="rounded-xl border border-border/60 bg-white overflow-hidden mt-1">
              {filteredUsers.length === 0 ? (
                <p className="text-xs text-muted-foreground p-3 text-center">No se encontraron usuarios</p>
              ) : (
                filteredUsers.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      setSelectedUser(u);
                      setSearch(u.name);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted/50 transition-colors text-left border-b border-border/40 last:border-0"
                  >
                    <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-secondary shrink-0">
                      {u.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{u.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                    </div>
                    <Badge variant={u.tier === "premium" ? "default" : "outline"} className="text-[9px] shrink-0">
                      {u.tier}
                    </Badge>
                  </button>
                ))
              )}
            </div>
          )}
          {selectedUser && (
            <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 p-2.5 mt-1">
              <CheckCircle2 className="size-4 text-green-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-green-800">{selectedUser.name}</p>
                <p className="text-[10px] text-green-600">{selectedUser.email}</p>
              </div>
              <button
                type="button"
                onClick={() => { setSelectedUser(null); setSearch(""); }}
                className="text-[10px] text-green-700 underline"
              >
                Cambiar
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="amount" className="text-xs font-medium">Monto de inversión (S/)</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="amount"
              type="number"
              min={500}
              max={remainingAmount}
              placeholder={`Mín. S/ 500 — Disponible: ${formatCurrency(remainingAmount)}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-9 rounded-xl"
            />
          </div>
          {parsedAmount > remainingAmount && (
            <p className="text-xs text-destructive">Excede el monto disponible ({formatCurrency(remainingAmount)})</p>
          )}
        </div>

        <Button
          onClick={handleRegister}
          disabled={!isValid || loading}
          className="w-full rounded-xl h-11 font-semibold"
        >
          {loading ? "Registrando..." : "Confirmar inversión"}
        </Button>

        <p className="text-[10px] text-muted-foreground text-center">
          Esta acción quedará registrada en el historial de auditoría del admin.
        </p>
      </CardContent>
    </Card>
  );
}
