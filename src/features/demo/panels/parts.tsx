"use client";
/* =====================================================================
   TrazaFlor · demo · piezas compartidas de los paneles
   Campo con matriz de permisos, tabla de log y banner de alerta. Cada uno
   replica la salida del POC usando las clases del sistema visual real.
   ===================================================================== */
import type { ReactNode } from "react";
import { puedeVer } from "@/domain";
import type { CampoPermiso, Rol } from "@/domain";
import type { EventoLog } from "@/domain";
import { useT } from "@/i18n";
import { cx, Nuevo } from "@/presentation/ui";
import { actorLabel } from "@/presentation/actors";
import { NUM_ALERTA_ABIERTA, NUM_ALERTA_RESUELTA } from "@/domain/timeline";

/** Campo del expediente sujeto a permisos. Si el rol no puede verlo, se
    muestra con candado (el dato existe, pero está oculto). */
export function Campo({
  rol,
  campo,
  etiqueta,
  resaltar = false,
  children,
}: {
  rol: Rol;
  campo: CampoPermiso;
  etiqueta: string;
  resaltar?: boolean;
  children: ReactNode;
}) {
  const t = useT();
  const visible = puedeVer(rol, campo);
  return (
    <div className={cx("campo", resaltar && "nuevo")}>
      <span className="campo-k">{etiqueta}</span>
      {visible ? (
        <span className="campo-v">
          {children}
          {resaltar && <Nuevo />}
        </span>
      ) : (
        <span className="campo-v oculto" title={t("campo_oculto_title")}>
          {t("campo_oculto_texto")}
        </span>
      )}
    </div>
  );
}

/** Tabla del log del expediente. Resalta la fila cuyo estado coincide con
    el actual (lo recién agregado). */
export function TablaLog({
  eventos,
  estadoActual,
}: {
  eventos: EventoLog[];
  estadoActual: number;
}) {
  const t = useT();
  if (!eventos.length) return <p className="vacio">{t("vacio_sin_eventos")}</p>;

  return (
    <table className="tabla">
      <thead>
        <tr>
          <th>{t("tabla_hora")}</th>
          <th>{t("tabla_actor")}</th>
          <th>{t("tabla_accion")}</th>
          <th>{t("tabla_ubicacion")}</th>
        </tr>
      </thead>
      <tbody>
        {eventos.map((e, i) => {
          const nueva = e.estado === estadoActual;
          const clase = cx(
            e.tipo === "alerta" && "fila-alerta",
            e.tipo === "resuelta" && "fila-ok",
            nueva && "nuevo",
          );
          return (
            <tr className={clase} key={`${e.estado}-${i}`}>
              <td>{e.hora}</td>
              <td>{actorLabel(e.actorId, t)}</td>
              <td>
                {t(e.accionKey)}
                {nueva && <Nuevo />}
              </td>
              <td>{e.lugar}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/** Banner de alerta scripted (peso): coral al abrirse, verde al resolverse.
    Solo visible en el estado exacto en que ocurre → siempre marcado nuevo. */
export function BannerAlerta({ estado }: { estado: number }) {
  const t = useT();
  if (estado === NUM_ALERTA_ABIERTA) {
    return (
      <div className="banner banner-alerta nuevo">
        ⚠ <strong>{t("alerta_activa_label")}</strong> {t("alerta_texto_abierta")}
        <Nuevo />
      </div>
    );
  }
  if (estado === NUM_ALERTA_RESUELTA) {
    return (
      <div className="banner banner-ok nuevo">
        ✔ <strong>{t("alerta_texto_resuelta")}</strong> {t("alerta_archivada_sufijo")}
        <Nuevo />
      </div>
    );
  }
  return null;
}
