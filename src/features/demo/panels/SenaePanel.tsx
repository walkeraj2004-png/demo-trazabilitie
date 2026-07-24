"use client";
/* =====================================================================
   TrazaFlor · demo · panel SENAE (aduana)
   Actor estatal separado de Agrocalidad: dueño de la autorización de
   salida (estado 7) y del cierre de la DAE (estado 9). Ve el valor
   declarado (a diferencia de Agrocalidad) porque la DAE lo incluye, pero
   no el detalle fitosanitario — ese trabajo no es de su competencia.
   ===================================================================== */
import {
  PEDIDO,
  numeroDeEstado,
  NUM_CFE_EMITIDO,
} from "@/domain";
import { useI18n } from "@/i18n";
import { cx, Nuevo } from "@/presentation/ui";
import { RoleBanner } from "../RoleBanner";
import { Campo } from "./parts";

const NUM_VALIDADO_GUIA = numeroDeEstado("validado_guia");
const NUM_SALIDA_AUTORIZADA = numeroDeEstado("salida_autorizada");
const NUM_EMBARCADO = numeroDeEstado("embarcado");
const NUM_CERRADO = numeroDeEstado("cerrado");

export function SenaePanel({ estado }: { estado: number }) {
  const { t } = useI18n();
  const p = PEDIDO;
  const guiasAsignadas = estado >= NUM_VALIDADO_GUIA;
  const guiasNuevo = estado === NUM_VALIDADO_GUIA;

  return (
    <>
      <RoleBanner rol="senae" />

      <div className="panel panel-compacto">
        <div className="campos campos-linea">
          <Campo rol="senae" campo="cliente" etiqueta={t("label_cliente")}>
            {p.cliente.nombre} · {p.cliente.ciudad}
          </Campo>
          <Campo rol="senae" campo="finca" etiqueta={t("label_finca")}>
            {p.finca.nombre} · {p.finca.ubicacion}
          </Campo>
          <Campo rol="senae" campo="producto" etiqueta={t("label_carga")}>
            {t("campo_carga_valor", {
              cajas: p.producto.cajas,
              descripcion: t("producto_descripcion"),
              total: `${(p.producto.cajas * p.producto.tallosPorCaja).toLocaleString("en-US")} ${t("unidad_tallos")}`,
            })}
          </Campo>
          <Campo rol="senae" campo="peso" etiqueta={t("label_peso_declarado")}>
            {p.producto.pesoDeclarado}
          </Campo>
          <Campo rol="senae" campo="monto" etiqueta={t("label_monto_pedido")}>
            {p.monto}
          </Campo>
          <Campo
            rol="senae"
            campo="logistica"
            etiqueta={t("label_awb_hawb")}
            resaltar={guiasNuevo}
          >
            {guiasAsignadas ? (
              `${p.awb} / ${p.hawb}`
            ) : (
              <span className="pendiente-doc">{t("awb_hawb_por_asignar")}</span>
            )}
          </Campo>
          <Campo rol="senae" campo="logistica" etiqueta={t("label_destino_vuelo")}>
            {p.destino} · {p.vuelo}
          </Campo>
        </div>
      </div>

      <div className="panel">
        <h3>{t("senae_declaracion_titulo")}</h3>
        {estado < NUM_SALIDA_AUTORIZADA ? (
          <>
            <p className="destacado">{t("senae_dae_abierta", { dae: p.dae })}</p>
            <p className="nota-tabla">{t("senae_espera_zona_primaria")}</p>
          </>
        ) : (
          <ul className="checks">
            <li className={cx("check-ok", estado === NUM_SALIDA_AUTORIZADA && "nuevo")}>
              {t("senae_salida_autorizada")}
              {estado === NUM_SALIDA_AUTORIZADA && <Nuevo />}
            </li>
            {estado >= NUM_EMBARCADO && (
              <li className={cx("check-ok", estado === NUM_EMBARCADO && "nuevo")}>
                {t("senae_manifiesto_recibido")}
                {estado === NUM_EMBARCADO && <Nuevo />}
              </li>
            )}
            {estado >= NUM_CERRADO && (
              <li className={cx("check-ok", estado === NUM_CERRADO && "nuevo")}>
                {t("senae_dae_cerrada")}
                {estado === NUM_CERRADO && <Nuevo />}
              </li>
            )}
          </ul>
        )}
        <p className="nota-tabla">
          {t("label_cfe_asociado")}: {estado >= NUM_CFE_EMITIDO ? p.cfe.numero : t("cfe_pendiente_texto")}
        </p>
      </div>
    </>
  );
}
