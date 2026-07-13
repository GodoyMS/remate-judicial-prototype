export const BRAND_THEME_STORAGE_KEY = "remata-brand-theme";

export const BRAND_THEME_IDS = [
  "classic",
  "blue-field",
  "green-field",
  "green-navy",
  "teal-ink",
  "mint-field",
] as const;

export type BrandThemeId = (typeof BRAND_THEME_IDS)[number];

export const DEFAULT_BRAND_THEME: BrandThemeId = "classic";

export type BrandThemeMeta = {
  id: BrandThemeId;
  label: string;
  description: string;
  /** Logo / mark color in the brand board */
  primary: string;
  /** Field / board background color */
  secondary: string;
};

/**
 * Six brand boards from the identity exploration.
 * Grid order matches the reference (row-major):
 *   blue-field | green-field | teal-ink
 *   classic    | green-navy  | mint-field
 */
export const BRAND_THEMES: BrandThemeMeta[] = [
  {
    id: "blue-field",
    label: "Azul campo",
    description: "Marca clara sobre azul",
    primary: "#E8E8E8",
    secondary: "#2D45DC",
  },
  {
    id: "green-field",
    label: "Verde campo",
    description: "Navy sobre verde vivo",
    primary: "#0D1117",
    secondary: "#39D353",
  },
  {
    id: "teal-ink",
    label: "Teal oscuro",
    description: "Teal sobre carbón",
    primary: "#00C49A",
    secondary: "#1A1A1A",
  },
  {
    id: "classic",
    label: "Azul clásico",
    description: "Azul sobre gris — default",
    primary: "#2D45DC",
    secondary: "#E8E8E8",
  },
  {
    id: "green-navy",
    label: "Verde navy",
    description: "Verde sobre navy",
    primary: "#37CD6D",
    secondary: "#12087B",
  },
  {
    id: "mint-field",
    label: "Mint campo",
    description: "Carbón sobre teal",
    primary: "#1A1A1A",
    secondary: "#00C49A",
  },
];

export function isBrandThemeId(value: unknown): value is BrandThemeId {
  return (
    typeof value === "string" &&
    (BRAND_THEME_IDS as readonly string[]).includes(value)
  );
}

export function getBrandTheme(id: BrandThemeId): BrandThemeMeta {
  return BRAND_THEMES.find((theme) => theme.id === id) ?? BRAND_THEMES[3];
}
