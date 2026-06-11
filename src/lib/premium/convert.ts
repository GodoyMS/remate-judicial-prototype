import type { AdminProperty } from "@/lib/admin/types";
import type { PremiumProperty } from "./types";
import { getPremiumPropertyOverride } from "@/lib/app-store";

function getDeadlineDays(deadline: string): number {
  const diff = new Date(deadline).getTime() - Date.now();
  if (diff <= 0) return 0;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function adminPropertyToPremiumProperty(
  property: AdminProperty
): PremiumProperty {
  const override = getPremiumPropertyOverride(property.id);
  const status =
    override?.premiumStatus ?? property.premiumStatus ?? "available";
  const deadline = property.premiumDeadline ?? new Date().toISOString();

  return {
    id: property.id,
    name: property.title,
    address: property.address,
    type: property.propertyType ?? "Departamento",
    area: property.area ?? "—",
    district: property.district,
    region: property.region,
    description: property.description,
    img: property.image,
    images: property.images.length > 0 ? property.images : [property.image],
    currency: property.currency,
    totalValue: property.totalInvestment,
    premiumRoi: property.premiumRoi ?? property.roi,
    standardRoi: property.roi,
    premiumDeadline: deadline,
    premiumDeadlineDays: getDeadlineDays(deadline),
    status,
    caughtByUserId: override?.caughtByUserId ?? property.caughtByUserId,
    caughtByUserName: override?.caughtByUserName ?? property.caughtByUserName,
    caughtAt: override?.caughtAt ?? property.caughtAt,
    notifyPremiumUsers: property.notifyPremiumUsers ?? false,
    createdAt: property.createdAt,
  };
}
