import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SectionBarProps {
  id: string;
  title: string;
  action?: { label: string; href: string };
}

/** Barra de título en primary con texto blanco para separar secciones clave. */
export function SectionBar({ id, title, action }: SectionBarProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-primary px-5 h-12">
      <h3 id={id} className="text-base font-semibold text-primary-foreground">
        {title}
      </h3>
      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 -mr-2 text-sm font-medium text-primary-foreground/85 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
        >
          {action.label}
          <ArrowRight className="size-3.5" />
        </Link>
      )}
    </div>
  );
}
