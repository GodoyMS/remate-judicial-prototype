import type { AdminProperty } from "./types";

export function getAdminPropertyImages(property: AdminProperty): string[] {
  if (property.images?.length) return property.images;
  return property.image ? [property.image] : [];
}
