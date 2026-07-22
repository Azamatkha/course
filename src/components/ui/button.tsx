import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg" | "icon" | "icon-sm";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-accent-ink shadow-sm hover:bg-accent-hover active:shadow-none",
  secondary: "bg-surface-sunken text-ink hover:bg-line/60 active:bg-line/80",
  ghost: "text-ink-soft hover:bg-surface-sunken hover:text-ink active:bg-line/50",
  outline:
    "border border-line bg-surface-raised text-ink shadow-sm hover:border-line-strong hover:bg-surface-sunken active:shadow-none",
  danger: "bg-danger text-white shadow-sm hover:brightness-110 active:shadow-none",
};

/**
 * Heights meet the 44px comfortable-touch guidance on the sizes used for
 * primary actions; `sm`/`icon-sm` are reserved for dense desktop toolbars.
 */
const sizes: Record<Size, string> = {
  sm: "h-8 gap-1.5 rounded-lg px-3 text-sm",
  md: "h-10 gap-2 rounded-xl px-4 text-sm",
  lg: "h-12 gap-2 rounded-xl px-6 text-base",
  icon: "h-10 w-10 rounded-xl",
  "icon-sm": "h-8 w-8 rounded-lg",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  /** Renders a spinner and blocks interaction while an action is in flight. */
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", loading = false, disabled, children, ...props },
    ref
  ) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        "relative inline-flex select-none items-center justify-center whitespace-nowrap font-medium",
        "transition-[background-color,border-color,color,box-shadow,transform] duration-fast ease-out",
        // Press feedback that doesn't shift surrounding layout
        "active:scale-[0.98]",
        "disabled:pointer-events-none disabled:opacity-45",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {children}
    </button>
  )
);
Button.displayName = "Button";
