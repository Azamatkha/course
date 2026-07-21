import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/engine/i18n";

export function NotFound() {
  const { t } = useI18n();
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-28 text-center">
      <p className="font-mono text-6xl font-bold text-ink-faint">{t("notfound.code")}</p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">{t("notfound.title")}</h1>
      <p className="mt-2 text-ink-soft">{t("notfound.body")}</p>
      <Link to="/" className="mt-6">
        <Button>{t("notfound.back")}</Button>
      </Link>
    </div>
  );
}
