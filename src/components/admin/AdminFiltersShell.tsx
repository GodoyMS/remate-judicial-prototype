"use client";

import { useEffect, useState, type ReactNode } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface AdminFiltersShellProps {
  activeCount: number;
  onClear: () => void;
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
  /** Desktop popover width / layout (drawer unchanged on mobile) */
  popoverClassName?: string;
}

export function AdminFiltersShell({
  activeCount,
  onClear,
  children,
  title = "Filtros",
  description = "Selecciona uno o más criterios",
  className,
  popoverClassName,
}: AdminFiltersShellProps) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClear = () => {
    onClear();
    setOpen(false);
  };

  const triggerButton = (
    <Button
      type="button"
      variant="outline"
      className={cn("h-10 rounded-xl gap-2 shrink-0", className)}
      onClick={mounted && isMobile ? () => setOpen(true) : undefined}
    >
      <SlidersHorizontal className="size-4" />
      <span>Filtros</span>
      {activeCount > 0 && (
        <Badge className="h-5 min-w-5 px-1.5 rounded-md text-[10px] font-bold">
          {activeCount}
        </Badge>
      )}
    </Button>
  );

  const body = (
    <div className="flex flex-col gap-5 overscroll-contain">{children}</div>
  );

  const footer = (
    <div className="flex gap-2 w-full">
      <Button
        type="button"
        variant="outline"
        className="flex-1 rounded-xl"
        onClick={handleClear}
        disabled={activeCount === 0}
      >
        Limpiar todo
      </Button>
      <Button
        type="button"
        className="flex-1 rounded-xl"
        onClick={() => setOpen(false)}
      >
        Aplicar
      </Button>
    </div>
  );

  if (!mounted) {
    return triggerButton;
  }

  if (isMobile) {
    return (
      <>
        {triggerButton}
        <Drawer open={open} onOpenChange={setOpen} direction="bottom">
          <DrawerContent className="max-h-[88vh]">
            <DrawerHeader className="text-left border-b border-border/40 pb-4">
              <DrawerTitle>{title}</DrawerTitle>
              <DrawerDescription>{description}</DrawerDescription>
            </DrawerHeader>
            <div className="flex-1 overflow-y-auto px-4 py-4">{body}</div>
            <DrawerFooter className="border-t border-border/40 pt-4">
              {footer}
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className={cn(
          "w-[min(100vw-2rem,380px)] p-0 overflow-hidden rounded-2xl",
          popoverClassName
        )}
      >
        <div className="px-4 pt-4 pb-2 border-b border-border/40">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
        <div className="max-h-[min(70vh,560px)] overflow-y-auto px-5 py-4">
          {body}
        </div>
        <div className="px-4 pb-4 pt-2 border-t border-border/40 bg-muted/10">
          {footer}
        </div>
      </PopoverContent>
    </Popover>
  );
}
