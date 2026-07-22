"use client";
/* =====================================================================
   TrazaFlor · header compartido
   Marca + crédito + selector de idioma. Presente en todas las páginas
   (montado desde el layout, dentro del I18nProvider).
   ===================================================================== */
import Link from "next/link";
import { LANGS, useI18n } from "@/i18n";
import { APP_NAME } from "@/config";
import styles from "./SiteHeader.module.css";

export function SiteHeader() {
  const { lang, setLang, t } = useI18n();

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brand}>
        {APP_NAME}
      </Link>

      <div className={styles.right}>
        <span className={styles.credito}>{t("credito")}</span>
        <div
          className={styles.langs}
          role="group"
          aria-label={t("selector_idioma_aria")}
        >
          {LANGS.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              aria-pressed={l === lang}
              className={l === lang ? styles.langActive : styles.lang}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
