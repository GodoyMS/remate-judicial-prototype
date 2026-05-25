"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Banknote,
  Building2,
  Check,
  Copy,
  FileText,
  ImageIcon,
  Upload,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

const bankDetails = [
  { label: "Banco", value: "BCP" },
  { label: "Cuenta corriente", value: "193-12345678-0-01", copy: true },
  { label: "CCI", value: "002-193-001234567801-52", copy: true },
  { label: "Titular", value: "Remata S.A.C." },
  { label: "RUC", value: "20123456789" },
];

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!value.receipt?.type.startsWith("image/")) {
      setReceiptPreview(null);
      return;
    }
    const url = URL.createObjectURL(value.receipt);
    setReceiptPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [value.receipt]);

  const handleCopy = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text.replace(/-/g, ""));
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFile = (file: File | null) => {
    if (!file) {
      onChange({ ...value, receipt: null });
      return;
    }
    const validTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!validTypes.includes(file.type)) return;
    onChange({ ...value, receipt: file });
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-5 pt-2"
    >
      {/* Destination account */}
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-[#163300] via-[#1f4a12] to-[#2d5a1e] text-white shadow-xl shadow-[#163300]/20">
        <div className="border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
              <Building2 className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Cuenta destino — Remata</p>
              <p className="text-xs text-white/60">Realiza la transferencia a esta cuenta</p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-white/10 px-5">
          {bankDetails.map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-3 py-3">
              <span className="text-xs text-white/55">{item.label}</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-semibold tracking-wide">{item.value}</span>
                {item.copy && (
                  <button
                    type="button"
                    onClick={() => handleCopy(item.value, item.label)}
                    className="rounded-lg bg-white/10 p-1.5 transition-colors hover:bg-white/20"
                    aria-label={`Copiar ${item.label}`}
                  >
                    {copiedField === item.label ? (
                      <Check className="size-3.5 text-[#9FE870]" />
                    ) : (
                      <Copy className="size-3.5 text-white/70" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User transfer details */}
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

          {/* Receipt upload */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Adjuntar recibo
            </Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            />

            {!value.receipt ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                className={cn(
                  "group flex min-h-[140px] flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-4 py-6 transition-all",
                  dragOver
                    ? "border-primary bg-primary/5 scale-[1.01]"
                    : "border-border/80 bg-muted/20 hover:border-primary/50 hover:bg-primary/5"
                )}
              >
                <div className="flex size-12 items-center justify-center rounded-full bg-primary/15 text-primary transition-transform group-hover:scale-110">
                  <Upload className="size-5" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">
                    Arrastra tu recibo aquí o haz clic
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">Foto (JPG, PNG) o PDF — máx. 10 MB</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[10px] font-medium text-muted-foreground shadow-sm">
                    <ImageIcon className="size-3" /> Foto
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[10px] font-medium text-muted-foreground shadow-sm">
                    <FileText className="size-3" /> PDF
                  </span>
                </div>
              </button>
            ) : (
              <div className="overflow-hidden rounded-xl border border-border/60 bg-white shadow-sm">
                <div className="flex items-center gap-3 p-3">
                  {receiptPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={receiptPreview}
                      alt="Vista previa del recibo"
                      className="size-14 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex size-14 items-center justify-center rounded-lg bg-red-50 text-red-600">
                      <FileText className="size-6" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">{value.receipt.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(value.receipt.size / 1024).toFixed(0)} KB ·{" "}
                      {value.receipt.type === "application/pdf" ? "PDF" : "Imagen"}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 shrink-0 rounded-lg text-muted-foreground hover:text-destructive"
                    onClick={() => {
                      handleFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-t border-border/50 py-2 text-xs font-medium text-primary hover:bg-muted/30"
                >
                  Cambiar archivo
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
