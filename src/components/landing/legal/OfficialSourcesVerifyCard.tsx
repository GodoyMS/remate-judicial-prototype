import { ArrowUpRight } from "lucide-react";
import { BRAND_REGISTRY } from "@/lib/brand";
import { cn } from "@/lib/utils";

const sources = [
  {
    id: "pj",
    name: "Poder Judicial",
    description: "Consulta el estado y las actuaciones de un expediente.",
    href: "https://cej.pj.gob.pe/cej/forms/busquedaform.html",
    linkLabel: "Ir a la consulta oficial",
  },
  {
    id: "sunarp",
    name: "SUNARP",
    description: "Consulta la información registral del inmueble.",
    href: BRAND_REGISTRY.sunarpUrl,
    linkLabel: "Ir al servicio oficial",
  },
] as const;

interface OfficialSourcesVerifyCardProps {
  className?: string;
  variant?: "standalone" | "nested";
}

export function OfficialSourcesVerifyCard({
  className,
  variant = "standalone",
}: OfficialSourcesVerifyCardProps) {
  const isNested = variant === "nested";

  return (
    <div
      className={cn(
        isNested
          ? "rounded-xl border border-border bg-muted/30 p-4 sm:p-5"
          : "rounded-2xl border border-border bg-card p-6 shadow-sm",
        className
      )}
    >
      <h2
        className={cn(
          "text-foreground",
          isNested ? "type-body font-semibold" : "type-h3"
        )}
      >
        Verifica en fuentes oficiales
      </h2>
      <ul className="mt-4 divide-y divide-border">
        {sources.map((source) => (
          <li
            key={source.id}
            className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
          >
            <div className="min-w-0">
              <p className="type-body font-semibold text-foreground">
                {source.name}
              </p>
              <p className="mt-0.5 type-caption text-muted-foreground">
                {source.description}
              </p>
            </div>
            <a
              href={source.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-1 type-caption font-semibold text-primary hover:underline"
            >
              {source.linkLabel}
              <ArrowUpRight className="size-3.5" aria-hidden />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
