"use client";
/* =====================================================================
   TrazaFlor · demo · panel Expoflores (gremio)
   Solo agregados y alertas; datos comerciales del pedido con candado.
   Replica htmlExpoflores del POC.
   ===================================================================== */
import type { ReactNode } from "react";
import {
  AGREGADOS,
  ESTADOS,
  PEDIDO,
  TOTAL_ESTADOS,
  NUM_ALERTA_ABIERTA,
  NUM_ALERTA_RESUELTA,
  NUM_CFE_EMITIDO,
} from "@/domain";
import { useT } from "@/i18n";
import { cx, Nuevo } from "@/presentation/ui";
import { RoleBanner } from "../RoleBanner";
import { HtmlText } from "@/presentation/HtmlText";
import { BannerAlerta } from "./parts";

function Kpi({
  valor,
  etiqueta,
  extra,
  resaltar,
}: {
  valor: string;
  etiqueta: string;
  extra?: string;
  resaltar?: boolean;
}) {
  return (
    <div className={cx("kpi", extra, resaltar && "nuevo")}>
      <span className="kpi-valor">{valor}</span>
      <span className="kpi-etiqueta">
        {etiqueta}
        {resaltar && <Nuevo />}
      </span>
    </div>
  );
}

export function ExpofloresPanel({ estado }: { estado: number }) {
  const t = useT();
  const alertaAbierta = estado === NUM_ALERTA_ABIERTA;
  const alertaResuelta = estado === NUM_ALERTA_RESUELTA;
  const alertas = alertaAbierta ? AGREGADOS.alertasAbiertas + 1 : AGREGADOS.alertasAbiertas;

  let flag: ReactNode;
  if (alertaAbierta) flag = <span className="flag flag-alerta">{t("flag_alerta_variedad")}</span>;
  else if (estado >= NUM_CFE_EMITIDO)
    flag = <span className="flag flag-ok">{t("flag_sin_alertas")}</span>;
  else flag = <span className="flag">—</span>;

  return (
    <>
      <RoleBanner rol="expoflores" />
      <BannerAlerta estado={estado} />

      <div className="nota-gobernanza">
        <HtmlText html={t("nota_gobernanza")} />
      </div>

      <div className="kpis">
        <Kpi valor={AGREGADOS.pedidosActivos} etiqueta={t("kpi_pedidos_activos")} />
        <Kpi valor={AGREGADOS.cajasEtiquetadasHoy} etiqueta={t("kpi_cajas_etiquetadas")} />
        <Kpi
          valor={String(alertas)}
          etiqueta={t("kpi_alertas_abiertas")}
          extra={cx(alertas > 0 && "kpi-watch", alertaAbierta && "kpi-alerta")}
          resaltar={alertaAbierta || alertaResuelta}
        />
        <Kpi valor={AGREGADOS.tiempoPromedio} etiqueta={t("kpi_tiempo_promedio")} />
      </div>

      <div className="panel">
        <h3>{t("pedidos_titulo")}</h3>
        <table className="tabla">
          <thead>
            <tr>
              <th>{t("tabla_pedido")}</th>
              <th>{t("tabla_estado")}</th>
              <th>{t("tabla_alertas")}</th>
              <th>{t("tabla_cliente")}</th>
              <th>{t("tabla_monto")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>{PEDIDO.id}</strong>
              </td>
              <td className="nuevo nuevo-constante">
                {t(`estado_nombre_${ESTADOS[estado - 1]!.key}`)} ({estado}/{TOTAL_ESTADOS})
                <Nuevo />
              </td>
              <td className={cx(alertaAbierta || alertaResuelta ? "nuevo" : undefined)}>
                {flag}
                {(alertaAbierta || alertaResuelta) && <Nuevo />}
              </td>
              <td>
                <span className="oculto">{t("oculto_simple")}</span>
              </td>
              <td>
                <span className="oculto">{t("oculto_simple")}</span>
              </td>
            </tr>
          </tbody>
        </table>
        <p className="nota-tabla">{t("nota_gremio")}</p>
      </div>
    </>
  );
}
