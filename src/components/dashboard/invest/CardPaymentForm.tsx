"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Lock, ShieldCheck, Wifi } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type CardFormData = {
  cardNumber: string;
  cardholder: string;
  expiry: string;
  cvv: string;
};

type CardPaymentFormProps = {
  amount: string;
  value: CardFormData;
  onChange: (data: CardFormData) => void;
};

function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
}

function detectCardBrand(number: string): "visa" | "mastercard" | "amex" | "unknown" {
  const digits = number.replace(/\D/g, "");
  if (/^4/.test(digits)) return "visa";
  if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) return "mastercard";
  if (/^3[47]/.test(digits)) return "amex";
  return "unknown";
}

const brandLabels = {
  visa: "VISA",
  mastercard: "MC",
  amex: "AMEX",
  unknown: "CARD",
};

export function isCardFormValid(data: CardFormData) {
  const digits = data.cardNumber.replace(/\D/g, "");
  const expiryDigits = data.expiry.replace(/\D/g, "");
  return (
    digits.length >= 15 &&
    data.cardholder.trim().length >= 3 &&
    expiryDigits.length === 4 &&
    data.cvv.replace(/\D/g, "").length >= 3
  );
}

export function CardPaymentForm({ amount, value, onChange }: CardPaymentFormProps) {
  const [focused, setFocused] = useState<"number" | "name" | "expiry" | "cvv" | null>(null);
  const brand = useMemo(() => detectCardBrand(value.cardNumber), [value.cardNumber]);

  const displayNumber = value.cardNumber.replace(/\D/g, "").length
    ? value.cardNumber
    : "•••• •••• •••• ••••";

  const displayName = value.cardholder.trim() || "NOMBRE DEL TITULAR";
  const displayExpiry = value.expiry || "MM / AA";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-5 pt-2"
    >
      {/* Card preview */}
      <div className="relative mx-auto w-full max-w-sm perspective-[1000px]">
        <motion.div
          animate={{
            rotateY: focused === "cvv" ? 8 : 0,
            scale: focused ? 1.02 : 1,
          }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="relative aspect-[1.586/1] w-full overflow-hidden rounded-2xl shadow-2xl shadow-[#163300]/25"
          style={{
            background: "linear-gradient(135deg, #163300 0%, #2d5a1e 45%, #9FE870 180%)",
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.18),transparent_45%)]" />
          <div className="absolute -right-8 -top-8 size-32 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-10 -left-6 size-36 rounded-full bg-[#9FE870]/20 blur-3xl" />

          <div className="relative flex h-full flex-col justify-between p-5 sm:p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-gradient-to-br from-amber-200 via-amber-300 to-amber-500 shadow-inner" />
                <Wifi className="size-5 rotate-90 text-white/70" />
              </div>
              <span className="rounded-md bg-white/15 px-2 py-1 text-[10px] font-bold tracking-widest text-white/90 backdrop-blur-sm">
                {brandLabels[brand]}
              </span>
            </div>

            <div className="space-y-4">
              <p
                className={cn(
                  "font-mono text-lg sm:text-xl tracking-[0.18em] text-white transition-opacity",
                  !value.cardNumber.replace(/\D/g, "").length && "text-white/55"
                )}
              >
                {displayNumber}
              </p>

              <div className="flex items-end justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] uppercase tracking-wider text-white/50">Titular</p>
                  <p
                    className={cn(
                      "truncate text-sm font-semibold uppercase tracking-wide text-white",
                      !value.cardholder.trim() && "text-white/55"
                    )}
                  >
                    {displayName}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[9px] uppercase tracking-wider text-white/50">Vence</p>
                  <p className={cn("font-mono text-sm text-white", !value.expiry && "text-white/55")}>
                    {displayExpiry}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {amount && (
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-border/60 bg-white px-4 py-1.5 text-xs font-semibold text-foreground shadow-md">
            Total: S/ {parseFloat(amount).toLocaleString()}
          </div>
        )}
      </div>

      {/* Form fields */}
      <div className="mt-4 rounded-2xl border border-border/60 bg-gradient-to-b from-white to-muted/20 p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">Datos de la tarjeta</p>
          <div className="flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold text-accent-foreground">
            <ShieldCheck className="size-3" />
            3D Secure
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="card-number" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Número de tarjeta
            </Label>
            <Input
              id="card-number"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="4242 4242 4242 4242"
              value={value.cardNumber}
              onFocus={() => setFocused("number")}
              onBlur={() => setFocused(null)}
              onChange={(e) =>
                onChange({ ...value, cardNumber: formatCardNumber(e.target.value) })
              }
              className="h-12 rounded-xl border-border/80 bg-white font-mono text-base tracking-wider shadow-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cardholder" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Nombre del titular
            </Label>
            <Input
              id="cardholder"
              autoComplete="cc-name"
              placeholder="Como aparece en la tarjeta"
              value={value.cardholder}
              onFocus={() => setFocused("name")}
              onBlur={() => setFocused(null)}
              onChange={(e) => onChange({ ...value, cardholder: e.target.value.toUpperCase() })}
              className="h-12 rounded-xl border-border/80 bg-white text-sm uppercase shadow-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="expiry" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Vencimiento
              </Label>
              <Input
                id="expiry"
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="MM / AA"
                value={value.expiry}
                onFocus={() => setFocused("expiry")}
                onBlur={() => setFocused(null)}
                onChange={(e) => onChange({ ...value, expiry: formatExpiry(e.target.value) })}
                className="h-12 rounded-xl border-border/80 bg-white font-mono text-sm shadow-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cvv" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                CVV
              </Label>
              <Input
                id="cvv"
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="•••"
                type="password"
                maxLength={4}
                value={value.cvv}
                onFocus={() => setFocused("cvv")}
                onBlur={() => setFocused(null)}
                onChange={(e) =>
                  onChange({ ...value, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })
                }
                className="h-12 rounded-xl border-border/80 bg-white font-mono text-sm shadow-sm"
              />
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border/50 pt-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="size-3.5 text-primary" />
            <span>Pago seguro con encriptación SSL 256-bit</span>
          </div>
          <div className="flex items-center gap-1.5">
            {(["VISA", "MC", "AMEX"] as const).map((label) => (
              <span
                key={label}
                className="rounded-md border border-border/70 bg-white px-2 py-0.5 text-[9px] font-bold tracking-wide text-muted-foreground"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
