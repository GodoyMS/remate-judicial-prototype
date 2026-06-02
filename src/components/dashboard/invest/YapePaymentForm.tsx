"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  CircleHelp,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";

export type YapeFormData = {
  phone: string;
  approvalCode: string;
};

type YapePaymentFormProps = {
  defaultAmount: string;
  value: YapeFormData;
  onChange: (data: YapeFormData) => void;
};

const YAPE_MERCHANT_NAME = "Remata S.A.C.";
const STEPS = [
  { id: 1, label: "Teléfono", hint: "Tu número Yape" },
  { id: 2, label: "Código", hint: "6 dígitos de aprobación" },
] as const;

function formatPeruvianPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 9);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
}

function isPhoneValid(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 9 && digits.startsWith("9");
}

export function isYapeFormValid(data: YapeFormData) {
  return isPhoneValid(data.phone) && /^\d{6}$/.test(data.approvalCode);
}

function ApprovalCodeHelpPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7 shrink-0 rounded-full text-[#742284] hover:bg-[#742284]/10 hover:text-[#742284]"
          aria-label="¿Dónde encuentro el código de aprobación?"
        >
          <CircleHelp className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[min(calc(100vw-2rem),340px)] gap-0 overflow-hidden p-0"
        align="end"
        side="top"
        sideOffset={8}
      >
        <PopoverHeader className="gap-1 border-b border-border/60 px-4 py-3">
          <PopoverTitle className="text-sm font-semibold text-foreground">
            ¿Dónde encuentro el código?
          </PopoverTitle>
          <PopoverDescription className="text-xs leading-relaxed">
            Al confirmar el pago en tu app Yape verás una pantalla de aprobación con el código de 6 dígitos.
          </PopoverDescription>
        </PopoverHeader>

        <div className="relative bg-muted/30 p-3">
          <Image
            src="/images/yape-approval-code-guide.png"
            alt="Pantalla de Yape mostrando el código de aprobación resaltado"
            width={640}
            height={800}
            className="w-full rounded-lg border border-border/60 shadow-sm"
          />
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-[#742284] px-3 py-1 text-[10px] font-semibold text-white shadow-lg">
            Código resaltado aquí
          </div>
        </div>

        <ol className="flex flex-col gap-2.5 px-4 py-3 text-xs text-muted-foreground">
          <li className="flex gap-2">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#742284]/10 text-[10px] font-bold text-[#742284]">
              1
            </span>
            <span>Abre la notificación de Yape en tu celular.</span>
          </li>
          <li className="flex gap-2">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#742284]/10 text-[10px] font-bold text-[#742284]">
              2
            </span>
            <span>Revisa la pantalla &quot;Aprobar pago&quot; con el monto de tu inversión.</span>
          </li>
          <li className="flex gap-2">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#742284]/10 text-[10px] font-bold text-[#742284]">
              3
            </span>
            <span>Copia el código de 6 dígitos y pégalo en los casilleros de abajo.</span>
          </li>
        </ol>
      </PopoverContent>
    </Popover>
  );
}

export function YapePaymentForm({ defaultAmount, value, onChange }: YapePaymentFormProps) {
  const payAmount = parseFloat(defaultAmount || "0");
  const phoneComplete = isPhoneValid(value.phone);
  const codeComplete = value.approvalCode.length === 6;
  const activeStep = phoneComplete ? 2 : 1;
  const codeProgress = value.approvalCode.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4 pt-2"
    >
      {/* Summary strip */}
      <div className="overflow-hidden rounded-2xl border border-[#742284]/20 bg-gradient-to-r from-[#742284] to-[#9B4DB8] text-white shadow-lg shadow-[#742284]/15">
        <div className="flex items-stretch">
          <div className="flex flex-1 flex-col justify-center gap-1 px-5 py-4">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-white/15">
                <Smartphone className="size-4" />
              </div>
              <div>
                <p className="text-sm font-bold">Pago con Yape</p>
                <p className="text-[11px] text-white/70">{YAPE_MERCHANT_NAME}</p>
              </div>
            </div>
          </div>
          <div className="flex min-w-[140px] flex-col items-end justify-center border-l border-white/15 bg-black/10 px-5 py-4">
            <p className="text-[10px] font-medium uppercase tracking-wider text-white/60">
              Total a pagar
            </p>
            <p className="text-2xl font-bold leading-tight">
              S/{" "}
              {payAmount.toLocaleString("es-PE", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Step progress */}
      <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/20 px-4 py-3">
        {STEPS.map((step, index) => {
          const isDone =
            step.id === 1 ? phoneComplete : codeComplete;
          const isActive = activeStep === step.id;
          return (
            <div key={step.id} className="flex flex-1 items-center gap-2">
              <div
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors",
                  isDone
                    ? "bg-[#742284] text-white"
                    : isActive
                      ? "bg-[#742284]/15 text-[#742284] ring-2 ring-[#742284]/30"
                      : "bg-muted text-muted-foreground"
                )}
              >
                {isDone ? <CheckCircle2 className="size-4" /> : step.id}
              </div>
              <div className="min-w-0">
                <p
                  className={cn(
                    "text-xs font-semibold",
                    isActive || isDone ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </p>
                <p className="truncate text-[10px] text-muted-foreground">{step.hint}</p>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    "mx-1 hidden h-px flex-1 sm:block",
                    phoneComplete ? "bg-[#742284]/40" : "bg-border"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step 1 — Phone */}
      <section
        className={cn(
          "rounded-2xl border bg-white p-5 shadow-sm transition-colors",
          activeStep === 1 ? "border-[#742284]/30 ring-2 ring-[#742284]/10" : "border-border/60"
        )}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#742284]">
              Paso 1
            </p>
            <h4 className="text-sm font-semibold text-foreground">Ingresa tu teléfono Yape</h4>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Usaremos este número para enviar la solicitud de cobro a tu app.
            </p>
          </div>
          {phoneComplete && (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-[10px] font-semibold text-green-700">
              <CheckCircle2 className="size-3" />
              Listo
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="yape-phone" className="text-xs font-medium text-muted-foreground">
            Teléfono
          </Label>
          <Input
            id="yape-phone"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="987 654 321"
            value={value.phone}
            onChange={(e) => onChange({ ...value, phone: formatPeruvianPhone(e.target.value) })}
            className="h-12 rounded-xl border-border/80 bg-muted/20 font-mono text-base shadow-sm focus-visible:border-[#742284]/50 focus-visible:ring-[#742284]/20"
          />
          <p className="text-[11px] text-muted-foreground">
            9 dígitos, debe iniciar con 9
          </p>
        </div>
      </section>

      {/* Step 2 — Approval code */}
      <section
        className={cn(
          "rounded-2xl border bg-white p-5 shadow-sm transition-colors",
          activeStep === 2 ? "border-[#742284]/30 ring-2 ring-[#742284]/10" : "border-border/60",
          !phoneComplete && "opacity-60"
        )}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#742284]">
              Paso 2
            </p>
            <div className="flex items-center gap-1">
              <h4 className="text-sm font-semibold text-foreground">Código de aprobación</h4>
              <ApprovalCodeHelpPopover />
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Ingresa los 6 dígitos que aparecen en la pantalla de aprobación de Yape.
            </p>
          </div>
          {codeComplete && (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-[10px] font-semibold text-green-700">
              <CheckCircle2 className="size-3" />
              Listo
            </span>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <InputOTP
            maxLength={6}
            inputMode="numeric"
            pattern="^[0-9]*$"
            value={value.approvalCode}
            onChange={(code) => onChange({ ...value, approvalCode: code })}
            disabled={!phoneComplete}
          >
            <InputOTPGroup className="w-full justify-center gap-2 sm:gap-2.5">
              {Array.from({ length: 6 }).map((_, i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className={cn(
                    "size-11 rounded-xl border-border/80 bg-muted/20 text-lg font-semibold shadow-sm first:rounded-xl last:rounded-xl sm:size-12",
                    "data-[active=true]:border-[#742284]/50 data-[active=true]:ring-[#742284]/20",
                    value.approvalCode[i] && "border-[#742284]/30 bg-[#742284]/5"
                  )}
                />
              ))}
            </InputOTPGroup>
          </InputOTP>

          <div className="flex items-center justify-between gap-2 px-1">
            <div className="flex gap-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1 w-5 rounded-full transition-colors",
                    i < codeProgress ? "bg-[#742284]" : "bg-border"
                  )}
                />
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground">
              {codeProgress}/6 dígitos
            </p>
          </div>

          {!phoneComplete && (
            <p className="rounded-lg bg-muted/40 px-3 py-2 text-center text-[11px] text-muted-foreground">
              Completa tu teléfono para habilitar el código de aprobación
            </p>
          )}
        </div>
      </section>

      {/* Footer */}
      <div className="flex items-start gap-2.5 rounded-xl border border-[#742284]/15 bg-[#742284]/5 px-4 py-3">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#742284]" />
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Autorizas el cobro de{" "}
          <strong className="text-foreground">
            S/ {payAmount.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
          </strong>{" "}
          desde tu Yape. Si no reconoces la solicitud, no ingreses el código.
        </p>
      </div>
    </motion.div>
  );
}
