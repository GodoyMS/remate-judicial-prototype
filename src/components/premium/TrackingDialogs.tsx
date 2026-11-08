"use client";

import { useRef, useState } from "react";
import { Check, ChevronDown, Copy, FileUp } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-hydrated";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ResponsiveDialog } from "./ResponsiveDialog";
import {
  getFunds,
  registerContribution,
  signDocument,
  withdrawRequest,
  type PremiumReservation,
  type ReservationDocument,
} from "@/lib/premium/reservations";
import { formatCurrency, type PropertyCurrency } from "@/lib/currency";
import { formatLimaDateTime } from "@/lib/premium/dates";
import { cn } from "@/lib/utils";

/* ── Cuenta de custodia ──────────────────────────────────────────────── */

export const CUSTODY_ACCOUNTS: Record<PropertyCurrency, { bank: string; holder: string; account: string; cci: string }> = {
  PEN: { bank: "BCP", holder: "Rematto Custodia S.A.C.", account: "193-2456781-0-41", cci: "002-193-002456781041-14" },
  USD: { bank: "BCP", holder: "Rematto Custodia S.A.C.", account: "193-2456782-1-58", cci: "002-193-002456782158-11" },
};

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="truncate font-mono text-sm font-medium text-foreground">{value}</p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 shrink-0 rounded-lg"
        onClick={() => {
          navigator.clipboard?.writeText(value).catch(() => {});
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        aria-label={`Copiar ${label}`}
      >
        {copied ? <Check className="text-success" /> : <Copy />}
        <span className="hidden sm:inline">{copied ? "Copiado" : "Copiar"}</span>
      </Button>
    </div>
  );
}

export function CustodyAccount({ reservation }: { reservation: PremiumReservation }) {
  const acc = CUSTODY_ACCOUNTS[reservation.currency];
  const desktop = useMediaQuery("(min-width: 640px)");
  const [toggled, setToggled] = useState<boolean | null>(null);
  // En móvil los datos bancarios se pliegan: son cuatro filas que solo se
  // necesitan en el momento de transferir.
  const open = toggled ?? desktop ?? false;
  return (
    <div className="rounded-xl border border-border/60 bg-card px-3">
      <button
        type="button"
        onClick={() => setToggled(!open)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 py-2.5 text-left text-sm font-medium text-foreground sm:hidden"
      >
        Ver datos para transferir
        <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      <div className={cn("divide-y divide-border/60", !open && "hidden", open && "border-t border-border/60 sm:border-t-0")}>
        <div className="py-2">
          <p className="text-[11px] text-muted-foreground">Titular</p>
          <p className="text-sm font-medium text-foreground">
            {acc.holder} · {acc.bank} · {reservation.currency === "USD" ? "Dólares" : "Soles"}
          </p>
        </div>
        <CopyField label="Cuenta corriente" value={acc.account} />
        <CopyField label="CCI" value={acc.cci} />
        <CopyField label="Referencia obligatoria" value={reservation.code} />
      </div>
    </div>
  );
}

/* ── Firmar contrato ─────────────────────────────────────────────────── */

export function SignContractDialog({
  reservation,
  document,
  open,
  onOpenChange,
  onDone,
}: {
  reservation: PremiumReservation;
  document: ReservationDocument;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onDone?: () => void;
}) {
  const [read, setRead] = useState(false);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const valid = read && code.length === 6;

  const sign = () => {
    setBusy(true);
    setTimeout(() => {
      const res = signDocument(reservation.id, document.id);
      setBusy(false);
      if (!res.ok) return toast.error(res.message);
      toast.success(`${document.title} firmado`, {
        description: document.id.endsWith("-contract") ? "Ya puedes transferir tu aporte." : undefined,
      });
      onOpenChange(false);
      setCode("");
      setRead(false);
      onDone?.();
    }, 700);
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Firmar ${document.title.toLowerCase()}`}
      description={`${reservation.code} · versión ${document.version}`}
      footer={
        <Button className="h-11 w-full rounded-xl sm:w-auto" disabled={!valid || busy} onClick={sign} data-testid="sign-confirm">
          {busy ? "Firmando…" : "Firmar documento"}
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        <ul className="space-y-2 rounded-xl bg-muted/50 p-3 text-sm text-muted-foreground">
          <li>· Reserva exclusiva del 100% por {formatCurrency(reservation.amount, reservation.currency)}.</li>
          {reservation.reservedUntil && <li>· Aporte completo antes del {formatLimaDateTime(reservation.reservedUntil)}.</li>}
          <li>· Si no completas el aporte, la reserva vence y lo aportado se devuelve a tu cuenta verificada.</li>
          <li>· Si la operación no se formaliza, el aporte se devuelve íntegro.</li>
        </ul>
        <a href="#" className="text-sm font-medium text-primary hover:underline">Descargar documento completo (PDF)</a>
        <label className="flex items-start gap-3 text-sm text-foreground">
          <Checkbox checked={read} onCheckedChange={(v) => setRead(v === true)} className="mt-0.5" />
          <span>Leí el documento y acepto sus condiciones.</span>
        </label>
        <div className="grid gap-2">
          <Label>Código de firma enviado a tu celular</Label>
          <InputOTP maxLength={6} value={code} onChange={setCode} inputMode="numeric" aria-label="Código de firma">
            <InputOTPGroup>
              {Array.from({ length: 6 }).map((_, i) => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>
          <p className="text-xs text-muted-foreground">Enviado al número terminado en ···21. Demo: cualquier código de 6 dígitos.</p>
        </div>
      </div>
    </ResponsiveDialog>
  );
}

/* ── Registrar transferencia ─────────────────────────────────────────── */

export function ContributionDialog({
  reservation,
  open,
  onOpenChange,
}: {
  reservation: PremiumReservation;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const funds = getFunds(reservation);
  const single = reservation.fundingPlan === "single";
  const [amount, setAmount] = useState(String(funds.pending));
  const [op, setOp] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [fileName, setFileName] = useState("");
  const [busy, setBusy] = useState(false);
  const [touched, setTouched] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const n = Number(amount.replace(/[^\d.]/g, ""));
  const amountError =
    !(n > 0) ? "Ingresa el monto transferido." : n > funds.pending ? `No puede superar el saldo pendiente (${formatCurrency(funds.pending, reservation.currency)}).` : single && n !== funds.pending ? "Elegiste un solo aporte: registra el saldo completo." : null;
  const opError = op.trim().length < 6 ? "El número de operación tiene al menos 6 dígitos." : null;
  const valid = !amountError && !opError && !!date;

  const submit = () => {
    setTouched(true);
    if (!valid) return;
    setBusy(true);
    setTimeout(() => {
      const res = registerContribution(reservation.id, {
        amount: n,
        operationNumber: op.trim(),
        transferDate: new Date(`${date}T12:00:00-05:00`).toISOString(),
        fileName: fileName || undefined,
      });
      setBusy(false);
      if (!res.ok) return toast.error(res.message);
      toast.success("Transferencia registrada", { description: "La conciliaremos con el banco en hasta 1 día hábil." });
      onOpenChange(false);
      setOp("");
      setFileName("");
      setTouched(false);
    }, 700);
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (o) setAmount(String(getFunds(reservation).pending));
      }}
      title="Registrar transferencia"
      description="Avísanos de cada transferencia para conciliarla más rápido."
      footer={
        <Button className="h-11 w-full rounded-xl sm:w-auto" disabled={busy} onClick={submit} data-testid="contribution-submit">
          {busy ? "Registrando…" : "Registrar transferencia"}
        </Button>
      }
    >
      <div className="flex min-w-0 flex-col gap-4 [&>*]:min-w-0">
        <div className="flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2.5 text-sm">
          <span className="text-muted-foreground">Saldo pendiente</span>
          <span className="font-semibold tabular-nums text-foreground">{formatCurrency(funds.pending, reservation.currency)}</span>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="c-amount">Monto transferido</Label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              {reservation.currency === "USD" ? "USD" : "S/"}
            </span>
            <Input
              id="c-amount"
              inputMode="decimal"
              value={amount}
              readOnly={single}
              onChange={(e) => setAmount(e.target.value)}
              className={cn("h-11 pl-13 tabular-nums", single && "bg-muted/40")}
              aria-invalid={touched && !!amountError}
            />
          </div>
          {touched && amountError && <p className="text-xs text-destructive">{amountError}</p>}
          {single && <p className="text-xs text-muted-foreground">Plan de un solo aporte: se registra el saldo completo.</p>}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label htmlFor="c-op">N.º de operación</Label>
            <Input
              id="c-op"
              inputMode="numeric"
              value={op}
              onChange={(e) => setOp(e.target.value.replace(/[^\d]/g, ""))}
              placeholder="Ej. 00418273"
              className="h-11"
              aria-invalid={touched && !!opError}
            />
            {touched && opError && <p className="text-xs text-destructive">{opError}</p>}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="c-date">Fecha de la transferencia</Label>
            <Input id="c-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-11" />
          </div>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="c-file">
            Constancia <span className="font-normal text-muted-foreground">(opcional)</span>
          </Label>
          <input ref={fileRef} id="c-file" type="file" accept=".pdf,.jpg,.jpeg,.png" className="sr-only" onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")} />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex min-h-11 w-full min-w-0 items-center gap-3 rounded-lg border border-dashed border-input px-3 py-2 text-left text-sm hover:border-primary/40"
          >
            <FileUp className="size-4 shrink-0 text-muted-foreground" />
            <span className={cn("min-w-0 flex-1 truncate", fileName ? "text-foreground" : "text-muted-foreground")}>
              {fileName || "PDF o imagen de la constancia"}
            </span>
          </button>
        </div>
      </div>
    </ResponsiveDialog>
  );
}

/* ── Retirar solicitud ───────────────────────────────────────────────── */

export function WithdrawDialog({
  reservation,
  userId,
  open,
  onOpenChange,
}: {
  reservation: PremiumReservation;
  userId: string;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="¿Retirar la solicitud?"
      description="La oportunidad volverá a estar disponible para otros inversionistas. No hay ningún cargo."
      footer={
        <>
          <Button variant="outline" className="h-11 rounded-xl" onClick={() => onOpenChange(false)}>
            Mantener solicitud
          </Button>
          <Button
            variant="destructive"
            className="h-11 rounded-xl"
            onClick={() => {
              const res = withdrawRequest(reservation.id, userId);
              if (!res.ok) return toast.error(res.message);
              toast.success("Solicitud retirada");
              onOpenChange(false);
            }}
          >
            Retirar solicitud
          </Button>
        </>
      }
    >
      <p className="text-sm text-muted-foreground">Si cambias de opinión, puedes volver a solicitarla mientras la ventana siga abierta.</p>
    </ResponsiveDialog>
  );
}

/* ── Reportar incidencia ─────────────────────────────────────────────── */

export function IncidentDialog({
  reservation,
  open,
  onOpenChange,
}: {
  reservation: PremiumReservation;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const [text, setText] = useState("");
  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Reportar una incidencia"
      description={`Operación ${reservation.code}. Tu asesora te responderá por correo y en Notificaciones.`}
      footer={
        <Button
          className="h-11 w-full rounded-xl sm:w-auto"
          disabled={text.trim().length < 10}
          onClick={() => {
            toast.success("Incidencia registrada", { description: "Te responderemos en menos de 2 horas hábiles." });
            setText("");
            onOpenChange(false);
          }}
        >
          Enviar
        </Button>
      }
    >
      <div className="grid gap-1.5">
        <Label htmlFor="incident">¿Qué pasó?</Label>
        <Textarea
          id="incident"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder="Ej. Transferí hace dos días y el aporte sigue en conciliación."
        />
      </div>
    </ResponsiveDialog>
  );
}
