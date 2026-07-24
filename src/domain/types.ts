/* =====================================================================
   TrazaFlor · dominio · tipos
   Contratos del dominio de trazabilidad. Puro, sin dependencias de
   framework, red ni DOM. Sobrevive a cualquier decisión de render/stack.
   ===================================================================== */

/** Las 9 fases lineales del expediente de exportación. */
export type EstadoKey =
  | "creado"
  | "validado_guia"
  | "etiquetado"
  | "recibido_agencia"
  | "cfe_emitido"
  | "paletizado"
  | "salida_autorizada"
  | "embarcado"
  | "cerrado";

/** Roles que observan el mismo expediente con permisos distintos. */
export type Rol = "finca" | "expoflores" | "agencia" | "agrocalidad" | "senae";

/**
 * Identidad estable de un actor del flujo. Reemplaza el acoplamiento por
 * texto ("actor empieza con 'AeroCarga'") del prototipo original: la
 * lógica de dominio referencia IDs, no cadenas visibles traducibles.
 * (El nombre para mostrar se resuelve en la capa de presentación.)
 */
export type ActorId =
  | "finca"
  | "agrocalidad"
  | "agencia"
  | "paletizadora"
  | "senae"
  | "aerolinea"
  | "sistema";

/** Campos del expediente sujetos a la matriz de permisos. */
export type CampoPermiso =
  | "cliente"
  | "monto"
  | "finca"
  | "producto"
  | "peso"
  | "logistica"
  | "alertas"
  | "documentos";

export type MatrizPermisos = Record<Rol, Record<CampoPermiso, boolean>>;

/** Registro que se agrega al log del pedido al entrar a un estado. */
export interface EventoRegistro {
  hora: string; // "HH:MM"
  actorId: ActorId;
  lugar: string;
}

/**
 * Evento de cada caja al entrar a un estado. `esEscaneo` marca los que
 * cuentan como "último escaneo" en la cadena de custodia. `null` = el
 * estado solo registra evento del pedido, sin acción física por caja.
 */
export interface CajaEvento extends EventoRegistro {
  esEscaneo: boolean;
}

export interface Estado {
  key: EstadoKey;
  evento: EventoRegistro;
  cajaEvento: CajaEvento | null;
}

/** Alerta scripted de discrepancia de etiquetado de variedad (abre y se
    resuelve por estado). */
export interface Alerta {
  abierta: { hora: string; lugar: string };
  resuelta: { hora: string; actorId: ActorId; lugar: string };
}

export interface Caja {
  id: string;
  etiqueta: string;
}

export interface Pedido {
  id: string;
  finca: { nombre: string; ubicacion: string; operador: string; bpa: string };
  cliente: { nombre: string; ciudad: string };
  producto: {
    descripcion: string;
    cajas: number;
    tipoCaja: string;
    tallosPorCaja: number;
    tallosTotal: string;
    pesoDeclarado: string;
  };
  monto: string;
  agencia: { nombre: string; agente: string };
  awb: string;
  hawb: string;
  dae: string;
  destino: string;
  vuelo: string;
  tarifas: {
    etiquetaUnitaria: string;
    etiquetasTotal: string;
    etiquetasDetalle: string;
    cfe: string;
  };
  cfe: { numero: string; ephyto: string };
}
