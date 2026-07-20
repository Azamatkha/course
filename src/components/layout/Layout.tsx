import { Outlet, ScrollRestoration } from "react-router-dom";
import { Header } from "./Header";

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-line py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 text-sm text-ink-faint sm:flex-row sm:px-6">
          <p>PyForge — advanced Python backend engineering, fully offline-friendly.</p>
          <p>Built as a static site. Your progress never leaves this browser.</p>
        </div>
      </footer>
      <ScrollRestoration />
    </div>
  );
}
