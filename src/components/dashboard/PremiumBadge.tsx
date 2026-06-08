import { Crown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface PremiumBadgeProps {
  className?: string;
  size?: "sm" | "md";
  variant?: "default" | "outline" | "subtle";
}

export function PremiumBadge({
  className,
  size = "sm",
  variant = "default",
}: PremiumBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-semibold rounded-full",
        size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1",
        variant === "default" &&
          "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm",
        variant === "outline" &&
          "border border-amber-300 bg-amber-50 text-amber-800",
        variant === "subtle" && "bg-amber-50/80 text-amber-700",
        className
      )}
    >
      <Crown className={size === "sm" ? "size-2.5" : "size-3"} />
      Premium
    </span>
  );
}

export function PremiumExclusiveBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full",
        "bg-gradient-to-r from-[#163300] to-[#2d5a1a] text-[#9FE870]",
        className
      )}
    >
      <Sparkles className="size-2.5" />
      Exclusivo Premium
    </span>
  );
}
