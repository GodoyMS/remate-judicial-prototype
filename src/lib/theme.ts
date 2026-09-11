export const BRAND_COLOR_STORAGE_KEY = "rematto-brand-color";
export const THEME_MODE_STORAGE_KEY = "rematto-theme-mode";
export const LOGO_SCALE_STORAGE_KEY = "rematto-logo-scale";

/** Multiplier applied to every logo's contextual size (1 = as designed) */
export const DEFAULT_LOGO_SCALE = 1;
export const MIN_LOGO_SCALE = 0.7;
export const MAX_LOGO_SCALE = 1.6;

/** Parses and clamps a logo scale value, or null if not a number. */
export function normalizeLogoScale(value: unknown): number | null {
  const num =
    typeof value === "number" ? value : parseFloat(String(value ?? ""));
  if (!Number.isFinite(num)) return null;
  const clamped = Math.min(MAX_LOGO_SCALE, Math.max(MIN_LOGO_SCALE, num));
  return Math.round(clamped * 100) / 100;
}

/** Azul clásico — brand default (#2D45DC on #E8E8E8 neutrals) */
export const DEFAULT_BRAND_COLOR = "#2D45DC";

export const THEME_MODES = ["light", "dark", "system"] as const;
export type ThemeMode = (typeof THEME_MODES)[number];
export const DEFAULT_THEME_MODE: ThemeMode = "light";

export function isThemeMode(value: unknown): value is ThemeMode {
  return (
    typeof value === "string" &&
    (THEME_MODES as readonly string[]).includes(value)
  );
}

/** Accepts #RGB or #RRGGBB and returns uppercase #RRGGBB, or null. */
export function normalizeHexColor(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(value.trim());
  if (!match) return null;
  const hex = match[1];
  const full =
    hex.length === 3
      ? hex
          .split("")
          .map((c) => c + c)
          .join("")
      : hex;
  return `#${full.toUpperCase()}`;
}

/** Curated starting points shown as swatches next to the free picker. */
export const BRAND_PRESETS: { label: string; value: string }[] = [
  { label: "Azul clásico", value: "#2D45DC" },
  { label: "Índigo", value: "#5B4FE8" },
  { label: "Teal", value: "#00A88C" },
  { label: "Esmeralda", value: "#1FA254" },
  { label: "Ámbar", value: "#C97B12" },
  { label: "Coral", value: "#E05D4B" },
  { label: "Fucsia", value: "#C43FA8" },
  { label: "Grafito", value: "#3D4351" },
];

export function resolveThemeMode(
  mode: ThemeMode,
  systemPrefersDark: boolean
): "light" | "dark" {
  if (mode === "system") return systemPrefersDark ? "dark" : "light";
  return mode;
}
