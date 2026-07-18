"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  BRAND_COLOR_STORAGE_KEY,
  DEFAULT_BRAND_COLOR,
  DEFAULT_LOGO_SCALE,
  DEFAULT_THEME_MODE,
  LOGO_SCALE_STORAGE_KEY,
  THEME_MODE_STORAGE_KEY,
  isThemeMode,
  normalizeHexColor,
  normalizeLogoScale,
  resolveThemeMode,
  type ThemeMode,
} from "@/lib/theme";

type ThemeContextValue = {
  /** Brand primary color (#RRGGBB) driving the whole token system */
  brandColor: string;
  setBrandColor: (color: string) => void;
  /** User preference: light, dark or follow the system */
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  /** What is actually rendered right now */
  resolvedMode: "light" | "dark";
  /** Multiplier on every logo's contextual size (1 = as designed) */
  logoScale: number;
  setLogoScale: (scale: number) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyBrandColor(color: string) {
  document.documentElement.style.setProperty("--brand", color);
}

function applyResolvedMode(resolved: "light" | "dark") {
  document.documentElement.classList.toggle("dark", resolved === "dark");
}

function applyLogoScale(scale: number) {
  document.documentElement.style.setProperty("--logo-scale", String(scale));
}

function systemPrefersDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [brandColor, setBrandColorState] = useState(DEFAULT_BRAND_COLOR);
  const [mode, setModeState] = useState<ThemeMode>(DEFAULT_THEME_MODE);
  const [resolvedMode, setResolvedMode] = useState<"light" | "dark">("light");
  const [logoScale, setLogoScaleState] = useState(DEFAULT_LOGO_SCALE);

  // Hydrate from storage (the inline script in layout.tsx already applied
  // these to <html> before first paint — here we mirror them into state).
  useEffect(() => {
    let storedColor: string | null = null;
    let storedMode: string | null = null;
    let storedScale: string | null = null;
    try {
      storedColor = localStorage.getItem(BRAND_COLOR_STORAGE_KEY);
      storedMode = localStorage.getItem(THEME_MODE_STORAGE_KEY);
      storedScale = localStorage.getItem(LOGO_SCALE_STORAGE_KEY);
    } catch {
      /* ignore */
    }

    const color = normalizeHexColor(storedColor) ?? DEFAULT_BRAND_COLOR;
    const nextMode = isThemeMode(storedMode) ? storedMode : DEFAULT_THEME_MODE;
    const scale =
      (storedScale !== null ? normalizeLogoScale(storedScale) : null) ??
      DEFAULT_LOGO_SCALE;

    setBrandColorState(color);
    setModeState(nextMode);
    setLogoScaleState(scale);
    applyBrandColor(color);
    applyLogoScale(scale);

    const resolved = resolveThemeMode(nextMode, systemPrefersDark());
    setResolvedMode(resolved);
    applyResolvedMode(resolved);
  }, []);

  // Follow OS preference while in "system" mode.
  useEffect(() => {
    if (mode !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const resolved = resolveThemeMode("system", media.matches);
      setResolvedMode(resolved);
      applyResolvedMode(resolved);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [mode]);

  const setBrandColor = useCallback((color: string) => {
    const normalized = normalizeHexColor(color);
    if (!normalized) return;
    setBrandColorState(normalized);
    applyBrandColor(normalized);
    try {
      localStorage.setItem(BRAND_COLOR_STORAGE_KEY, normalized);
    } catch {
      /* ignore */
    }
  }, []);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    const resolved = resolveThemeMode(next, systemPrefersDark());
    setResolvedMode(resolved);
    applyResolvedMode(resolved);
    try {
      localStorage.setItem(THEME_MODE_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const setLogoScale = useCallback((scale: number) => {
    const normalized = normalizeLogoScale(scale);
    if (normalized === null) return;
    setLogoScaleState(normalized);
    applyLogoScale(normalized);
    try {
      localStorage.setItem(LOGO_SCALE_STORAGE_KEY, String(normalized));
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(
    () => ({
      brandColor,
      setBrandColor,
      mode,
      setMode,
      resolvedMode,
      logoScale,
      setLogoScale,
    }),
    [brandColor, setBrandColor, mode, setMode, resolvedMode, logoScale, setLogoScale]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
