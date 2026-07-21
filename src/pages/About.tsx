import { Card } from "@/components/ui/card";
import { useI18n } from "@/engine/i18n";
import type { DictKey } from "@/engine/i18n/en";

export function About() {
  const { t } = useI18n();
  const principles: { title: DictKey; body: DictKey }[] = [
    { title: "about.p1.title", body: "about.p1.body" },
    { title: "about.p2.title", body: "about.p2.body" },
    { title: "about.p3.title", body: "about.p3.body" },
    { title: "about.p4.title", body: "about.p4.body" },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight">{t("about.title")}</h1>
      <p className="mt-4 leading-relaxed text-ink-soft">{t("about.intro")}</p>

      <h2 className="mt-10 text-xl font-bold tracking-tight">
        {t("about.principlesHeading")}
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {principles.map((p) => (
          <Card key={p.title} className="p-6">
            <h3 className="font-bold tracking-tight">{t(p.title)}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{t(p.body)}</p>
          </Card>
        ))}
      </div>

      <h2 className="mt-12 text-xl font-bold tracking-tight">
        {t("about.structureHeading")}
      </h2>
      <p className="mt-3 leading-relaxed text-ink-soft">{t("about.structureBody")}</p>

      <h2 className="mt-10 text-xl font-bold tracking-tight">{t("about.techHeading")}</h2>
      <p className="mt-3 leading-relaxed text-ink-soft">{t("about.techBody")}</p>
    </div>
  );
}
