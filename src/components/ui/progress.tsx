import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  className,
  label,
}: {
  value: number;
  className?: string;
  /** Accessible name — required when the bar isn't adjacent to its own label. */
  label?: string;
}) {
  const pct = Math.min(100, Math.max(0, Math.round(value)));
  const complete = pct === 100;

  return (
    <div
      className={cn(
        "h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken ring-1 ring-inset ring-line/60",
        className
      )}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      aria-valuetext={`${pct}%`}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-slow ease-out",
          complete ? "bg-success" : "bg-accent"
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
