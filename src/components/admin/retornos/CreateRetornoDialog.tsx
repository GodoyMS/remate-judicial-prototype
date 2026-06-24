"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CreditCard,
  Landmark,
  Check,
  User,
  Upload,
  X,
  TrendingUp,
  RotateCcw,
  Target,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { addRetorno } from "@/lib/retornos/store";
import type { RetornoType, RetornoPaymentMethod } from "@/lib/retornos/types";
import type { AdminUser } from "@/lib/admin/types";

const STEPS = ["Tipo", "Destinatario", "Pago", "Confirmar"];

const RETORNO_TYPES: {
  id: RetornoType;
  label: string;
  description: string;
  icon: typeof TrendingUp;
  color: string;
}[] = [
  {
    id: "roi_return",
    label: "Retorno de inversión",
    description: "Pago de ganancias al cliente por inversión exitosa",
    icon: TrendingUp,
    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
  },
  {
    id: "refund",
    label: "Reembolso",
    description: "Devolución por problema de pago o error en la inversión",
    icon: RotateCcw,
    color: "text-blue-600 bg-blue-50 border-blue-200",
  },
  {
    id: "goal_not_reached",
    label: "Meta no alcanzada",
    description: "Devolución porque la propiedad no alcanzó el monto objetivo",
    icon: Target,
    color: "text-amber-600 bg-amber-50 border-amber-200",
  },
];

const MOCK_PROPERTIES = [
  { id: "prop-001", title: "Apartamento en San Isidro – Lote 12B", currency: "PEN" },
  { id: "prop-002", title: "Local Comercial Miraflores – Av. Larco", currency: "PEN" },
  { id: "prop-003", title: "Casa en Surco – Urbanización Las Casuarinas", currency: "PEN" },
  { id: "prop-004", title: "Departamento en Barranco – Av. San Martín", currency: "PEN" },
  { id: "prop-005", title: "Oficina en San Borja – Edificio Torre Norte", currency: "USD" },
];

const MOCK_USERS: Pick<AdminUser, "id" | "name" | "email">[] = [
  { id: "user-001", name: "Carlos Mendoza Ríos", email: "carlos.mendoza@gmail.com" },
  { id: "user-002", name: "Ana Lucía Torres", email: "ana.torres@outlook.com" },
  { id: "user-003", name: "Roberto Sánchez Vega", email: "rsanchez@empresa.pe" },
  { id: "user-004", name: "Patricia Huamán Quispe", email: "phuaman@yahoo.com" },
  { id: "user-005", name: "Jorge Díaz Luna", email: "jorge.diaz@gmail.com" },
];

const BANKS = ["BCP", "Interbank", "BBVA", "Scotiabank", "BanBif", "Pichincha"];

interface CreateRetornoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  adminName: string;
}

function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}
function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
}

export function CreateRetornoDialog({
  open,
  onOpenChange,
  adminName,
}: CreateRetornoDialogProps) {
  const [step, setStep] = useState(0);
  const [type, setType] = useState<RetornoType | null>(null);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<RetornoPaymentMethod | null>(null);

  // Card fields
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // Bank transfer fields
  const [bankName, setBankName] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [transferRef, setTransferRef] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);

  function reset() {
    setStep(0);
    setType(null);
    setSelectedUserId("");
    setSelectedPropertyId("");
    setAmount("");
    setNotes("");
    setPaymentMethod(null);
    setCardNumber("");
    setCardHolder("");
    setCardExpiry("");
    setCardCvv("");
    setBankName("");
    setAccountHolder("");
    setAccountNumber("");
    setTransferRef("");
    setProofFile(null);
  }

  const selectedUser = MOCK_USERS.find((u) => u.id === selectedUserId);
  const selectedProperty = MOCK_PROPERTIES.find((p) => p.id === selectedPropertyId);

  function canGoNext() {
    if (step === 0) return !!type;
    if (step === 1)
      return !!selectedUserId && !!selectedPropertyId && !!amount && parseFloat(amount) > 0;
    if (step === 2) {
      if (!paymentMethod) return false;
      if (paymentMethod === "card")
        return (
          cardNumber.replace(/\s/g, "").length >= 16 &&
          cardHolder.trim().length > 0 &&
          cardExpiry.replace(/\s/g, "").length >= 4 &&
          cardCvv.length >= 3
        );
      if (paymentMethod === "bank_transfer")
        return (
          bankName.length > 0 &&
          accountHolder.trim().length > 0 &&
          accountNumber.trim().length > 0 &&
          transferRef.trim().length > 0
        );
    }
    return true;
  }

  async function handleSubmit() {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));

    addRetorno({
      type: type!,
      propertyId: selectedProperty!.id,
      propertyTitle: selectedProperty!.title,
      userId: selectedUser!.id,
      userName: selectedUser!.name,
      userEmail: selectedUser!.email,
      amount: parseFloat(amount),
      currency: (selectedProperty!.currency as "PEN" | "USD") ?? "PEN",
      paymentMethod: paymentMethod!,
      ...(paymentMethod === "card"
        ? {
            cardLastFour: cardNumber.replace(/\s/g, "").slice(-4),
            cardholderName: cardHolder.toUpperCase(),
          }
        : {
            bankName,
            accountHolder,
            accountNumber,
            transferReference: transferRef,
            transferProofName: proofFile?.name,
          }),
      createdBy: adminName,
      notes: notes.trim() || undefined,
    });

    setSubmitting(false);
    toast.success("Retorno creado exitosamente");
    reset();
    onOpenChange(false);
  }

  const typeConfig = RETORNO_TYPES.find((t) => t.id === type);

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="sm:max-w-xl overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle>Nuevo retorno</DialogTitle>
          <DialogDescription>
            Registra un retorno, reembolso o devolución a un inversor
          </DialogDescription>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex items-center gap-0 px-6 pt-4">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <div
                className={cn(
                  "flex size-7 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                  i < step
                    ? "bg-primary text-primary-foreground"
                    : i === step
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {i < step ? <Check className="size-3.5" /> : i + 1}
              </div>
              <span
                className={cn(
                  "ml-1.5 text-xs font-medium",
                  i === step ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {s}
              </span>
              {i < STEPS.length - 1 && (
                <div
                  className={cn(
                    "mx-3 h-px flex-1 w-8",
                    i < step ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        <div className="overflow-hidden px-6 pb-6 pt-5">
          <AnimatePresence mode="wait">
            {/* Step 0 – Type */}
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-3"
              >
                <p className="text-sm font-medium text-foreground">
                  Selecciona el tipo de retorno
                </p>
                {RETORNO_TYPES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setType(t.id)}
                    className={cn(
                      "w-full rounded-xl border p-4 text-left transition-all",
                      type === t.id
                        ? "border-foreground bg-foreground/5 ring-1 ring-foreground"
                        : "border-border hover:border-foreground/40 hover:bg-muted/30"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("flex size-9 items-center justify-center rounded-lg border", t.color)}>
                        <t.icon className="size-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{t.label}</p>
                        <p className="text-xs text-muted-foreground">{t.description}</p>
                      </div>
                      {type === t.id && (
                        <Check className="ml-auto size-4 shrink-0 text-foreground" />
                      )}
                    </div>
                  </button>
                ))}
              </motion.div>
            )}

            {/* Step 1 – Client & Property */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Cliente <span className="text-destructive">*</span>
                  </Label>
                  <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Seleccionar cliente..." />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_USERS.map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          <div>
                            <span className="font-medium">{u.name}</span>
                            <span className="ml-2 text-xs text-muted-foreground">{u.email}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedUser && (
                    <div className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                      <User className="size-3.5" />
                      {selectedUser.email}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Propiedad <span className="text-destructive">*</span>
                  </Label>
                  <Select value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Seleccionar propiedad..." />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_PROPERTIES.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          <div className="flex items-center gap-2">
                            <Building2 className="size-3.5 shrink-0 text-muted-foreground" />
                            <span className="text-sm">{p.title}</span>
                            <span className="ml-1 text-xs text-muted-foreground">{p.currency}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Monto a retornar <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                      {selectedProperty?.currency === "USD" ? "$" : "S/"}
                    </span>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="rounded-xl pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Notas internas (opcional)
                  </Label>
                  <Input
                    placeholder="Ej: Retorno del Q2 2026..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="rounded-xl"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 2 – Payment Method */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <p className="text-sm font-medium text-foreground">Método de pago</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "card" as const, label: "Tarjeta", icon: CreditCard, hint: "Cargo directo a tarjeta" },
                    { id: "bank_transfer" as const, label: "Transferencia", icon: Landmark, hint: "Con comprobante bancario" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id)}
                      className={cn(
                        "rounded-xl border p-4 text-left transition-all",
                        paymentMethod === m.id
                          ? "border-foreground bg-foreground/5 ring-1 ring-foreground"
                          : "border-border hover:border-foreground/40"
                      )}
                    >
                      <m.icon className={cn("mb-2 size-5", paymentMethod === m.id ? "text-foreground" : "text-muted-foreground")} />
                      <p className="text-sm font-semibold">{m.label}</p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">{m.hint}</p>
                    </button>
                  ))}
                </div>

                {paymentMethod === "card" && (
                  <div className="space-y-3 rounded-xl border border-border/60 bg-muted/20 p-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Número de tarjeta</Label>
                      <Input
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        className="rounded-xl font-mono"
                        maxLength={19}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Titular de la tarjeta</Label>
                      <Input
                        placeholder="NOMBRE APELLIDO"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                        className="rounded-xl uppercase"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Vencimiento</Label>
                        <Input
                          placeholder="MM / AA"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                          className="rounded-xl font-mono"
                          maxLength={7}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">CVV</Label>
                        <Input
                          placeholder="•••"
                          type="password"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                          className="rounded-xl font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "bank_transfer" && (
                  <div className="space-y-3 rounded-xl border border-border/60 bg-muted/20 p-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Banco</Label>
                      <Select value={bankName} onValueChange={setBankName}>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Seleccionar banco..." />
                        </SelectTrigger>
                        <SelectContent>
                          {BANKS.map((b) => (
                            <SelectItem key={b} value={b}>{b}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Titular de la cuenta</Label>
                      <Input
                        placeholder="Nombre completo del titular"
                        value={accountHolder}
                        onChange={(e) => setAccountHolder(e.target.value)}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Número de cuenta</Label>
                      <Input
                        placeholder="Ej: 19012345678901"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                        className="rounded-xl font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Referencia / N° operación</Label>
                      <Input
                        placeholder="Ej: TRF-20260610-0023"
                        value={transferRef}
                        onChange={(e) => setTransferRef(e.target.value)}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Comprobante (PDF o imagen)</Label>
                      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-border bg-background px-4 py-3 transition-colors hover:border-foreground/40">
                        <Upload className="size-4 shrink-0 text-muted-foreground" />
                        <span className="truncate text-sm text-muted-foreground">
                          {proofFile ? proofFile.name : "Adjuntar archivo..."}
                        </span>
                        {proofFile && (
                          <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); setProofFile(null); }}
                            className="ml-auto shrink-0"
                          >
                            <X className="size-4 text-muted-foreground hover:text-foreground" />
                          </button>
                        )}
                        <input
                          type="file"
                          accept=".pdf,image/*"
                          className="sr-only"
                          onChange={(e) => setProofFile(e.target.files?.[0] ?? null)}
                        />
                      </label>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 3 – Confirm */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <p className="text-sm font-medium text-foreground">Confirma los detalles</p>
                <div className="rounded-xl border border-border/60 bg-muted/20 divide-y divide-border/40">
                  {[
                    { label: "Tipo", value: typeConfig?.label ?? "" },
                    { label: "Cliente", value: selectedUser?.name ?? "" },
                    { label: "Propiedad", value: selectedProperty?.title ?? "" },
                    {
                      label: "Monto",
                      value: `${selectedProperty?.currency === "USD" ? "$ " : "S/ "}${parseFloat(amount).toFixed(2)}`,
                    },
                    {
                      label: "Método de pago",
                      value: paymentMethod === "card"
                        ? `Tarjeta **** ${cardNumber.replace(/\s/g, "").slice(-4)}`
                        : `Transferencia ${bankName}`,
                    },
                    ...(notes ? [{ label: "Notas", value: notes }] : []),
                  ].map((row) => (
                    <div key={row.label} className="flex items-start justify-between gap-4 px-4 py-2.5">
                      <span className="text-xs text-muted-foreground shrink-0">{row.label}</span>
                      <span className="text-right text-xs font-medium">{row.value}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Al confirmar, se creará el retorno con estado{" "}
                  <span className="font-semibold text-emerald-600">Confirmado</span> y será
                  visible para el cliente en su panel.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border/60 bg-muted/15 px-6 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { if (step === 0) { reset(); onOpenChange(false); } else setStep(step - 1); }}
            className="rounded-xl"
          >
            <ArrowLeft className="mr-1.5 size-4" />
            {step === 0 ? "Cancelar" : "Anterior"}
          </Button>
          {step < STEPS.length - 1 ? (
            <Button
              size="sm"
              disabled={!canGoNext()}
              onClick={() => setStep(step + 1)}
              className="rounded-xl"
            >
              Siguiente
              <ArrowRight className="ml-1.5 size-4" />
            </Button>
          ) : (
            <Button
              size="sm"
              disabled={submitting}
              onClick={handleSubmit}
              className="rounded-xl"
            >
              {submitting ? "Creando..." : "Confirmar retorno"}
              {!submitting && <Check className="ml-1.5 size-4" />}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
