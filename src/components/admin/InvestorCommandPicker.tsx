"use client";

import { useState, type MouseEvent } from "react";
import { Check, ChevronsUpDown, User, X } from "lucide-react";
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

export interface InvestorOption {
  id: string;
  name: string;
  email: string;
}

interface InvestorCommandPickerProps {
  options: InvestorOption[];
  value: string[];
  onChange: (userIds: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function InvestorCommandPicker({
  options,
  value,
  onChange,
  disabled = false,
  placeholder = "Buscar inversor...",
}: InvestorCommandPickerProps) {
  const [open, setOpen] = useState(false);

  const selectedUsers = options.filter((u) => value.includes(u.id));

  const toggle = (userId: string) => {
    onChange(toggleFilterValue(value, userId));
  };

  const remove = (userId: string, e: MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((id) => id !== userId));
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
              <User className="size-3.5 shrink-0 opacity-60 mt-0.5 self-start" />
              {value.length === 0 ? (
                <span className="truncate">Buscar y seleccionar inversores</span>
              ) : (
                <span className="text-foreground text-sm">
                  {value.length} inversor{value.length !== 1 ? "es" : ""}{" "}
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
              <CommandEmpty>No se encontró el inversor.</CommandEmpty>
              <CommandGroup>
                {options.map((user) => {
                  const selected = value.includes(user.id);
                  return (
                    <CommandItem
                      key={user.id}
                      value={`${user.name} ${user.email}`}
                      onSelect={() => toggle(user.id)}
                    >
                      <Check
                        className={cn(
                          "size-4 shrink-0",
                          selected ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              {value.length > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      value="limpiar-inversores"
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

      {selectedUsers.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedUsers.map((user) => (
            <Badge
              key={user.id}
              variant="secondary"
              className="rounded-lg pl-2 pr-1 py-0.5 text-xs font-medium gap-1 max-w-full"
            >
              <span className="truncate">{user.name}</span>
              <button
                type="button"
                onClick={(e) => remove(user.id, e)}
                className="rounded-sm p-0.5 hover:bg-muted-foreground/20 shrink-0"
                aria-label={`Quitar ${user.name}`}
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
