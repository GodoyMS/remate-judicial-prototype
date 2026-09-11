"use client";

import { useState } from "react";
import { ShieldCheck, Scale, FileText, ExternalLink, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { JudicialRecord, VerificationReport, RoiBasis } from "@/lib/dashboard/types";
import { formatCurrency, formatDate } from "@/lib/dashboard/mock-data";
import type { PropertyCurrency } from "@/lib/currency";

interface OpportunityEvidenceProps {
  judicial: JudicialRecord;
  verification: VerificationReport;
}

/**
 * "Propiedad verificada" es una afirmación que el usuario debe creer hasta
 * que se muestre qué se verificó y con qué expediente (WP-3.1, cierra
 * E-032/E-033). En remates judiciales, el expediente es el producto.
 */
export function OpportunityEvidence({ judicial, verification }: OpportunityEvidenceProps) {
  return (
    <Card className="rounded-2xl border-border/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <ShieldCheck className="size-4 text-success" />
          Verificación de la oportunidad
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Estado</p>
            <p className="font-semibold text-success">Verificada</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Fecha de revisión</p>
            <p className="font-medium">{formatDate(verification.verifiedAt)}</p>
          </div>
        </div>

        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1.5">Qué se revisó</p>
          <ul className="space-y-1.5">
            {verification.scope.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                <ShieldCheck className="size-3.5 text-success shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {verification.documents.length > 0 && (
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1.5">Documentos disponibles</p>
            <div className="flex flex-col gap-1.5">
              {verification.documents.map((doc) => (
                <a
                  key={doc.label}
                  href={doc.url}
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <FileText className="size-3.5 shrink-0" />
                  {doc.label}
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-xl bg-muted/30 border border-border/60 p-4 space-y-2">
          <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Scale className="size-3.5" />
            Proceso judicial
          </p>
          <dl className="grid sm:grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
            <div className="flex justify-between sm:block">
              <dt className="text-muted-foreground text-xs">N.º de expediente</dt>
              <dd className="font-mono font-medium">{judicial.expediente}</dd>
            </div>
            <div className="flex justify-between sm:block">
              <dt className="text-muted-foreground text-xs">Juzgado</dt>
              <dd className="font-medium">{judicial.juzgado}</dd>
            </div>
            <div className="flex justify-between sm:block">
              <dt className="text-muted-foreground text-xs">Etapa actual</dt>
              <dd className="font-medium">{judicial.etapa}</dd>
            </div>
            <div className="flex justify-between sm:block">
              <dt className="text-muted-foreground text-xs">Última revisión</dt>
              <dd className="font-medium">{formatDate(judicial.lastReviewedAt)}</dd>
            </div>
          </dl>
          {judicial.sourceUrl && (
            <a
              href={judicial.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
            >
              Consultar en el Poder Judicial
              <ExternalLink className="size-3" />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface RoiBreakdownProps {
  roiBasis: RoiBasis;
  currency: PropertyCurrency;
}

/** "Ver cálculo": desglosa supuestos, costos y retorno neto (WP-3.2, cierra E-036). */
export function RoiBreakdown({ roiBasis, currency }: RoiBreakdownProps) {
  const [open, setOpen] = useState(false);
  const totalCosts = roiBasis.costs.reduce((sum, c) => sum + c.amount, 0);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
      >
        Ver cálculo
        <ChevronDown className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="mt-3 rounded-xl border border-border/60 bg-muted/20 p-4 space-y-3 text-sm">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1.5">Supuestos</p>
            {roiBasis.assumptions.map((a) => (
              <div key={a.label} className="flex justify-between py-0.5">
                <span className="text-muted-foreground">{a.label}</span>
                <span className="font-medium">{a.value}</span>
              </div>
            ))}
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1.5">Costos estimados de la operación</p>
            {roiBasis.costs.map((c) => (
              <div key={c.label} className="flex justify-between py-0.5">
                <span className="text-muted-foreground">{c.label}</span>
                <span className="font-medium">{formatCurrency(c.amount, currency)}</span>
              </div>
            ))}
            <div className="flex justify-between py-0.5 border-t border-border/60 mt-1 pt-1">
              <span className="text-muted-foreground">Total costos</span>
              <span className="font-medium">{formatCurrency(totalCosts, currency)}</span>
            </div>
          </div>
          <div className="flex justify-between border-t border-border/60 pt-2">
            <span className="font-semibold">Retorno bruto</span>
            <span className="font-semibold">{roiBasis.grossRoi}%</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold text-success">Retorno neto estimado</span>
            <span className="font-bold text-success">{roiBasis.netRoi}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
