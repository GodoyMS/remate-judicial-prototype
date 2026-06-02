"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { motion } from "framer-motion";
import { CalendarIcon, Landmark } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { DestinationAccountCard } from "@/components/dashboard/invest/DestinationAccountCard";
import { ReceiptUploadField } from "@/components/dashboard/invest/ReceiptUploadField";

export type DepositFormData = {
  voucherNumber: string;
  voucherDate: Date | undefined;
  operationNumber: string;
  amount: string;
  receipt: File | null;
};

type DepositFormProps = {
  defaultAmount: string;
  value: DepositFormData;
  onChange: (data: DepositFormData) => void;
};

export function isDepositFormValid(data: DepositFormData) {
  const amount = parseFloat(data.amount);
  return (
    data.voucherNumber.trim().length >= 3 &&
    data.voucherDate instanceof Date &&
    data.operationNumber.trim().length >= 4 &&
    !Number.isNaN(amount) &&
    amount > 0 &&
    data.receipt !== null
  );
}

export function DepositForm({ defaultAmount, value, onChange }: DepositFormProps) {
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
            <Landmark className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Datos del voucher</p>
            <p className="text-xs text-muted-foreground">
              Completa la información del comprobante de depósito en ventanilla o agente
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="voucher-number" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Número de voucher
            </Label>
            <Input
              id="voucher-number"
              placeholder="Ej. VCH-2024-001234"
              value={value.voucherNumber}
              onChange={(e) => onChange({ ...value, voucherNumber: e.target.value })}
              className="h-12 rounded-xl border-border/80 bg-white text-sm shadow-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Fecha
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "h-12 w-full justify-start rounded-xl border-border/80 bg-white font-normal shadow-sm",
                    !value.voucherDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 size-4" />
                  {value.voucherDate
                    ? format(value.voucherDate, "PPP", { locale: es })
                    : "Seleccionar fecha del depósito"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={value.voucherDate}
                  onSelect={(date) => onChange({ ...value, voucherDate: date })}
                  disabled={(date) => date > new Date()}
                  locale={es}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="operation-number" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Número de operación
            </Label>
            <Input
              id="operation-number"
              placeholder="Código de la operación bancaria"
              value={value.operationNumber}
              onChange={(e) => onChange({ ...value, operationNumber: e.target.value })}
              className="h-12 rounded-xl border-border/80 bg-white text-sm shadow-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="deposit-amount" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Monto (Soles)
            </Label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                S/
              </span>
              <Input
                id="deposit-amount"
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
            id="deposit-voucher"
            label="Adjuntar voucher"
            value={value.receipt}
            onChange={(receipt) => onChange({ ...value, receipt })}
            hint="Foto o PDF del voucher de depósito — máx. 10 MB"
          />
        </div>
      </div>
    </motion.div>
  );
}
