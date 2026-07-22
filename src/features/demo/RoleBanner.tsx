"use client";
/* =====================================================================
   TrazaFlor · demo · banner de identidad de rol
   Primera cosa que se ve en cada panel: de quién es esta pantalla, en
   lenguaje simple. Resuelve "todo se ve igual, no sé de quién es esto":
   cada rol trae su propio color (mismo que su pestaña) y su propósito en
   una línea, sin jerga.
   ===================================================================== */
import type { Rol } from "@/domain";
import { useI18n } from "@/i18n";
import { ROL_NOMBRE, ROL_BADGE, ROL_VE } from "./narrative";

export function RoleBanner({ rol }: { rol: Rol }) {
  const { lang } = useI18n();
  return (
    <div className="rol-banner" data-rol={rol}>
      <span className="rol-banner-badge" aria-hidden="true">
        {ROL_BADGE[rol]}
      </span>
      <span className="rol-banner-texto">
        <span className="rol-banner-nombre">{ROL_NOMBRE[lang][rol]}</span>
        <span className="rol-banner-desc">{ROL_VE[lang][rol]}</span>
      </span>
    </div>
  );
}
