import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import type { Difficulty } from "@/engine/types";

export function Badge({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-line bg-surface-sunken px-2.5 py-0.5 text-xs font-medium text-ink-soft",
        className
      )}
      {...props}
    />
  );
}

const difficultyStyles: Record<Difficulty, string> = {
  beginner:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900",
  intermediate:
    "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-900",
  advanced:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-900",
  expert:
    "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-900",
};

export function DifficultyBadge({ level }: { level: Difficulty }) {
  return (
    <Badge className={cn("capitalize", difficultyStyles[level])}>{level}</Badge>
  );
}
