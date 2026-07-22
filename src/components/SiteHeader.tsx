"use client";
/* =====================================================================
   TrazaFlor · header compartido
   Usa el sistema visual real del proyecto (clases de style.css): marca con
   logo, crédito y selector de idioma. Presente en todas las páginas.
   ===================================================================== */
import Link from "next/link";
import { LANGS, useI18n } from "@/i18n";
import { APP_NAME } from "@/config";

export function SiteHeader() {
  const { lang, setLang, t } = useI18n();

  return (
    <header className="header">
      <Link className="brand" href="/">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="brand-icon" src="/assets/logo-icon.png" alt="" width={32} height={32} />
        {APP_NAME}
      </Link>

      <span className="credito">{t("credito")}</span>

      <div className="lang-switch" role="group" aria-label={t("selector_idioma_aria")}>
        {LANGS.map((l) => (
          <button
            key={l}
            type="button"
            className={`lang-btn${l === lang ? " activo" : ""}`}
            aria-pressed={l === lang}
            onClick={() => setLang(l)}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>
    </header>
  );
}
