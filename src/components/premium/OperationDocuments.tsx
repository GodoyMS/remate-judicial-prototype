"use client";

import Link from "next/link";
import { ChevronRight, FileText } from "lucide-react";
import { StatusPill } from "./StatusPill";
import { trackingHref } from "./reservation-ui";
import { getPremiumPropertyById } from "@/lib/premium/mock-data";
import {
  DOCUMENT_STATUS_LABELS,
  useReservations,
  type DocumentStatus,
  type StatusTone,
} from "@/lib/premium/reservations";
import { formatLimaDate } from "@/lib/premium/dates";
import { cn } from "@/lib/utils";

const TONE: Record<DocumentStatus, StatusTone> = {
  approved: "success",
  confirmed: "success",
  in_review: "info",
  to_sign: "warning",
};

/**
 * Documentos generados por las operaciones Premium (contratos, constancias,
 * informes). Se distinguen de los archivos que sube el usuario y cada fila
 * lleva al seguimiento, donde se firman o se revisan.
 */
export function OperationDocuments({ userId, query }: { userId: string; query: string }) {
  const reservations = useReservations();
  const q = query.trim().toLowerCase();
  const rows = reservations
    .filter((r) => r.userId === userId)
    .flatMap((r) =>
      r.documents.map((d) => ({ d, r, name: getPremiumPropertyById(r.propertyId)?.name ?? r.code }))
    )
    .filter(({ d, name }) => !q || d.title.toLowerCase().includes(q) || name.toLowerCase().includes(q))
    .sort((a, b) => {
      if ((a.d.status === "to_sign") !== (b.d.status === "to_sign")) return a.d.status === "to_sign" ? -1 : 1;
      return b.d.date.localeCompare(a.d.date);
    });

  if (rows.length === 0) return null;

  return (
    <section className="mb-6 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm" aria-labelledby="op-docs" data-testid="operation-documents">
      <div className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-3 sm:px-5">
        <h2 id="op-docs" className="text-sm font-semibold text-foreground">
          Documentos de tus operaciones Premium
        </h2>
        <span className="text-xs text-muted-foreground">{rows.length}</span>
      </div>
      <div className="hidden grid-cols-[minmax(0,1fr)_110px_130px_120px_28px] gap-4 border-b border-border/60 bg-primary/5 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground md:grid">
        <span className="text-primary">Documento</span>
        <span>Tipo</span>
        <span>Estado</span>
        <span>Fecha</span>
        <span />
      </div>
      <ul className="max-h-[26rem] divide-y divide-border/60 overflow-y-auto">
        {rows.map(({ d, r, name }) => (
          <li key={d.id}>
            <Link
              href={trackingHref(r.id, "documentos")}
              className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 hover:bg-muted/40 sm:px-5 md:grid-cols-[minmax(0,1fr)_110px_130px_120px_28px]"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary dark:bg-accent dark:text-accent-foreground">
                  <FileText className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className={cn("truncate text-sm font-semibold", d.status === "to_sign" ? "text-foreground" : "text-foreground/90")}>
                    {d.title}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{name}</p>
                  <div className="mt-1 md:hidden">
                    <StatusPill tone={TONE[d.status]} size="xs">
                      {DOCUMENT_STATUS_LABELS[d.status]}
                    </StatusPill>
                  </div>
                </div>
              </div>
              <span className="hidden text-xs font-medium text-muted-foreground md:block">PDF · v{d.version}</span>
              <span className="hidden md:block">
                <StatusPill tone={TONE[d.status]} size="xs">
                  {DOCUMENT_STATUS_LABELS[d.status]}
                </StatusPill>
              </span>
              <span className="hidden text-sm text-muted-foreground md:block">{formatLimaDate(d.date)}</span>
              <ChevronRight className="size-4 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
