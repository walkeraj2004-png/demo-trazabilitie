"use client";
/* =====================================================================
   TrazaFlor · demo · navegación por rol
   El punto junto a una pestaña indica que algo cambió ahí y no se ha
   abierto todavía (derivado en `changes.ts`).
   ===================================================================== */
import { ROLES } from "@/domain";
import type { Rol } from "@/domain";
import { useT } from "@/i18n";
import { cx } from "@/presentation/ui";
import { mostrarPunto } from "./changes";

const LABEL: Record<Rol, string> = {
  finca: "tab_finca",
  expoflores: "",
  agencia: "tab_agencia",
  agrocalidad: "",
  senae: "",
};

const FIJO: Record<Rol, string> = {
  finca: "Finca · El Rosal",
  expoflores: "Expoflores",
  agencia: "Agencia de carga",
  agrocalidad: "Agrocalidad",
  senae: "SENAE",
};

export function TabsNav({
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
  const t = useT();

  return (
    <nav className="tabs" aria-label={t("nav_tabs_aria")}>
      {ROLES.map((rol) => {
        const punto = mostrarPunto(rol, estado, activa, vistas);
        const texto = LABEL[rol] ? t(LABEL[rol]) : FIJO[rol];
        return (
          <button
            key={rol}
            data-tab={rol}
            className={cx(rol === activa && "activa")}
            onClick={() => onActivar(rol)}
          >
            <span>{texto}</span>
            <span
              className={cx("punto-cambio", punto && "visible")}
              aria-label={punto ? t("aria_cambios_sin_ver") : undefined}
            />
          </button>
        );
      })}
    </nav>
  );
}
