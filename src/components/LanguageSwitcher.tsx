import React from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import { languageOptions, type Language } from "../i18n/translations";

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <label className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white/80 px-2.5 py-1.5 text-xs font-semibold text-stone-700 shadow-xs hover:bg-stone-50 transition-colors">
      <Globe className="h-3.5 w-3.5 text-emerald-700" />
      <span className="sr-only">{t("language.label")}</span>
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value as Language)}
        className="bg-transparent text-xs font-bold text-stone-700 outline-none cursor-pointer"
        aria-label={t("language.label")}
      >
        {languageOptions.map((option) => (
          <option key={option.code} value={option.code}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
