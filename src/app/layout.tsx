import type { Metadata } from "next";
import { Geist, Fredoka } from "next/font/google";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ThemeSwitcherFab } from "@/components/theme/ThemeSwitcherFab";
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
    var mode = localStorage.getItem(${JSON.stringify(THEME_MODE_STORAGE_KEY)});
    if (mode !== "light" && mode !== "dark") mode = "system";
    var dark =
      mode === "dark" ||
      (mode === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    root.classList.toggle("dark", dark);
  } catch (e) {}
})();
`;

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
          {children}
          <ThemeSwitcherFab />
        </ThemeProvider>
      </body>
    </html>
  );
}
