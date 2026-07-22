"use client";
/* =====================================================================
   TrazaFlor · demo · barra de lente (reemplaza las pestañas crudas)
   En vez de 4 pestañas co-iguales, presenta un punto de vista: "estás
   viendo como X", y explica en una línea qué ve ese rol. Ancla en
   Agrocalidad (autoridad). El punto marca cambios sin ver.
   ===================================================================== */
import type { Rol } from "@/domain";
import { useI18n } from "@/i18n";
import { cx } from "@/presentation/ui";
import { mostrarPunto } from "./changes";
import { LENS_ORDER, ROL_NOMBRE, ROL_VE, STORY_UI } from "./narrative";
import styles from "./LensBar.module.css";

export function LensBar({
  estado,
  activa,
  vistas,
  onActivar,
}: {
  estado: number;
  activa: Rol;
  vistas: readonly Rol[];
  onActivar: (tab: Rol) => void;
}) {
  const { lang } = useI18n();
  const ui = STORY_UI[lang];

  return (
    <div className={styles.wrap}>
      <div className={styles.row}>
        <span className={styles.label}>{ui.verComo}</span>
        <div className={styles.opciones} role="tablist" aria-label={ui.verComo}>
          {LENS_ORDER.map((rol) => {
            const activo = rol === activa;
            const punto = mostrarPunto(rol, estado, activa, vistas);
            return (
              <button
                key={rol}
                type="button"
                role="tab"
                aria-selected={activo}
                className={cx(styles.chip, activo && styles.chipActivo)}
                onClick={() => onActivar(rol)}
              >
                {ROL_NOMBRE[lang][rol]}
                {punto && <span className={styles.punto} aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      </div>
      <p className={styles.explica}>{ROL_VE[lang][activa]}</p>
    </div>
  );
}
