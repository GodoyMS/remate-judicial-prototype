"use client";

import { useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { FilterCheckboxGroup } from "@/components/admin/FilterCheckboxGroup";
import { DistrictCommandPicker } from "@/components/admin/DistrictCommandPicker";
import { getDistrictsForRegion } from "@/lib/admin/districts";
import { REGIONS } from "@/lib/admin/mock-data";
import { formatCurrency } from "@/lib/admin/formatters";
import type { PropertyStatus } from "@/lib/admin/types";

export type PublishedFilterValue = "published" | "draft";

export interface PropertiesFilterState {
  region: string | null;
  districts: string[];
  statuses: PropertyStatus[];
  published: PublishedFilterValue[];
  amountRange: [number, number];
}

interface PropertiesFiltersContentProps {
  filters: PropertiesFilterState;
  onChange: (filters: PropertiesFilterState) => void;
}

const STATUS_OPTIONS: { value: PropertyStatus; label: string }[] = [
  { value: "published", label: "Activa" },
  { value: "draft", label: "Borrador" },
  { value: "closed", label: "Cerrada" },
];

const PUBLISHED_OPTIONS: {
  value: PublishedFilterValue;
  label: string;
  description?: string;
}[] = [
  { value: "published", label: "Publicada", description: "Visible en la plataforma" },
  { value: "draft", label: "No publicada", description: "Borrador o oculta" },
];

export function PropertiesFiltersContent({
  filters,
  onChange,
}: PropertiesFiltersContentProps) {
  const districtOptions = useMemo(
    () => getDistrictsForRegion(filters.region),
    [filters.region]
  );

  const patch = (partial: Partial<PropertiesFilterState>) =>
    onChange({ ...filters, ...partial });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
      <div className="space-y-2">
        <p className="text-xs font-semibold text-foreground">Región</p>
        <Select
          value={filters.region ?? "all"}
          onValueChange={(v) =>
            patch({
              region: v === "all" ? null : v,
              districts: [],
            })
          }
        >
          <SelectTrigger className="h-10 rounded-xl w-full">
            <SelectValue placeholder="Seleccionar región" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las regiones</SelectItem>
            {REGIONS.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-foreground">Distrito</p>
        <DistrictCommandPicker
          options={districtOptions}
          value={filters.districts}
          onChange={(districts) => patch({ districts })}
          disabled={!filters.region}
          placeholder={
            filters.region
              ? "Buscar distrito..."
              : "Selecciona una región primero"
          }
        />
        {!filters.region && (
          <p className="text-[11px] text-muted-foreground">
            Elige una región para ver distritos disponibles.
          </p>
        )}
      </div>

      <FilterCheckboxGroup
        label="Estado de subasta"
        options={STATUS_OPTIONS}
        selected={filters.statuses}
        onChange={(statuses) => patch({ statuses })}
      />

      <FilterCheckboxGroup
        label="Publicación"
        options={PUBLISHED_OPTIONS}
        selected={filters.published}
        onChange={(published) => patch({ published })}
      />

      <div className="md:col-span-2">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-foreground">
            Meta de inversión
          </p>
          <span className="text-[11px] text-muted-foreground tabular-nums">
            {formatCurrency(filters.amountRange[0])} —{" "}
            {formatCurrency(filters.amountRange[1])}
          </span>
        </div>
        <Slider
          min={0}
          max={700000}
          step={10000}
          value={filters.amountRange}
          onValueChange={(v) =>
            patch({ amountRange: v as [number, number] })
          }
          className="py-2"
        />
      </div>
    </div>
  );
}

export const defaultPropertiesFilters: PropertiesFilterState = {
  region: null,
  districts: [],
  statuses: [],
  published: [],
  amountRange: [0, 700000],
};

export function matchPublishedFilter(
  selected: PublishedFilterValue[],
  published: boolean
): boolean {
  if (selected.length === 0) return true;
  if (selected.includes("published") && published) return true;
  if (selected.includes("draft") && !published) return true;
  return false;
}

export function countPropertiesActiveFilters(
  filters: PropertiesFilterState
): number {
  return [
    filters.region !== null,
    filters.districts.length > 0,
    filters.statuses.length > 0,
    filters.published.length > 0,
    filters.amountRange[0] > 0 || filters.amountRange[1] < 700000,
  ].filter(Boolean).length;
}
