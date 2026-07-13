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
  BRAND_THEME_STORAGE_KEY,
  DEFAULT_BRAND_THEME,
  isBrandThemeId,
  type BrandThemeId,
} from "@/lib/brand-themes";

type BrandThemeContextValue = {
  theme: BrandThemeId;
  setTheme: (theme: BrandThemeId) => void;
};

const BrandThemeContext = createContext<BrandThemeContextValue | null>(null);

function applyThemeAttribute(theme: BrandThemeId) {
  document.documentElement.setAttribute("data-brand-theme", theme);
}

export function BrandThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<BrandThemeId>(DEFAULT_BRAND_THEME);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(BRAND_THEME_STORAGE_KEY);
      if (isBrandThemeId(stored)) {
        setThemeState(stored);
        applyThemeAttribute(stored);
        return;
      }
    } catch {
      /* ignore */
    }
    applyThemeAttribute(DEFAULT_BRAND_THEME);
  }, []);

  const setTheme = useCallback((next: BrandThemeId) => {
    setThemeState(next);
    applyThemeAttribute(next);
    try {
      localStorage.setItem(BRAND_THEME_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return (
    <BrandThemeContext.Provider value={value}>
      {children}
    </BrandThemeContext.Provider>
  );
}

export function useBrandTheme() {
  const ctx = useContext(BrandThemeContext);
  if (!ctx) {
    throw new Error("useBrandTheme must be used within BrandThemeProvider");
  }
  return ctx;
}
