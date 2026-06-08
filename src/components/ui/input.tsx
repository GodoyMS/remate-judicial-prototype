import * as React from "react"

import { cn } from "@/lib/utils"
import {
  disabledState,
  formControlBase,
  formControlSize,
} from "@/lib/ui-styles"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        formControlBase,
        formControlSize.default,
        disabledState,
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export { Input }
