/* =====================================================================
   TrazaFlor · demo · "cambios sin ver" por pestaña
   Predicado puro: ¿la pestaña `tab` tiene algún cambio resaltado en el
   estado dado? Cada conjunto refleja los estados en que ESE panel marca
   algo "nuevo" (excluyendo el resaltado permanente del estado en
   Expoflores). Se deriva por `key` vía numeroDeEstado → resiste reordenes.
   El POC lo hacía renderizando el panel fuera de pantalla y buscando
   `.nuevo`; aquí la regla es explícita y testeable.
   ===================================================================== */
import { numeroDeEstado } from "@/domain";
import type { EstadoKey, Rol } from "@/domain";

function estadosDe(...keys: EstadoKey[]): ReadonlySet<number> {
  return new Set(keys.map(numeroDeEstado));
}

const CAMBIOS: Record<Rol, ReadonlySet<number>> = {
  finca: estadosDe("validado_guia", "etiquetado", "recibido_agencia", "cfe_emitido"),
  expoflores: estadosDe("recibido_agencia", "cfe_emitido"),
  agencia: estadosDe("validado_guia", "etiquetado", "recibido_agencia", "cfe_emitido", "paletizado"),
  agrocalidad: estadosDe(
    "validado_guia",
    "etiquetado",
    "recibido_agencia",
    "cfe_emitido",
    "paletizado",
    "embarcado",
  ),
  senae: estadosDe("validado_guia", "salida_autorizada", "embarcado", "cerrado"),
};

export function tabTieneCambios(tab: Rol, estado: number): boolean {
  return CAMBIOS[tab].has(estado);
}

/**
 * Muestra el punto de "cambios sin ver" en `tab` si: hay cambios en el
 * estado actual, no es la pestaña activa y no se ha visto en este estado.
 * Nunca en el estado 1 (nada ha cambiado aún).
 */
export function mostrarPunto(
  tab: Rol,
  estado: number,
  activa: Rol,
  vistas: readonly Rol[],
): boolean {
  if (estado <= 1) return false;
  if (tab === activa) return false;
  if (vistas.includes(tab)) return false;
  return tabTieneCambios(tab, estado);
}
