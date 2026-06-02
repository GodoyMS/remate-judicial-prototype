import { DISTRICTS, PROVINCES, adminProperties } from "@/lib/admin/mock-data";

/** Districts available for a region (from catalog + existing properties). */
export function getDistrictsForRegion(region: string | null): string[] {
  if (!region) return [];

  const provinces = PROVINCES[region] ?? [];
  const fromCatalog = provinces.flatMap((province) => DISTRICTS[province] ?? []);
  const fromProperties = adminProperties
    .filter((p) => p.region === region)
    .map((p) => p.district);

  return [...new Set([...fromCatalog, ...fromProperties])].sort((a, b) =>
    a.localeCompare(b, "es")
  );
}
