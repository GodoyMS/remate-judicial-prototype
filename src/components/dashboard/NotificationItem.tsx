"use client";

import Link from "next/link";
import {
  Gavel,
  TrendingUp,
  Wallet,
  Scale,
  Sparkles,
  Zap,
  Check,
  Circle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  CATEGORY_META,
  type AppNotification,
  type NotificationCategory,
} from "@/lib/dashboard/notifications";

const ICONS = {
  Gavel,
  TrendingUp,
  Wallet,
  Scale,
  Sparkles,
  Zap,
} as const;

function CategoryIcon({ category }: { category: NotificationCategory }) {
  const meta = CATEGORY_META[category];
  const Icon = ICONS[meta.iconName as keyof typeof ICONS];
  return (
    <div
      className={cn(
        "size-10 rounded-xl border flex items-center justify-center shrink-0 transition-all",
        meta.bg,
        meta.color
      )}
    >
      <Icon className="size-4" />
    </div>
  );
}

interface NotificationItemProps {
  notification: AppNotification;
  onMarkRead?: (id: string) => void;
  compact?: boolean;
  showMarkAction?: boolean;
}

export function NotificationItem({
  notification,
  onMarkRead,
  compact = false,
  showMarkAction = true,
}: NotificationItemProps) {
  const meta = CATEGORY_META[notification.category];
  const isUnread = !notification.read;

  const content = (
    <div
      className={cn(
        "group relative flex gap-3 rounded-xl border transition-all duration-200",
        compact ? "p-3" : "p-4",
        isUnread
          ? "border-primary/20 bg-gradient-to-r from-primary/[0.06] via-primary/[0.03] to-transparent shadow-sm"
          : "border-border/50 bg-muted/20 opacity-80 hover:opacity-100 hover:bg-muted/35"
      )}
    >
      {isUnread && (
        <span className="absolute left-0 top-3 bottom-3 w-1 rounded-full bg-primary" />
      )}

      <CategoryIcon category={notification.category} />

      <div className="flex-1 min-w-0 pl-0.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-wrap">
            <p
              className={cn(
                "text-sm leading-snug",
                isUnread ? "font-semibold text-foreground" : "font-medium text-muted-foreground"
              )}
            >
              {notification.title}
            </p>
            {isUnread && (
              <span className="size-2 rounded-full bg-primary shrink-0 animate-pulse" />
            )}
          </div>
          {notification.highlight && (
            <Badge
              variant="outline"
              className={cn(
                "shrink-0 text-[10px] font-semibold",
                isUnread && "border-primary/30 bg-primary/5 text-primary"
              )}
            >
              {notification.highlight}
            </Badge>
          )}
        </div>

        <p
          className={cn(
            "mt-1 text-xs leading-relaxed line-clamp-2",
            isUnread ? "text-muted-foreground" : "text-muted-foreground/70"
          )}
        >
          {notification.description}
        </p>

        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-[10px] font-medium uppercase tracking-wide",
                meta.color
              )}
            >
              {meta.label}
            </span>
            <span className="text-[10px] text-muted-foreground/60">·</span>
            <span className="text-[10px] text-muted-foreground">
              {notification.timeAgo}
            </span>
          </div>

          {showMarkAction && onMarkRead && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onMarkRead(notification.id);
              }}
              className={cn(
                "flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-medium transition-all",
                isUnread
                  ? "text-primary hover:bg-primary/10 opacity-100"
                  : "text-muted-foreground hover:bg-muted opacity-0 group-hover:opacity-100"
              )}
            >
              {isUnread ? (
                <>
                  <Check className="size-3" />
                  Marcar leída
                </>
              ) : (
                <>
                  <Circle className="size-3" />
                  No leída
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (notification.href) {
    return (
      <Link
        href={notification.href}
        onClick={() => isUnread && onMarkRead?.(notification.id)}
        className="block"
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className="block w-full text-left"
      onClick={() => onMarkRead?.(notification.id)}
    >
      {content}
    </button>
  );
}
