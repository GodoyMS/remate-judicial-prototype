"use client";

import { FilterCheckboxGroup } from "@/components/admin/FilterCheckboxGroup";
import type { LoginProvider, UserStatus, UserTier } from "@/lib/admin/types";

export interface UsersFilterState {
  tiers: UserTier[];
  statuses: UserStatus[];
  providers: LoginProvider[];
}

interface UsersFiltersContentProps {
  filters: UsersFilterState;
  onChange: (filters: UsersFilterState) => void;
}

const TIER_OPTIONS: { value: UserTier; label: string }[] = [
  { value: "premium", label: "Premium" },
  { value: "standard", label: "Standard" },
];

const STATUS_OPTIONS: { value: UserStatus; label: string }[] = [
  { value: "active", label: "Activo" },
  { value: "blocked", label: "Bloqueado" },
];

const PROVIDER_OPTIONS: { value: LoginProvider; label: string }[] = [
  { value: "google", label: "Google" },
  { value: "email", label: "Email" },
];

export function UsersFiltersContent({
  filters,
  onChange,
}: UsersFiltersContentProps) {
  const patch = (partial: Partial<UsersFilterState>) =>
    onChange({ ...filters, ...partial });

  return (
    <>
      <FilterCheckboxGroup
        label="Plan"
        options={TIER_OPTIONS}
        selected={filters.tiers}
        onChange={(tiers) => patch({ tiers })}
      />

      <FilterCheckboxGroup
        label="Estado de cuenta"
        options={STATUS_OPTIONS}
        selected={filters.statuses}
        onChange={(statuses) => patch({ statuses })}
      />

      <FilterCheckboxGroup
        label="Proveedor de acceso"
        options={PROVIDER_OPTIONS}
        selected={filters.providers}
        onChange={(providers) => patch({ providers })}
        columns={2}
      />
    </>
  );
}

export const defaultUsersFilters: UsersFilterState = {
  tiers: [],
  statuses: [],
  providers: [],
};

export function countUsersActiveFilters(filters: UsersFilterState): number {
  return [
    filters.tiers.length > 0,
    filters.statuses.length > 0,
    filters.providers.length > 0,
  ].filter(Boolean).length;
}
