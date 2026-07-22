"use client";
import Link from "next/link";
import { useT } from "@/i18n";
import { ESTADOS } from "@/domain";

/* Tipo visual de cada nodo del flujo, derivado de la posición en la
   máquina de estados: relleno navy = paso del Estado; hueco = actor
   privado (mismo criterio que el diagrama institucional del POC). */
const ES_PRIVADO = new Set([0, 3, 5, 7]);
const RESTRICCIONES = [1, 2, 3, 4, 5, 6] as const;

export default function Home() {
  const t = useT();

  return (
    <>
      <section className="hero">
        <h1 className="hero-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo-completo.png" alt="TrazaFlor" width={640} height={708} />
        </h1>
        <p className="tagline">{t("tagline")}</p>
        <div className="resumen">
          <p dangerouslySetInnerHTML={{ __html: t("resumen_1") }} />
          <p dangerouslySetInnerHTML={{ __html: t("resumen_2") }} />
          <p dangerouslySetInnerHTML={{ __html: t("resumen_3") }} />
        </div>
      </section>

      <section className="restricciones" aria-label={t("restricciones_aria")}>
        <h2>{t("restricciones_titulo")}</h2>
        <div className="restricciones-tabla">
          <div className="restricciones-encabezado">{t("restricciones_col_actual")}</div>
          <div className="restricciones-encabezado">{t("restricciones_col_propuesto")}</div>
          <div className="restricciones-regla" aria-hidden="true" />
          {RESTRICCIONES.map((n) => (
            <div className="restricciones-par" key={n}>
              <div className="restricciones-celda restricciones-problema">
                <span className="restricciones-celda-t">{t(`restriccion_${n}_t`)}</span>
                <span className="restricciones-celda-s">{t(`restriccion_${n}_s`)}</span>
              </div>
              <div className="restricciones-celda restricciones-solucion">
                <span className="restricciones-celda-t">{t(`solucion_${n}_t`)}</span>
                <span className="restricciones-celda-s">{t(`solucion_${n}_s`)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="diagrama" aria-label={t("diagrama_aria")}>
        <ol className="flujo-pasos">
          {ESTADOS.map((e, i) => (
            <li className="paso" key={e.key}>
              <span className="paso-num">{String(i + 1).padStart(2, "0")}</span>
              <span
                className={`paso-punto ${ES_PRIVADO.has(i) ? "es-privado" : "es-estado"}`}
                aria-hidden="true"
              />
              <span className="paso-nombre">{t(`diagrama_n${i + 1}`)}</span>
              <span className="paso-accion">{t(`diagrama_n${i + 1}_sub`)}</span>
            </li>
          ))}
        </ol>

        <p className="flujo-leyenda">
          <span className="leyenda-item">
            <span className="paso-punto es-estado" aria-hidden="true" />
            <span>{t("leyenda_estado")}</span>
          </span>
          <span className="leyenda-item">
            <span className="paso-punto es-privado" aria-hidden="true" />
            <span>{t("leyenda_privado")}</span>
          </span>
        </p>

        <div className="flujo-pie">
          <p>{t("diagrama_banda")}</p>
        </div>
      </section>

      <div className="cta">
        <Link className="btn-grande" href="/demo">
          {t("cta_entrar_demo")}
        </Link>
      </div>
    </>
  );
}
