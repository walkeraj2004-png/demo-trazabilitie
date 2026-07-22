import {
  ESTADOS,
  ROLES,
  TOTAL_ESTADOS,
  PEDIDO,
  PERMISOS,
  type EstadoKey,
  type Rol,
} from "@/domain";
import { APP_NAME, CREDITO } from "@/config";

/* Etiquetas provisionales solo para verificar el cableado del dominio en
   F0. En el siguiente sub-paso se reemplazan por la capa i18n portada
   desde legacy/i18n.js (ES/EN). No es copy final. */
const NOMBRE_ESTADO: Record<EstadoKey, string> = {
  creado: "Pedido creado",
  validado_guia: "Validado en GUIA",
  etiquetado: "Etiquetado",
  recibido_agencia: "Recibido en agencia",
  cfe_emitido: "CFE · ePhyto emitido",
  paletizado: "Paletizado",
  salida_autorizada: "Salida autorizada",
  embarcado: "Embarcado",
  cerrado: "DAE cerrada",
};

const NOMBRE_ROL: Record<Rol, string> = {
  finca: "Finca",
  expoflores: "Expoflores",
  agencia: "Agencia de carga",
  agrocalidad: "Agrocalidad",
};

export default function Home() {
  return (
    <main style={{ maxWidth: "72ch", margin: "0 auto", padding: "3rem 1.5rem" }}>
      <p style={{ fontSize: "0.8rem", letterSpacing: "0.02em", color: "#666" }}>
        {CREDITO}
      </p>
      <h1 style={{ fontSize: "2rem", marginTop: "0.5rem" }}>{APP_NAME}</h1>
      <p style={{ color: "#444", marginTop: "0.5rem" }}>
        F0 · esqueleto Next + dominio extraído. Expediente demo:{" "}
        <strong>{PEDIDO.id}</strong> · {PEDIDO.producto.cajas} cajas ·{" "}
        {PEDIDO.destino}
      </p>

      <section style={{ marginTop: "2.5rem" }}>
        <h2 style={{ fontSize: "1.1rem" }}>
          Flujo del expediente ({TOTAL_ESTADOS} estados)
        </h2>
        <ol style={{ marginTop: "1rem", paddingLeft: "1.25rem" }}>
          {ESTADOS.map((e) => (
            <li key={e.key} style={{ marginBottom: "0.4rem" }}>
              <strong>{NOMBRE_ESTADO[e.key]}</strong>{" "}
              <span style={{ color: "#888" }}>
                — {e.evento.hora} · {e.evento.lugar}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section style={{ marginTop: "2.5rem" }}>
        <h2 style={{ fontSize: "1.1rem" }}>Matriz de permisos por rol</h2>
        <ul style={{ marginTop: "1rem", listStyle: "none", padding: 0 }}>
          {ROLES.map((rol) => {
            const visibles = Object.entries(PERMISOS[rol])
              .filter(([, ok]) => ok)
              .map(([campo]) => campo);
            return (
              <li key={rol} style={{ marginBottom: "0.75rem" }}>
                <strong>{NOMBRE_ROL[rol]}</strong>
                <span style={{ color: "#888" }}>
                  {" "}
                  — ve {visibles.length}/8 campos: {visibles.join(", ")}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <p style={{ marginTop: "3rem", fontSize: "0.85rem", color: "#999" }}>
        Demo estático original preservado en <code>legacy/</code>. Siguiente:
        portar i18n (ES/EN) y la capa de render por rol (F1–F2).
      </p>
    </main>
  );
}
