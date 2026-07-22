import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  BookMarked,
  BookOpen,
  Info,
  Library,
  Menu,
  Moon,
  Search,
  Sun,
  TrendingUp,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/engine/theme";
import { useI18n } from "@/engine/i18n";
import type { DictKey } from "@/engine/i18n/en";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const nav: { to: string; key: DictKey; icon: typeof TrendingUp }[] = [
  { to: "/courses", key: "nav.courses", icon: Library },
  { to: "/progress", key: "nav.progress", icon: TrendingUp },
  { to: "/bookmarks", key: "nav.bookmarks", icon: BookMarked },
  { to: "/glossary", key: "nav.glossary", icon: BookOpen },
  { to: "/about", key: "nav.about", icon: Info },
];

export function Header() {
  const { theme, toggle } = useTheme();
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Global shortcut: Ctrl/Cmd+K → search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        navigate("/search");
      }
      // Escape closes the mobile menu and returns focus to its trigger.
      if (e.key === "Escape" && open) {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate, open]);

  // Navigating always dismisses the mobile sheet — back/forward included.
  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-header border-b border-line",
        "bg-surface/80 backdrop-blur-xl supports-[backdrop-filter]:bg-surface/70"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2.5 font-bold tracking-tight"
          aria-label={t("brand.name")}
        >
          <span
            aria-hidden="true"
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl",
              "bg-accent text-accent-ink shadow-sm",
              "transition-transform duration-base ease-out hover:scale-105"
            )}
          >
            {/* Anvil-ish mark: a forge for Python engineers */}
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" strokeWidth={2}>
              <path
                d="M4 7h9l3 3h4M7 10v4a5 5 0 0 0 5 5h1M6 19h10"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="text-lg">{t("brand.name")}</span>
        </Link>

        <nav className="ml-2 hidden items-center gap-0.5 md:flex" aria-label="Main">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "relative rounded-lg px-3 py-2 text-sm font-medium",
                  "transition-colors duration-fast ease-out",
                  isActive
                    ? "text-ink"
                    : "text-ink-soft hover:bg-surface-sunken hover:text-ink"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {t(item.key)}
                  {/* Active indicator is a shape, not just a colour shift */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-x-3 -bottom-[13px] h-[2px] rounded-full bg-accent",
                      "transition-opacity duration-base ease-out",
                      isActive ? "opacity-100" : "opacity-0"
                    )}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <button
            onClick={() => navigate("/search")}
            aria-label={t("nav.search")}
            className={cn(
              "hidden h-10 items-center gap-2 rounded-xl border border-line bg-surface-raised",
              "px-3 text-sm text-ink-faint shadow-sm sm:inline-flex",
              "transition-colors duration-fast ease-out hover:border-line-strong hover:text-ink-soft"
            )}
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            <span className="hidden lg:inline">{t("nav.search")}</span>
            <kbd className="ml-1 rounded border border-line bg-surface-sunken px-1.5 py-0.5 font-mono text-[10px] leading-none">
              Ctrl K
            </kbd>
          </button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/search")}
            className="sm:hidden"
            aria-label={t("nav.search")}
          >
            <Search className="h-4 w-4" />
          </Button>

          <LanguageSwitcher />

          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            aria-label={t("nav.toggleTheme")}
            aria-pressed={theme === "dark"}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <Button
            ref={menuButtonRef}
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label={t("nav.menu")}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="animate-rise border-t border-line bg-surface px-3 py-2 md:hidden"
        >
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    // 48px row: comfortable touch target
                    "flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-medium",
                    "transition-colors duration-fast ease-out",
                    isActive
                      ? "bg-accent-soft text-accent"
                      : "text-ink-soft active:bg-surface-sunken"
                  )
                }
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {t(item.key)}
              </NavLink>
            );
          })}
        </nav>
      )}
    </header>
  );
}
