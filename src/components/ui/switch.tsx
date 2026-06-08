"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { focusRing, invalidState, transitionInteractive } from "@/lib/ui-styles"

function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent",
        transitionInteractive,
        focusRing,
        invalidState,
        "data-[size=default]:h-5 data-[size=default]:w-9",
        "data-[size=sm]:h-4 data-[size=sm]:w-7",
        "data-checked:bg-primary data-unchecked:bg-input",
        "dark:data-unchecked:bg-input/80",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block rounded-full bg-background shadow-sm ring-0 transition-transform",
          "group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3",
          "group-data-[size=default]/switch:data-checked:translate-x-4 group-data-[size=sm]/switch:data-checked:translate-x-3",
          "group-data-[size=default]/switch:data-unchecked:translate-x-0.5 group-data-[size=sm]/switch:data-unchecked:translate-x-0.5",
          "dark:data-checked:bg-primary-foreground dark:data-unchecked:bg-foreground"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
