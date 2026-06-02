"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { toggleFilterValue } from "@/lib/admin/filters";
import { cn } from "@/lib/utils";

export interface FilterOption<T extends string> {
  value: T;
  label: string;
  description?: string;
}

interface FilterCheckboxGroupProps<T extends string> {
  label: string;
  options: FilterOption<T>[];
  selected: T[];
  onChange: (selected: T[]) => void;
  columns?: 1 | 2;
  className?: string;
}

export function FilterCheckboxGroup<T extends string>({
  label,
  options,
  selected,
  onChange,
  columns = 1,
  className,
}: FilterCheckboxGroupProps<T>) {
  return (
    <div className={className}>
      <p className="text-xs font-semibold text-foreground mb-2.5">{label}</p>
      <div
        className={cn(
          "gap-2",
          columns === 2 ? "grid grid-cols-2" : "flex flex-col"
        )}
      >
        {options.map((opt) => {
          const checked = selected.includes(opt.value);
          return (
            <label
              key={opt.value}
              className={cn(
                "flex items-start gap-2.5 rounded-lg border px-3 py-2.5 cursor-pointer transition-colors",
                checked
                  ? "border-primary/30 bg-primary/5"
                  : "border-border/60 hover:bg-muted/40"
              )}
            >
              <Checkbox
                checked={checked}
                onCheckedChange={() =>
                  onChange(toggleFilterValue(selected, opt.value))
                }
                className="mt-0.5"
              />
              <div className="min-w-0 flex-1">
                <span className="text-sm font-medium text-foreground leading-none">
                  {opt.label}
                </span>
                {opt.description && (
                  <p className="text-[11px] text-muted-foreground mt-1">
                    {opt.description}
                  </p>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
