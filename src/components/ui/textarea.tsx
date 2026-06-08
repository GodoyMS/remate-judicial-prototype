import * as React from "react"

import { cn } from "@/lib/utils"
import {
  disabledState,
  focusRing,
  formControlBase,
  invalidState,
  transitionInteractive,
} from "@/lib/ui-styles"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "field-sizing-content flex min-h-20 w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm text-foreground shadow-xs",
        transitionInteractive,
        focusRing,
        invalidState,
        disabledState,
        "placeholder:text-muted-foreground/60 hover:border-foreground/15 disabled:bg-muted/40 disabled:hover:border-input dark:bg-card/80 dark:disabled:bg-muted/30",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
