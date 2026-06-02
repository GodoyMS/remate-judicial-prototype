"use client";

import { motion } from "framer-motion";
import { Banknote } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DestinationAccountCard } from "@/components/dashboard/invest/DestinationAccountCard";
import { ReceiptUploadField } from "@/components/dashboard/invest/ReceiptUploadField";

export type TransferFormData = {
  accountNumber: string;
  transferNumber: string;
  amount: string;
  receipt: File | null;
};

type BankTransferFormProps = {
  defaultAmount: string;
  value: TransferFormData;
  onChange: (data: TransferFormData) => void;
};

export function isTransferFormValid(data: TransferFormData) {
  const amount = parseFloat(data.amount);
  return (
    data.accountNumber.trim().length >= 8 &&
    data.transferNumber.trim().length >= 4 &&
    !Number.isNaN(amount) &&
    amount > 0 &&
    data.receipt !== null
  );
}

export function BankTransferForm({ defaultAmount, value, onChange }: BankTransferFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-5 pt-2"
    >
      <DestinationAccountCard />

      <div className="rounded-2xl border border-border/60 bg-gradient-to-b from-white to-muted/20 p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Banknote className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Confirma tu transferencia</p>
            <p className="text-xs text-muted-foreground">
              Completa los datos de la operación que realizaste
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="transfer-account" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Número de cuenta
            </Label>
            <Input
              id="transfer-account"
              inputMode="numeric"
              placeholder="Ej. 193-09876543-0-45"
              value={value.accountNumber}
              onChange={(e) => onChange({ ...value, accountNumber: e.target.value })}
              className="h-12 rounded-xl border-border/80 bg-white font-mono text-sm shadow-sm"
            />
            <p className="text-[11px] text-muted-foreground">Cuenta desde la que realizaste el envío</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="transfer-number" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Número de transferencia
            </Label>
            <Input
              id="transfer-number"
              placeholder="Código o referencia de la operación"
              value={value.transferNumber}
              onChange={(e) => onChange({ ...value, transferNumber: e.target.value })}
              className="h-12 rounded-xl border-border/80 bg-white text-sm shadow-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="transfer-amount" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Monto (Soles)
            </Label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                S/
              </span>
              <Input
                id="transfer-amount"
                type="number"
                inputMode="decimal"
                placeholder={defaultAmount || "0.00"}
                value={value.amount}
                onChange={(e) => onChange({ ...value, amount: e.target.value })}
                className="h-12 rounded-xl border-border/80 bg-white pl-10 text-lg font-semibold shadow-sm"
              />
            </div>
          </div>

          <ReceiptUploadField
            id="transfer-receipt"
            label="Adjuntar recibo"
            value={value.receipt}
            onChange={(receipt) => onChange({ ...value, receipt })}
          />
        </div>
      </div>
    </motion.div>
  );
}
