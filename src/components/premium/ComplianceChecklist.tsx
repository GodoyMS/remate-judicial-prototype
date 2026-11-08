"use client";

import { useRef, useState } from "react";
import { ChevronDown, FileUp, Fingerprint, Landmark, ScrollText, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { formControlBase } from "@/lib/ui-styles";
import { StatusPill } from "./StatusPill";
import {
  CHECK_STATUS_LABELS,
  FUNDS_ORIGIN_LABELS,
  submitSourceOfFunds,
  type CheckStatus,
  type ComplianceProfile,
  type FundsOrigin,
} from "@/lib/premium/compliance";
import type { StatusTone } from "@/lib/premium/reservations";
import { formatLimaDate } from "@/lib/premium/dates";
import { cn } from "@/lib/utils";

const TONE: Record<CheckStatus, StatusTone> = {
  complete: "success",
  in_review: "info",
  action_required: "warning",
};

interface ChecklistProps {
  profile: ComplianceProfile;
  /** Muestra el formulario de origen de fondos en línea cuando hace falta. */
  inlineForm?: boolean;
  onSubmitted?: () => void;
}

/**
 * Verificación reforzada: tres validaciones de cuenta con su estado y,
 * cuando falta algo, la acción para resolverlo en el mismo lugar.
 */
export function ComplianceChecklist({ profile, inlineForm = true, onSubmitted }: ChecklistProps) {
  const sof = profile.sourceOfFunds;
  const rows: { id: string; icon: LucideIcon; title: string; detail: string; status: CheckStatus }[] = [
    {
      id: "identity",
      icon: Fingerprint,
      title: "Identidad",
      detail:
        profile.identity.status === "complete" && profile.identity.verifiedAt
          ? `Verificada el ${formatLimaDate(profile.identity.verifiedAt)}`
          : "Documento de identidad y prueba de vida",
      status: profile.identity.status,
    },
    {
      id: "funds",
      icon: ScrollText,
      title: "Origen de fondos",
      detail:
        sof.status === "complete"
          ? `${sof.origin ? FUNDS_ORIGIN_LABELS[sof.origin] : "Declarado"}${sof.verifiedAt ? ` · validado el ${formatLimaDate(sof.verifiedAt)}` : ""}`
          : sof.status === "in_review"
            ? `Declaración enviada${sof.submittedAt ? ` el ${formatLimaDate(sof.submittedAt)}` : ""} · la revisamos junto con tu solicitud`
            : sof.reason ?? "Declara el origen de los fondos que vas a aportar",
      status: sof.status,
    },
    {
      id: "bank",
      icon: Landmark,
      title: "Cuenta bancaria",
      detail:
        profile.bankAccount.status === "complete"
          ? `${profile.bankAccount.bank} ···${profile.bankAccount.last4} · ${profile.bankAccount.holder}`
          : "Cuenta a tu nombre desde la que aportarás y a la que devolveremos fondos",
      status: profile.bankAccount.status,
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <ul className="divide-y divide-border/60 rounded-2xl border border-border/60 bg-card">
        {rows.map((r) => (
          <li key={r.id} className="flex items-start gap-3 p-4" data-testid={`check-${r.id}`}>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground/70">
              <r.icon className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <p className="text-sm font-semibold text-foreground">{r.title}</p>
                <StatusPill tone={TONE[r.status]} size="xs">
                  {CHECK_STATUS_LABELS[r.status]}
                </StatusPill>
              </div>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{r.detail}</p>
            </div>
          </li>
        ))}
      </ul>
      {inlineForm && sof.status === "action_required" && (
        <SourceOfFundsForm userId={profile.userId} onSubmitted={onSubmitted} />
      )}
    </div>
  );
}

export function SourceOfFundsForm({
  userId,
  onSubmitted,
  className,
}: {
  userId: string;
  onSubmitted?: () => void;
  className?: string;
}) {
  const [origin, setOrigin] = useState<FundsOrigin | "">("");
  const [fileName, setFileName] = useState("");
  const [declared, setDeclared] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const valid = origin !== "" && fileName !== "" && declared;

  const submit = () => {
    if (!valid) return;
    setSubmitting(true);
    setTimeout(() => {
      submitSourceOfFunds(userId, { origin: origin as FundsOrigin, supportFileName: fileName });
      setSubmitting(false);
      toast.success("Declaración enviada", { description: "La revisaremos en 1 día hábil." });
      onSubmitted?.();
    }, 700);
  };

  return (
    <div className={cn("min-w-0 rounded-2xl border border-warning/40 bg-warning/5 p-4 sm:p-5", className)} data-testid="source-of-funds-form">
      <p className="text-sm font-semibold text-foreground">Actualiza tu declaración de origen de fondos</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Es un requisito regulatorio para operaciones de alto valor. Solo lo ve el equipo de cumplimiento.
      </p>

      <div className="mt-4 grid min-w-0 gap-4 [&>*]:min-w-0">
        <div className="grid gap-1.5">
          <Label htmlFor="sof-origin">Origen principal de los fondos</Label>
          {/* Select nativo: en móvil abre el selector del sistema, que nunca se
              sale de la pantalla ni queda debajo de la barra fija. */}
          <div className="relative">
            <select
              id="sof-origin"
              value={origin}
              onChange={(e) => setOrigin(e.target.value as FundsOrigin)}
              className={cn(formControlBase, "h-11 appearance-none bg-card pr-9 sm:h-10", !origin && "text-muted-foreground")}
            >
              <option value="" disabled>
                Selecciona una opción
              </option>
              {(Object.keys(FUNDS_ORIGIN_LABELS) as FundsOrigin[]).map((k) => (
                <option key={k} value={k}>
                  {FUNDS_ORIGIN_LABELS[k]}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="sof-file">Sustento</Label>
          <input
            ref={fileRef}
            id="sof-file"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="sr-only"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex min-h-11 w-full min-w-0 items-center gap-3 rounded-lg border border-dashed border-input bg-card px-3 py-2 text-left text-sm hover:border-primary/40"
          >
            <FileUp className="size-4 shrink-0 text-muted-foreground" />
            <span className={cn("min-w-0 flex-1 truncate", fileName ? "text-foreground" : "text-muted-foreground")}>
              {fileName || "Estado de cuenta, boletas o minuta (PDF o imagen)"}
            </span>
            <span className="shrink-0 text-xs font-medium text-primary">{fileName ? "Cambiar" : "Adjuntar"}</span>
          </button>
        </div>

        <label className="flex items-start gap-3 text-sm text-foreground">
          <Checkbox checked={declared} onCheckedChange={(v) => setDeclared(v === true)} className="mt-0.5" />
          <span>Declaro que los fondos tienen origen lícito y que la información es verdadera.</span>
        </label>

        <Button onClick={submit} disabled={!valid || submitting} className="h-10 rounded-xl sm:w-fit">
          {submitting ? "Enviando…" : "Enviar declaración"}
        </Button>
      </div>
    </div>
  );
}
