/* =====================================================================
   TrazaFlor · demo · narrativa en lenguaje simple
   Para el rediseño: explica cada paso y cada rol SIN jerga, para que un
   comprador no técnico entienda qué pasa y quién ve qué. El nombre del
   responsable NO se escribe aquí: se deriva del actorId del estado
   (actorLabel). Aquí solo vive el "qué está pasando" y el "qué ve cada rol".
   ===================================================================== */
import type { EstadoKey, Rol } from "@/domain";
import type { Lang } from "@/i18n";

/** Qué pasa en cada paso, contado simple (1-2 frases). */
export const QUE_PASA: Record<Lang, Record<EstadoKey, string>> = {
  es: {
    creado:
      "La finca crea el pedido. Aquí nace el expediente digital: un solo lugar donde vivirá toda la información de este envío.",
    validado_guia:
      "Agrocalidad confirma que la finca está habilitada para exportar. La validación es automática, en segundos, sin trámites en papel.",
    etiquetado:
      "Se emiten las etiquetas oficiales, una por caja, cada una con su QR. Desde aquí cada caja se rastrea por separado.",
    recibido_agencia:
      "La agencia de carga recibe y escanea las cajas. Un escaneo detecta que el peso real no coincide con el declarado y levanta una alerta al instante, no en el aeropuerto.",
    cfe_emitido:
      "Con el peso ya corregido, Agrocalidad emite el certificado fitosanitario (CFE) y lo transmite en digital. La carga queda habilitada para consolidarse.",
    paletizado:
      "La paletizadora arma los pallets. Solo puede hacerlo porque el certificado ya existe: el sistema no la deja avanzar sin él.",
    salida_autorizada:
      "La aduana (SENAE) autoriza que la carga salga del país.",
    embarcado:
      "La aerolínea embarca la carga. Cada caja registra su último escaneo antes de partir.",
    cerrado:
      "La aduana cierra la declaración. El expediente queda completo y auditable de principio a fin.",
  },
  en: {
    creado:
      "The farm creates the order. This is where the digital case file is born: one place that will hold all the information for this shipment.",
    validado_guia:
      "Agrocalidad confirms the farm is cleared to export. Validation is automatic, in seconds, with no paperwork.",
    etiquetado:
      "Official labels are issued, one per box, each with its QR. From here every box can be tracked individually.",
    recibido_agencia:
      "The freight agency receives and scans the boxes. A scan finds the real weight doesn't match the declared one and raises an alert instantly, not at the airport.",
    cfe_emitido:
      "With the weight corrected, Agrocalidad issues the phytosanitary certificate (CFE) and transmits it digitally. The cargo is cleared to be consolidated.",
    paletizado:
      "The palletizer builds the pallets. It can only do so because the certificate already exists: the system won't let it proceed without one.",
    salida_autorizada: "Customs (SENAE) authorizes the cargo to leave the country.",
    embarcado:
      "The airline loads the cargo. Each box logs its final scan before departure.",
    cerrado:
      "Customs closes the declaration. The case file is complete and auditable end to end.",
  },
};

/** Etiquetas de la tarjeta de relato (no van al diccionario grande). */
export const STORY_UI: Record<
  Lang,
  { paso: (n: number, total: number) => string; responsable: string; alertaAbierta: string; alertaResuelta: string; verComo: string }
> = {
  es: {
    paso: (n, total) => `Paso ${n} de ${total}`,
    responsable: "Responsable:",
    alertaAbierta: "⚠ Se detectó un problema de peso. La alerta salta aquí, en tiempo real, no en el aeropuerto.",
    alertaResuelta: "✔ Alerta resuelta. Queda archivada en el historial.",
    verComo: "Estás viendo como",
  },
  en: {
    paso: (n, total) => `Step ${n} of ${total}`,
    responsable: "In charge:",
    alertaAbierta: "⚠ A weight problem was detected. The alert fires here, in real time, not at the airport.",
    alertaResuelta: "✔ Alert resolved. It stays archived in the history.",
    verComo: "You're viewing as",
  },
};

/** Orden de la lente: la autoridad (vista héroe) primero; el gremio al final. */
export const LENS_ORDER: readonly Rol[] = ["agrocalidad", "finca", "agencia", "expoflores"];

/** Nombre plain de cada rol para la barra de lente. */
export const ROL_NOMBRE: Record<Lang, Record<Rol, string>> = {
  es: {
    agrocalidad: "Agrocalidad",
    finca: "Finca",
    agencia: "Agencia de carga",
    expoflores: "Gremio",
  },
  en: {
    agrocalidad: "Agrocalidad",
    finca: "Farm",
    agencia: "Freight agency",
    expoflores: "Guild",
  },
};

/** Qué ve cada rol, en una línea (para la barra de lente). */
export const ROL_VE: Record<Lang, Record<Rol, string>> = {
  es: {
    agrocalidad:
      "La autoridad. Valida, certifica y ve toda la trazabilidad, pero no los datos comerciales del negocio.",
    finca: "El dueño del pedido. Ve su expediente completo, sin nada oculto.",
    expoflores: "El gremio. Ve estadísticas y alertas del sector, no los datos de cada pedido.",
    agencia: "La logística. Ve la carga y el peso para operar, no el monto del negocio.",
  },
  en: {
    agrocalidad:
      "The authority. Validates, certifies and sees the full traceability, but not the commercial figures.",
    finca: "The order owner. Sees the complete case file, nothing hidden.",
    expoflores: "The guild. Sees sector stats and alerts, not the data of each order.",
    agencia: "Logistics. Sees the cargo and weight to operate, not the deal amount.",
  },
};
