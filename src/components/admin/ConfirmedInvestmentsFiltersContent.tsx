"use client";

import { Slider } from "@/components/ui/slider";
import { FilterCheckboxGroup } from "@/components/admin/FilterCheckboxGroup";
import { InvestorCommandPicker } from "@/components/admin/InvestorCommandPicker";
import type { ConfirmedInvestmentsFilterState } from "@/lib/admin/investments";
import { PAYMENT_METHOD_LABELS } from "@/lib/admin/investments";
import { formatCurrency } from "@/lib/admin/formatters";
import type { PaymentMethodId } from "@/lib/admin/types";
import type { InvestorOption } from "@/components/admin/InvestorCommandPicker";

const PAYMENT_OPTIONS: { value: PaymentMethodId; label: string }[] = [
  { value: "card", label: PAYMENT_METHOD_LABELS.card },
  { value: "yape", label: PAYMENT_METHOD_LABELS.yape },
  { value: "transfer", label: PAYMENT_METHOD_LABELS.transfer },
  { value: "deposit", label: PAYMENT_METHOD_LABELS.deposit },
];

interface ConfirmedInvestmentsFiltersContentProps {
  filters: ConfirmedInvestmentsFilterState;
  onChange: (filters: ConfirmedInvestmentsFilterState) => void;
  users: InvestorOption[];
  amountBounds: { min: number; max: number };
}

export function ConfirmedInvestmentsFiltersContent({
  filters,
  onChange,
  users,
  amountBounds,
}: ConfirmedInvestmentsFiltersContentProps) {
  const patch = (partial: Partial<ConfirmedInvestmentsFilterState>) =>
    onChange({ ...filters, ...partial });

  const sliderMax = Math.max(amountBounds.max, amountBounds.min + 500);
  const sliderStep = Math.max(100, Math.round((sliderMax - amountBounds.min) / 100));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
      <FilterCheckboxGroup
        label="Tipo de pago"
        options={PAYMENT_OPTIONS}
        selected={filters.paymentMethods}
        onChange={(paymentMethods) => patch({ paymentMethods })}
        columns={1}
      />

      <div className="space-y-2">
        <p className="text-xs font-semibold text-foreground">Usuario</p>
        <InvestorCommandPicker
          options={users}
          value={filters.userIds}
          onChange={(userIds) => patch({ userIds })}
          placeholder="Buscar por nombre o correo..."
          disabled={users.length === 0}
        />
        {users.length === 0 && (
          <p className="text-[11px] text-muted-foreground">
            No hay inversores confirmados en esta propiedad.
          </p>
        )}
      </div>

      <div className="md:col-span-2">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-foreground">Rango de monto</p>
          <span className="text-[11px] text-muted-foreground tabular-nums">
            {formatCurrency(filters.amountMin)} — {formatCurrency(filters.amountMax)}
          </span>
        </div>
        <Slider
          min={amountBounds.min}
          max={sliderMax}
          step={sliderStep}
          value={[filters.amountMin, filters.amountMax]}
          onValueChange={([amountMin, amountMax]) =>
            patch({ amountMin, amountMax })
          }
          className="py-2"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
          <span>{formatCurrency(amountBounds.min)}</span>
          <span>{formatCurrency(sliderMax)}</span>
        </div>
      </div>
    </div>
  );
}
