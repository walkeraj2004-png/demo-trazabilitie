"use client";
/* =====================================================================
   TrazaFlor · demo · panel Agrocalidad (vista héroe)
   Validación automática, emisión de etiquetas con tarifas, cadena de
   custodia por caja y certificación CFE/ePhyto. Datos comerciales siempre
   con candado (la neutralidad se ve). Replica htmlAgrocalidad del POC.
   ===================================================================== */
import {
  PEDIDO,
  CAJAS,
  ultimoEscaneo,
  NUM_CFE_EMITIDO,
  NUM_ALERTA_ABIERTA,
} from "@/domain";
import { useI18n } from "@/i18n";
import { cx, Nuevo } from "@/presentation/ui";
import { actorLabel } from "@/presentation/actors";
import { hrefCaja, urlCaja } from "@/presentation/links";
import { Qr } from "../Qr";
import { Campo } from "./parts";

export function AgrocalidadPanel({ estado }: { estado: number }) {
  const { t, lang } = useI18n();
  const p = PEDIDO;

  return (
    <>
      {/* Datos comerciales — siempre con candado */}
      <div className="panel panel-compacto">
        <div className="campos campos-linea">
          <Campo rol="agrocalidad" campo="cliente" etiqueta={t("label_cliente")}>
            {p.cliente.nombre}
          </Campo>
          <Campo rol="agrocalidad" campo="monto" etiqueta={t("label_monto")}>
            {p.monto}
          </Campo>
          <Campo rol="agrocalidad" campo="finca" etiqueta={t("label_finca")}>
            {p.finca.nombre} · {p.finca.ubicacion}
          </Campo>
          <Campo rol="agrocalidad" campo="logistica" etiqueta={t("label_dae")}>
            {p.dae}
          </Campo>
        </div>
      </div>

      {/* a) Validación automática */}
      <div className={cx("panel", estado === 2 && "nuevo")}>
        <h3>
          {t("validacion_titulo")} <span className="tag">{t("tag_estado", { n: 2 })}</span>
          {estado === 2 && <Nuevo />}
        </h3>
        {estado >= 2 ? (
          <>
            <ul className="checks">
              <li className="check-ok">
                {t("check_operador", { operador: p.finca.operador })}{" "}
                <span className="check-hora">08:05:12</span>
              </li>
              <li className="check-ok">
                {t("check_bpa")} <span className="check-hora">08:05:14</span>
              </li>
              <li className="check-ok">
                {t("check_variedad")} <span className="check-hora">08:05:15</span>
              </li>
            </ul>
            <p className="nota-tabla">{t("nota_simulacion_api")}</p>
          </>
        ) : (
          <p className="vacio">{t("vacio_validacion")}</p>
        )}
      </div>

      {/* b) Emisión de etiquetas */}
      <div className={cx("panel", estado === 3 && "nuevo")}>
        <h3>
          {t("emision_titulo")} <span className="tag">{t("tag_estado", { n: 3 })}</span>
          {estado === 3 && <Nuevo />}
        </h3>
        {estado >= 3 ? (
          <>
            <p className="destacado">
              {t("etiquetas_emitidas", {
                n: 24,
                total: p.tarifas.etiquetasTotal,
                detalle: p.tarifas.etiquetasDetalle,
              })}
            </p>
            <p className="nota-recaudo">
              {t("nota_recaudo_prefix")} {t("agregados_recaudacion_dia")}
            </p>
            <details>
              <summary>{t("resumen_ver_etiquetas")}</summary>
              <div className="grid-cajas grid-cajas-chica">
                {CAJAS.map((c) => (
                  <a className="caja-card" href={hrefCaja(c.id)} key={c.id}>
                    <Qr url={urlCaja(c.id, estado, lang)} size={64} />
                    <span className="caja-id">{c.id}</span>
                    <span className="caja-etq">{c.etiqueta}</span>
                  </a>
                ))}
              </div>
            </details>
          </>
        ) : (
          <p className="vacio">{t("vacio_etiquetas")}</p>
        )}
      </div>

      {/* c) Cadena de custodia */}
      <div className="panel">
        <h3>
          {t("custodia_titulo")}{" "}
          <span className="tag-coral">{t("tag_antinarcoticos")}</span>
        </h3>
        {estado >= 3 ? (
          <details>
            <summary>{t("resumen_ver_custodia")}</summary>
            <table className="tabla">
              <thead>
                <tr>
                  <th>{t("tabla_caja")}</th>
                  <th>{t("tabla_etiqueta")}</th>
                  <th>{t("tabla_ultimo_escaneo")}</th>
                  <th>{t("tabla_actor")}</th>
                  <th>{t("tabla_lugar")}</th>
                  <th>{t("tabla_hora")}</th>
                </tr>
              </thead>
              <tbody>
                {CAJAS.map((c, i) => {
                  const u = ultimoEscaneo(i, estado);
                  const filaNueva = !!(u && u.estado === estado);
                  return (
                    <tr className={cx(filaNueva && "nuevo")} key={c.id}>
                      <td>
                        <a href={hrefCaja(c.id)}>{c.id}</a>
                      </td>
                      <td>{c.etiqueta}</td>
                      <td>
                        {u ? t(u.accionKey) : "—"}
                        {filaNueva && <Nuevo />}
                      </td>
                      <td>{u ? actorLabel(u.actorId) : "—"}</td>
                      <td>{u ? u.lugar : "—"}</td>
                      <td>{u ? u.hora : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </details>
        ) : (
          <p className="vacio">{t("vacio_custodia")}</p>
        )}
      </div>

      {/* d) Certificación */}
      <div className={cx("panel", estado === NUM_CFE_EMITIDO && "nuevo")}>
        <h3>
          {t("certificacion_titulo")}{" "}
          <span className="tag">{t("tag_estado", { n: NUM_CFE_EMITIDO })}</span>
          {estado === NUM_CFE_EMITIDO && <Nuevo />}
        </h3>
        {estado >= NUM_CFE_EMITIDO ? (
          <>
            <p className="check-ok">{t("certificacion_requisito_cumplido")}</p>
            <div className="banner banner-ok">
              {t("cfe_emitido", {
                cfe: p.tarifas.cfe,
                numero: p.cfe.numero,
                ephyto: p.cfe.ephyto,
              })}
            </div>
            <div className="cardinalidad">
              <span>{t("cardinalidad_pedido")}</span>
              <span className="flecha">→</span>
              <span>{t("cardinalidad_cfe")}</span>
              <span className="flecha">→</span>
              <span>{t("cardinalidad_etiquetas")}</span>
            </div>
          </>
        ) : estado === NUM_ALERTA_ABIERTA ? (
          <div className="banner banner-alerta nuevo">
            {t("certificacion_bloqueada")}
            <Nuevo />
          </div>
        ) : (
          <p className="vacio">{t("vacio_certificacion")}</p>
        )}
      </div>
    </>
  );
}
