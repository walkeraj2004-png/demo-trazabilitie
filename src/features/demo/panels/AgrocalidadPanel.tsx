"use client";
/* =====================================================================
   TrazaFlor · demo · panel Agrocalidad (vista héroe)
   Validación automática, emisión de etiquetas, cadena de custodia y
   certificación CFE/ePhyto — como sub-vistas navegables, no apiladas una
   tras otra. Aterriza en la etapa relevante para el estado actual, no
   siempre en la misma, para que se sienta "esto es lo que pasa ahora".
   ===================================================================== */
import {
  PEDIDO,
  CAJAS,
  ESTADOS,
  ultimoEscaneo,
  NUM_CFE_EMITIDO,
  NUM_ALERTA_ABIERTA,
} from "@/domain";
import Link from "next/link";
import { useI18n } from "@/i18n";
import { cx, Nuevo } from "@/presentation/ui";
import { actorLabel } from "@/presentation/actors";
import { hrefCaja, urlCaja } from "@/presentation/links";
import { Qr } from "../Qr";
import { RoleBanner } from "../RoleBanner";
import { SubNav } from "../SubNav";
import { HtmlText } from "@/presentation/HtmlText";
import { Campo } from "./parts";

function vistaRelevante(estado: number): string {
  if (estado === 2) return "validacion";
  if (estado === 3) return "etiquetas";
  if (estado === NUM_ALERTA_ABIERTA || estado === NUM_CFE_EMITIDO) return "certificacion";
  if (ESTADOS[estado - 1]?.cajaEvento?.esEscaneo) return "custodia";
  return "certificacion";
}

export function AgrocalidadPanel({ estado }: { estado: number }) {
  const { t, lang } = useI18n();
  const p = PEDIDO;

  return (
    <>
      <RoleBanner rol="agrocalidad" />

      {/* Datos comerciales — siempre con candado, siempre visibles */}
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

      <SubNav
        resetKey={estado}
        defaultId={vistaRelevante(estado)}
        views={[
          {
            id: "validacion",
            label: t("nav_validacion"),
            tieneCambios: estado === 2,
            content: (
              <div className="panel">
                <h3>{t("validacion_titulo")}</h3>
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
            ),
          },
          {
            id: "etiquetas",
            label: t("nav_etiquetas"),
            tieneCambios: estado === 3,
            content: (
              <div className="panel">
                <h3>{t("emision_titulo")}</h3>
                {estado >= 3 ? (
                  <>
                    <p className="destacado">
                      <HtmlText
                        html={t("etiquetas_emitidas", {
                          n: 24,
                          total: p.tarifas.etiquetasTotal,
                          detalle: p.tarifas.etiquetasDetalle,
                        })}
                      />
                    </p>
                    <p className="nota-recaudo">
                      {t("nota_recaudo_prefix")} {t("agregados_recaudacion_dia")}
                    </p>
                    <div className="grid-cajas grid-cajas-chica">
                      {CAJAS.map((c) => (
                        <Link className="caja-card" href={hrefCaja(c.id)} key={c.id}>
                          <Qr url={urlCaja(c.id, estado, lang)} size={64} />
                          <span className="caja-id">{c.id}</span>
                          <span className="caja-etq">{c.etiqueta}</span>
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="vacio">{t("vacio_etiquetas")}</p>
                )}
              </div>
            ),
          },
          {
            id: "custodia",
            label: t("nav_custodia"),
            tieneCambios: !!ESTADOS[estado - 1]?.cajaEvento?.esEscaneo,
            content: (
              <div className="panel">
                <h3>
                  {t("custodia_titulo")} <span className="tag-coral">{t("tag_antinarcoticos")}</span>
                </h3>
                {estado >= 3 ? (
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
                              <Link href={hrefCaja(c.id)}>{c.id}</Link>
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
                ) : (
                  <p className="vacio">{t("vacio_custodia")}</p>
                )}
              </div>
            ),
          },
          {
            id: "certificacion",
            label: t("nav_certificacion"),
            tieneCambios: estado === NUM_CFE_EMITIDO || estado === NUM_ALERTA_ABIERTA,
            content: (
              <div className="panel">
                <h3>{t("certificacion_titulo")}</h3>
                {estado >= NUM_CFE_EMITIDO ? (
                  <>
                    <p className="check-ok">{t("certificacion_requisito_cumplido")}</p>
                    <div className="banner banner-ok">
                      <HtmlText
                        html={t("cfe_emitido", {
                          cfe: p.tarifas.cfe,
                          numero: p.cfe.numero,
                          ephyto: p.cfe.ephyto,
                        })}
                      />
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
            ),
          },
        ]}
      />
    </>
  );
}
