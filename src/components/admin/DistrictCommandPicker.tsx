"use client";

import { useState, type MouseEvent } from "react";
import { Check, ChevronsUpDown, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toggleFilterValue } from "@/lib/admin/filters";
import { cn } from "@/lib/utils";

interface DistrictCommandPickerProps {
  options: string[];
  value: string[];
  onChange: (districts: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function DistrictCommandPicker({
  options,
  value,
  onChange,
  disabled = false,
  placeholder = "Buscar distrito...",
}: DistrictCommandPickerProps) {
  const [open, setOpen] = useState(false);

  const toggle = (district: string) => {
    onChange(toggleFilterValue(value, district));
  };

  const remove = (district: string, e: MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((d) => d !== district));
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "min-h-10 h-auto w-full justify-between rounded-xl font-normal py-2",
              value.length === 0 && "text-muted-foreground"
            )}
          >
            <span className="flex items-center gap-2 text-left flex-1 min-w-0">
              <MapPin className="size-3.5 shrink-0 opacity-60 mt-0.5 self-start" />
              {value.length === 0 ? (
                <span className="truncate">Buscar y seleccionar distritos</span>
              ) : (
                <span className="text-foreground text-sm">
                  {value.length} distrito{value.length !== 1 ? "s" : ""}{" "}
                  seleccionado{value.length !== 1 ? "s" : ""}
                </span>
              )}
            </span>
            <ChevronsUpDown className="size-4 shrink-0 opacity-50 ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0 rounded-xl"
          align="start"
        >
          <Command>
            <CommandInput placeholder={placeholder} />
            <CommandList>
              <CommandEmpty>No se encontró el distrito.</CommandEmpty>
              <CommandGroup>
                {options.map((district) => {
                  const selected = value.includes(district);
                  return (
                    <CommandItem
                      key={district}
                      value={district}
                      onSelect={() => toggle(district)}
                    >
                      <Check
                        className={cn(
                          "size-4 shrink-0",
                          selected ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {district}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              {value.length > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      value="limpiar-distritos"
                      onSelect={() => onChange([])}
                      className="text-muted-foreground"
                    >
                      Limpiar selección ({value.length})
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
          <div className="flex items-center justify-between gap-2 border-t border-border/40 px-3 py-2 bg-muted/20">
            <span className="text-[11px] text-muted-foreground">
              {value.length === 0
                ? "Selecciona uno o más"
                : `${value.length} seleccionado${value.length !== 1 ? "s" : ""}`}
            </span>
            <Button
              type="button"
              size="sm"
              className="h-7 rounded-lg text-xs"
              onClick={() => setOpen(false)}
            >
              Listo
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((district) => (
            <Badge
              key={district}
              variant="secondary"
              className="rounded-lg pl-2 pr-1 py-0.5 text-xs font-medium gap-1 max-w-full"
            >
              <span className="truncate">{district}</span>
              <button
                type="button"
                onClick={(e) => remove(district, e)}
                className="rounded-sm p-0.5 hover:bg-muted-foreground/20 shrink-0"
                aria-label={`Quitar ${district}`}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
