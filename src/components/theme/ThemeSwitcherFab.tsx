"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  Monitor,
  Moon,
  Palette,
  Pipette,
  RotateCcw,
  Sun,
  X,
} from "lucide-react";
import {
  BRAND_PRESETS,
  DEFAULT_BRAND_COLOR,
  DEFAULT_LOGO_SCALE,
  MAX_LOGO_SCALE,
  MIN_LOGO_SCALE,
  normalizeHexColor,
  type ThemeMode,
} from "@/lib/theme";
import { useTheme } from "@/components/theme/ThemeProvider";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";

const MODE_OPTIONS: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Claro", icon: Sun },
  { value: "dark", label: "Oscuro", icon: Moon },
  { value: "system", label: "Sistema", icon: Monitor },
];

export function ThemeSwitcherFab() {
  const { brandColor, setBrandColor, mode, setMode, logoScale, setLogoScale } =
    useTheme();
  const [open, setOpen] = useState(false);
  const [hexDraft, setHexDraft] = useState(brandColor);
  const colorInputRef = useRef<HTMLInputElement>(null);

  const isDefault = brandColor.toUpperCase() === DEFAULT_BRAND_COLOR;
  const isDefaultScale = logoScale === DEFAULT_LOGO_SCALE;
  const hexDraftValid = normalizeHexColor(hexDraft) !== null;

  // Keep the hex field in sync when the color changes via picker/presets
  useEffect(() => {
    setHexDraft(brandColor);
  }, [brandColor]);

  function commitHexDraft() {
    const normalized = normalizeHexColor(hexDraft);
    if (normalized) {
      setBrandColor(normalized);
      setHexDraft(normalized);
    } else {
      setHexDraft(brandColor);
    }
  }

  return (
    <div className="pointer-events-none fixed bottom-6 left-6 z-60 flex flex-col items-start gap-3">
      {open && (
        <div
          role="dialog"
          aria-label="Personalizar apariencia"
          className="pointer-events-auto w-[min(100vw-3rem,20rem)] origin-bottom-left animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 rounded-2xl border border-border/60 bg-popover p-4 text-popover-foreground shadow-2xl shadow-black/15 duration-150"
        >
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold tracking-tight">Apariencia</p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                El color elegido genera toda la paleta
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Cerrar personalización"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Mode: light / dark / system */}
          <div
            role="radiogroup"
            aria-label="Modo de color"
            className="mb-4 grid grid-cols-3 gap-1 rounded-xl bg-muted p-1"
          >
            {MODE_OPTIONS.map((option) => {
              const selected = mode === option.value;
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setMode(option.value)}
                  className={cn(
                    "flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium transition-all duration-150 outline-none",
                    "focus-visible:ring-[3px] focus-visible:ring-ring/40",
                    selected
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="size-3.5" />
                  {option.label}
                </button>
              );
            })}
          </div>

          {/* Free color picker + manual hex input */}
          <div className="relative mb-3 flex items-center gap-3 rounded-xl border border-border/60 bg-card p-3">
            <button
              type="button"
              onClick={() => colorInputRef.current?.click()}
              aria-label="Elegir color primario con el selector"
              title="Abrir selector de color"
              className={cn(
                "group flex size-10 shrink-0 items-center justify-center rounded-lg border border-black/10 shadow-inner transition-transform outline-none",
                "hover:scale-105 focus-visible:ring-[3px] focus-visible:ring-ring/40"
              )}
              style={{ backgroundColor: brandColor }}
            >
              <Pipette className="size-4 text-white opacity-0 mix-blend-difference transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
            </button>
            <div className="min-w-0 flex-1">
              <label
                htmlFor="brand-hex-input"
                className="block text-xs font-medium"
              >
                Color primario
              </label>
              <input
                id="brand-hex-input"
                type="text"
                inputMode="text"
                autoComplete="off"
                spellCheck={false}
                maxLength={7}
                placeholder={DEFAULT_BRAND_COLOR}
                value={hexDraft}
                onChange={(event) => {
                  const next = event.target.value;
                  setHexDraft(next);
                  if (/^#?[0-9a-fA-F]{6}$/.test(next.trim())) {
                    setBrandColor(next);
                  }
                }}
                onBlur={commitHexDraft}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    commitHexDraft();
                  }
                }}
                aria-label="Código hexadecimal del color primario"
                aria-invalid={!hexDraftValid}
                className={cn(
                  "mt-0.5 w-full rounded-md bg-transparent font-mono text-[11px] uppercase tracking-wide outline-none transition-colors",
                  "focus-visible:bg-muted/60 focus-visible:px-1.5 focus-visible:py-0.5",
                  hexDraftValid ? "text-muted-foreground" : "text-destructive"
                )}
              />
            </div>
            {!isDefault && (
              <button
                type="button"
                aria-label="Restaurar Azul clásico"
                title="Restaurar Azul clásico"
                onClick={() => setBrandColor(DEFAULT_BRAND_COLOR)}
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <RotateCcw className="size-3.5" />
              </button>
            )}
            <input
              ref={colorInputRef}
              type="color"
              value={normalizeHexColor(brandColor) ?? DEFAULT_BRAND_COLOR}
              onChange={(event) => setBrandColor(event.target.value)}
              aria-label="Elegir color primario"
              tabIndex={-1}
              className="absolute bottom-0 left-3 size-0 opacity-0"
            />
          </div>

          {/* Curated presets */}
          <div
            role="group"
            aria-label="Colores sugeridos"
            className="grid grid-cols-8 gap-1.5"
          >
            {BRAND_PRESETS.map((preset) => {
              const selected =
                brandColor.toUpperCase() === preset.value.toUpperCase();
              return (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setBrandColor(preset.value)}
                  title={preset.label}
                  aria-label={preset.label}
                  aria-pressed={selected}
                  className={cn(
                    "flex aspect-square items-center justify-center rounded-lg border-2 transition-all duration-150 outline-none",
                    "focus-visible:ring-[3px] focus-visible:ring-ring/40",
                    selected
                      ? "scale-105 border-foreground shadow-md"
                      : "border-transparent hover:scale-105 hover:border-foreground/25"
                  )}
                  style={{ backgroundColor: preset.value }}
                >
                  {selected && (
                    <Check className="size-3 stroke-3 text-white mix-blend-difference" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Logo size */}
          <div className="mt-4 border-t border-border/60 pt-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-medium">Tamaño del logo</p>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[11px] tracking-wide text-muted-foreground">
                  {Math.round(logoScale * 100)}%
                </span>
                {!isDefaultScale && (
                  <button
                    type="button"
                    onClick={() => setLogoScale(DEFAULT_LOGO_SCALE)}
                    aria-label="Restaurar tamaño original"
                    title="Restaurar tamaño original"
                    className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <RotateCcw className="size-3" />
                  </button>
                )}
              </div>
            </div>
            <div className="mb-2.5 flex h-14 items-center justify-center overflow-hidden rounded-xl border border-border/60 bg-card">
              <Logo className="text-2xl text-primary" />
            </div>
            <input
              type="range"
              min={Math.round(MIN_LOGO_SCALE * 100)}
              max={Math.round(MAX_LOGO_SCALE * 100)}
              step={5}
              value={Math.round(logoScale * 100)}
              onChange={(event) =>
                setLogoScale(Number(event.target.value) / 100)
              }
              aria-label="Tamaño del logo"
              className="w-full accent-primary"
            />
          </div>

          {/* Live token preview */}
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-muted/60 p-2">
            <span className="flex h-7 flex-1 items-center justify-center rounded-md bg-primary text-[10px] font-semibold text-primary-foreground">
              Primary
            </span>
            <span className="flex h-7 flex-1 items-center justify-center rounded-md bg-accent text-[10px] font-semibold text-accent-foreground">
              Accent
            </span>
            <span className="flex h-7 flex-1 items-center justify-center rounded-md border border-border bg-card text-[10px] font-semibold text-card-foreground">
              Card
            </span>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? "Cerrar personalización" : "Personalizar apariencia"}
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
