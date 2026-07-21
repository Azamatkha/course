import { useEffect, useRef, useState } from "react";
import { Check, Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LOCALES, useI18n } from "@/engine/i18n";

/**
 * Compact language menu. Switching sets React state in the i18n provider,
 * so the whole UI re-renders instantly — no reload, no flash.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LOCALES.find((l) => l.code === lang) ?? LOCALES[0];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen((o) => !o)}
        className="gap-1.5 text-ink-soft"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("nav.language")}
      >
        <Languages className="h-4 w-4" />
        <span className="text-xs font-semibold">{current.short}</span>
      </Button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-line bg-surface-raised p-1 shadow-lg"
        >
          <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-faint">
            {t("nav.language")}
          </p>
          {LOCALES.map((locale) => (
            <button
              key={locale.code}
              role="menuitemradio"
              aria-checked={locale.code === lang}
              onClick={() => {
                setLang(locale.code);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-surface-sunken",
                locale.code === lang ? "font-semibold text-ink" : "text-ink-soft"
              )}
            >
              <span className="flex items-center gap-2">
                <span className="w-6 font-mono text-[11px] text-ink-faint">
                  {locale.short}
                </span>
                {locale.label}
              </span>
              {locale.code === lang && <Check className="h-4 w-4 text-accent" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
