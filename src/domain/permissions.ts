/* =====================================================================
   TrazaFlor · dominio · matriz de permisos
   Qué campos del expediente ve cada rol. `false` = el dato existe pero
   se muestra con candado ("oculto por permisos"): la neutralidad se VE.
   Los permisos son DATO, no ramas if/else regadas por la UI.
   ===================================================================== */
import type { CampoPermiso, MatrizPermisos, Rol } from "./types";

export const PERMISOS: MatrizPermisos = {
  finca:       { cliente: true,  monto: true,  finca: true,  producto: true,  peso: true,  logistica: true,  alertas: true,  documentos: true },
  expoflores:  { cliente: false, monto: false, finca: false, producto: false, peso: false, logistica: false, alertas: true,  documentos: false },
  agencia:     { cliente: true,  monto: false, finca: true,  producto: true,  peso: true,  logistica: true,  alertas: true,  documentos: false },
  agrocalidad: { cliente: false, monto: false, finca: true,  producto: true,  peso: true,  logistica: true,  alertas: true,  documentos: true },
  // La aduana: ve el valor declarado (a diferencia de Agrocalidad) porque la
  // DAE lo incluye, pero no el detalle fitosanitario (validación BPA,
  // etiquetas, custodia por caja) — ese trabajo no es de su competencia.
  senae:       { cliente: false, monto: true,  finca: true,  producto: true,  peso: true,  logistica: true,  alertas: false, documentos: false },
};

/** ¿Puede este rol ver este campo del expediente? */
export function puedeVer(rol: Rol, campo: CampoPermiso): boolean {
  return PERMISOS[rol][campo];
}

export const ROLES: readonly Rol[] = ["finca", "expoflores", "agencia", "agrocalidad", "senae"];
