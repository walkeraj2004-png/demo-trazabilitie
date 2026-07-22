/* =====================================================================
   TrazaFlor · presentación · etiquetas de actor
   Resuelve el nombre visible de un ActorId componiéndolo desde los datos
   del pedido. La lógica de dominio referencia IDs; solo aquí se convierten
   en texto. (Simplifica el "GUIA · Agrocalidad" del POC a "Agrocalidad".)
   ===================================================================== */
import { PEDIDO } from "@/domain";
import type { ActorId } from "@/domain";
import { APP_NAME } from "@/config";

export function actorLabel(actorId: ActorId): string {
  switch (actorId) {
    case "finca":
      return PEDIDO.finca.nombre;
    case "agrocalidad":
      return "Agrocalidad";
    case "agencia":
      return `${PEDIDO.agencia.nombre} (${PEDIDO.agencia.agente})`;
    case "paletizadora":
      return `${PEDIDO.agencia.nombre} (paletizadora)`;
    case "senae":
      return "ECUAPASS · SENAE";
    case "aerolinea":
      return `LATAM Cargo (${PEDIDO.vuelo})`;
    case "sistema":
      return APP_NAME;
  }
}
