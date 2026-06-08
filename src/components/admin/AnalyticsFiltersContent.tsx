"use client";

import { FilterCheckboxGroup } from "@/components/admin/FilterCheckboxGroup";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PropertyCurrency } from "@/lib/currency";
import {
  DATE_PRESET_LABELS,
  type AnalyticsDatePreset,
  type AnalyticsFilterState,
} from "@/lib/admin/analytics";
import { REGIONS } from "@/lib/admin/mock-data";
import type { InvestmentStatus, PropertyStatus } from "@/lib/admin/types";

interface AnalyticsFiltersContentProps {
  filters: AnalyticsFilterState;
  onChange: (filters: AnalyticsFilterState) => void;
}

const CURRENCY_OPTIONS: { value: PropertyCurrency; label: string }[] = [
  { value: "PEN", label: "Soles (PEN)" },
  { value: "USD", label: "Dólares (USD)" },
];

const PROPERTY_STATUS_OPTIONS: { value: PropertyStatus; label: string }[] = [
  { value: "published", label: "Publicada" },
  { value: "draft", label: "Borrador" },
  { value: "closed", label: "Cerrada" },
];

const INVESTMENT_STATUS_OPTIONS: { value: InvestmentStatus; label: string }[] = [
  { value: "confirmed", label: "Confirmada" },
  { value: "pending", label: "Pendiente" },
  { value: "rejected", label: "Rechazada" },
];

const REGION_OPTIONS = REGIONS.map((r) => ({ value: r, label: r }));

export function AnalyticsFiltersContent({
  filters,
  onChange,
}: AnalyticsFiltersContentProps) {
  const patch = (partial: Partial<AnalyticsFilterState>) =>
    onChange({ ...filters, ...partial });

  return (
    <>
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Período
        </Label>
        <Select
          value={filters.datePreset}
          onValueChange={(v) => patch({ datePreset: v as AnalyticsDatePreset })}
        >
          <SelectTrigger className="rounded-xl h-10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.entries(DATE_PRESET_LABELS) as [AnalyticsDatePreset, string][]).map(
              ([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </div>

      <FilterCheckboxGroup
        label="Región"
        options={REGION_OPTIONS}
        selected={filters.regions}
        onChange={(regions) => patch({ regions })}
      />

      <FilterCheckboxGroup
        label="Moneda"
        options={CURRENCY_OPTIONS}
        selected={filters.currencies}
        onChange={(currencies) => patch({ currencies })}
        columns={2}
      />

      <FilterCheckboxGroup
        label="Estado de propiedad"
        options={PROPERTY_STATUS_OPTIONS}
        selected={filters.propertyStatuses}
        onChange={(propertyStatuses) => patch({ propertyStatuses })}
        columns={2}
      />

      <FilterCheckboxGroup
        label="Estado de inversión"
        options={INVESTMENT_STATUS_OPTIONS}
        selected={filters.investmentStatuses}
        onChange={(investmentStatuses) => patch({ investmentStatuses })}
        columns={2}
      />
    </>
  );
}
