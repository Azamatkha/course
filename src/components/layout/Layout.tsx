import { Outlet, ScrollRestoration } from "react-router-dom";
import { Header } from "./Header";
import { useI18n } from "@/engine/i18n";

export function Layout() {
  const { t } = useI18n();
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-line py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 text-sm text-ink-faint sm:flex-row sm:px-6">
          <p>{t("footer.line1")}</p>
          <p>{t("footer.line2")}</p>
        </div>
      </footer>
      <ScrollRestoration />
    </div>
  );
}
