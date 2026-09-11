import type { Metadata } from "next";
import { Geist, Fredoka } from "next/font/google";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ThemeSwitcherFab } from "@/components/theme/ThemeSwitcherFab";
import { UserProvider } from "@/contexts/user-context";
import {
  BRAND_COLOR_STORAGE_KEY,
  LOGO_SCALE_STORAGE_KEY,
  MAX_LOGO_SCALE,
  MIN_LOGO_SCALE,
  THEME_MODE_STORAGE_KEY,
} from "@/lib/theme";
import "./globals.css";

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const fredoka = Fredoka({
  variable: "--font-logo",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: "Rematto — Invierte en remates judiciales",
  description:
    "La plataforma más segura para invertir en propiedades inmobiliarias en remate judicial en Perú. Verificadas legalmente, retornos atractivos.",
};

/**
 * Applies the persisted brand color and dark mode before first paint to
 * avoid a flash of the default theme. Mirrors the logic in ThemeProvider.
 */
const themeInitScript = `
(function () {
  var root = document.documentElement;
  try {
    var color = localStorage.getItem(${JSON.stringify(BRAND_COLOR_STORAGE_KEY)});
    if (color && /^#[0-9a-fA-F]{6}$/.test(color)) {
      root.style.setProperty("--brand", color);
    }
  } catch (e) {}
  try {
    var scale = parseFloat(localStorage.getItem(${JSON.stringify(LOGO_SCALE_STORAGE_KEY)}));
    if (isFinite(scale) && scale >= ${MIN_LOGO_SCALE} && scale <= ${MAX_LOGO_SCALE}) {
      root.style.setProperty("--logo-scale", String(scale));
    }
  } catch (e) {}
  try {
    // Default is light regardless of OS preference — only an explicit
    // stored choice of "dark" (or "system" resolving to dark) turns it on.
    var mode = localStorage.getItem(${JSON.stringify(THEME_MODE_STORAGE_KEY)});
    if (mode !== "light" && mode !== "dark" && mode !== "system") mode = "light";
    var dark =
      mode === "dark" ||
      (mode === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    root.classList.toggle("dark", dark);
  } catch (e) {}
})();
`;

/**
 * Appearance control — second review, finding 26.
 *
 * The floating palette button is a design tool: it lets anyone recolour the
 * brand and resize the logotype. Useful while iterating, out of place on a
 * public site that asks people for money, where the only floating action
 * should be support. It is therefore off in production unless explicitly
 * enabled, and on by default in development.
 */
const showAppearanceFab =
  process.env.NEXT_PUBLIC_ENABLE_APPEARANCE_FAB === "true" ||
  (process.env.NODE_ENV !== "production" &&
    process.env.NEXT_PUBLIC_ENABLE_APPEARANCE_FAB !== "false");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`${geist.variable} ${fredoka.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>
          {/* Global: login/register need the same session context as the
              dashboard (WP-1.4) — a page outside /dashboard can't call
              useCurrentUser() unless the provider lives above it. */}
          <UserProvider>
            {children}
            {showAppearanceFab && <ThemeSwitcherFab />}
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
