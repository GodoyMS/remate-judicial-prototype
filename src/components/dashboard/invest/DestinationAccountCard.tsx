"use client";

import { useState } from "react";
import { Building2, Check, Copy } from "lucide-react";
import type { PropertyCurrency } from "@/lib/currency";

const bankDetailsByCurrency: Record<
  PropertyCurrency,
  { label: string; value: string; copy?: boolean }[]
> = {
  PEN: [
    { label: "Banco", value: "BCP" },
    { label: "Cuenta corriente (PEN)", value: "193-12345678-0-01", copy: true },
    { label: "CCI", value: "002-193-001234567801-52", copy: true },
    { label: "Titular", value: "Rematto S.A.C." },
    { label: "RUC", value: "20123456789" },
  ],
  USD: [
    { label: "Banco", value: "BCP" },
    { label: "Cuenta corriente (USD)", value: "194-98765432-1-56", copy: true },
    { label: "CCI", value: "002-194-009876543256-78", copy: true },
    { label: "Titular", value: "Rematto S.A.C." },
    { label: "RUC", value: "20123456789" },
  ],
};

interface DestinationAccountCardProps {
  currency?: PropertyCurrency;
}

export function DestinationAccountCard({ currency = "PEN" }: DestinationAccountCardProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const bankDetails = bankDetailsByCurrency[currency];

  const handleCopy = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text.replace(/-/g, ""));
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-primary/10 shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/15">
            <Building2 className="size-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Cuenta destino — Rematto ({currency === "USD" ? "USD" : "PEN"})
            </p>
            <p className="text-xs text-muted-foreground">Realiza la transferencia o depósito a esta cuenta</p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-border px-5">
        {bankDetails.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-3 py-3">
            <span className="text-xs text-foreground">{item.label}</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-semibold tracking-wide text-foreground">{item.value}</span>
              {item.copy && (
                <button
                  type="button"
                  onClick={() => handleCopy(item.value, item.label)}
                  className="rounded-lg bg-muted p-1.5 transition-colors hover:bg-muted/70"
                  aria-label={`Copiar ${item.label}`}
                >
                  {copiedField === item.label ? (
                    <Check className="size-3.5 text-foreground" />
                  ) : (
                    <Copy className="size-3.5 text-foreground" />
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
