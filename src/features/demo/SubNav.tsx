"use client";
/* =====================================================================
   TrazaFlor · demo · sub-navegación dentro de un panel de rol
   Convierte un scroll infinito de secciones apiladas en vistas separadas
   que se navegan una a la vez, como un producto real (no una landing).
   Vuelve a "resumen" automáticamente cuando cambia el estado, para que lo
   resaltado nunca quede enterrado en una sub-vista que no estás viendo.
   ===================================================================== */
import { useEffect, useState } from "react";
import { cx } from "@/presentation/ui";
import swap from "./panelSwap.module.css";

export interface SubViewDef {
  id: string;
  label: string;
  /** true si esta sub-vista tiene algo resaltado ahora mismo (punto de aviso). */
  tieneCambios?: boolean;
  content: React.ReactNode;
}

export function SubNav({
  views,
  resetKey,
  defaultId,
}: {
  views: SubViewDef[];
  resetKey: unknown;
  /** Sub-vista a mostrar tras el reset (por defecto, la primera). Permite
      aterrizar en "lo que está pasando ahora" en vez de siempre la misma. */
  defaultId?: string;
}) {
  const inicial = views.find((v) => v.id === defaultId)?.id ?? views[0]!.id;
  const [activa, setActiva] = useState(inicial);

  // Al cambiar de estado, vuelve a la vista relevante: lo nuevo nunca
  // queda enterrado en una sub-vista que el usuario no tiene abierta.
  useEffect(() => {
    setActiva(views.find((v) => v.id === defaultId)?.id ?? views[0]!.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  const vista = views.find((v) => v.id === activa) ?? views[0]!;

  return (
    <div className="subnav-wrap">
      <div className="subnav-pills" role="tablist">
        {views.map((v) => (
          <button
            key={v.id}
            type="button"
            role="tab"
            aria-selected={v.id === activa}
            className={cx("subnav-pill", v.id === activa && "activa")}
            onClick={() => setActiva(v.id)}
          >
            {v.label}
            {v.tieneCambios && v.id !== activa && <span className="subnav-punto" aria-hidden="true" />}
          </button>
        ))}
      </div>
      <div className={swap.swap} key={vista.id}>
        {vista.content}
      </div>
    </div>
  );
}
