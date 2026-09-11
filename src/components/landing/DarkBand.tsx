import { cn } from "@/lib/utils";

/**
 * Full-bleed dark marketing band, matching the closing CTA surface so
 * photographic sections feel like one continuous product language.
 */
export function DarkBand({
  id,
  children,
  className,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      data-nav-tone="dark"
      className={cn(
        "relative isolate overflow-hidden bg-foreground py-20 text-background scroll-mt-24 sm:py-24 lg:py-28",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -top-32 left-1/2 size-[560px] -translate-x-1/2 rounded-full bg-primary/22 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-16 size-80 rounded-full bg-primary/12 blur-3xl"
        aria-hidden
      />
      {children}
    </section>
  );
}
