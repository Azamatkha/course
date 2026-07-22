import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import type { Difficulty } from "@/engine/types";
import { useI18n } from "@/engine/i18n";
import type { DictKey } from "@/engine/i18n/en";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-line bg-surface-sunken",
        "px-2.5 py-0.5 text-xs font-medium text-ink-soft",
        className
      )}
      {...props}
    />
  );
}

/**
 * Difficulty maps onto the semantic status ramp, so light/dark contrast is
 * handled once in the token layer rather than per-badge.
 */
const difficultyStyles: Record<Difficulty, string> = {
  beginner: "border-success/25 bg-success-soft/70 text-success",
  intermediate: "border-info/25 bg-info-soft/70 text-info",
  advanced: "border-warning/25 bg-warning-soft/70 text-warning",
  expert: "border-danger/25 bg-danger-soft/70 text-danger",
};

/** Rank shown as filled pips — meaning survives without relying on colour. */
const difficultyRank: Record<Difficulty, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
  expert: 4,
};

export function DifficultyBadge({ level }: { level: Difficulty }) {
  const { t } = useI18n();
  const key = `difficulty.${level}` as DictKey;
  const rank = difficultyRank[level];

  return (
    <Badge className={cn("capitalize", difficultyStyles[level])}>
      <span aria-hidden="true" className="flex items-center gap-[2px]">
        {[1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={cn(
              "h-1 w-1 rounded-full bg-current",
              i > rank && "opacity-25"
            )}
          />
        ))}
      </span>
      {t(key)}
    </Badge>
  );
}
