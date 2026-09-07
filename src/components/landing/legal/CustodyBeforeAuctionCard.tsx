import Link from "next/link";
import { Check, ChevronDown, CircleHelp, Shield } from "lucide-react";
import { BRAND_NAME } from "@/lib/brand";

const CUSTODY_ITEMS = [
  "Entidad que mantiene los fondos",
  "Titular legal de la cuenta",
  "Tipo de cuenta o mecanismo de custodia",
  `Separación de los fondos de ${BRAND_NAME}`,
  "Cuándo y bajo qué condición se libera el dinero",
  "Plazo y medio de devolución si el pool no se completa",
] as const;

export function CustodyBeforeAuctionCard() {
  return (
    <li className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h3 className="type-h3 text-balance text-foreground">
        ¿Dónde está tu dinero antes del remate?
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Tu dinero aún no se aplica a la operación. Permanece en custodia hasta
        que se cumplan las condiciones.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {CUSTODY_ITEMS.map((label) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-xl border border-border/80 bg-background px-3.5 py-3"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-muted/40">
              <Check
                className="size-4 text-muted-foreground"
                strokeWidth={2}
                aria-hidden
              />
            </span>
            <span className="min-w-0 flex-1 text-sm leading-snug text-foreground">
              {label}
            </span>
            <span className="shrink-0 text-sm text-muted-foreground">
              Por confirmar
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-200/90 bg-[#fff8ef] p-4">
        <Shield
          className="mt-0.5 size-5 shrink-0 text-amber-800/80"
          strokeWidth={1.75}
          aria-hidden
        />
        <p className="text-sm leading-relaxed text-foreground">
          Antes de invertir, {BRAND_NAME} debe identificar la entidad, explicar
          la estructura legal y enlazar el documento que acredita la custodia y
          la devolución de los fondos.
        </p>
      </div>

      <Link
        href="/preguntas-frecuentes#custodia"
        className="mt-4 flex items-center gap-3 rounded-xl border border-border/80 bg-background px-4 py-3.5 transition-colors hover:bg-muted/30"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-muted/40">
          <CircleHelp
            className="size-4 text-muted-foreground"
            strokeWidth={2}
            aria-hidden
          />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-semibold text-muted-foreground">
            Preguntas frecuentes
          </span>
          <span className="mt-0.5 block text-sm text-foreground">
            ¿Dónde está mi dinero antes del remate?
          </span>
        </span>
        <ChevronDown
          className="size-5 shrink-0 text-muted-foreground"
          aria-hidden
        />
      </Link>

      <p className="mt-5 text-center">
        <Link
          href="/preguntas-frecuentes#custodia"
          className="text-sm font-semibold text-primary hover:underline"
        >
          Ver preguntas frecuentes
        </Link>
      </p>
    </li>
  );
}
