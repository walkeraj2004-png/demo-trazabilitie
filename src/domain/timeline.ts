/* =====================================================================
   TrazaFlor · dominio · derivación de línea de tiempo
   Deriva, desde el número de estado, el log del pedido y la cadena de
   custodia por caja. Puro y tipado: no toca DOM ni i18n — devuelve claves
   i18n (`accionKey`) y `actorId`, y la capa de presentación resuelve el
   texto. Esto reemplaza la lógica embebida en el app.js del POC, incluido
   el filtro acoplado por strings (`actor.indexOf("AeroCarga")`).
   ===================================================================== */
import { ESTADOS, indiceDeEstado } from "./states";
import { ALERTA } from "./order";
import type { ActorId } from "./types";

export type TipoEvento = "normal" | "alerta" | "resuelta";

export interface EventoLog {
  /** Estado (1-based) en que ocurrió — para resaltar la fila más reciente. */
  estado: number;
  hora: string;
  actorId: ActorId;
  /** Clave i18n de la acción; el texto lo resuelve la presentación. */
  accionKey: string;
  lugar: string;
  tipo: TipoEvento;
}

export interface EventoCaja {
  estado: number;
  hora: string;
  actorId: ActorId;
  accionKey: string;
  lugar: string;
  esEscaneo: boolean;
}

const IDX_CFE_EMITIDO = indiceDeEstado("cfe_emitido");
const IDX_ALERTA_ABIERTA = indiceDeEstado("recibido_agencia");
/** La alerta se resuelve justo antes de emitir el CFE — mismo estado. */
const IDX_ALERTA_RESUELTA = IDX_CFE_EMITIDO;

export const IDX_PALETIZADO = indiceDeEstado("paletizado");
export const NUM_ALERTA_ABIERTA = IDX_ALERTA_ABIERTA + 1;
export const NUM_ALERTA_RESUELTA = IDX_ALERTA_RESUELTA + 1;
export const NUM_CFE_EMITIDO = IDX_CFE_EMITIDO + 1;
export const NUM_PALETIZADO = IDX_PALETIZADO + 1;

/** Suma minutos a un "HH:MM" (para desfasar escaneos por caja). */
function sumaMinutos(hhmm: string, min: number): string {
  const [hh, mm] = hhmm.split(":");
  const total = parseInt(hh!, 10) * 60 + parseInt(mm!, 10) + min;
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  return `${h < 10 ? "0" : ""}${h}:${m < 10 ? "0" : ""}${m}`;
}

/**
 * Log del pedido (append-only) derivado del estado actual. La resolución
 * de la alerta se registra ANTES del evento del CFE (orden cronológico:
 * primero se resuelve el peso, luego se emite el CFE).
 */
export function buildLog(estado: number): EventoLog[] {
  const eventos: EventoLog[] = [];
  for (let i = 0; i < estado; i++) {
    const est = ESTADOS[i];
    if (!est) break;

    if (i === IDX_ALERTA_RESUELTA) {
      eventos.push({
        estado: NUM_ALERTA_RESUELTA,
        hora: ALERTA.resuelta.hora,
        actorId: ALERTA.resuelta.actorId,
        accionKey: "alerta_resuelta_accion",
        lugar: ALERTA.resuelta.lugar,
        tipo: "resuelta",
      });
    }

    eventos.push({
      estado: i + 1,
      hora: est.evento.hora,
      actorId: est.evento.actorId,
      accionKey: `estado_evento_${est.key}`,
      lugar: est.evento.lugar,
      tipo: "normal",
    });

    if (i === IDX_ALERTA_ABIERTA) {
      eventos.push({
        estado: NUM_ALERTA_ABIERTA,
        hora: ALERTA.abierta.hora,
        actorId: "sistema",
        accionKey: "alerta_abierta_accion",
        lugar: ALERTA.abierta.lugar,
        tipo: "alerta",
      });
    }
  }
  return eventos;
}

/** Filtra el log a los eventos de un actor (por ID, no por texto). */
export function logDeActor(estado: number, actorId: ActorId): EventoLog[] {
  return buildLog(estado).filter((e) => e.actorId === actorId);
}

/** Cadena de custodia de una caja (por índice) hasta el estado dado. */
export function eventosCaja(idx: number, estado: number): EventoCaja[] {
  const out: EventoCaja[] = [];
  for (let i = 0; i < estado; i++) {
    const est = ESTADOS[i];
    if (!est?.cajaEvento) continue;
    const ce = est.cajaEvento;
    out.push({
      estado: i + 1,
      hora: sumaMinutos(ce.hora, ce.esEscaneo ? idx % 7 : 0),
      actorId: ce.actorId,
      accionKey: `caja_evento_${est.key}`,
      lugar: ce.lugar,
      esEscaneo: ce.esEscaneo,
    });
  }
  return out;
}

/** Último evento de escaneo de una caja (para la tabla de custodia). */
export function ultimoEscaneo(idx: number, estado: number): EventoCaja | null {
  const escaneos = eventosCaja(idx, estado).filter((e) => e.esEscaneo);
  return escaneos.length ? escaneos[escaneos.length - 1]! : null;
}
