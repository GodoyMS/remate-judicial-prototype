/**
 * Shared UI style primitives for consistent ShadCN component styling.
 * Centralizes spacing, focus, states, and surface patterns across the design system.
 */

/** Smooth, snappy transitions for interactive elements */
export const transitionInteractive =
  "transition-[color,background-color,border-color,box-shadow,transform] duration-150 ease-out"

/** Consistent focus ring — visible but not overwhelming */
export const focusRing =
  "outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40"

/** Invalid / error state styling */
export const invalidState =
  "aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/30"

/** Disabled state styling */
export const disabledState =
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"

/** Base form control — inputs, selects, triggers */
export const formControlBase = [
  "w-full min-w-0 rounded-lg border border-input bg-card text-sm text-foreground shadow-xs",
  transitionInteractive,
  focusRing,
  invalidState,
  "placeholder:text-muted-foreground/60",
  "hover:border-foreground/15",
  "disabled:bg-muted/40 disabled:hover:border-input",
  "dark:bg-card/80 dark:disabled:bg-muted/30",
].join(" ")

/** Default control height & horizontal padding */
export const formControlSize = {
  default: "h-9 px-3",
  sm: "h-8 px-2.5 text-xs",
} as const

/** Floating overlay surface — popovers, dropdowns, select menus */
export const overlaySurface = [
  "rounded-lg bg-popover text-popover-foreground",
  "shadow-lg shadow-foreground/5",
  "ring-1 ring-foreground/8",
  "border border-border/50",
].join(" ")

/** Overlay enter/exit animations */
export const overlayAnimation = [
  "duration-150",
  "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
  "data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
  "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
  "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
].join(" ")

/** Menu container padding */
export const menuContainer = "p-1.5"

/** Menu item base — dropdown, select, combobox items */
export const menuItemBase = [
  "relative flex w-full min-h-9 cursor-default items-center gap-2",
  "rounded-md px-2.5 py-2 text-sm outline-none select-none",
  transitionInteractive,
  "data-disabled:pointer-events-none data-disabled:opacity-50",
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
].join(" ")

/** Menu item focus/highlight state */
export const menuItemHighlight =
  "focus:bg-accent focus:text-accent-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground"

/** Menu group label */
export const menuLabel = "px-2.5 py-1.5 text-xs font-medium text-muted-foreground"

/** Menu separator */
export const menuSeparator = "pointer-events-none -mx-1 my-1 h-px bg-border"

/** Modal/dialog surface */
export const dialogSurface = [
  "rounded-xl bg-popover text-popover-foreground",
  "shadow-xl shadow-foreground/8",
  "ring-1 ring-foreground/8",
  "border border-border/50",
].join(" ")

/** Modal overlay backdrop */
export const dialogOverlay =
  "bg-foreground/20 supports-backdrop-filter:backdrop-blur-[2px]"

/** Table cell padding */
export const tableCellPadding = "px-4 py-3"

/** Table header styling */
export const tableHeadStyle =
  "h-11 text-left align-middle text-xs font-semibold uppercase tracking-wide text-muted-foreground"
