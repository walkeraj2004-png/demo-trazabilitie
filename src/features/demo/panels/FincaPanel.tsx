"use client";
/* =====================================================================
   TrazaFlor · demo · panel Finca
   Vista de la finca: expediente completo (ve todo), documentos, cajas con
   QR e historial. Replica htmlFinca del POC.
   ===================================================================== */
import { PEDIDO, CAJAS, buildLog, NUM_ALERTA_ABIERTA, NUM_CFE_EMITIDO } from "@/domain";
import { useI18n } from "@/i18n";
import { cx, Nuevo } from "@/presentation/ui";
import { hrefCaja, urlCaja } from "@/presentation/links";
import { Qr } from "../Qr";
import { RoleBanner } from "../RoleBanner";
import { Campo, TablaLog, BannerAlerta } from "./parts";

export function FincaPanel({ estado }: { estado: number }) {
  const { t, lang } = useI18n();
  const p = PEDIDO;
  const editable = estado < 2;
  const tallosTotal = `${(p.producto.cajas * p.producto.tallosPorCaja).toLocaleString("en-US")} ${t("unidad_tallos")}`;
  const cajasResaltar = estado === 1 || estado === 3;
  const log = buildLog(estado);

  return (
    <>
      <RoleBanner rol="finca" />
      <BannerAlerta estado={estado} />

      <div className={cx("panel", estado === 1 && "nuevo")}>
        <div className="panel-cabecera">
          <h2>{t("expediente_titulo", { id: p.id })}</h2>
          <button
            className={cx("btn", "btn-sec", estado === 2 && "nuevo")}
            disabled
            title={editable ? t("title_accion_simulada") : t("title_edicion_bloqueada")}
          >
            {editable ? t("btn_editar_pedido") : t("btn_edicion_bloqueada")}
            {estado === 2 && <Nuevo />}
          </button>
        </div>
        <div className="campos">
          <Campo rol="finca" campo="finca" etiqueta={t("label_finca")}>
            {p.finca.nombre} · {p.finca.ubicacion}
          </Campo>
          <Campo rol="finca" campo="finca" etiqueta={t("label_operador_guia")}>
            {p.finca.operador} · {t("finca_bpa_vigente")}
          </Campo>
          <Campo rol="finca" campo="cliente" etiqueta={t("label_cliente")}>
            {p.cliente.nombre} · {p.cliente.ciudad}
          </Campo>
          <Campo rol="finca" campo="monto" etiqueta={t("label_monto")}>
            {p.monto}
          </Campo>
          <Campo rol="finca" campo="producto" etiqueta={t("label_producto")}>
            {t("campo_producto_resumen", {
              descripcion: t("producto_descripcion"),
              cajas: p.producto.cajas,
              tallosPorCaja: p.producto.tallosPorCaja,
              total: tallosTotal,
            })}
          </Campo>
          <Campo
            rol="finca"
            campo="peso"
            etiqueta={t("label_peso_declarado")}
            resaltar={estado === NUM_ALERTA_ABIERTA}
          >
            {p.producto.pesoDeclarado}
            {estado >= NUM_ALERTA_ABIERTA && (
              <>
                {" · "}
                <span className="dato-alerta">
                  {t("palabra_escaneado")} {p.producto.pesoEscaneado}
                </span>
              </>
            )}
          </Campo>
          <Campo rol="finca" campo="logistica" etiqueta={t("label_agencia_carga")}>
            {p.agencia.nombre} · {p.agencia.agente}
          </Campo>
          <Campo rol="finca" campo="logistica" etiqueta={t("label_awb_hawb")}>
            {p.awb} / {p.hawb}
          </Campo>
          <Campo rol="finca" campo="logistica" etiqueta={t("label_dae_destino_vuelo")}>
            {p.dae} · {p.destino} · {p.vuelo}
          </Campo>
        </div>
      </div>

      {/* Documentos */}
      <div className="panel">
        <h3>{t("documentos_titulo")}</h3>
        <ul className="docs">
          <li className={cx(estado === 2 && "nuevo")}>
            {t("doc_factura_prefix")} {p.monto} —{" "}
            {estado === 1 ? t("doc_factura_borrador") : t("doc_factura_registrada")}
            {estado === 2 && <Nuevo />}
          </li>
          <li className={cx(estado === 3 && "nuevo")}>
            {estado >= 3 ? (
              <>
                {t("doc_etiquetas_emitidas")}
                {estado === 3 && <Nuevo />}
              </>
            ) : (
              <span className="pendiente-doc">{t("doc_etiquetas_pendientes")}</span>
            )}
          </li>
          <li className={cx(estado === NUM_CFE_EMITIDO && "nuevo")}>
            {estado >= NUM_CFE_EMITIDO ? (
              <>
                {t("doc_cfe_emitido", { numero: p.cfe.numero, ephyto: p.cfe.ephyto })}
                {estado === NUM_CFE_EMITIDO && <Nuevo />}
              </>
            ) : (
              <span className="pendiente-doc">{t("doc_cfe_pendiente")}</span>
            )}
          </li>
        </ul>
      </div>

      {/* Cajas con QR */}
      <div className={cx("panel", cajasResaltar && "nuevo")}>
        <h3>{t("cajas_titulo")}</h3>
        <details>
          <summary>
            {t("resumen_ver_cajas")}
            {cajasResaltar && <Nuevo />}
          </summary>
          <div className="grid-cajas">
            {CAJAS.map((c) => (
              <a className="caja-card" href={hrefCaja(c.id)} key={c.id}>
                <Qr url={urlCaja(c.id, estado, lang)} size={72} />
                <span className="caja-id">{c.id}</span>
                <span className="caja-etq">{estado >= 3 ? c.etiqueta : t("sin_etiqueta")}</span>
              </a>
            ))}
          </div>
        </details>
      </div>

      {/* Historial */}
      <div className="panel">
        <h3>{t("historial_titulo")}</h3>
        <details>
          <summary>{t("resumen_historial", { n: log.length })}</summary>
          <TablaLog eventos={log} estadoActual={estado} />
        </details>
      </div>
    </>
  );
}
