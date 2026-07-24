/* =====================================================================
   TrazaFlor · demo · identidad de rol en lenguaje simple
   Nombre plano y descripción de una línea de cada rol, sin jerga. Se
   muestra en el banner de cada panel para que sea inconfundible de quién
   es esta pantalla (finca, agencia, gremio o autoridad).
   ===================================================================== */
import type { Rol } from "@/domain";
import type { Lang } from "@/i18n";

export const ROL_NOMBRE: Record<Lang, Record<Rol, string>> = {
  es: {
    agrocalidad: "Agrocalidad",
    finca: "Finca",
    agencia: "Agencia de carga",
    expoflores: "Gremio (Expoflores)",
    senae: "SENAE",
  },
  en: {
    agrocalidad: "Agrocalidad",
    finca: "Farm",
    agencia: "Freight agency",
    expoflores: "Guild (Expoflores)",
    senae: "SENAE",
  },
};

/** Iniciales para el badge de color del banner de rol. */
export const ROL_BADGE: Record<Rol, string> = {
  agrocalidad: "AC",
  finca: "FI",
  agencia: "AG",
  expoflores: "EX",
  senae: "SE",
};

/** Qué ve y qué hace este rol, en una línea (banner del panel). */
export const ROL_VE: Record<Lang, Record<Rol, string>> = {
  es: {
    agrocalidad:
      "La autoridad: valida, certifica y ve toda la trazabilidad, pero no los datos comerciales.",
    finca: "El dueño del pedido: ve su expediente completo, sin nada oculto.",
    expoflores: "El gremio: ve estadísticas y alertas del sector, no los datos de cada pedido.",
    agencia: "La logística: ve la carga y el peso para operar, no el monto del negocio.",
    senae:
      "La aduana: autoriza la salida y cierra la declaración, ve el valor declarado, no el detalle fitosanitario.",
  },
  en: {
    agrocalidad:
      "The authority: validates, certifies and sees the full traceability, but not the commercial figures.",
    finca: "The order owner: sees the complete case file, nothing hidden.",
    expoflores: "The guild: sees sector stats and alerts, not each order's data.",
    agencia: "Logistics: sees the cargo and weight to operate, not the deal amount.",
    senae:
      "Customs: authorizes departure and closes the declaration, sees the declared value, not the phytosanitary detail.",
  },
};
