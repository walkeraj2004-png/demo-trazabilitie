"use client";
/* =====================================================================
   TrazaFlor · demo · panel Agencia de carga
   Recepción y escaneo. El botón "Escanear recepción" avanza la simulación
   (solo habilitado en el estado de etiquetado). La consolidación queda
   bloqueada hasta que el CFE se emite. Replica htmlAgencia del POC.
   ===================================================================== */
import {
  PEDIDO,
  buildLog,
  numeroDeEstado,
  NUM_ALERTA_ABIERTA,
  NUM_CFE_EMITIDO,
} from "@/domain";
import { useI18n } from "@/i18n";
import { cx, Nuevo } from "@/presentation/ui";
import { RoleBanner } from "../RoleBanner";
import { Campo, TablaLog, BannerAlerta } from "./parts";

/* Glosas en lenguaje simple para siglas del sector, junto al dato (no en
   un tooltip que nadie hace hover). "en/es" porque el POC no traía estas
   frases en el diccionario grande. */
const GLOSA = {
  es: { awbHawb: "guía aérea", dae: "declaración aduanera" },
  en: { awbHawb: "airway bill", dae: "customs declaration" },
} as const;

const NUM_ETIQUETADO = numeroDeEstado("etiquetado");

export function AgenciaPanel({
  estado,
  onEscanear,
}: {
  estado: number;
  onEscanear: () => void;
}) {
  const { t, lang } = useI18n();
  const glosa = GLOSA[lang];
  const p = PEDIDO;
  const tallosTotal = `${(p.producto.cajas * p.producto.tallosPorCaja).toLocaleString("en-US")} ${t("unidad_tallos")}`;
  /* Bug del POC original: comparaba contra "paletizado" (estado 6), así
     que en el estado 5 (CFE recién emitido) seguía diciendo "CFE
     pendiente" — contradice al propio CFE que ya se ve emitido en
     Agrocalidad. La autorización depende del CFE, no del paletizado. */
  const consolidacionAutorizada = estado >= NUM_CFE_EMITIDO;
  const consolidacionResaltar = estado === NUM_CFE_EMITIDO;
  const puedeEscanear = estado === NUM_ETIQUETADO;
  const logAgencia = buildLog(estado).filter(
    (e) => e.actorId === "agencia" || e.actorId === "paletizadora",
  );

  return (
    <>
      <RoleBanner rol="agencia" />
      <BannerAlerta estado={estado} />

      <div className={cx("panel", estado === 1 && "nuevo")}>
        <div className="panel-cabecera">
          <h2>{t("agencia_titulo", { agencia: p.agencia.nombre, id: p.id })}</h2>
          <button
            id="btn-escanear-agencia"
            className={cx("btn", "btn-pri", puedeEscanear && "nuevo")}
            disabled={!puedeEscanear}
            onClick={onEscanear}
            title={puedeEscanear ? t("title_simular_escaneo") : t("title_escaneo_no_disponible")}
          >
            {t("btn_escanear_recepcion")}
            {puedeEscanear && <Nuevo />}
          </button>
        </div>
        <p className="nota-tabla">{t("nota_escaneo_mecanismo")}</p>
        <div className="campos">
          <Campo rol="agencia" campo="finca" etiqueta={t("label_finca")}>
            {p.finca.nombre} · {p.finca.ubicacion}
          </Campo>
          <Campo rol="agencia" campo="cliente" etiqueta={t("label_consignatario")}>
            {p.cliente.nombre} · {p.cliente.ciudad}
          </Campo>
          <Campo rol="agencia" campo="producto" etiqueta={t("label_carga")}>
            {t("campo_carga_valor", {
              cajas: p.producto.cajas,
              descripcion: t("producto_descripcion"),
              total: tallosTotal,
            })}
          </Campo>
          <Campo
            rol="agencia"
            campo="peso"
            etiqueta={t("label_peso")}
            resaltar={estado === NUM_ALERTA_ABIERTA}
          >
            {p.producto.pesoDeclarado} {t("palabra_declarado")}
            {estado >= NUM_ALERTA_ABIERTA && (
              <>
                {" · "}
                <span className="dato-alerta">
                  {p.producto.pesoEscaneado} {t("palabra_escaneado")}
                </span>
              </>
            )}
          </Campo>
          <Campo rol="agencia" campo="logistica" etiqueta={t("label_awb_hawb")}>
            {p.awb} / {p.hawb} <span className="glosa">({glosa.awbHawb})</span>
          </Campo>
          <Campo rol="agencia" campo="logistica" etiqueta={t("label_dae")}>
            {p.dae} <span className="glosa">({glosa.dae})</span>
          </Campo>
          <Campo rol="agencia" campo="logistica" etiqueta={t("label_destino_vuelo")}>
            {p.destino} · {p.vuelo}
          </Campo>
          <Campo rol="agencia" campo="monto" etiqueta={t("label_monto_pedido")}>
            {p.monto}
          </Campo>
        </div>

        <div
          className={cx(
            "banner",
            consolidacionAutorizada ? "banner-ok" : "banner-alerta",
            consolidacionResaltar && "nuevo",
          )}
        >
          {consolidacionAutorizada
            ? t("consolidacion_autorizada", { numero: p.cfe.numero })
            : t("consolidacion_bloqueada")}
          {consolidacionResaltar && <Nuevo />}
        </div>
      </div>

      <div className="panel">
        <h3>{t("log_agencia_titulo")}</h3>
        {logAgencia.length ? (
          <TablaLog eventos={logAgencia} estadoActual={estado} />
        ) : (
          <p className="vacio">{t("vacio_sin_escaneos_agencia")}</p>
        )}
      </div>
    </>
  );
}
