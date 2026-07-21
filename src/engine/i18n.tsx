import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { readStore, writeStore } from "@/lib/storage";
import { en, type DictKey } from "./i18n/en";
import { uz } from "./i18n/uz";

/**
 * Scalable, dependency-free i18n.
 *
 * Adding a language is a two-step change:
 *   1. create `./i18n/<code>.ts` exporting `Record<DictKey, string>`
 *   2. register it in `dictionaries` + `LOCALES` below
 * The `Record<DictKey, string>` typing guarantees the new file covers every
 * key, so translations can never silently drift out of sync.
 */
export type Locale = "en" | "uz";

export interface LocaleInfo {
  code: Locale;
  /** Endonym — the language's name in its own language. */
  label: string;
  /** Short code shown in the compact switcher. */
  short: string;
}

export const LOCALES: LocaleInfo[] = [
  { code: "en", label: "English", short: "EN" },
  { code: "uz", label: "O‘zbekcha", short: "UZ" },
];

const dictionaries: Record<Locale, Record<DictKey, string>> = { en, uz };

const KEY = "pyforge.lang";
const DEFAULT: Locale = "en";

function isLocale(v: unknown): v is Locale {
  return v === "en" || v === "uz";
}

function detectInitial(): Locale {
  const stored = readStore<string | null>(KEY, null);
  if (isLocale(stored)) return stored;
  const nav = typeof navigator !== "undefined" ? navigator.language : "";
  if (nav.toLowerCase().startsWith("uz")) return "uz";
  return DEFAULT;
}

/** Replace {placeholders} with values from `vars`. */
function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, k: string) =>
    k in vars ? String(vars[k]) : `{${k}}`
  );
}

export type TFunction = (key: DictKey, vars?: Record<string, string | number>) => string;

interface I18nCtx {
  lang: Locale;
  setLang: (l: Locale) => void;
  t: TFunction;
}

const Ctx = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Locale>(detectInitial);

  // Persist + reflect on <html lang> so the switch is instant and
  // accessible without any page reload.
  useEffect(() => {
    writeStore(KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback<TFunction>(
    (key, vars) => {
      const dict = dictionaries[lang];
      // Fall back to English, then to the raw key — never throw in the UI.
      const template = dict[key] ?? dictionaries.en[key] ?? key;
      return interpolate(template, vars);
    },
    [lang]
  );

  const value = useMemo<I18nCtx>(() => ({ lang, setLang, t }), [lang, t]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n(): I18nCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useI18n must be used within <I18nProvider>");
  return ctx;
}

/** Convenience hook when only the translate function is needed. */
export function useT(): TFunction {
  return useI18n().t;
}

/**
 * Locale-aware reading-time formatter. Hours use short h/m (near-universal);
 * minutes are translated (`min` / `daqiqa`).
 */
export function useFormatMinutes(): (min: number) => string {
  const { t } = useI18n();
  return useCallback(
    (min: number) => {
      if (min < 60) return t("unit.min", { n: min });
      const h = Math.floor(min / 60);
      const m = min % 60;
      return m ? `${h}h ${m}m` : `${h}h`;
    },
    [t]
  );
}
