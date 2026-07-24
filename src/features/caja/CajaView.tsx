"use client";
/* =====================================================================
   TrazaFlor · caja · detalle de una caja (destino de cada QR)
   Muestra la cadena de custodia de UNA caja. El estado sale de ?e= (QR
   escaneado desde otro dispositivo) y, si no viene, del localStorage del
   presentador. React escapa el `id` recibido → sin saneado manual (el POC
   sí lo necesitaba por usar innerHTML).
   ===================================================================== */
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CAJAS,
  PEDIDO,
  ESTADOS,
  TOTAL_ESTADOS,
  eventosCaja,
  normalizarEstado,
  NUM_CFE_EMITIDO,
} from "@/domain";
import { useI18n } from "@/i18n";
import { cx, Nuevo } from "@/presentation/ui";
import { actorLabel } from "@/presentation/actors";

const KEY_ESTADO = "trazaflor_estado";

export function CajaView() {
  const params = useSearchParams();
  const { t } = useI18n();
  const id = params.get("id") ?? "";
  const idx = CAJAS.findIndex((c) => c.id === id);

  const eParam = parseInt(params.get("e") ?? "", 10);
  const [estado, setEstado] = useState<number | null>(null);

  useEffect(() => {
    document.title = t("titulo_caja");
  }, [t]);

  // Resuelve el estado: ?e= válido > localStorage > 1.
  useEffect(() => {
    if (eParam >= 1 && eParam <= TOTAL_ESTADOS) {
      setEstado(eParam);
      return;
    }
    const stored = parseInt(localStorage.getItem(KEY_ESTADO) ?? "", 10);
    setEstado(Number.isFinite(stored) ? normalizarEstado(stored) : 1);
  }, [eParam]);

  if (estado === null) {
    return (
      <main className="caja-main">
        <p className="vacio">{t("cargando_caja")}</p>
      </main>
    );
  }

  if (idx === -1) {
    return (
      <main className="caja-main">
        <div className="panel">
          <h2>{t("caja_no_encontrada_titulo")}</h2>
          <p>{t("caja_no_encontrada_texto", { id, pedido: PEDIDO.id })}</p>
          <p>
            <Link href="/demo">{t("volver_demo")}</Link>
          </p>
        </div>
      </main>
    );
  }

  const caja = CAJAS[idx]!;
  const evs = eventosCaja(idx, estado);

  return (
    <main className="caja-main">
      <div className="panel">
        <p className="caja-pedido">{t("caja_pedido_label", { id: PEDIDO.id })}</p>
        <h2>{caja.id}</h2>
        <div className="campos">
          <div className="campo">
            <span className="campo-k">{t("label_etiqueta_agrocalidad")}</span>
            <span className="campo-v">
              {estado >= 3 ? caja.etiqueta : t("etiqueta_aun_no_emitida")}
            </span>
          </div>
          <div className="campo">
            <span className="campo-k">{t("label_finca")}</span>
            <span className="campo-v">
              {PEDIDO.finca.nombre} · {PEDIDO.finca.ubicacion}
            </span>
          </div>
          <div className="campo">
            <span className="campo-k">{t("label_producto")}</span>
            <span className="campo-v">
              {t("campo_producto_simple", {
                descripcion: t("producto_descripcion"),
                tallos: PEDIDO.producto.tallosPorCaja,
              })}
            </span>
          </div>
          <div className="campo">
            <span className="campo-k">{t("label_especie")}</span>
            <span className="campo-v">{t("producto_especie")}</span>
          </div>
          <div className="campo">
            <span className="campo-k">{t("label_variedad")}</span>
            <span className="campo-v">{t("producto_variedad")}</span>
          </div>
          <div className="campo">
            <span className="campo-k">{t("label_cfe")}</span>
            <span className="campo-v">
              {estado >= NUM_CFE_EMITIDO
                ? `${PEDIDO.cfe.numero} · ${PEDIDO.cfe.ephyto}`
                : t("cfe_pendiente_texto")}
            </span>
          </div>
        </div>
      </div>

      <div className="panel">
        <h3>{t("custodia_simple_titulo")}</h3>
        {evs.length ? (
          <ol className="timeline">
            {evs.map((ev, i) => {
              const esUltimo = i === evs.length - 1;
              return (
                <li
                  className={cx(
                    ev.esEscaneo ? "tl-escaneo" : "tl-hito",
                    ev.alerta && "tl-alerta",
                    esUltimo && "nuevo",
                  )}
                  key={`${ev.estado}-${i}`}
                >
                  <span className="tl-hora">{ev.hora}</span>
                  <span className="tl-accion">
                    {t(ev.accionKey)}
                    {esUltimo && <Nuevo />}
                  </span>
                  <span className="tl-meta">
                    {actorLabel(ev.actorId, t)} · {ev.lugar}
                  </span>
                </li>
              );
            })}
          </ol>
        ) : (
          <p className="vacio">{t("vacio_sin_eventos")}</p>
        )}
        <p className="nota-tabla">
          {t("estado_pedido_resumen", {
            n: estado,
            nombre: t(`estado_nombre_${ESTADOS[estado - 1]!.key}`),
          })}
        </p>
      </div>
    </main>
  );
}
