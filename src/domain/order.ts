/* =====================================================================
   TrazaFlor · dominio · datos semilla del pedido
   Un solo pedido hardcodeado (herencia del POC). En F1 esto se reemplaza
   por datos que llegan de la fusión Xpotrack + couriers + backend propio;
   por eso vive detrás de tipos y no se lee directo desde la UI.
   ===================================================================== */
import type { Alerta, Caja, Pedido } from "./types";

export const PEDIDO: Pedido = {
  id: "PED-2026-0417",
  finca: {
    nombre: "Florícola El Rosal",
    ubicacion: "Cayambe, Pichincha",
    operador: "OP-17-00482",
    bpa: "BPA vigente",
  },
  cliente: { nombre: "Miami Blooms LLC", ciudad: "Miami, FL" },
  producto: {
    descripcion: "Rosa var. Freedom",
    cajas: 24,
    tipoCaja: "caja full",
    tallosPorCaja: 300,
    tallosTotal: "7,200 tallos",
    pesoDeclarado: "312 kg",
    pesoEscaneado: "298 kg",
  },
  monto: "USD 4,320.00",
  agencia: { nombre: "AeroCarga Andina", agente: "P. Guzmán" },
  awb: "145-58291034",
  hawb: "ACA-8842",
  dae: "055-2026-40-01234567",
  destino: "MIA · Miami, FL",
  vuelo: "LA-1447",
  tarifas: {
    etiquetaUnitaria: "$0.0943",
    etiquetasTotal: "USD 2.26",
    etiquetasDetalle: "$0.0943 × 24 = USD 2.26",
    cfe: "USD 1.2583",
  },
  cfe: {
    numero: "CFE-2026-078945",
    ephyto: "EC-2026-EPH-114532",
  },
};

/** 24 cajas con etiqueta Agrocalidad preasignada. */
export const CAJAS: readonly Caja[] = Array.from({ length: PEDIDO.producto.cajas }, (_, i) => {
  const n = String(i + 1).padStart(3, "0");
  return {
    id: `ROS-0417-${n}`,
    etiqueta: `ETQ-2026-40${1151 + i}`,
  };
});

/** Alerta scripted de discrepancia de peso: abre en `recibido_agencia`,
    se resuelve en `cfe_emitido` (Agrocalidad verifica el peso corregido
    como requisito previo a emitir el CFE). */
export const ALERTA: Alerta = {
  abierta: { hora: "14:35", lugar: "Tababela" },
  resuelta: { hora: "15:50", actorId: "agrocalidad", lugar: "Quito" },
};

/** Agregados ficticios para las vistas de gremio/autoridad. */
export const AGREGADOS = {
  pedidosActivos: "1,847",
  cajasEtiquetadasHoy: "44,210",
  alertasAbiertas: 3,
  tiempoPromedio: "11.4 h",
  recaudacionDia: "Hoy: 44,210 etiquetas · USD 4,169.00",
} as const;
