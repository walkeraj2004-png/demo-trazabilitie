"use client";
import Link from "next/link";
import { useT } from "@/i18n";
import { ESTADOS } from "@/domain";
import styles from "./page.module.css";

/* Tipo visual de cada nodo del flujo (estado del sistema vs actor privado).
   Derivado de la posición en la máquina de estados, no escrito a mano. */
const TIPO_NODO: ("estado" | "privado")[] = ESTADOS.map((_, i) =>
  [0, 3, 5, 7].includes(i) ? "privado" : "estado",
);

const RESTRICCIONES = [1, 2, 3, 4, 5, 6] as const;

export default function Home() {
  const t = useT();

  return (
    <main className={styles.main}>
      {/* Hero */}
      <section className={styles.hero}>
        <h1 className={styles.h1}>{t("tagline")}</h1>
        <div className={styles.resumen}>
          <p dangerouslySetInnerHTML={{ __html: t("resumen_1") }} />
          <p dangerouslySetInnerHTML={{ __html: t("resumen_2") }} />
          <p dangerouslySetInnerHTML={{ __html: t("resumen_3") }} />
        </div>
      </section>

      {/* Restricciones → respuestas */}
      <section className={styles.section}>
        <h2 className={styles.h2}>{t("restricciones_titulo")}</h2>
        <div className={styles.tabla}>
          <div className={styles.colHead}>{t("restricciones_col_actual")}</div>
          <div className={styles.colHead}>{t("restricciones_col_propuesto")}</div>
          {RESTRICCIONES.map((n) => (
            <div key={n} className={styles.par}>
              <div className={`${styles.celda} ${styles.problema}`}>
                <span className={styles.celdaT}>{t(`restriccion_${n}_t`)}</span>
                <span className={styles.celdaS}>{t(`restriccion_${n}_s`)}</span>
              </div>
              <div className={`${styles.celda} ${styles.solucion}`}>
                <span className={styles.celdaT}>{t(`solucion_${n}_t`)}</span>
                <span className={styles.celdaS}>{t(`solucion_${n}_s`)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Flujo del expediente */}
      <section className={styles.section}>
        <ol className={styles.flujo}>
          {ESTADOS.map((e, i) => (
            <li key={e.key} className={styles.paso}>
              <span className={styles.pasoNum}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className={`${styles.punto} ${
                  TIPO_NODO[i] === "estado" ? styles.puntoEstado : styles.puntoPrivado
                }`}
                aria-hidden="true"
              />
              <span className={styles.pasoNombre}>{t(`diagrama_n${i + 1}`)}</span>
              <span className={styles.pasoAccion}>{t(`diagrama_n${i + 1}_sub`)}</span>
            </li>
          ))}
        </ol>
        <p className={styles.leyenda}>
          <span className={styles.leyendaItem}>
            <span className={`${styles.punto} ${styles.puntoEstado}`} aria-hidden="true" />
            {t("leyenda_estado")}
          </span>
          <span className={styles.leyendaItem}>
            <span className={`${styles.punto} ${styles.puntoPrivado}`} aria-hidden="true" />
            {t("leyenda_privado")}
          </span>
        </p>
        <p className={styles.banda}>{t("diagrama_banda")}</p>
      </section>

      {/* CTA */}
      <div className={styles.cta}>
        <Link href="/demo" className={styles.btn}>
          {t("cta_entrar_demo")}
        </Link>
      </div>
    </main>
  );
}
