import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { BrandThemeProvider } from "@/components/theme/BrandThemeProvider";
import { ThemeSwitcherFab } from "@/components/theme/ThemeSwitcherFab";
import {
  BRAND_THEME_STORAGE_KEY,
  DEFAULT_BRAND_THEME,
} from "@/lib/brand-themes";
import "./globals.css";

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Remata — Invierte en remates judiciales",
  description:
    "La plataforma más segura para invertir en propiedades inmobiliarias en remate judicial en Perú. Verificadas legalmente, retornos atractivos.",
};

const brandThemeInitScript = `
(function () {
  try {
    var key = ${JSON.stringify(BRAND_THEME_STORAGE_KEY)};
    var fallback = ${JSON.stringify(DEFAULT_BRAND_THEME)};
    var stored = localStorage.getItem(key);
    var valid = ["classic","blue-field","green-field","green-navy","teal-ink","mint-field"];
    var theme = valid.indexOf(stored) !== -1 ? stored : fallback;
    document.documentElement.setAttribute("data-brand-theme", theme);
  } catch (e) {
    document.documentElement.setAttribute("data-brand-theme", ${JSON.stringify(DEFAULT_BRAND_THEME)});
  }
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
      data-brand-theme={DEFAULT_BRAND_THEME}
      className={`${geist.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: brandThemeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <BrandThemeProvider>
          {children}
          <ThemeSwitcherFab />
        </BrandThemeProvider>
      </body>
    </html>
  );
}
