"use client";
import { LOCALES } from "@/lib/i18n";
import { useI18n } from "./I18nProvider";

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();
  return (
    <div
      role="group"
      aria-label={t("lang.label")}
      className="flex items-center gap-1 rounded-full glass px-1.5 py-1"
    >
      {LOCALES.map((l) => {
        const active = l.code === locale;
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => setLocale(l.code)}
            aria-pressed={active}
            title={l.label}
            className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-sm transition-colors ${
              active
                ? "bg-[var(--accent)] text-white"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            <span aria-hidden>{l.flag}</span>
            <span className="hidden text-xs font-medium sm:inline">{l.code.toUpperCase()}</span>
          </button>
        );
      })}
    </div>
  );
}
