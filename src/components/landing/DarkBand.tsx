import { cn } from "@/lib/utils";

/**
 * Full-bleed dark marketing band. Uses a fixed always-dark surface so light
 * text stays readable in light mode (semantic bg-foreground/text-background
 * invert with the theme and break contrast on tinted containers).
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
        "relative isolate overflow-hidden scroll-mt-24 py-20 sm:py-24 lg:py-28",
        "bg-[oklch(from_var(--brand)_0.2_calc(c*0.1)_h)] text-[oklch(0.97_0_0)]",
        "dark:bg-[oklch(from_var(--brand)_0.28_calc(c*0.12)_h)] dark:text-[oklch(0.96_0_0)]",
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
