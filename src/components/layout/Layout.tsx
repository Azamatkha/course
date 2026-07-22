import { Outlet, ScrollRestoration } from "react-router-dom";
import { Header } from "./Header";
import { useI18n } from "@/engine/i18n";

export function Layout() {
  const { t } = useI18n();
  return (
    <div className="flex min-h-dvh flex-col">
      {/* First tab stop: lets keyboard users bypass the nav on every page. */}
      <a href="#main" className="skip-link">
        {t("nav.skipToContent")}
      </a>

      <Header />

      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        <Outlet />
      </main>

      <footer className="mt-16 border-t border-line bg-surface-sunken/50">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-ink-faint sm:flex-row sm:px-6">
          <p>{t("footer.line1")}</p>
          <p>{t("footer.line2")}</p>
        </div>
      </footer>

      <ScrollRestoration />
    </div>
  );
}
