"use client";

import { useState } from "react";
import { Check, Palette, X } from "lucide-react";
import { BRAND_THEMES, type BrandThemeId } from "@/lib/brand-themes";
import { useBrandTheme } from "@/components/theme/BrandThemeProvider";
import { cn } from "@/lib/utils";

export function ThemeSwitcherFab() {
  const { theme, setTheme } = useBrandTheme();
  const [open, setOpen] = useState(false);

  function selectTheme(id: BrandThemeId) {
    setTheme(id);
  }

  return (
    <div className="pointer-events-none fixed bottom-6 left-6 z-60 flex flex-col items-start gap-3">
      {open && (
        <div
          role="dialog"
          aria-label="Selector de tema de marca"
          className="pointer-events-auto w-[min(100vw-3rem,20rem)] origin-bottom-left animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 rounded-2xl border border-border/60 bg-popover p-3 text-popover-foreground shadow-2xl shadow-black/15 duration-150"
        >
          <div className="mb-3 flex items-start justify-between gap-3 px-1">
            <div>
              <p className="text-sm font-semibold tracking-tight">Temas de marca</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Explora paletas primary / secondary
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Cerrar selector de tema"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {BRAND_THEMES.map((item) => {
              const selected = theme === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectTheme(item.id)}
                  title={`${item.label} — ${item.description}`}
                  aria-pressed={selected}
                  className={cn(
                    "group relative aspect-5/4 overflow-hidden rounded-xl border-2 transition-all duration-150 outline-none",
                    "focus-visible:ring-[3px] focus-visible:ring-ring/40",
                    selected
                      ? "border-foreground scale-[1.02] shadow-md"
                      : "border-transparent hover:border-foreground/25 hover:scale-[1.02]"
                  )}
                  style={{ backgroundColor: item.secondary }}
                >
                  <span
                    className="absolute inset-0 flex items-center justify-center font-bold tracking-tight"
                    style={{ color: item.primary, fontSize: "0.7rem" }}
                  >
                    Aa
                  </span>
                  {selected && (
                    <span
                      className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full"
                      style={{
                        backgroundColor: item.primary,
                        color: item.secondary,
                      }}
                    >
                      <Check className="size-2.5 stroke-3" />
                    </span>
                  )}
                  <span className="sr-only">
                    {item.label}. {item.description}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="mt-3 px-1 text-[11px] leading-relaxed text-muted-foreground">
            {
              BRAND_THEMES.find((item) => item.id === theme)?.label
            }{" "}
            ·{" "}
            <span className="font-mono uppercase tracking-wide">
              {BRAND_THEMES.find((item) => item.id === theme)?.primary}
            </span>
            {" / "}
            <span className="font-mono uppercase tracking-wide">
              {BRAND_THEMES.find((item) => item.id === theme)?.secondary}
            </span>
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? "Cerrar temas de marca" : "Abrir temas de marca"}
        className={cn(
          "pointer-events-auto flex size-12 items-center justify-center rounded-full border border-border/60 bg-primary text-primary-foreground shadow-lg shadow-black/20 transition-all duration-150",
          "hover:scale-105 hover:shadow-xl active:scale-95",
          "focus-visible:ring-[3px] focus-visible:ring-ring/40 outline-none",
          open && "ring-[3px] ring-ring/30"
        )}
      >
        {open ? <X className="size-5" /> : <Palette className="size-5" />}
      </button>
    </div>
  );
}
