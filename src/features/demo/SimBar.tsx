"use client";
/* =====================================================================
   TrazaFlor · demo · barra de simulación
   ===================================================================== */
import { ESTADOS, TOTAL_ESTADOS } from "@/domain";
import { useT } from "@/i18n";

export function SimBar({
  estado,
  puedeAvanzar,
  onAvanzar,
  onReiniciar,
}: {
  estado: number;
  puedeAvanzar: boolean;
  onAvanzar: () => void;
  onReiniciar: () => void;
}) {
  const t = useT();
  const nombre = t(`estado_nombre_${ESTADOS[estado - 1]!.key}`);

  return (
    <div className="simbar">
      <button className="btn btn-reiniciar" onClick={onReiniciar}>
        {t("btn_reiniciar")}
      </button>
      <div id="sim-estado">
        {t("estado_actual", { n: estado, nombre, total: TOTAL_ESTADOS })}
      </div>
      <button className="btn btn-avanzar" onClick={onAvanzar} disabled={!puedeAvanzar}>
        {t("btn_avanzar")}
      </button>
    </div>
  );
}
