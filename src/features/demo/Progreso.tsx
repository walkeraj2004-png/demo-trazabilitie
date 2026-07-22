"use client";
/* =====================================================================
   TrazaFlor · demo · barra de progreso
   Cada nodo es un <button> navegable. Click → salta a ese estado (adelante
   o atrás). El nodo actual lleva aria-current y no responde (irA ignora el
   salto al estado ya activo).
   ===================================================================== */
import { ESTADOS } from "@/domain";
import { useT } from "@/i18n";
import { cx } from "@/presentation/ui";

export function Progreso({
  estado,
  onIr,
}: {
  estado: number;
  onIr: (n: number) => void;
}) {
  const t = useT();

  return (
    <div className="progreso-wrap">
      <ol id="progreso">
        {ESTADOS.map((e, i) => {
          const n = i + 1;
          const actual = n === estado;
          const cls = n < estado ? "hecho" : actual ? "actual" : "pendiente";
          const nombre = t(`estado_nombre_${e.key}`);
          const label = t("nodo_ir_a_estado", { n, nombre });
          return (
            <li className={cls} key={e.key}>
              <button
                className="nodo-btn"
                onClick={() => onIr(n)}
                title={label}
                aria-label={label}
                {...(actual ? { "aria-current": "step" as const } : {})}
              >
                <span className="nodo">{n < estado ? "✓" : n}</span>
                <span className="nodo-label">{nombre}</span>
              </button>
            </li>
          );
        })}
      </ol>
      <p className="progreso-nota">{t("progreso_nota")}</p>
    </div>
  );
}
