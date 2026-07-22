/* =====================================================================
   TrazaFlor · data.js
   Datos semilla, definición de estados y matriz de permisos.
   Demo estático — un solo pedido hardcodeado.
   ===================================================================== */

/* CONFIG --------------------------------------------------------------
   BASE_URL: URL absoluta del deploy en GitHub Pages. Actualizar tras el
   primer deploy; los QR se regeneran solos al recargar la página. */
const BASE_URL = "https://walkeraj2004-png.github.io/demo-trazabilitie/";

const APP_NAME = "TrazaFlor";
const CREDITO = APP_NAME + " · impulsado por Xpotrack";

/* PEDIDO -------------------------------------------------------------- */
const PEDIDO = {
  id: "PED-2026-0417",
  finca: {
    nombre: "Florícola El Rosal",
    ubicacion: "Cayambe, Pichincha",
    operador: "OP-17-00482",
    bpa: "BPA vigente"
  },
  cliente: { nombre: "Miami Blooms LLC", ciudad: "Miami, FL" },
  producto: {
    descripcion: "Rosa var. Freedom",
    cajas: 24,
    tipoCaja: "caja full",
    tallosPorCaja: 300,
    tallosTotal: "7,200 tallos",
    pesoDeclarado: "312 kg",
    pesoEscaneado: "298 kg"
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
    cfe: "USD 1.2583"
  },
  cfe: {
    numero: "CFE-2026-078945",
    ephyto: "EC-2026-EPH-114532"
  }
};

/* CAJAS ----------------------------------------------------------------
   La etiqueta Agrocalidad se muestra en la UI solo desde el estado 3
   (etiquetado); aquí está preasignada por simplicidad. */
const CAJAS = Array.from({ length: 24 }, (_, i) => {
  const n = String(i + 1).padStart(3, "0");
  return {
    id: "ROS-0417-" + n,
    etiqueta: "ETQ-2026-40" + String(1151 + i)
  };
});

/* MÁQUINA DE ESTADOS ----------------------------------------------------
   9 estados lineales. El texto visible (nombre, toast, evento, evento de
   caja) vive en i18n.js, indexado por `key` — aquí solo quedan los datos
   estructurales que no se traducen:
   - evento:     hora/actor/lugar del registro que se agrega al log
   - cajaEvento: hora/actor/lugar/esEscaneo del evento de CADA caja al
                 entrar al estado (null = evento solo del pedido, sin
                 acción física por caja). esEscaneo marca los que cuentan
                 como "último escaneo" en la cadena de custodia.
   La paletizadora no consolida carga sin el CFE emitido: cfe_emitido va
   antes de paletizado. El cierre de DAE es un trámite aduanero aparte y
   queda al final. */
const ESTADOS = [
  {
    key: "creado",
    evento: { hora: "06:12", actor: "Florícola El Rosal", lugar: "Cayambe" },
    cajaEvento: { hora: "06:12", actor: "Florícola El Rosal", lugar: "Cayambe", esEscaneo: false }
  },
  {
    key: "validado_guia",
    evento: { hora: "08:05", actor: "GUIA · Agrocalidad", lugar: "Quito" },
    cajaEvento: null
  },
  {
    key: "etiquetado",
    evento: { hora: "09:30", actor: "GUIA · Agrocalidad", lugar: "Quito" },
    cajaEvento: { hora: "09:48", actor: "Florícola El Rosal", lugar: "Cayambe", esEscaneo: true }
  },
  {
    key: "recibido_agencia",
    evento: { hora: "14:32", actor: "AeroCarga Andina (P. Guzmán)", lugar: "Tababela" },
    cajaEvento: { hora: "14:32", actor: "AeroCarga Andina (P. Guzmán)", lugar: "Tababela", esEscaneo: true }
  },
  {
    key: "cfe_emitido",
    evento: { hora: "15:52", actor: "Agrocalidad", lugar: "Quito" },
    cajaEvento: { hora: "15:52", actor: "Agrocalidad", lugar: "Quito", esEscaneo: false }
  },
  {
    key: "paletizado",
    evento: { hora: "16:10", actor: "AeroCarga Andina (paletizadora)", lugar: "Tababela" },
    cajaEvento: { hora: "16:10", actor: "AeroCarga Andina (paletizadora)", lugar: "Tababela", esEscaneo: true }
  },
  {
    key: "salida_autorizada",
    evento: { hora: "18:45", actor: "ECUAPASS · SENAE", lugar: "Quito" },
    cajaEvento: null
  },
  {
    key: "embarcado",
    evento: { hora: "22:05", actor: "LATAM Cargo (LA-1447)", lugar: "Tababela" },
    cajaEvento: { hora: "22:05", actor: "LATAM Cargo (LA-1447)", lugar: "Tababela", esEscaneo: true }
  },
  {
    key: "cerrado",
    evento: { hora: "23:55", actor: "ECUAPASS · SENAE", lugar: "Quito" },
    cajaEvento: null
  }
];

/* ALERTA SCRIPTED --------------------------------------------------------
   Se abre al entrar al estado 4 (recibido_agencia) y se resuelve al entrar
   al estado 5 (cfe_emitido): Agrocalidad verifica el peso corregido como
   requisito previo a emitir el CFE, así que su hora precede a la del
   evento de ese estado y el actor es Agrocalidad (no la agencia). */
const ALERTA = {
  abierta: { hora: "14:35", lugar: "Tababela" },
  resuelta: { hora: "15:50", actor: "Agrocalidad", lugar: "Quito" }
};

/* AGREGADOS FICTICIOS (Expoflores y Agrocalidad) ------------------------ */
const AGREGADOS = {
  pedidosActivos: "1,847",
  cajasEtiquetadasHoy: "44,210",
  alertasAbiertas: 3,
  tiempoPromedio: "11.4 h",
  recaudacionDia: "Hoy: 44,210 etiquetas · USD 4,169.00"
};

/* MATRIZ DE PERMISOS ------------------------------------------------------
   Qué campos del expediente ve cada rol. false = se muestra con candado
   ("•••• oculto por permisos") para que se VEA que el dato existe. */
const PERMISOS = {
  finca:       { cliente: true,  monto: true,  finca: true,  producto: true, peso: true, logistica: true, alertas: true, documentos: true },
  expoflores:  { cliente: false, monto: false, finca: false, producto: false, peso: false, logistica: false, alertas: true, documentos: false },
  agencia:     { cliente: true,  monto: false, finca: true,  producto: true, peso: true, logistica: true, alertas: true, documentos: false },
  agrocalidad: { cliente: false, monto: false, finca: true,  producto: true, peso: true, logistica: true, alertas: true, documentos: true }
};
