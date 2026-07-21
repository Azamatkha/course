import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  BookMarked,
  GraduationCap,
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

const nav: { to: string; key: DictKey; icon?: typeof TrendingUp }[] = [
  { to: "/courses", key: "nav.courses" },
  { to: "/progress", key: "nav.progress", icon: TrendingUp },
  { to: "/bookmarks", key: "nav.bookmarks", icon: BookMarked },
  { to: "/glossary", key: "nav.glossary" },
  { to: "/about", key: "nav.about" },
];

export function Header() {
  const { theme, toggle } = useTheme();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // Global shortcut: Ctrl/Cmd+K → search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        navigate("/search");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/85 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 font-bold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-surface">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="text-lg">{t("brand.name")}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-surface-sunken text-ink"
                    : "text-ink-soft hover:bg-surface-sunken hover:text-ink"
                )
              }
            >
              {t(item.key)}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/search")}
            className="hidden gap-2 text-ink-soft sm:inline-flex"
            aria-label={t("nav.search")}
          >
            <Search className="h-4 w-4" />
            <span>{t("nav.search")}</span>
            <kbd className="rounded border border-line bg-surface-sunken px-1.5 font-mono text-[10px] text-ink-faint">
              Ctrl K
            </kbd>
          </Button>
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
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label={t("nav.menu")}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line bg-surface px-4 py-3 md:hidden">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  "block rounded-lg px-3 py-2.5 text-sm font-medium",
                  isActive ? "bg-surface-sunken text-ink" : "text-ink-soft"
                )
              }
            >
              {t(item.key)}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
