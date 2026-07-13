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
          "bg-gradient-to-r from-premium to-premium/80 text-premium-foreground shadow-sm",
        variant === "outline" &&
          "border border-premium/30 bg-premium/10 text-premium",
        variant === "subtle" && "bg-premium/10 text-premium",
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
        "bg-gradient-to-r from-premium to-premium/70 text-premium-foreground",
        className
      )}
    >
      <Sparkles className="size-2.5" />
      Exclusivo Premium
    </span>
  );
}
