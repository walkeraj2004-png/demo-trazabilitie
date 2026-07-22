/* =====================================================================
   TrazaFlor · presentación · utilidades de UI compartidas
   ===================================================================== */
import { useT } from "@/i18n";

/** Une clases condicionales (descarta falsy). */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Tag "nuevo" que marca lo que cambió en el estado actual. */
export function Nuevo() {
  const t = useT();
  return <span className="nuevo-tag">{t("nuevo")}</span>;
}
