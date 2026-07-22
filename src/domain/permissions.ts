/* =====================================================================
   TrazaFlor · dominio · matriz de permisos
   Qué campos del expediente ve cada rol. `false` = el dato existe pero
   se muestra con candado ("oculto por permisos"): la neutralidad se VE.
   Los permisos son DATO, no ramas if/else regadas por la UI.
   ===================================================================== */
import type { CampoPermiso, MatrizPermisos, Rol } from "./types";

export const PERMISOS: MatrizPermisos = {
  finca:       { cliente: true,  monto: true,  finca: true,  producto: true,  peso: true,  logistica: true,  alertas: true, documentos: true },
  expoflores:  { cliente: false, monto: false, finca: false, producto: false, peso: false, logistica: false, alertas: true, documentos: false },
  agencia:     { cliente: true,  monto: false, finca: true,  producto: true,  peso: true,  logistica: true,  alertas: true, documentos: false },
  agrocalidad: { cliente: false, monto: false, finca: true,  producto: true,  peso: true,  logistica: true,  alertas: true, documentos: true },
};

/** ¿Puede este rol ver este campo del expediente? */
export function puedeVer(rol: Rol, campo: CampoPermiso): boolean {
  return PERMISOS[rol][campo];
}

export const ROLES: readonly Rol[] = ["finca", "expoflores", "agencia", "agrocalidad"];
